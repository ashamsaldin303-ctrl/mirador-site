# MIRADOR — Damascus · mirador-site v1.1

Fine-dining restaurant site with a fully international visual identity — the
register of the world's best tables. Bilingual AR/EN (full RTL parity), dark
night-cinematic design system, pinned horizontal three-act journey
(*Dusk → Fire → The Table*) with one kill-switched WebGL moment, and a
transactional reservation funnel with WhatsApp confirmation.

## Verified run commands (sandbox runtime — bun)

```bash
bun install                 # dependencies (lockfile is authoritative)
bun run db:push             # or: bunx prisma migrate deploy (bun run migrate)
bun run seed                # deterministic seed: 28 dishes · 8 gallery · 12 demo reservations
bun run dev                 # dev server on http://localhost:3000
```

Deterministic gates (all expected green):

```bash
bun run typecheck           # tsc --noEmit · 0 errors in src/ (template examples/skills excluded)
bun run lint                # eslint · 0 problems in src/
bash scripts/gates.sh       # grep gates G1–G7 (§10.1) · 0 hits
bun run audit:fonts         # F1-4 AR weight payloads ≤60KB
bun run audit:tokens        # F2-1 frozen token contract diff
bun run audit:copy          # G1/G5 copy + F9-4 word counts + F9-5 parity (docs/copy-parity.md)
bash scripts/build-fonts.sh # rebuild WOFF2 subsets (sources in assets/fonts-src/)
bun scripts/images.mjs      # rebuild the AVIF ladder from assets/img-src/raw/
```

Bare `/` redirects deterministically to `/en` (no Accept-Language negotiation;
hreflang x-default covers SEO). All routes exist per locale:
`/{en,ar}/{,menu,reserve,confirmation/[id],story,gallery,private-dining,contact}`.

## Environment (`.env`, see `.env.example`)

```
DATABASE_URL="file:/home/z/my-project/db/custom.db"   # SQLite in this sandbox
WHATSAPP_NUMBER="963955000111"                        # env override, venue.ts default
NEXT_PUBLIC_SITE_URL="http://localhost:3000"          # hreflang/OG base
```

No secret ever reaches client bundles.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 5 strict · Tailwind CSS 4
(CSS-first `@theme` in `src/app/globals.css` — no tailwind.config) · shadcn/ui
primitives restyled via token vars · Prisma (SQLite here; PostgreSQL-ready —
see ASSUMPTIONS #2) · gsap 3.13 + Lenis 1.1 (ALL motion) · three + R3F in ONE
lazy chunk. Exact resolved versions: `docs/versions.md`.

## Docs map

- `docs/versions.md` — pinned versions + sandbox deviations
- `docs/api-route-table.md` — frozen API contract
- `docs/component-inventory.md` — frozen component inventory
- `docs/copy-parity.md` — 138-row bilingual copy parity audit
- `docs/design-system.md` — operational build contract (tokens/rules/data)
- `ASSUMPTIONS.md` — rule-zero ledger (5 entries)
- `ASSETS-REPLACE.md` — replaceable asset register (A2 · F10-3)
- `worklog.md` — build log (every task, every agent)

## Production build (handoff machine)

The sandbox forbids in-session production builds; on the handoff machine:
`bun run build && bun run start` (standalone output is configured).
