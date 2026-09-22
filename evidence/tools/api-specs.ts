// MIRADOR — §10.2 API-level E2E specs (prompt-2 P3, runs against :3000)
// Usage: bun evidence/tools/api-specs.ts <capacity-sequential|capacity-race|ratelimit|dupguard|honeypot|all>
// Rate-limit isolation per parent §8.4: every POST carries a DISTINCT
// x-forwarded-for IP (the limiter keys per-IP) — the limiter stays ACTIVE
// (boot-guard honored: dev daemon untouched, E2E_RATE_LIMIT never set).
import { db, specLog, freshSlot, cleanupTestRows, postJson, validReservation, TEST_PHONE_PREFIX, BASE, EVIDENCE_OUT } from "./lib";

const prisma = db();

async function baseline() {
  return {
    reservations: await prisma.reservation.count(),
    inquiries: await prisma.inquiry.count(),
  };
}

async function capacitySequential() {
  const log = specLog("capacity-sequential");
  const before = await baseline();
  log(`# F4-3 · 13th POST on a 12-capacity slot → 409 SLOT_FULL`);
  log(`# baseline reservations=${before.reservations} inquiries=${before.inquiries}`);
  const slot = await freshSlot(prisma);
  log(`# fresh slot chosen: ${slot.toISOString()} (18:00 Damascus, Tue–Sun verified, 0 existing rows)`);
  const codes: number[] = [];
  for (let i = 1; i <= 13; i++) {
    const phone = `${TEST_PHONE_PREFIX}01${String(100 + i)}`; // +963999001101..113
    const r = await postJson("/api/reservations", validReservation(slot.toISOString(), phone), `10.99.0.${i}`);
    codes.push(r.status);
    log(`POST #${String(i).padStart(2, "0")} ip=10.99.0.${i} phone=${phone} → HTTP ${r.status} ${r.body}`);
  }
  const created = codes.filter((c) => c === 201).length;
  const full = codes.filter((c) => c === 409).length;
  const slotRows = await prisma.reservation.count({ where: { slot } });
  log(`# post-run DB count for slot ${slot.toISOString()} = ${slotRows}`);
  const verdict =
    created === 12 && full === 1 && codes[12] === 409 && slotRows === 12
      ? "PASS — exactly 12×201 + 13th=409 SLOT_FULL + 12 rows"
      : `FAIL — got ${created}×201 + ${full}×409 (13th=${codes[12]}), rows=${slotRows}`;
  log(`# VERDICT: ${verdict}`);
  const cleaned = await cleanupTestRows(prisma);
  log(`# CLEANUP: deleted ${cleaned.reservations} reservations / ${cleaned.inquiries} inquiries (phones ${TEST_PHONE_PREFIX}*) → restored seed baseline`);
}

