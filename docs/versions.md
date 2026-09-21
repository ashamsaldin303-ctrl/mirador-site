# MIRADOR — resolved versions (T0.1 duty, brief §2.1)

Recorded from the installed dependency graph (lockfile authoritative).
`[verify]` / `[pin-at-build]` claims from the brief are resolved here.
Prompt-3 update: the canonical database engine is PostgreSQL 16 (below),
executed on the GitHub Actions surface + mirrored by a user-space PG 16.14 in
the original sandbox (both at the committed `.env` URL).

| Layer | Brief pin | Resolved | Note |
|---|---|---|---|
| Next.js | 16.x [verify] | 16.1.3 | App Router only (Turbopack build) |
| React | 19.x | 19.x | Server Components default |
| TypeScript | 5.x strict | 5.9.x | `strict: true` (+ `noUncheckedIndexedAccess: true` enabled) |
| Tailwind CSS | 4.x | 4.x | CSS-first `@theme` in `src/app/globals.css`; `tailwind.config.ts` deleted (F2-5) |
| shadcn/ui | CLI add-on [pin-at-build] | new-york style, pre-provisioned in `src/components/ui` | restyled exclusively via token CSS vars |
| Prisma | 7.x [verify] | **6.19.2** | Prisma 7.x was not resolvable at T0.1 — disclosed (ASSUMPTIONS #5/#6), not silently substituted; canonical PostgreSQL schema + migrations fully supported |
| Database | PostgreSQL | **PostgreSQL 16** (canonical, prompt-3 E20) | CI service container `postgres:16` [pin-at-build] · original sandbox: user-space embedded PostgreSQL 16.14 (`~/pg-runtime`, never committed — N22 note in REPLAY.md) · schema = §6.1 verbatim (enums + `String[]`) |
| gsap | 3.13.x [verify] | 3.13.0 | core + ScrollTrigger + Flip (registered in `src/lib/motion.ts`) |
| lenis | 1.1.x [verify] | 1.1.22 | wired to `ScrollTrigger.update`, reduced-motion guarded |
| three | [pin-at-build] | 0.186.0 | ONE lazy chunk (home journey only) |
| @react-three/fiber | [pin-at-build] | 9.7.0 | — |
| @react-three/drei | [pin-at-build] | 10.7.8 | installed for pin compliance; **not imported** (tree-cost) — the skyline scene needs no drei helpers |
| zod | [pin-at-build] | 4.0.2 | schemas are brief §8.2 verbatim (zod4-compatible) |
| sharp | tooling | 0.34.3 | AVIF ladder generation (scripts/images) |
| lucide-react | tooling | 0.525.0 | icons: 16/20/24px, strokeWidth 1.5 |
| playwright / @axe-core/playwright / @lhci/cli | tooling [pin-at-build] | playwright **1.63.0** · @axe-core/playwright **4.13.0** (devDependencies) · @lhci/cli **0.15.1** (pinned at invocation on the runner) | battery scripts under `evidence/tools/`; chromium via `bunx playwright install --with-deps chromium` |
| fonttools / pyftsubset | tooling | Python 3.12 + fonttools (subset pipeline) | WOFF2 subsetting for the four self-hosted families |

## Runtime deviations from the brief (disclosed once, all logged in ASSUMPTIONS.md)

1. **bun, not pnpm** — the original sandbox runs `bun run dev` on port 3000 (dev
   server, background). Every `pnpm <script>` maps 1:1 to `bun run <script>`.
2. ~~SQLite, not PostgreSQL~~ **REVERSED (prompt-3 E20):** the committed
   datasource is the canonical PostgreSQL §6.1 schema. The original sandbox
   mirrors it with a user-space PostgreSQL 16.14 at the same `.env` URL
   (`~/pg-runtime`, local-only — N22); the CI battery runs the `postgres:16`
   service container.
3. **`src/app/`, not root `app/`** — the pre-provisioned scaffold uses
   `src/app` + `src/lib` with `@/* → ./src/*`. App Router semantics unchanged.
4. ~~No production build in-session~~ **REVERSED (prompt-3):** production
   builds execute on the sanctioned GitHub Actions surface
   (`.github/workflows/production-evidence.yml`, manual `workflow_dispatch`);
   the sandbox keeps exactly one job — the live dev daemon behind the preview.
