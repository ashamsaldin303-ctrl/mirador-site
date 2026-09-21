# BLOCKED INDEX — environment-blocked items

## Round 3 (prompt-3 · production surface) — 2026-09-21

The round-2 platform constraint (production builds forbidden in the sandbox)
is RESOLVED: the battery now runs on the sanctioned GitHub Actions surface
(`production-evidence` workflow). Round-2's blockers resolved as follows:

| # | round-2 item | resolution |
|---|---|---|
| B1 | production build + route size/chunk tables | **CLOSED** — `bun run build` exit 0 (actions run #1+, SHA 05d91d6+); tables + manifests in `F12-2/prod-run/` |
| B2 | production Lighthouse medians + raw traces | **CLOSED** — `prod-run/lighthouse/` (E27/E28) |
| B3 | (merged into B2) | — |
| B4 | prod-form 404 status semantics | **PARTIALLY CLOSED — see BLK-R3-1 below** |

### Round-3 residual blockers (shipped verbatim, root-caused)

| # | item | root cause | evidence | solution path |
|---|---|---|---|---|
| BLK-R3-1 | **E22 status component:** `/en/ar/nonexistent-page` answer **HTTP 200**, not 404 (the §7.9 designed copy + noindex DO ship in the body) | Next 16 streams the shell: the `[locale]/loading.tsx` Suspense boundary (a §6.6-contracted state surface) flushes before `notFound()` resolves, so the server's 404-status assignment (app-render error path) loses the race to the first flush; the `generateMetadata → notFound()` trick is structurally dead because Next 16 streams metadata inside the RSC payload. NOT an environment artifact — reproduced identically across 3 production runs. | `prod-run/http/{en,ar}-nonexistent.txt` + `http/summary.txt` | human-approved architecture change: remove the loading boundary for the catch-all segment (loses a contracted state surface) or move the designed 404 to a statically prerendered not-found (loses the locale-header mechanism). Neither is a minimal fix — thresholds/frozen surfaces stay untouched. |
| BLK-R3-2 | **E19 first-load component:** per-route first-load JS ≤150KB gz (hard 200KB) — **FAIL 16/16 routes** (216.7–299.3KB wire) | the pinned stack's client floor: React 19 + Next 16 App Router runtime ≈ **158KB gz with ALL motion excluded** (motion stack itself: 57.5KB gz — within its own ≤90KB budget); even a motion-free first-load exceeds the soft budget, so no minimal product fix exists within the frozen dependency pins. Thresholds are FROZEN and never bend. | `F12-2/prod-run/{first-load-js-gz.txt, chunk-manifest.txt, network-firstload.txt, summary.md}` | human decision: structural work (partial prerendering/static shell for marketing routes) or budget revision against the pinned stack. |

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