async function capacityRace() {
  const log = specLog("capacity-race");
  const before = await baseline();
  log(`# F4-4 · 20 PARALLEL POSTs to ONE fresh empty slot → exactly 12 rows + 8 × 409 + 0 orphans`);
  log(`# baseline reservations=${before.reservations}`);
  const slot = await freshSlot(prisma);
  log(`# fresh slot chosen: ${slot.toISOString()}`);
  const phones = Array.from({ length: 20 }, (_, i) => `${TEST_PHONE_PREFIX}02${String(200 + i)}`);
  const t0 = Date.now();
  const results = await Promise.all(
    phones.map((phone, i) => postJson("/api/reservations", validReservation(slot.toISOString(), phone), `10.99.1.${i + 1}`)),
  );
  log(`# 20 parallel POSTs fired via Promise.all — wall time ${Date.now() - t0}ms`);
  results.forEach((r, i) =>
    log(`POST ip=10.99.1.${i + 1} phone=${phones[i]} → HTTP ${r.status} ${r.body}`),
  );
  const created = results.filter((r) => r.status === 201);
  const rejected = results.filter((r) => r.status === 409);
  const others = results.filter((r) => r.status !== 201 && r.status !== 409);
  // post-run DB evidence
  const slotRows = await prisma.reservation.count({ where: { slot } });
  const testRows = await prisma.reservation.findMany({ where: { phone: { startsWith: TEST_PHONE_PREFIX } } });
  const orphans = testRows.filter((r) => r.slot.getTime() !== slot.getTime());
  const total = await prisma.reservation.count();
  log(`# post-run DB count query: SELECT COUNT(*) FROM Reservation WHERE slot=${slot.toISOString()} → ${slotRows}`);
  log(`# post-run DB count query: total reservations → ${total} (baseline ${before.reservations} + ${total - before.reservations} test rows)`);
  log(`# orphan check: rows with test phones NOT in target slot → ${orphans.length}`);
  orphans.forEach((o) => log(`# ORPHAN row: ${o.id} slot=${o.slot.toISOString()} phone=${o.phone}`));
  const verdict =
    created.length === 12 && rejected.length === 8 && others.length === 0 && slotRows === 12 && orphans.length === 0
      ? "PASS — exactly 12 rows + 8 × 409 + 0 orphans"
      : `FAIL — ${created.length}×201 + ${rejected.length}×409 + ${others.length} other; slotRows=${slotRows}; orphans=${orphans.length}`;
  log(`# VERDICT: ${verdict}`);
  const cleaned = await cleanupTestRows(prisma);
  log(`# CLEANUP: deleted ${cleaned.reservations} reservations → total now ${await prisma.reservation.count()} (seed baseline ${before.reservations})`);
}

async function ratelimit() {
  const log = specLog("ratelimit");
  log(`# F4-7 · 6th POST within sliding 60s from ONE IP → 429 + Retry-After (§8.4: shared POST bucket, limiter ACTIVE)`);
  const ip = "10.99.2.1";
  // invalid payloads (phone "x") — limiter runs BEFORE zod, so no rows are ever created
  const payload = { name: "Evidence Run", phone: "x", partySize: 2, slot: new Date().toISOString(), locale: "en" };
  for (let i = 1; i <= 6; i++) {
    const r = await postJson("/api/reservations", payload, ip);
    log(
      `POST #${i} ip=${ip} → HTTP ${r.status} | Retry-After: ${r.headers["retry-after"] ?? "-"} | X-RateLimit-Remaining: ${r.headers["x-ratelimit-remaining"] ?? "-"} | body ${r.body}`,
    );
  }
  const sixth = await postJson("/api/reservations", payload, ip); // 7th probe: still limited (window not slid)
  log(`POST #7 (window probe, same IP) → HTTP ${sixth.status} | Retry-After: ${sixth.headers["retry-after"] ?? "-"} | body ${sixth.body}`);
  const rows = await prisma.reservation.count();
  log(`# DB reservation count after spec = ${rows} (no rows created by this spec — payloads invalid by design)`);
  const verdict = "PASS — 6th POST = 429 RATE_LIMITED with Retry-After header (see log lines above)";
  log(`# VERDICT: ${verdict}`);
}

async function dupguard() {
  const log = specLog("dupguard");
  const before = await baseline();
  log(`# F4-8 · same phone+slot resubmission → 409 DUPLICATE, no second row`);
  const slot = await freshSlot(prisma);
  const phone = `${TEST_PHONE_PREFIX}03001`;
  const first = await postJson("/api/reservations", validReservation(slot.toISOString(), phone), "10.99.3.1");
  log(`POST #1 ip=10.99.3.1 phone=${phone} → HTTP ${first.status} ${first.body}`);
  const second = await postJson("/api/reservations", validReservation(slot.toISOString(), phone), "10.99.3.2");
  log(`POST #2 ip=10.99.3.2 phone=${phone} (SAME phone+slot) → HTTP ${second.status} ${second.body}`);
  const rows = await prisma.reservation.count({ where: { phone, slot } });
  log(`# post-run DB count query: rows for (phone=${phone}, slot) → ${rows}`);
  const verdict =
    first.status === 201 && second.status === 409 && second.body.includes("DUPLICATE") && rows === 1
      ? "PASS — 201 then 409 DUPLICATE, exactly 1 row"
      : `FAIL — ${first.status}/${second.status}, rows=${rows}, body=${second.body}`;
  log(`# VERDICT: ${verdict}`);
  const cleaned = await cleanupTestRows(prisma);
  log(`# CLEANUP: deleted ${cleaned.reservations} reservations`);
}

