// POST /api/inquiries — persist private-dining/general inquiry (§8.1)
// 201 created · 400 validation · 429 rate-limited (shared POST bucket with reservations)
// Honeypot ruling (§8.2): a non-empty `website` short-circuits BEFORE persistence —
// returns the normal 201 shape with a fake id, creates no row (F8-4).
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inquirySchema, normalizePhone, toDbLocale } from "@/lib/validation";
import { clientIp, limitWrite } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELD_ERROR: Record<string, string> = {
  type: "required",
  name: "invalid_name",
  phone: "invalid_phone",
  preferredDate: "invalid_date",
  partySize: "invalid_party",
  message: "invalid_message",
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

function fakeId(): string {
  const hex = Array.from({ length: 24 }, () =>
    "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)],
  ).join("");
  return `cm${hex}`;
}

export async function POST(req: NextRequest) {
  const rl = limitWrite(clientIp(req.headers));
  if (!rl.ok) {
    return NextResponse.json(
      { error: "RATE_LIMITED", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter), "X-RateLimit-Remaining": "0" } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(validationBody([{ path: [] }]), { status: 400 });
  }

  // honeypot: short-circuit BEFORE persistence — fake 201, no row (F8-4)
  if (typeof body.website === "string" && body.website.trim().length > 0) {
    return NextResponse.json({ id: fakeId() }, { status: 201 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(validationBody(parsed.error.issues), {
      status: 400,
      headers: { "X-RateLimit-Remaining": String(rl.remaining) } ,
    });
  }

  const { type, name, phone, message, locale } = parsed.data;

  try {
    const inquiry = await db.inquiry.create({
      data: {
        type,
        name,
        phone: normalizePhone(phone),
        preferredDate: parsed.data.preferredDate ? new Date(parsed.data.preferredDate) : null,
        partySize: parsed.data.partySize ?? null,
        message,
        locale: toDbLocale(locale),
      },
    });
    return NextResponse.json(
      { id: inquiry.id },
      { status: 201, headers: { "X-RateLimit-Remaining": String(rl.remaining) } },
    );
  } catch (e) {
    console.error("[api/inquiries] unexpected:", e);
    return NextResponse.json({ error: "INTERNAL", messageKey: "network" }, { status: 500 });
  }
}
