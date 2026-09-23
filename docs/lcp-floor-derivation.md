# The lantern floor derivation (prompt-5 R2 · E84) — machine-generated 2026-09-23T16:51:28.739Z

Reproduce: `bun evidence/tools/lcp-floor.ts` — reads ONLY the committed LHRs in
`evidence/prod-run/lighthouse/` and regenerates this file. Every number cites its LHR path.

**Coverage (the honest state of the raws):** 48 LHRs committed, all `throttlingMethod: "simulate"` (verified across the set), in 8 timestamped batches of 6 (3×/en + 3×/ar). Median-value anchors: batch 1 ≡ run 11 (EN median 3515ms — the run-11 quote in `evidence/BLOCKED.md` B2) · batch 4 ≡ run 20 (EN median 3647ms — the control) · batch 8 ≡ run 25 (EN 3340 · AR 3904 — equal to `medians.md`'s committed exit verdicts). Runs 9/10/12–17's LHRs are not committed (those dispatches died before the Lighthouse step or were superseded); no number below is attributed to an uncommitted run.

**The instrument constants** (every LHR's `configSettings.throttling`): `requestLatencyMs = 562.5` · `rttMs = 150` · `downloadThroughputKbps = 1474.56` · `cpuSlowdownMultiplier = 4` (uniform across all 48 — verified).

## 1 · The observed page is textbook — on the same instrument

observedLargestContentfulPaint == observedFirstContentfulPaint on **48/48** committed LHRs; the observed LCP range is **127–178ms**. The page paints its hero (text + font) in the first frame of the unthrottled load, every run, both locales.

| batch | locale | observed LCP | observed FCP | relation | simulated LCP | slots (N) | LHR |
|---|---|---|---|---|---|---|---|
| 1 | /en | 173 | 173 | == FCP | 3001 | 4 | `lhr-1790101297364.json` |
| 1 | /en | 138 | 138 | == FCP | 3515 | 5 | `lhr-1790101310206.json` |
| 1 | /en | 144 | 144 | == FCP | 3530 | 5 | `lhr-1790101322447.json` |
| 1 | /ar | 156 | 156 | == FCP | 3980 | 6 | `lhr-1790101334717.json` |
| 1 | /ar | 152 | 152 | == FCP | 3643 | 6 | `lhr-1790101346990.json` |
| 1 | /ar | 171 | 171 | == FCP | 4207 | 7 | `lhr-1790101359297.json` |
| 2 | /en | 134 | 134 | == FCP | 3406 | 5 | `lhr-1790131476328.json` |
| 2 | /en | 137 | 137 | == FCP | 3431 | 5 | `lhr-1790131489111.json` |
| 2 | /en | 142 | 142 | == FCP | 3439 | 5 | `lhr-1790131501321.json` |
| 2 | /ar | 156 | 156 | == FCP | 4194 | 7 | `lhr-1790131513544.json` |
| 2 | /ar | 159 | 159 | == FCP | 4213 | 7 | `lhr-1790131525746.json` |
| 2 | /ar | 173 | 173 | == FCP | 4176 | 7 | `lhr-1790131537971.json` |
| 3 | /en | 139 | 139 | == FCP | 3566 | 6 | `lhr-1790135317675.json` |
| 3 | /en | 144 | 144 | == FCP | 3550 | 6 | `lhr-1790135330555.json` |
| 3 | /en | 135 | 135 | == FCP | 3550 | 5 | `lhr-1790135342773.json` |
| 3 | /ar | 168 | 168 | == FCP | 4381 | 7 | `lhr-1790135355132.json` |
| 3 | /ar | 175 | 175 | == FCP | 4347 | 7 | `lhr-1790135367489.json` |
| 3 | /ar | 162 | 162 | == FCP | 4375 | 7 | `lhr-1790135379791.json` |
| 4 | /en | 151 | 151 | == FCP | 3681 | 6 | `lhr-1790136532862.json` |
| 4 | /en | 143 | 143 | == FCP | 3641 | 6 | `lhr-1790136545572.json` |
| 4 | /en | 162 | 162 | == FCP | 3647 | 6 | `lhr-1790136557690.json` |
| 4 | /ar | 178 | 178 | == FCP | 4489 | 7 | `lhr-1790136569865.json` |
| 4 | /ar | 160 | 160 | == FCP | 3668 | 6 | `lhr-1790136581977.json` |
| 4 | /ar | 168 | 168 | == FCP | 4505 | 7 | `lhr-1790136594146.json` |
| 5 | /en | 127 | 127 | == FCP | 3564 | 6 | `lhr-1790138168674.json` |
| 5 | /en | 139 | 139 | == FCP | 3560 | 6 | `lhr-1790138181376.json` |
| 5 | /en | 150 | 150 | == FCP | 3566 | 6 | `lhr-1790138193476.json` |
| 5 | /ar | 168 | 168 | == FCP | 3796 | 6 | `lhr-1790138205661.json` |
| 5 | /ar | 149 | 149 | == FCP | 4363 | 7 | `lhr-1790138217839.json` |
| 5 | /ar | 163 | 163 | == FCP | 4470 | 7 | `lhr-1790138230030.json` |
| 6 | /en | 135 | 135 | == FCP | 3567 | 6 | `lhr-1790139280806.json` |
| 6 | /en | 156 | 156 | == FCP | 3575 | 6 | `lhr-1790139293530.json` |
| 6 | /en | 135 | 135 | == FCP | 3566 | 6 | `lhr-1790139305651.json` |
| 6 | /ar | 162 | 162 | == FCP | 4495 | 7 | `lhr-1790139317839.json` |
| 6 | /ar | 152 | 152 | == FCP | 4498 | 7 | `lhr-1790139330047.json` |
| 6 | /ar | 146 | 146 | == FCP | 4485 | 7 | `lhr-1790139342239.json` |
| 7 | /en | 134 | 134 | == FCP | 3651 | 6 | `lhr-1790140580069.json` |
| 7 | /en | 133 | 133 | == FCP | 3634 | 6 | `lhr-1790140592767.json` |
| 7 | /en | 145 | 145 | == FCP | 3632 | 6 | `lhr-1790140604892.json` |
| 7 | /ar | 145 | 145 | == FCP | 4082 | 6 | `lhr-1790140617158.json` |
| 7 | /ar | 152 | 152 | == FCP | 4126 | 7 | `lhr-1790140629350.json` |
| 7 | /ar | 152 | 152 | == FCP | 4092 | 6 | `lhr-1790140641552.json` |
| 8 | /en | 159 | 159 | == FCP | 3340 | 5 | `lhr-1790142817448.json` |
| 8 | /en | 166 | 166 | == FCP | 3360 | 5 | `lhr-1790142830235.json` |
| 8 | /en | 133 | 133 | == FCP | 2649 | 4 | `lhr-1790142842502.json` |
| 8 | /ar | 160 | 160 | == FCP | 3848 | 6 | `lhr-1790142854726.json` |
| 8 | /ar | 175 | 175 | == FCP | 4141 | 7 | `lhr-1790142866993.json` |
| 8 | /ar | 160 | 160 | == FCP | 3904 | 6 | `lhr-1790142879248.json` |

## 2 · The batch ledger — where the number moved and why it can't cross 2500

Each optimization round changed the render-blocking font SET (run 18 hero subsets · run 19 poster priority · run 20 fallbacks · runs 21/22 hero-stack diet · run 23 deferred full families + prefetch kill). The slot count N tracks the set's size; the 2500ms gate requires N ≤ 3 post-TTFB slots (see the per-locale closing arithmetic below).

| batch | UTC | EN simLCP (median) | EN N | AR simLCP (median) | AR N | AR−EN slots→ms | files |
|---|---|---|---|---|---|---|---|
| 1 | 2026-09-22 18:21 | 3515 | 5 | 3980 | 6 | +562.5ms | lhr-1790… (6 files) |
| 2 | 2026-09-23 02:44 | 3431 | 5 | 4194 | 7 | +1125ms | lhr-1790… (6 files) |
| 3 | 2026-09-23 03:48 | 3550 | 6 | 4375 | 7 | +562.5ms | lhr-1790… (6 files) |
| 4 | 2026-09-23 04:08 | 3647 | 6 | 4489 | 7 | +562.5ms | lhr-1790… (6 files) |
| 5 | 2026-09-23 04:36 | 3564 | 6 | 4363 | 7 | +562.5ms | lhr-1790… (6 files) |
| 6 | 2026-09-23 04:54 | 3567 | 6 | 4495 | 7 | +562.5ms | lhr-1790… (6 files) |
| 7 | 2026-09-23 05:16 | 3634 | 6 | 4092 | 6 | 0ms | lhr-1790… (6 files) |
| 8 | 2026-09-23 05:53 | 3340 | 5 | 3904 | 6 | +562.5ms | lhr-1790… (6 files) |

### /en — the exit-gate derivation (batch 8 = run 25; median of 3 runs)

**The render-blocking chain of the LCP element** (critical-request-chains, `lhr-1790142817448.json`): HTML `/en` → the CSS chunk → 2 fonts:
  - `http://localhost:3000/fonts/amiri-wordmark-arabic.woff2`
  - `http://localhost:3000/fonts/fraunces-hero-latin.woff2`

**The font/stylesheet inventory as fetched** (network-requests, same LHR):

| request | transfer | priority | tier |
|---|---|---|---|
| `http://localhost:3000/fonts/fraunces-wordmark-latin.woff2` | 7750B | High | wordmark/logo + locale-switcher script |
| `http://localhost:3000/fonts/instrument-sans-var-latin.woff2` | 34823B | High | EN body face (variable) |
| `http://localhost:3000/_next/static/chunks/f65bc9557605a129.css` | 12007B | VeryHigh | other |
| `http://localhost:3000/fonts-deferred.css` | 1324B | VeryLow | other |
| `http://localhost:3000/fonts/amiri-wordmark-arabic.woff2` | 6594B | VeryHigh | wordmark/logo + locale-switcher script |
| `http://localhost:3000/fonts/fraunces-hero-latin.woff2` | 14227B | VeryHigh | the LCP face (H1 hero line) |
| `http://localhost:3000/fonts/fraunces-var-latin.woff2` | 55547B | VeryHigh | deferred full family (post-load, media=print) |

**Lighthouse's own LCP phase attribution** (largest-contentful-paint-element, same LHR):
  - TTFB: 456ms (14%)
  - Load Delay: 0ms (0%)
  - Load Time: 0ms (0%)
  - Render Delay: 2884ms (86%)

**The slot arithmetic** (median of the 3 runs; every LHR carries `configSettings.throttling.requestLatencyMs = 562.5`):

```
simulated LCP  = 3340ms
TTFB (sim)     = 456ms
post-TTFB span = 2884ms  =  5 × 562.5ms serialized-request slots  +  +72ms residual (transfer+CPU+modeling)
slots:         per-run N = [5, 5, 4]  (continuous 5.13)
```

**The arithmetic floor** — the minimum the model can express for THIS chain with the H1's own face kept (font-display is not modeled; the LCP text waits for its font):

```
floor = TTFB 456 + CSS 562.5 + the LCP face 562.5 + residual +72  ≈  1653ms
measured − floor = 1688ms  =  3.0 slots of serialized font-queue beyond the LCP face
```

**The closing requirement at the frozen 2500ms gate:** post-TTFB slots ≤ ⌊(2500 − 456 − 72)/562.5⌋ = **3** — i.e. CSS + the LCP face + at most **1** more render-blocking face. /en currently carries 4 font slots; closing requires deferring **3 non-LCP faces** out of the render-blocking set.

### /ar — the exit-gate derivation (batch 8 = run 25; median of 3 runs)

**The render-blocking chain of the LCP element** (critical-request-chains, `lhr-1790142854726.json`): HTML `/ar` → the CSS chunk → 7 fonts:
  - `http://localhost:3000/fonts/fraunces-wordmark-latin.woff2`
  - `http://localhost:3000/fonts/plex-arabic-400-latin.woff2`
  - `http://localhost:3000/fonts/amiri-hero-arabic.woff2`
  - `http://localhost:3000/fonts/plex-arabic-600-arabic.woff2`
  - `http://localhost:3000/fonts/plex-arabic-500-arabic.woff2`
  - `http://localhost:3000/fonts/plex-arabic-600-latin.woff2`
  - `http://localhost:3000/fonts/plex-arabic-500-latin.woff2`

**The font/stylesheet inventory as fetched** (network-requests, same LHR):

| request | transfer | priority | tier |
|---|---|---|---|
| `http://localhost:3000/fonts/amiri-wordmark-arabic.woff2` | 6594B | High | wordmark/logo + locale-switcher script |
| `http://localhost:3000/fonts/plex-arabic-400-arabic.woff2` | 30019B | High | AR body/digits weight arm |
| `http://localhost:3000/_next/static/chunks/f65bc9557605a129.css` | 12007B | VeryHigh | other |
| `http://localhost:3000/fonts-deferred.css` | 1324B | VeryLow | other |
| `http://localhost:3000/fonts/fraunces-wordmark-latin.woff2` | 7750B | VeryHigh | wordmark/logo + locale-switcher script |
| `http://localhost:3000/fonts/plex-arabic-400-latin.woff2` | 6186B | VeryHigh | AR body/digits weight arm |
| `http://localhost:3000/fonts/amiri-hero-arabic.woff2` | 21803B | VeryHigh | the LCP face (H1 hero line) |
| `http://localhost:3000/fonts/plex-arabic-600-arabic.woff2` | 32415B | VeryHigh | AR body/digits weight arm |
| `http://localhost:3000/fonts/plex-arabic-500-arabic.woff2` | 32327B | VeryHigh | AR body/digits weight arm |
| `http://localhost:3000/fonts/plex-arabic-600-latin.woff2` | 6474B | VeryHigh | AR body/digits weight arm |
| `http://localhost:3000/fonts/plex-arabic-500-latin.woff2` | 6366B | VeryHigh | AR body/digits weight arm |
| `http://localhost:3000/fonts/amiri-400-latin.woff2` | 7578B | VeryHigh | deferred full family (post-load, media=print) |
| `http://localhost:3000/fonts/amiri-400-arabic.woff2` | 36683B | VeryHigh | deferred full family (post-load, media=print) |

**Lighthouse's own LCP phase attribution** (largest-contentful-paint-element, same LHR):
  - TTFB: 456ms (12%)
  - Load Delay: 0ms (0%)
  - Load Time: 0ms (0%)
  - Render Delay: 3393ms (88%)

**The slot arithmetic** (median of the 3 runs; every LHR carries `configSettings.throttling.requestLatencyMs = 562.5`):

```
simulated LCP  = 3904ms
TTFB (sim)     = 456ms
post-TTFB span = 3448ms  =  6 × 562.5ms serialized-request slots  +  +17ms residual (transfer+CPU+modeling)
slots:         per-run N = [6, 7, 6]  (continuous 6.13)
```

**The arithmetic floor** — the minimum the model can express for THIS chain with the H1's own face kept (font-display is not modeled; the LCP text waits for its font):

```
floor = TTFB 456 + CSS 562.5 + the LCP face 562.5 + residual +17  ≈  1598ms
measured − floor = 2306ms  =  4.1 slots of serialized font-queue beyond the LCP face
```

**The closing requirement at the frozen 2500ms gate:** post-TTFB slots ≤ ⌊(2500 − 456 − 17)/562.5⌋ = **3** — i.e. CSS + the LCP face + at most **1** more render-blocking face. /ar currently carries 5 font slots; closing requires deferring **4 non-LCP faces** out of the render-blocking set.


### The AR door's own account — why its floor sits ~560ms above EN's

AR's above-fold set is heavier by construction: the AR body needs per-weight arms of Plex Arabic (no variable face in the set), each arm split by script (arabic + latin) to stay inside the ≤60KB face fence — so the render-blocking set enumerates 7 faces where EN enumerates 4 (a variable body face + 3 single-purpose faces). The slot ledger: **AR N = 6 vs EN N = 5 → AR−EN = 562.5ms** — one serialized request's latency. Even AR's first paint queues: AR simFCP − TTFB ≈ 1363ms (2.4 slots) vs EN's 612ms (1.1 slots) — the model does not credit `font-display: swap`; the fallback paint itself waits on the simulated font queue.

### The control experiment (run 20, `lhr-1790136557690.json`)

Every LCP-relevant resource confirmed in OBSERVED network wave 1 — yet simulated LCP = 3647ms:

| request | observed start | observed end | transfer | priority |
|---|---|---|---|---|
| `http://localhost:3000/en` | 2.5ms | 7.7ms | 8193B | VeryHigh |
| `http://localhost:3000/fonts/fraunces-hero-latin.woff2` | 19.0ms | 38.9ms | 14227B | High |
| `http://localhost:3000/fonts/fraunces-wordmark-latin.woff2` | 19.3ms | 39.2ms | 7750B | High |
| `http://localhost:3000/fonts/instrument-sans-var-latin.woff2` | 19.5ms | 39.4ms | 34823B | High |
| `http://localhost:3000/img/hero/poster-750w.avif?w=750` | 19.7ms | 39.5ms | 33098B | High |
| `http://localhost:3000/_next/static/chunks/1104d33eea4d01df.css` | 27.8ms | 38.5ms | 12034B | VeryHigh |
| `http://localhost:3000/fonts/amiri-wordmark-arabic.woff2` | 116.4ms | 122.8ms | 6594B | VeryHigh |
| `http://localhost:3000/fonts/fraunces-var-latin.woff2` | 116.5ms | 126.0ms | 55547B | VeryHigh |
| `http://localhost:3000/fonts/amiri-400-latin.woff2` | 116.7ms | 126.2ms | 7578B | VeryHigh |
| `http://localhost:3000/fonts/amiri-hero-arabic.woff2` | 304.3ms | 328.6ms | 21803B | High |
| `http://localhost:3000/fonts/amiri-wordmark-arabic.woff2` | 304.8ms | 315.1ms | 555B | High |
| `http://localhost:3000/fonts/plex-arabic-400-arabic.woff2` | 305.2ms | 328.4ms | 30019B | High |

The hero font, the poster, the CSS, the body face — all fetched and transferred inside the first ~329ms of the observed trace. The simulation still attributes 3647ms (5.67 slots) — the remaining attribution is structural to the simulated font queue, not to observable page behavior. (This is the control first cited in `evidence/r1/DONE.md` known-gaps; its numbers regenerate here from the LHR itself.)

## 3 · What the floor means for the frozen gate (feeds R3/E85)

- The **floor** (TTFB + CSS slot + the LCP face slot + residual) sits near **1653ms (EN) / 1598ms (AR)** — the model CAN express sub-2500 LCP for this chain, but only with the H1's face as (nearly) the sole render-blocking font.
- Every face beyond the LCP face in the render-blocking set costs one serialized 562.5ms slot. The non-LCP faces ARE the conversion surface: the wordmark/logo face, the locale-switcher script face, the body/CTA face(s), the digits arms.
- Therefore closing ≤2500ms under lantern requires deferring conversion-surface typography to post-load on BOTH locales — the exact trade `evidence/r1/DONE.md` known-gaps already refused on product grounds. The R3 enumeration (E85) prices each candidate against this arithmetic.
- The 48/48 observed==FCP table and the phase attribution (Load Delay 0 · Load Time 0 · Render Delay ~89%) are the instrument's own testimony that this is a model-queue attribution, not a page defect.

*(N27: this derivation records the lantern arithmetic; it changes no threshold and substitutes no instrument. The parallel devtools-method battery is recorded beside — never instead — in `medians.md`'s RECORDED-NOT-GATE block per R4/E86.)*
