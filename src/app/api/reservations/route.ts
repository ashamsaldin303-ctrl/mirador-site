// POST /api/reservations — create reservation (transactional, §6.3 VERBATIM pattern; R4 Critical)
// 201 created · 400 validation · 409 SLOT_FULL / DUPLICATE · 429 rate-limited (shared POST bucket)
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { reservationSchema, normalizePhone, toDbLocale } from "@/lib/validation";
import { clientIp, limitWrite } from "@/lib/rate-limit";
import { damascusDate, damascusTime, slotRejection } from "@/lib/slots";
import { TABLES } from "@/lib/venue";
import { waHref, confirmationMessage } from "@/lib/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** handler-defined error class (§6.3) */
class SlotFullError extends Error {
  constructor() {
    super("SLOT_FULL");
    this.name = "SlotFullError";
  }
}

const FIELD_ERROR: Record<string, string> = {
  name: "invalid_name",
  phone: "invalid_phone",
  partySize: "invalid_party",
  slot: "invalid_slot",
  locale: "required",
};

function validationBody(issues: { path: (string | number | symbol)[] }[]): {
  error: string;
  fields: Record<string, string[]>;
} {
  const fields: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "form");
    const code = FIELD_ERROR[key] ?? "required";
    fields[key] = [...(fields[key] ?? []), code];
  }
  return { error: "VALIDATION", fields };
}

export async function POST(req: NextRequest) {
  const rl = limitWrite(clientIp(req.headers));
  if (!rl.ok) {
    return NextResponse.json(
      { error: "RATE_LIMITED", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter), "X-RateLimit-Remaining": "0" } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(validationBody([{ path: [] }]), { status: 400 });
  }

  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationBody(parsed.error.issues), {
      status: 400,
      headers: { "X-RateLimit-Remaining": String(rl.remaining) },
    });
  }

  const { name, phone, partySize, locale } = parsed.data;
  const slot = new Date(parsed.data.slot);

  // Slot-day validation (server, beyond Zod): Damascus-local Tue–Sun within horizon; Monday → 400
  const rejection = slotRejection(slot);
  if (rejection !== null) {
    return NextResponse.json(
      { error: "VALIDATION", fields: { slot: ["invalid_slot"] } },
      { status: 400, headers: { "X-RateLimit-Remaining": String(rl.remaining) } },
    );
  }

  try {
    const reservation = await db.$transaction(async (tx) => {
      const taken = await tx.reservation.findMany({
        where: { slot, status: { in: ["PENDING", "CONFIRMED"] } },
        select: { tableNumber: true },
      });
      const free = TABLES.filter((t) => !taken.some((r) => r.tableNumber === t)); // TABLES = [1..12]
      if (free.length === 0) throw new SlotFullError();
      return tx.reservation.create({
        data: {
          name,
          phone: normalizePhone(phone), // normalize BEFORE the unique guard
          partySize,
          slot,
          locale: toDbLocale(locale), // wire "en|ar" → DB "EN|AR"
          tableNumber: free[0] ?? 1,
          status: "PENDING",
        },
      });
    });

    const date = damascusDate(reservation.slot);
    const time = damascusTime(reservation.slot);
    const whatsappUrl = waHref(
      confirmationMessage(locale, {
        name,
        partySize,
        date,
        time,
        id: reservation.id,
      }),
    );

    return NextResponse.json(
      {
        id: reservation.id,
        tableNumber: reservation.tableNumber,
        slot: reservation.slot.toISOString(),
        whatsappUrl,
      },
      { status: 201, headers: { "X-RateLimit-Remaining": String(rl.remaining) } },
    );
  } catch (e) {
    if (e instanceof SlotFullError) {
      return NextResponse.json({ error: "SLOT_FULL", messageKey: "slotFull" }, { status: 409 });
    }
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      const target = (e.meta?.target as string[] | undefined) ?? [];
      // P2002 on [slot,tableNumber] → 409 SLOT_FULL · on [phone,slot] → 409 DUPLICATE
      if (target.includes("phone")) {
        return NextResponse.json({ error: "DUPLICATE", messageKey: "duplicate" }, { status: 409 });
      }
      return NextResponse.json({ error: "SLOT_FULL", messageKey: "slotFull" }, { status: 409 });
    }
    console.error("[api/reservations] unexpected:", e);
    return NextResponse.json({ error: "INTERNAL", messageKey: "network" }, { status: 500 });
  }
}
