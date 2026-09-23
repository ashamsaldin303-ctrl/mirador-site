// MIRADOR — kitchen-side counters (P-086, prompt-4 R12 · E77): server-side
// ONLY house telemetry. Counts HOUSE events — bookings created, inquiries
// received, 409 capacity rejections, 429 rate rejections — never visitors,
// never per-request identities, zero client wiring (ZERO RUM — the battery
// stays the analytics; audit:motion's RUM grep guards the tree).
// In-memory + globalThis-registered: process-local by design (a per-process
// pulse, hot-path countersigned — no DB writes on the booking path, no PII,
// no retention), and the globalThis key survives the per-route bundle
// isolation of dev (same pattern as the prisma singleton).
export type HouseCounter =
  | "bookings.created"
  | "inquiries.created"
  | "bookings.rejected.capacity"
  | "bookings.rejected.rate";

const GLOBAL_KEY = Symbol.for("mirador.house.counters");
const globalForHouse = globalThis as unknown as {
  [GLOBAL_KEY]?: Map<HouseCounter, number>;
};
const counters: Map<HouseCounter, number> =
  globalForHouse[GLOBAL_KEY] ?? new Map<HouseCounter, number>();
globalForHouse[GLOBAL_KEY] = counters;

function bump(counter: HouseCounter): void {
  counters.set(counter, (counters.get(counter) ?? 0) + 1);
}

export const house = {
  /** booking persisted (201 path) */
  bookingCreated(): void {
    bump("bookings.created");
  },
  /** inquiry persisted (201 path) */
  inquiryCreated(): void {
    bump("inquiries.created");
  },
  /** capacity rejection (409 slotFull / duplicate) */
  capacityRejection(): void {
    bump("bookings.rejected.capacity");
  },
  /** rate-limit rejection (429 on a write route) */
  rateRejection(): void {
    bump("bookings.rejected.rate");
  },
  /** read-only snapshot (the /api/house surface) */
  snapshot(): Record<HouseCounter, number> {
    return {
      "bookings.created": counters.get("bookings.created") ?? 0,
      "inquiries.created": counters.get("inquiries.created") ?? 0,
      "bookings.rejected.capacity": counters.get("bookings.rejected.capacity") ?? 0,
      "bookings.rejected.rate": counters.get("bookings.rejected.rate") ?? 0,
    };
  },
};
