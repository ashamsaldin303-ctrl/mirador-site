# BLOCKED INDEX — environment-blocked items

## Round 4 (prompt-4 · Release-1) — 2026-09-22 · doc-truth re-sync (C-2/N24)

Release-1 re-synced every row below to the CURRENT raw state (run 11,
`evidence/prod-run/**`, surface-labeled). verify-docs (scripts/verify-docs.ts,
CI-wired) enforces these quotes mechanically — a doc that drifts from the raw
fails the job.

| # | round-2 item | resolution (re-synced to run-11 raw) |
|---|---|---|
| B1 | production build + route size/chunk tables | **CLOSED** — `bun run build` exit 0 (actions runs #1+, SHA 05d91d6+); tables + manifests in `F12-2/prod-run/` |
| B2 | production Lighthouse medians + raw traces | **EXECUTED — GATE E27: FAIL** (exit-gate dispatch run 25: perf 92/87 ✓ · CLS 0.0195/0.0000 ✓ · TBT 72/90ms ✓ — **LCP medians EN 3340ms · AR 3904ms vs ≤2500 the sole failing threshold**; observedLCP 152ms == FCP on the same runs — the gap is the lantern font-queue model, six optimization rounds + full diagnosis in `r1/DONE.md` known-gaps; runs 11→25 raw preserved) — `prod-run/lighthouse/medians.md` |
| B3 | (merged into B2) | — |
| B4 | prod-form 404 status semantics | **CLOSED — GATE E22: PASS** (run 11: R3's loading-boundary relocation landed — `/{en,ar}/nonexistent-page` → HTTP 404 + the six §7.9 copy strings + noindex on the Actions production server) — `prod-run/http/summary.txt` |

### Round-3 residual blockers (re-synced 2026-09-22 — prompt-4 R1/R3/R4)

| # | item | root cause | evidence | resolution |
|---|---|---|---|---|
| BLK-R3-1 | **E22 status component:** `/en/ar/nonexistent-page` answered **HTTP 200**, not 404 (the §7.9 designed copy + noindex DO ship in the body) | Next 16 streams the shell: the `[locale]/loading.tsx` Suspense boundary (a §6.6-contracted state surface) flushes before `notFound()` resolves, so the server's 404-status assignment (app-render error path) loses the race to the first flush; the `generateMetadata → notFound()` trick is structurally dead because Next 16 streams metadata inside the RSC payload. NOT an environment artifact — reproduced identically across 3 production runs. | `prod-run/http/{en,ar}-nonexistent.txt` + `http/summary.txt` | **RESOLVED by prompt-4 R3 (option a):** the loading boundary relocated into the DB-backed segments (menu · gallery · confirmation) — skeletons survive where streaming happens; the catch-all unwraps. GATE E22: PASS on run 11 (both locales 404 + copy + noindex). |
| BLK-R3-2 | **E19 first-load component:** per-route first-load JS ≤150KB gz (hard 200KB) — round-3 measured **FAIL 16/16 routes** (216.7–299.3KB wire) | the pinned stack's client floor: React 19 + Next 16 App Router runtime ≈ **158KB gz with ALL motion excluded** (motion stack itself: 57.5KB gz — within its own ≤90KB budget); even a motion-free first-load exceeds the soft budget, so no minimal product fix exists within the frozen dependency pins. Thresholds are FROZEN and never bend. | `F12-2/prod-run/{first-load-js-gz.txt, chunk-manifest.txt, network-firstload.txt, summary.md}` | **Release-1 re-scope (prompt-4 §5):** this release gates on the HARD 200KB — run 11 measured 170.3–180.9KB gz 16/16 (P-022's lazy motion landed; the motion family is out of every route's first load). The 150→165KB soft cap gates Release 2 per the ceilings table. |

Every other E17–E33 check ran on the production surface with raw committed
output — see `/evidence/MATRIX.md` (regenerated) and `/evidence/INDEX.md`.

## Round 2 (prompt-2 · dev surface) — historical record, 2026-09-21

Executor: z.ai sandbox container (see round-2 MANIFEST entry). One platform
constraint produced all entries below; every other contracted check ran and
ships as raw output. (Superseded by the round-3 resolutions above; retained
verbatim as the historical record.)

| # | item | reason | evidence |
|---|---|---|---|
| B1 | P1 production build (`bun run build`) → route size table, chunk manifests | platform forbids production builds — dev daemon on :3000 is the only sanctioned server | /evidence/F12-2/BLOCKED.md · /evidence/F6-3/BLOCKED.md · /evidence/F2/BLOCKED.md |
| B2 | E8 Lighthouse CI gate-form (mobile, prod build, 3 runs, median) | requires B1 | /evidence/lighthouse/BLOCKED.md |
| B3 | E9 LCP element from committed Lighthouse trace JSON | requires B1 | /evidence/lighthouse/BLOCKED.md (+ diagnostic in-browser LCP-element capture) |
| B4 | E5 prod-form 404 status semantics | dev-mode Turbopack 404-status quirk (disclosed by build round; raw round-trip shipped verbatim — body copy + noindex ARE verified) | /evidence/http/ |
