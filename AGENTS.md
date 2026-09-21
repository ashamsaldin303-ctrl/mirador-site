# AGENTS.md — MIRADOR project DoD & agent notes

## Dual execution surfaces (prompt-3)

- **prod-run** — production evidence originates ONLY on GitHub Actions
  (`production-evidence` workflow, `workflow_dispatch`-only, `postgres:16`
  service). Never relabel dev-surface artifacts as production evidence (N21).
- **dev-run** — the original sandbox dev daemon (port 3000, behind the human
  preview) is a historical evidence surface; its round-2 output paths stay
  untouched. The sandbox now runs the CANONICAL PostgreSQL schema against a
  user-space PostgreSQL 16.14 (`~/pg-runtime/start-pg.sh` — LOCAL, never
  committed; N22). The committed `prisma/schema.prisma` provider is always
  `postgresql` — `scripts/judge-audit.sh` asserts it on every run.

## Definition of done (per task)

1. `bun run typecheck` — 0 errors in `src/` (pre-existing template errors under
   `examples/` and `skills/` are out of scope and predate this project).
2. `bun run lint` — 0 problems in `src/` (`--max-warnings 0`).
3. `bash scripts/gates.sh` — G1–G7 all 0 hits.
4. Dev server (`bun run dev`, port 3000) serves the touched routes 200 with a
   clean `dev.log` tail; SSR truth greps pass (content present without JS).
5. Browser battery: both locales, 375/768/1440, no horizontal scroll at 375,
   zero console errors, keyboard walkthroughs on interactive routes.

## Architecture invariants

- **Tokens**: `src/app/globals.css` is the ONE token file (frozen §5 contract).
  Never introduce raw hex/oklch outside it (G2), arbitrary spacing (G3),
  ad-hoc radii (G4), or `transition-all` (G7).
- **Motion**: gsap + Lenis own ALL motion (never framer-motion — G6). Durations
  and easings come from `src/lib/motion.ts` (mirror of the CSS tokens).
  Entrances ≤400ms; signature ≤600ms; scrub time exempt.
  `prefers-reduced-motion` leaves all content visible.
- **i18n**: every UI string lives in `content/{en,ar}.json` (1:1 keys, checked
  by `bun run audit:copy`). Routes are `/[locale]/…`; `<html lang dir>` comes
  from the root locale layout; locale switch is a soft `Link` flip (atomic).
  AR typography: no letter-spacing, no ALL-CAPS, body/small lh ≥1.7 (token
  overrides), Western digits everywhere.
- **Booking safety (R4, Critical)**: the ONLY accepted pattern is the §6.3
  interactive transaction + `@@unique([slot, tableNumber])` +
  `@@unique([phone, slot])` with P2002→409 mapping — see
  `src/app/api/reservations/route.ts`. Never check-then-write without it.
- **Images**: `next/image` only (never `<img>`, never `<video>`). The AVIF path
  contract is frozen (`public/img/**` — see `docs/design-system.md`); missing
  files render the designed image-fail state.
- **The ONE WebGL moment**: `src/components/home/skyline-canvas.tsx` — lazy
  chunk post-LCP, ≤6000 particles, DPR ≤1.5, kill-switch on all three paths.
  Never add a second canvas.

## Rate-limiter scale-out note (DoD item)

The limiter (`src/lib/rate-limit.ts`) is an in-memory sliding window —
single-instance v1 by design, NEVER a security boundary (the unique
constraints are the booking-safety layer). Behind a load balancer it must be
moved to a shared store (per-IP windows) — flag any multi-instance deploy.
IP derivation assumes the proxy chain sets `x-forwarded-for` (first hop) or
`x-real-ip` — verify the gateway does.

## Verification loop discipline

≤3 self-retries per failing task · ≤3 fix rounds per finding · then BLOCKED
with the §10.5 anatomy (condition → hypothesis → attempts → options → default
→ the exact question). Evidence per AC → `/evidence/<AC-ID>/`
(`route--state--width.png`). Never weaken a frozen check to make it pass.

## Frozen artifacts (read-only)

`docs/api-route-table.md` · `docs/component-inventory.md` · the `@theme` block
in `globals.css` · `prisma/schema.prisma` guards · `scripts/audit-*` expected
outcomes (fixed by §9).
