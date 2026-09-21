# MIRADOR — Damascus · mirador-site v1.1

Fine-dining restaurant site with a fully international visual identity — the
register of the world's best tables. Bilingual AR/EN (full RTL parity), dark
night-cinematic design system, pinned horizontal three-act journey
(*Dusk → Fire → The Table*) with one kill-switched WebGL moment, and a
transactional reservation funnel with WhatsApp confirmation.

## Execution surfaces (dual — declared in MANIFEST.md)

| surface | what it is | what it produces |
|---|---|---|
| **prod-run** (canonical evidence) | GitHub Actions · `production-evidence` workflow (`workflow_dispatch` only) · ubuntu runner · PostgreSQL 16 service container | the production build, budgets, HTTP semantics, the full §10.2 battery, Lighthouse — committed under `/evidence/prod-run/` + `F12-2|F6-3/prod-run/` |
| **dev-run** (historical, round-2) | the original sandbox dev daemon (port 3000) — still alive behind the preview | round-2 evidence at its original `/evidence/` paths (never edited) |

Re-run the production battery: **Actions tab → production-evidence → Run
workflow** (or `gh workflow run production-evidence.yml`). Every artifact
family regenerates by one documented command — see `/evidence/REPLAY.md`.

## Local development (any machine with PostgreSQL 16+)

```bash
bun install                 # dependencies (lockfile is authoritative)
bun run db:generate         # Prisma client
bun run migrate             # prisma migrate deploy → PostgreSQL at DATABASE_URL
bun run seed                # deterministic seed: 28 dishes · 8 gallery · 12 demo reservations
bun run dev                 # dev server on http://localhost:3000
```

`.env` defaults to `postgresql://mirador:mirador@localhost:5432/mirador` —
provision any PostgreSQL 16+ (create user `mirador` + db `mirador`, or edit
`DATABASE_URL`). The original sandbox runs a user-space PostgreSQL 16.14 via
`~/pg-runtime/start-pg.sh` (LOCAL script, never committed — prompt-3 N22).

Deterministic gates (all expected green):

```bash
bash scripts/judge-audit.sh  # E32: tsc + eslint + G1–G7 + canonical-schema assert (fresh-clone-safe; needs ripgrep)
bun run typecheck            # tsc --noEmit · 0 errors (scaffold examples/skills excluded — ASSUMPTIONS #9)
bun run lint                 # eslint · 0 problems
bash scripts/gates.sh        # grep gates G1–G7 (§10.1) · 0 hits (requires ripgrep)
bun run audit:fonts          # F1-4 AR weight payloads ≤60KB
bun run audit:tokens         # F2-1 frozen token contract diff
bun run audit:copy           # G1/G5 copy + F9-4 word counts + F9-5 parity (needs the seeded DB)
```

Bare `/` redirects deterministically to `/en` (no Accept-Language negotiation;
hreflang x-default covers SEO). All routes exist per locale:
`/{en,ar}/{,menu,reserve,confirmation/[id],story,gallery,private-dining,contact}`.

## Environment (`.env`, see `.env.example`)

```
DATABASE_URL="postgresql://mirador:mirador@localhost:5432/mirador"  # canonical (any PostgreSQL 16+)
WHATSAPP_NUMBER="963955000111"                        # env override, venue.ts default
NEXT_PUBLIC_SITE_URL="http://localhost:3000"          # hreflang/OG base
```

No secret ever reaches client bundles.

## Stack

Next.js 16 (App Router, Turbopack build) · React 19 · TypeScript 5 strict ·
Tailwind CSS 4 (CSS-first `@theme` in `src/app/globals.css` — no
tailwind.config) · shadcn/ui primitives restyled via token vars · **Prisma on
PostgreSQL — the canonical §6.1 schema (enums + `String[]`, both `@@unique`
booking guards)** · gsap 3.13 + Lenis 1.1 (ALL motion) · three + R3F in ONE
lazy chunk. Exact resolved versions: `docs/versions.md`.

## Docs map

- `docs/versions.md` — pinned versions + surface deviations
- `docs/deploy-pre.md` — pre-deployment checklist (PostgreSQL switch EXECUTED + evidenced; remaining human/ops items)
- `docs/api-route-table.md` — frozen API contract
- `docs/component-inventory.md` — frozen component inventory
- `docs/copy-parity.md` — 138-row bilingual copy parity audit
- `docs/design-system.md` — operational build contract (tokens/rules/data)
- `ASSUMPTIONS.md` — rule-zero ledger (11 entries, contract-ordered)
- `ASSETS-REPLACE.md` — replaceable asset register (A2 · F10-3)
- `worklog.md` — build log (every task, every agent)

## Production build

`bun run build && bun run start` (standalone output is configured) — executed
on the sanctioned GitHub Actions surface; see `/evidence/F12-2/prod-run/`.
The first-load JS budget verdict ships there verbatim (thresholds frozen).
