# ASSUMPTIONS.md — MIRADOR (rule zero §1.2 ledger · cap 5)

Standing assumptions A1–A5 (brief §1.3) are inherited constants, not entries
here. Below: unknowns resolved by decision under sandbox constraints — each is
reversible, none invents product facts.

| id | decision | rationale | risk | blast radius | reversal |
|---|---|---|---|---|---|
| 1 | Package manager **bun** replaces pnpm; scripts map 1:1 (`bun run dev/build/lint/typecheck/seed/audit:*`) | sandbox runtime mandate: dev server must run `bun run dev -p 3000` in background; pnpm unavailable | low — script names and DAG commits unchanged | CI/handoff docs | install pnpm + `pnpm import` from lockfile |
| 2 | **SQLite** datasource instead of PostgreSQL; §6.1 schema adapted: enums → `String` (Zod/app-layer validated), `allergens`/`dietTags` `String[]` → JSON-encoded `String` (typed accessors in `src/lib`) | sandbox provides SQLite-only Prisma; brief §6.3 transaction pattern + both `@@unique` guards preserved verbatim (R4 booking safety intact) | medium — true write-parallelism is serialized by SQLite; race AC (F4-4) still yields exactly 12 rows + 8×409 via unique-violation mapping | data layer only | `prisma/db push` against a PostgreSQL `DATABASE_URL`, restore verbatim §6.1 types (enums + `String[]`) — app code unchanged (typed accessors already isolate the encoding) |
| 3 | Routes under **`src/app/`** (scaffold pathing) instead of root `app/` + `src/` libs | pre-provisioned Next 16 scaffold (tsconfig `@/* → ./src/*`, components.json) — App Router semantics identical | low | grep-gate paths (G1–G4, G7 run on `src/`), brief doc references | move `src/app/*` → `app/`, update tsconfig include |
| 4 | Fonts self-hosted as **WOFF2 subsets under `public/fonts/` + `@font-face` (unicode-range)** instead of `next/font/local` under `app/fonts/` | F1-4 requires unicode-range splits (AR weight ≤60KB summed); `next/font/local` cannot express per-file unicode-range; files remain self-hosted, `font-display: swap`, preloaded per active locale (no CDN, no `<link>` to Google) | low — no automatic size assertions from next/font; `audit:fonts` script covers it | `globals.css` + font files | switch declarations to `next/font/local` with the same subset files |
| 5 | **Prisma 6.11.1** (brief pin: 7.x [verify]) | §2.1: pinned major unresolvable at T0.1 → disclosed per errata discipline rather than silently substituting a *different* major; schema/transaction/unique semantics used by the brief are fully supported on 6.x | low-medium — future migration to 7 client API changes (context client) at handoff | prisma client instantiation (`src/lib/db.ts`) | upgrade when 7.x is available; `src/lib/db.ts` is the single touchpoint |

Closed-Monday availability semantics (interpretation, not an assumption): the
availability API answers a Monday date with all 10 slots at `remaining: 0`
(sold-out rendering — §4.3 disabled grid); POST still rejects Monday slots with
400 (§8.2 slot-day validation). Recorded in `docs/api-route-table.md`.
