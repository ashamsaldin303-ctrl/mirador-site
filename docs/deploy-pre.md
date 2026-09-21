# docs/deploy-pre.md — blocking pre-deployment checklist (prompt-2 D-2 ruling)

The sandbox executed everything legally runnable (full §10.2 battery against
the :3000 dev daemon — see `/evidence/`). The items below are the ones that
MUST run on a build-capable machine before real deployment. None may be
skipped, softened, or declared done without executing.

## 1. PostgreSQL switch (ASSUMPTIONS #2 reversal — the contracted target engine)

1. Provision PostgreSQL; set `DATABASE_URL="postgresql://user:pass@host:5432/mirador"`.
2. `prisma/schema.prisma`: change `provider = "sqlite"` → `"postgresql"` and
   restore the verbatim §6.1 types (enums for status/locale; `allergens` /
   `dietTags` as true `String[]` — the JSON-encoding accessors in
   `src/lib/menu.ts` are the single seam).
3. `bun run db:generate` then `bunx prisma migrate dev --name pg-switch`
   (or `migrate deploy` against a fresh database).
4. `bun run seed` — deterministic seed (6 sections · 28 dishes · 8 gallery ·
   12 demo reservations) must count identically to `/evidence/specs/seed-count.log`.
5. **Re-run the race gate verbatim:** `bun evidence/tools/api-specs.ts capacity-race`
   → exactly 12 rows + 8 × 409 + 0 orphans. Note: the in-process
   serialization queue (`serializeWrite` in `src/app/api/reservations/route.ts`)
   was added for the SQLite single-writer deviation; on PostgreSQL it is
   harmless (the §6.3 transaction body is byte-identical) and may be removed
   as part of this switch if row-lock concurrency is preferred — re-run the
   race gate either way.
6. Re-run the full API spec suite: `bun evidence/tools/api-specs.ts all` —
   all five verdicts must read PASS.

## 2. Production build + budgets (B1 — platform-prohibited in the sandbox)

1. `bun run build` — exit 0; capture the route size table.
2. Assert per-route first-load JS ≤150KB gz (hard 200KB) — F12-2.
3. Assert the lazy three/fiber/drei chunk ≤400KB gz and absent from every
   route's first-load JS — F6-3 (dev-mode bundles must never be quoted).
4. Optionally capture the motion-stack base total (gsap+ScrollTrigger+Flip+
   lenis ≤90KB gz) — F2 bonus.
5. Boot `bun run start` on a port ≠ any dev daemon (boot-guard: `E2E_RATE_LIMIT`
   is ignored under `NODE_ENV=production` by design).

## 3. Lighthouse CI on the production build (B2/B3)

`bunx @lhci/cli autorun` — mobile, 3 runs, median on `/en` and `/ar`:
**≥90 · LCP ≤2.5s · CLS ≤0.1 · TBT ≤300ms**; commit reports + raw traces;
read `lcpElement` (must be the hero poster `<img>` — corroborated in-sandbox
by `/evidence/lighthouse/lcp-element--{en,ar}--diagnostic.json`).

## 4. 404 status commit (B4)

On the production server: `curl -i` a nonexistent path → **HTTP 404** with the
§7.9 designed copy (the dev-mode Turbopack quirk that answered 200 is dev-only;
the copy + noindex were verified in `/evidence/http/`).

## 5. Cold-start handoff (F12-3)

Fresh clone → `bun install && bun run migrate && bun run seed && bun run dev`
→ clean boot, `GET /en` 200. (Not runnable in the sandbox: it would reset the
live daemon's database.)

---
All commands above mirror `/evidence/REPLAY.md` — same repo, same tools.
