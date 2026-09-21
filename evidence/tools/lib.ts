// MIRADOR evidence tools — shared lib (prompt-2 §5 REPLAY-able runners; prompt-3 §5 surface labels)
// Run: bun evidence/tools/<script>.ts  (bun auto-loads .env → DATABASE_URL)
// EVIDENCE_SURFACE=prod-run on the CI battery redirects every output family
// under /evidence/prod-run/<family>/ (one family, one surface — prompt-3 §5);
// unset = the round-2 dev-run layout, byte-identical to its committed set.
import { appendFileSync, mkdirSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

export const BASE = process.env.EVIDENCE_BASE_URL ?? "http://localhost:3000";
export const EVIDENCE_ROOT = new URL("..", import.meta.url).pathname; // /evidence/
export const EVIDENCE_SURFACE = process.env.EVIDENCE_SURFACE ?? "";
export const EVIDENCE_OUT = EVIDENCE_SURFACE ? `${EVIDENCE_ROOT}${EVIDENCE_SURFACE}/` : EVIDENCE_ROOT;
export function outDir(family: string): string {
  const dir = `${EVIDENCE_OUT}${family}`;
  mkdirSync(dir, { recursive: true });
  return dir;
}
export const TEST_PHONE_PREFIX = "+96399900"; // evidence-run test range, cleaned after every spec

export function db(): PrismaClient {
  return new PrismaClient();
}

export function ts(): string {
  return new Date().toISOString();
}

/** Append-only raw log writer → <surface>/specs/<name>.log */
export function specLog(name: string) {
  const path = `${outDir("specs")}/${name}.log`;
  appendFileSync(path, `\n===== ${name} · run ${ts()} =====\n`);
  return (s = "") => {
    appendFileSync(path, s + "\n");
  };
}

/** First seeded reservation id (createdAt asc) — the confirmation-route target
 *  for screenshot/axe/console sweeps. Round-2 hardcoded the id committed inside
 *  db/custom.db; a fresh CI seed mints new cuids, so each surface resolves its
 *  own at runtime (same rule as REPLAY.md §snapshots). */
export async function seedConfirmationId(prisma: PrismaClient): Promise<string> {
  const row = await prisma.reservation.findFirst({ orderBy: { createdAt: "asc" } });
  if (!row) throw new Error("no seeded reservation found — run `bun run seed` first");
  return row.id;
}

/** Find a fresh empty slot: Tue–Sun (Damascus), 18:00 local (15:00Z), 0 existing rows. */
export async function freshSlot(prisma: PrismaClient, fromDaysAhead = 14): Promise<Date> {
  const DAMASCUS_OFFSET = 3 * 3600_000;
  for (let ahead = fromDaysAhead; ahead < fromDaysAhead + 30; ahead++) {
    const day = new Date(Date.now() + ahead * 86400_000);
    const local = new Date(day.getTime() + DAMASCUS_OFFSET); // Damascus-local wall clock
    const dow = local.getUTCDay(); // 0=Sun..6=Sat; Monday(1) closed
    if (dow === 1) continue;
    const y = local.getUTCFullYear(), m = local.getUTCMonth(), d = local.getUTCDate();
    const slot = new Date(Date.UTC(y, m, d, 15, 0, 0)); // 18:00 Damascus = 15:00Z
    const rows = await prisma.reservation.count({ where: { slot } });
    if (rows === 0) return slot;
  }
  throw new Error("no fresh slot found within horizon");
}

/** Delete every test-created row (phone prefix) — restores seed baseline. */
export async function cleanupTestRows(prisma: PrismaClient) {
  const reservations = await prisma.reservation.deleteMany({
    where: { phone: { startsWith: TEST_PHONE_PREFIX } },
  });
  const inquiries = await prisma.inquiry.deleteMany({
    where: { phone: { startsWith: TEST_PHONE_PREFIX } },
  });
  return { reservations: reservations.count, inquiries: inquiries.count };
}

export type PostResult = {
  status: number;
  body: string;
  headers: Record<string, string>;
};

/** POST JSON with a spoofed per-request IP (rate-limit isolation, §8.4). */
export async function postJson(
  path: string,
  payload: unknown,
  ip: string,
): Promise<PostResult> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(payload),
  });
  const body = await res.text();
  const headers: Record<string, string> = {};
  res.headers.forEach((v, k) => (headers[k] = v));
  return { status: res.status, body, headers };
}

export function validReservation(slotIso: string, phone: string, name = "Evidence Run") {
  return { name, phone, partySize: 2, slot: slotIso, locale: "en" as const };
}