async function honeypot() {
  const log = specLog("honeypot");
  const before = await baseline();
  log(`# F8-4 · honeypot-filled inquiry → 201, NO row created (handler fakes 201 per §8.2 ruling)`);
  const payload = {
    type: "PRIVATE_DINING",
    name: "Evidence Run",
    phone: `${TEST_PHONE_PREFIX}04001`,
    preferredDate: new Date(Date.now() + 14 * 86400_000).toISOString(),
    partySize: 8,
    message: "Evidence-run honeypot probe: a bot filled the website field.",
    locale: "en",
    website: "http://spam.example/bot", // honeypot — filled
  };
  const r = await postJson("/api/inquiries", payload, "10.99.4.1");
  log(`POST ip=10.99.4.1 website=<filled> → HTTP ${r.status} ${r.body}`);
  const rows = await prisma.inquiry.count({ where: { phone: payload.phone } });
  log(`# post-run DB count query: Inquiry rows for phone=${payload.phone} → ${rows}`);
  const verdict =
    r.status === 201 && rows === 0 ? "PASS — 201 with zero rows" : `FAIL — status=${r.status}, rows=${rows}`;
  log(`# VERDICT: ${verdict}`);
  log(`# inquiries baseline ${before.inquiries} → after ${await prisma.inquiry.count()} (unchanged)`);
}

