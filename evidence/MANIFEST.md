# MANIFEST.md — MIRADOR evidence-run environment (prompt-2 §5.3)

| field | value |
|---|---|
| machine | single container — z.ai cloud sandbox (one machine executed the entire battery; no split environments) |
| OS | Debian GNU/Linux 13 (trixie) |
| runtime | bun 1.3.14 (specs + server process) · node v24.21.0 available |
| repo state | code-under-test = commit `0ad5587` (product fixes on top of `619f239`); evidence pack lands in the immediately following commit |
| server under test | `bun run dev` daemon — Next.js 16 (Turbopack) on port 3000, the platform's only sanctioned surface; **production builds are forbidden by platform policy** (see /evidence/BLOCKED.md) |
| DB engine | SQLite via Prisma 6.11.1 (`db/custom.db`, 12-row seed baseline maintained — every spec cleans its test rows; post-run count query outputs in the spec logs) |
| Playwright | 1.63.0 (chromium-1243, pre-provisioned at ~/.cache/ms-playwright; launched with `--enable-unsafe-swiftshader --use-angle=swiftshader --use-gl=angle` so the WebGL control run can mount software WebGL2) |
| axe | @axe-core/playwright 4.13.0 |
| LHCI | NOT INSTALLED — gate-form BLOCKED-by-policy (no prod build to measure); no Lighthouse numbers are claimed anywhere in this pack |
| run window | 2026-09-21 · 11:14–12:10 UTC (14:14–15:10 UTC+3, Damascus) |
| env flags during runs | none — `E2E_RATE_LIMIT` never set (boot-guard honored; rate isolation via per-request `x-forwarded-for` IPs inside the tools, limiter stays ACTIVE) |
| in-run product fixes | 2 (both under frozen checks, both documented): reservations API single-writer safety (race F4-4) · reserve fieldset `min-w-0` (overflow F12-6) — commit `0ad5587` |

Deviations register: ASSUMPTIONS.md rows #1–#8 · /evidence/BLOCKED.md B1–B4 ·
prompt-2 §3 rulings D-1..D-7 all honored (D-6/D-7 eliminated by this run's P1/P3
to the extent the platform allows).
