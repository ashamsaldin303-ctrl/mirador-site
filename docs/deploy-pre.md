# docs/deploy-pre.md — blocking pre-deployment checklist

## §1 PostgreSQL switch — **EXECUTED + EVIDENCED** (prompt-3, 2026-09-21)

The canonical-schema switch from the round-1 SQLite adaptation (ASSUMPTIONS #2)
is done and evidenced on the sanctioned surface (GitHub Actions ·
`production-evidence` workflow · PostgreSQL 16 service container):

1. ~~Provision PostgreSQL; set `DATABASE_URL="postgresql://user:pass@host:5432/mirador"`.~~
   **Executed:** runner service `postgres:16` + local dev databases at
   `postgresql://mirador:mirador@localhost:5432/mirador` (the committed `.env`).
2. ~~`prisma/schema.prisma`: provider → `"postgresql"`, verbatim §6.1 types~~
   (enums; `allergens`/`dietTags` as true `String[]`).
   **Executed:** committed schema IS the §6.1 canonical form
   (`evidence/prod-run/gates/deterministic-suite.log` — judge-audit asserts the
   provider on every run; `scripts/judge-audit.sh` §0).
3. ~~`bun run db:generate` + `prisma migrate dev` against a fresh database.~~
   **Executed:** migrations history regenerated against PostgreSQL
   (`prisma/migrations/20260921125931_pg_init/migration.sql` — enums, `TEXT[]`
   columns, both `@@unique` guards + slot index); `bun run migrate` green on
   the runner.
4. ~~`bun run seed` — counts identical to the SQLite baseline.~~
   **Executed + evidenced:** `evidence/prod-run/specs/seed-count.log`
   (6 sections · 28 dishes · 4–5 per section · 8 gallery · 12 reservations ·
   0 inquiries — GATE F3-1 PASS).
5. ~~Re-run the race gate verbatim on PostgreSQL.~~
   **Executed + evidenced (E21):** `evidence/prod-run/specs/capacity-race.log`
   — 20 parallel POSTs → exactly 12 rows + 8 × 409 + 0 orphans on PostgreSQL
   (the `serializeWrite` in-process queue was RETAINED per the option recorded
   below; the §6.3 transaction body + both `@@unique` guards are the safety
   layer proven on this engine).
   *Original note:* the queue added for the SQLite single-writer deviation is
   harmless on PostgreSQL (the §6.3 transaction body is byte-identical) and may
   be removed if row-lock concurrency is preferred — re-run the race gate
   either way. Chosen: retained (minimal diff; zero product change this round).
6. ~~Re-run the full API spec suite.~~ **Executed + evidenced (E23):**
   `evidence/prod-run/specs/*.log` — all five verdicts PASS.

## §2 Production build + budgets (B1/B2) — **EXECUTED + EVIDENCED**

1. `bun run build` — exit 0 on the sanctioned surface (first run: actions run
   #1, SHA 05d91d6; reproduced on every subsequent run).
2. Per-route first-load JS budget **≤150KB gz (hard 200KB): FAIL — 16/16
   routes** (`evidence/F12-2/prod-run/first-load-js-gz.txt`,
   `F12-2/prod-run/summary.md`). Root cause: the pinned stack's client floor —
   React 19 + Next 16 App Router runtime ≈ **158KB gz with ALL motion excluded**
   (motion stack itself: 57.5KB gz, within its own ≤90KB budget), so even a
   motion-free first-load exceeds the soft budget; the hard cap is exceeded by
   17–100KB per route. **This is a product-level blocker, not an environment
   artifact** — thresholds stay frozen. Solution path (human-approved work,
   never done unilaterally): partial prerendering/static-shell for marketing
   routes, or a budget revision against the pinned stack. No minimal fix exists
   within the frozen dependency pins (arithmetic above).
3. Lazy three/fiber/drei chunk **≤400KB gz + absent from every route's
   first-load: PASS** — 229.7KB gz, zero route references
   (`evidence/F6-3/prod-run/three-lazy-chunk.txt`); wire-corroborated
   (238KB loaded only after journey scroll — `F12-2/prod-run/network-firstload.txt`).
4. Motion stack (gsap+ScrollTrigger+Flip+lenis) in base **≤90KB gz: PASS** —
   57.5KB gz (`evidence/F12-2/prod-run/motion-stack.txt`).
5. `bun run start` (standalone, port 3000) boots and serves — readiness +
   raw `evidence/prod-run/server.log`.

## §3 Lighthouse CI on the production build (B3) — EXECUTED + EVIDENCED

`bunx @lhci/cli@0.15.1 autorun --config=.lighthouserc.json` (mobile emulation ·
3 runs · `/en` + `/ar`): reports + raw traces +
`evidence/prod-run/lighthouse/medians.md` + `lcp-element.txt`. See that file
for the medians vs the frozen thresholds (≥90 · LCP ≤2.5s · CLS ≤0.1 ·
TBT ≤300ms) and the lcpElement proof (hero poster `<img>` + raw-trace
corroboration).

## §4 404 status commit (B4) — **EXECUTED + EVIDENCED**

Production server round-trips: `evidence/prod-run/http/` — `/en` `/ar` → 200;
`/en/nonexistent-page` `/ar/nonexistent-page` → **HTTP 404** + the six §7.9
designed copy strings + noindex (`http/summary.txt`, GATE E22).

## §5 Cold-start handoff (F12-3) — EXECUTED + EVIDENCED

Fresh clone → `bun install && bun run migrate && bun run seed && bun run dev`
→ `GET /en` 200: `evidence/prod-run/cold-start/cold-start.log`.

---

## Remaining pre-deployment items — HUMAN/OPS, undone (N23: never claimed done)

| item | owner | note |
|---|---|---|
| real `DATABASE_URL` (provisioned PostgreSQL with credentials) | ops | CI/dev URLs are placeholders by design |
| domain, TLS, hosting env (`NEXT_PUBLIC_SITE_URL`, headers at the edge) | ops | hreflang/OG use `NEXT_PUBLIC_SITE_URL` |
| real venue constants per `ASSETS-REPLACE.md` (photography, WhatsApp number) | human | A5 fictional constants still shipped |
| first-load JS budget resolution (§2.2 above) | human | product decision: structural work or budget revision |
| Lighthouse medians vs frozen thresholds (§3) | human | see `evidence/prod-run/lighthouse/medians.md` |

All commands mirror `/evidence/REPLAY.md` — same repo, same tools.
