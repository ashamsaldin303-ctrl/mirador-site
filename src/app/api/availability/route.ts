// GET /api/availability?date=YYYY-MM-DD — slots + remaining for a Damascus-local date (§8.1)
// 200 on success · 400 bad date · 429 rate-limited (30/min/IP, own read bucket)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { availabilityQuerySchema } from "@/lib/validation";
import { clientIp, limitRead } from "@/lib/rate-limit";
import { SLOT_TIMES, slotsForDate, damascusDay } from "@/lib/slots";
import { VENUE } from "@/lib/venue";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const rl = limitRead(clientIp(req.headers));
  if (!rl.ok) {
    return NextResponse.json(
      { error: "RATE_LIMITED", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter), "X-RateLimit-Remaining": "0" } },
    );
  }

  const url = new URL(req.url);
  const parsed = availabilityQuerySchema.safeParse({ date: url.searchParams.get("date") ?? "" });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION", fields: { date: ["invalid_date"] } },
      { status: 400, headers: { "X-RateLimit-Remaining": String(rl.remaining) } },
    );
  }

  const date = parsed.data.date;
  const instants = slotsForDate(date);

  const rows = await db.reservation.groupBy({
    by: ["slot"],
    where: { slot: { in: instants }, status: { in: ["PENDING", "CONFIRMED"] } },
    _count: { _all: true },
  });
  const countBySlot = new Map(
    rows.map((r) => {
      // Prisma 6.19 runtime shape: _count is { _all: number } (typed as number — handle both)
      const c = typeof r._count === "number" ? r._count : r._count._all;
      return [r.slot.getTime(), c] as const;
    }),
  );

  const now = Date.now();
  const closedDay = damascusDay(instants[0] ?? new Date()) === 1; // Monday → sold-out rendering
  const slots = instants.map((instant, i) => {
    const past = instant.getTime() <= now;
    const remaining =
      past || closedDay
        ? 0
        : Math.max(0, VENUE.tablesPerSlot - (countBySlot.get(instant.getTime()) ?? 0));
    return { time: SLOT_TIMES[i], remaining };
  });

  return NextResponse.json(
    { date, slots },
    { headers: { "X-RateLimit-Remaining": String(rl.remaining) } },
  );
}
