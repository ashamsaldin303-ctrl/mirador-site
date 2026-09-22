// MIRADOR — capacity & slot model (§6.2 constants mirrored from venue.ts)
// Timezone: Asia/Damascus, fixed UTC+3, no DST — slots stored as UTC instants of
// Damascus-local times. Service Tue–Sun (closed Monday); bookable dinner slots
// 18:00–22:30 local every 30 min (10 slots/day); 12 tables per slot;
// horizon today → +60 days; past slots rejected.

import { VENUE } from "./venue";

const DAMASCUS_OFFSET_MS = 3 * 3600_000; // fixed UTC+3, no DST

/** The 10 bookable slot times as Damascus-local "HH:MM" strings. */
export const SLOT_TIMES = [
  "18:00", "18:30", "19:00", "19:30", "20:00",
  "20:30", "21:00", "21:30", "22:00", "22:30",
] as const;

/** UTC instant for a Damascus-local date ("YYYY-MM-DD") + "HH:MM" time.
 * Destructure defaults keep the noUncheckedIndexedAccess chain total — the
 * zod layer validates the shapes before any API-path call. */
export function slotInstant(date: string, time: string): Date {
  const [y = 1970, m = 1, d = 1] = date.split("-").map(Number);
  const [hh = 0, mm = 0] = time.split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh, mm) - DAMASCUS_OFFSET_MS);
}

/** Damascus-local "YYYY-MM-DD" for a UTC instant. */
export function damascusDate(ts: Date | number): string {
  const t = typeof ts === "number" ? ts : ts.getTime();
  return new Date(t + DAMASCUS_OFFSET_MS).toISOString().slice(0, 10);
}

/** Damascus-local "HH:MM" for a UTC instant. */
export function damascusTime(ts: Date | number): string {
  const t = typeof ts === "number" ? ts : ts.getTime();
  return new Date(t + DAMASCUS_OFFSET_MS).toISOString().slice(11, 16);
}

/** Damascus-local day-of-week (0=Sun … 6=Sat) for a UTC instant. */
export function damascusDay(ts: Date | number): number {
  const t = typeof ts === "number" ? ts : ts.getTime();
  return new Date(t + DAMASCUS_OFFSET_MS).getUTCDay();
}

export function isBookableDay(ts: Date | number): boolean {
  return damascusDay(ts) !== 1; // closed Monday
}

/** Today's Damascus-local date string. */
export function damascusToday(): string {
  return damascusDate(Date.now());
}

/** Damascus-local date strings for the next `days` days starting today. */
export function dateStrip(days: number = VENUE.bookingHorizonDays): string[] {
  const out: string[] = [];
  const today = damascusToday();
  const [y = 1970, m = 1, d = 1] = today.split("-").map(Number);
  for (let i = 0; i < days; i++) {
    const dt = new Date(Date.UTC(y, m - 1, d + i));
    out.push(dt.toISOString().slice(0, 10));
  }
  return out;
}

/** All 10 slot instants for a Damascus-local date. */
export function slotsForDate(date: string): Date[] {
  return SLOT_TIMES.map((t) => slotInstant(date, t));
}

/** Server-side slot-day + horizon + past rejection (§8.2 beyond-Zod checks).
 * BKG-1 (prompt-4 R5): "off-grid" — ONLY the 10 canonical service instants
 * (18:00–22:30 Damascus, every 30min) persist. A crafted off-service instant
 * (e.g. 17:30 or 23:00 local) previously passed the 30-min UTC-grid Zod check
 * and slotRejection — anything not in SLOT_TIMES → 400 invalid_slot. */
export type SlotRejection = "past" | "monday" | "off-grid" | "beyond-horizon" | null;

export function slotRejection(slot: Date): SlotRejection {
  const now = Date.now();
  if (slot.getTime() <= now) return "past";
  if (damascusDay(slot) === 1) return "monday";
  if (!SLOT_TIMES.includes(damascusTime(slot) as (typeof SLOT_TIMES)[number])) {
    return "off-grid";
  }
  const horizonEnd = now + VENUE.bookingHorizonDays * 24 * 3600_000;
  if (slot.getTime() > horizonEnd) return "beyond-horizon";
  return null;
}
