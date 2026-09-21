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

/** UTC instant for a Damascus-local date ("YYYY-MM-DD") + "HH:MM" time. */
export function slotInstant(date: string, time: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, hh ?? 0, mm ?? 0) - DAMASCUS_OFFSET_MS);
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
  const [y, m, d] = today.split("-").map(Number);
  for (let i = 0; i < days; i++) {
    const dt = new Date(Date.UTC(y, (m ?? 1) - 1, (d ?? 1) + i));
    out.push(dt.toISOString().slice(0, 10));
  }
  return out;
}

/** All 10 slot instants for a Damascus-local date. */
export function slotsForDate(date: string): Date[] {
  return SLOT_TIMES.map((t) => slotInstant(date, t));
}

/** Server-side slot-day + horizon + past rejection (§8.2 beyond-Zod checks). */
export type SlotRejection = "past" | "monday" | "beyond-horizon" | null;

export function slotRejection(slot: Date): SlotRejection {
  const now = Date.now();
  if (slot.getTime() <= now) return "past";
  if (damascusDay(slot) === 1) return "monday";
  const horizonEnd = now + VENUE.bookingHorizonDays * 24 * 3600_000;
  if (slot.getTime() > horizonEnd) return "beyond-horizon";
  return null;
}