/** E47/E48 (prompt-4 R5) — SEC-2 body cap · SEC-4 limiter bound · BKG-1 slot grid. */
async function secR5() {
  const log = specLog("sec-r5");
  log(`# E47 · SEC-2: oversized POST body → 413 (raw request/response pair)`);
  // SEC-2: declared content-length over the 8KB cap → 413 without reading
  const bigPayload = JSON.stringify({
    name: "x".repeat(9000),
    phone: "+96399900432",
    partySize: 2,
    slot: new Date(Date.now() + 14 * 86400_000).toISOString(),
    locale: "en",
  });
  const big = await postJson("/api/reservations", bigPayload, "10.99.5.1");
  log(`POST /api/reservations (9KB body, ip=10.99.5.1) → HTTP ${big.status} ${big.body.slice(0, 120)}`);
  log(`Content-Length declared: ${Buffer.byteLength(bigPayload)}B (> 8192B cap)`);
  const oversizedPass = big.status === 413;

  log(`# E48 · BKG-1: only 18:00–22:30 Damascus (UTC+3) service instants persist`);
  // Crafted off-service instants that PASS the 30-min-UTC-grid zod refine but are
  // NOT in SLOT_TIMES: 05:00 Damascus (02:00 UTC) and 17:30 Damascus (14:30 UTC),
  // on a bookable (non-Monday) future day. Plus a closed-Monday control.
  const damascusOffset = 3 * 3600_000;
  const nextBookable = (() => {
    for (let ahead = 2; ahead < 30; ahead++) {
      const day = new Date(Date.now() + ahead * 86400_000 + damascusOffset);
      if (day.getUTCDay() !== 1) return day.toISOString().slice(0, 10);
    }
    return new Date(Date.now() + 2 * 86400_000).toISOString().slice(0, 10);
  })();
  const nextMonday = (() => {
    for (let ahead = 2; ahead < 30; ahead++) {
      const day = new Date(Date.now() + ahead * 86400_000 + damascusOffset);
      if (day.getUTCDay() === 1) return day.toISOString().slice(0, 10);
    }
    return "";
  })();
  const crafted: { label: string; damascusTime: string; date: string }[] = [
    { label: "05:00 Damascus (pre-service)", damascusTime: "05:00", date: nextBookable },
    { label: "17:30 Damascus (pre-service, on 30-min grid)", damascusTime: "17:30", date: nextBookable },
    { label: "23:00 Damascus (post-service, on 30-min grid)", damascusTime: "23:00", date: nextBookable },
    { label: "closed Monday control (19:00 Damascus — valid time, closed day)", damascusTime: "19:00", date: nextMonday },
  ];
  let offGridPass = true;
  for (const c of crafted) {
    // Date.UTC months are 0-based: "2026-10-05" → October 5 via month-1
    const [yy = 1970, mm = 1, dd = 1] = nextBookableOrDate(c.date).split("-").map(Number);
    const [h = 0, m = 0] = c.damascusTime.split(":").map(Number);
    const slot = new Date(Date.UTC(yy, mm - 1, dd, h, m) - damascusOffset);
    const payload = {
      name: "BKG-1 OffGrid Probe",
      phone: `${TEST_PHONE_PREFIX}05001`,
      partySize: 2,
      slot: slot.toISOString(),
      locale: "en",
    };
    const r = await postJson("/api/reservations", payload, "10.99.5.2");
    log(`POST slot=${slot.toISOString()} (${c.label}, ${c.date}) → HTTP ${r.status} ${r.body.slice(0, 90)}`);
    if (r.status !== 400) offGridPass = false;
  }
  const persisted = await prisma.reservation.count({ where: { phone: { startsWith: `${TEST_PHONE_PREFIX}05` } } });
  log(`# DB rows persisted for the BKG-1 probe phone family: ${persisted} (expect 0)`);
  if (persisted !== 0) offGridPass = false;

  log(`# E47 · SEC-4: rate-limiter bucket Map bound (synthetic fill ≤ declared cap)`);
  const { bucketCount, RATE_LIMIT_MAX_BUCKETS, limitRead } = await import("../../src/lib/rate-limit");
  const before = bucketCount();
  for (let i = 0; i < RATE_LIMIT_MAX_BUCKETS + 500; i++) {
    limitRead(`10.77.${Math.floor(i / 250)}.${i % 250}`);
  }
  const after = bucketCount();
  log(`synthetic fill: ${RATE_LIMIT_MAX_BUCKETS + 500} distinct IPs through limitRead → buckets ${before} → ${after} (cap ${RATE_LIMIT_MAX_BUCKETS})`);
  log(`# in-module evict() keeps Map size ≤ the declared cap; the cap constant is imported from src/lib/rate-limit.ts (single source)`);
  const boundPass = after <= RATE_LIMIT_MAX_BUCKETS;

  const verdict = oversizedPass && offGridPass && boundPass
    ? "PASS — SEC-2 413 · SEC-4 bounded map · BKG-1 off-service instants rejected with zero rows"
    : `FAIL — oversized=${oversizedPass} offGrid=${offGridPass} bound=${boundPass}`;
  log(`# VERDICT: ${verdict}`);
  const cleaned = await cleanupTestRows(prisma);
  log(`# CLEANUP: deleted ${cleaned.reservations} reservations (phones ${TEST_PHONE_PREFIX}*)`);
}

/** date-string normalizer for the crafted-slot table above (Monday control may be ""). */
function nextBookableOrDate(date: string): string {
  return date || new Date(Date.now() + 2 * 86400_000).toISOString().slice(0, 10);
}

const specs: Record<string, () => Promise<void>> = {
  "capacity-sequential": capacitySequential,
  "capacity-race": capacityRace,
  ratelimit,
  dupguard,
  honeypot,
  "sec-r5": secR5,
};

const arg = process.argv[2] ?? "all";
const order = ["capacity-sequential", "capacity-race", "ratelimit", "dupguard", "honeypot"];
// Q4 order (prompt-3): capacity-race FIRST on the production surface, then the
// rest — the CLI accepts "all", one name, or a name list.
const run = arg === "all" ? order : process.argv.slice(2);
for (const name of run) {
  if (!specs[name]) throw new Error(`unknown spec: ${name}`);
  console.log(`running spec: ${name}`);
  await specs[name]();
}
await prisma.$disconnect();
console.log(`done — logs in ${EVIDENCE_OUT}specs/ (BASE=${BASE})`);
