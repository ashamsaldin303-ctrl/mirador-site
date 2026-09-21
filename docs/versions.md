# MIRADOR — resolved versions (T0.1 duty, brief §2.1)

Recorded from the installed dependency graph on the sandbox date. `[verify]` /
`[pin-at-build]` claims from the brief are resolved here; the lockfile is
authoritative.

| Layer | Brief pin | Resolved | Note |
|---|---|---|---|
| Next.js | 16.x [verify] | 16.1.1 | App Router only |
| React | 19.x | 19.x | Server Components default |
| TypeScript | 5.x strict | 5.9.x | `strict: true` (+ `noUncheckedIndexedAccess: true` enabled) |
| Tailwind CSS | 4.x | 4.x | CSS-first `@theme` in `src/app/globals.css`; `tailwind.config.ts` deleted (F2-5) |
| shadcn/ui | CLI add-on [pin-at-build] | new-york style, pre-provisioned in `src/components/ui` | restyled exclusively via token CSS vars |
| Prisma | 7.x [verify] | **6.11.1** | Prisma 7.x not resolvable in this sandbox — disclosed (ASSUMPTIONS #5), not silently substituted |
| Database | PostgreSQL | **SQLite (file)** | sandbox mandate — schema adapted: enums → `String` (app-layer validation), `String[]` → JSON-encoded `String` (ASSUMPTIONS #2); interactive transactions + `@@unique` guards preserved (R4) |
| gsap | 3.13.x [verify] | 3.13.0 | core + ScrollTrigger + Flip (registered in `src/lib/motion.ts`) |
| lenis | 1.1.x [verify] | 1.1.22 | wired to `ScrollTrigger.update`, reduced-motion guarded |
| three | [pin-at-build] | 0.186.0 | ONE lazy chunk (home journey only) |
| @react-three/fiber | [pin-at-build] | 9.7.0 | — |
| @react-three/drei | [pin-at-build] | 10.7.8 | installed for pin compliance; **not imported** (tree-cost) — the skyline scene needs no drei helpers |
| zod | [pin-at-build] | 4.0.2 | schemas are brief §8.2 verbatim (zod4-compatible) |
| sharp | tooling | 0.34.3 | AVIF ladder generation (scripts/images) |
| lucide-react | tooling | 0.525.0 | icons: 16/20/24px, strokeWidth 1.5 |
| playwright / @axe-core/playwright / @lhci/cli / tsx | tooling [pin-at-build] | not installed in sandbox | battery scripts authored under `tests/` + `scripts/` with expected outcomes frozen by §9; running the full Playwright/Lighthouse battery requires `bun add -D playwright @axe-core/playwright @lhci/cli` + `bunx playwright install chromium` on the handoff machine |
| fonttools / pyftsubset | tooling | Python 3.12 + fonttools (subset pipeline) | WOFF2 subsetting for the four self-hosted families |

## Runtime deviations from the brief (disclosed once, all logged in ASSUMPTIONS.md)

1. **bun, not pnpm** — the sandbox runs `bun run dev` on port 3000 (dev server,
   background). Every `pnpm <script>` maps 1:1 to `bun run <script>`.
2. **SQLite, not PostgreSQL** — the sandbox Prisma datasource is SQLite-only
   (`DATABASE_URL=file:...`). Booking safety (R4) is preserved: the §6.3
   interactive transaction pattern runs verbatim, `@@unique([slot, tableNumber])`
   and `@@unique([phone, slot])` are enforced, P2002 → 409 mapping is intact.
3. **`src/app/`, not root `app/`** — the pre-provisioned scaffold uses
   `src/app` + `src/lib` with `@/* → ./src/*`. App Router semantics unchanged.
4. **No production build in-session** — the sandbox forbids `bun run build`;
   verification runs against the dev server (`next dev -p 3000`) plus the
   deterministic gates (tsc / eslint / grep G1–G7).
