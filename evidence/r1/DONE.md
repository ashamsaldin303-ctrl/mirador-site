# DONE REPORT — PROMPT 4 · RELEASE 1 · THE HOUSE EDGES (E81)

**Repo:** github.com/ashamsaldin303-ctrl/mirador-site · **Branch:** main · **Exit-gate dispatch:** Actions run 25 (commit e755c8f)
**Contract:** upload/prompt-4-release1-house-edges.md v1.1 · ACs E34–E81 · ACK on record: `evidence/r1/E34-ACK.md` (commit 56d0713, before all Release-1 code)

## §8 verdict (the STOP rule, quoted)

> DONE = E34–E81 all PASS with regenerated raw evidence + the E79 exit-gate run green + the ACK on record. When every gate passes — **STOP**. A failing threshold is reported as FAIL with diagnosis — never polished, never relabeled, never re-surfaced.

**E34–E78, E80, E81: PASS (raw evidence committed). E79: FAIL — three failing cells per the raw gates (/en LCP=3300ms · /ar LCP=3907ms · /ar performance=87 score:false — the current raw, THE P6 EXIT DISPATCH (Actions run 31, on the fully-landed register ae2dc9c — the seven floors cost ZERO gate regressions); the run-band history: 3340/3904/87 · 3349/3888/87 · 3522/4056/85 · 3361/3911/86 · 3335/3910/87 · 3301/3836/87 across runs 25–30), diagnosed below. The contract's DONE definition is therefore NOT met; this report is the honest close of the round per §8/N16/N24 — every number regenerates from the run's raw artifacts.**

**Instrument standing (prompt-5 R5/E87): Option A stands — the lantern (simulate) is the sanctioned LCP instrument and NO instrument change has occurred; the devtools-method battery is recorded beside (never instead, N27) in `medians.md`'s RECORDED-NOT-GATE block, and `docs/instrument-decision.md` awaits the human signature — unsigned.**

## Per-AC table (E34–E81)

| AC | Verdict | Evidence (raw path) |
|---|---|---|
| E34 ACK before first code | PASS | `r1/E34-ACK.md` |
| E35 chromeFlags + dispatch artifacts | PASS | `prod-run/lighthouse/` (48 simulate-method LHRs committed across 8 timestamped batches — runs 11, 18–25 by median-value anchors; instrument live on every dispatch) |
| E36 SITE_URL + guard | PASS | `.github/workflows/production-evidence.yml` + `.env.example` (PLACEHOLDER origin; COP-1 enforces) |
| E37 doc-truth corrections | PASS | `r1/E37-E38/doc-truth.md` |
| E38 verify-docs CI-wired | PASS | `r1/E37-E38/doc-truth.md` + ci.yml (green on HEAD) |
| E39 sheet z-order + walkthrough | PASS | `specs/sheet-z.log` + `specs/keyboard-mobile-sheet--{en,ar}.log` |
| E40 corner/scrim/tempo greps | PASS | `r1/E40/` |
| E41 honest 404 ×2 locales | PASS | `prod-run/http/` + `r1/E41/dev-pairs.log` |
| E42 motion family 0/16 static | PASS | `r1/E42/import-graph.log` |
| E43 16/16 ≤200KB gz | PASS | `F12-2/prod-run/first-load-js-gz.txt` (run 25 fresh: max 177.2KB — KiB display, 181,419B, the raw table's own units) |
| E44 ×16 zero-localhost snapshots | PASS | `prod-run/snapshots/` |
| E45 confirmation demoted | PASS | `prod-run/snapshots/grep-summary.txt` (COP-2-confirmation=2/2: 0 alternates + self-canonical + noindex) |
| E46 four security headers | PASS | `prod-run/http/{en,ar}--200.txt` — the raw curl -is dumps of both locales carry CSP/XFO/RP/XCTO (no X-Powered-By) + `prod-run/http/summary.txt` |
| E47 413 + bounded limiter | PASS | `specs/sec-r5.log` |
| E48 off-grid + closed-day → 400 | PASS | `specs/sec-r5.log` |
| E49 tsconfig + typecheck | PASS | tsconfig.json + `gates/deterministic-suite.log` |
| E50 filter pair RE-SHOT | PASS | `prod-run/specs/filter-pair--{en,ar}.log` + `prod-run/F3-5/` (prod re-shot runs 15+) |
| E51 zero stub headings | PASS | `prod-run/F3-5/menu--{en,ar}--filtered-vegan--1440.png` |
| E52 AR footer leading ≥1.7 | PASS | `r1/E64-dev/` |
| E53 AVIF served + loader | PASS | `prod-run/img-surface/ladder-avif.txt` + `prod-run/img-surface/optimizer-avif.txt` |
| E54 OG JPEG magic | PASS | `prod-run/img-surface/og-{en,ar}-jpeg.txt` + `prod-run/img-surface/magic-{en,ar}.txt` |
| E55 JRN-1 auto-kill emulation | PASS | `prod-run/specs/journey-emulation--{control-60fps,starved-under-30fps}.log` + `JRN-1/` |
| E56 prod-run MANIFEST | PASS | `prod-run/MANIFEST.md` |
| E57 LEDGER job | PASS | `r1/E57/ledger.log` (disk 334,200B ≤ 334,880B) |
| E58 EXCHANGE LEDGER ΣΔ≤0 | PASS | `docs/exchange-ledger.md` (fonts −35,560B + hero subsets documented) |
| E59 GATEBOOK wired | PASS | `r1/E59/gatebook-check.log` |
| E60 BEZEL (11 sites killed) | PASS | `r1/E60-E62/house-edges.md` |
| E61 P-075 edge set | PASS | `r1/E60-E62/` + `docs/spec/tab-lamp.md` (SPEC-ONLY, N26) |
| E62 P-084 night's hands | PASS | `r1/E60-E62/house-edges.md` |
| E63 FIGURE REGISTER | PASS | `docs/figure-register.md` (generated from @theme) |
| E64 gallery wire + subsets + ledger | PASS | `r1/E64-dev/` + `F12-2/prod-run/network-firstload.txt` |
| E65 route census ○/● | PASS | `prod-run/route-census.txt` (prerender-manifest machine truth: 8/8 ○ + 5/5 justified ƒ + 4/4 ● fallbacks) |
| E66 Button API + audit:idioms | PASS | `r1/E66/audit-idioms.log` (A1–A12) |
| E67 settle/draw/breathe | PASS | `docs/idiom-contracts.md` |
| E68 EASE_OUT_SOFT = 0 + keyframes ≤7 | PASS | `r1/E76/audit-motion.log` |
| E69 RM audit (all sites) | PASS | `prod-run/specs/readers--*.log` (Calm ×8) |
| E70 handrail + announcer | PASS | `prod-run/specs/route-announcer--{en,ar}.log` |
| E71 «يرجى» = 0 + drift kills | PASS | `prod-run/snapshots/grep-summary.txt` (يرجى-rendered=0) |
| E72 dead-code receipt | PASS | package.json (71→20 deps) + git log ee82a23 |
| E73 content-Minors table | PASS | content/{en,ar}.json + git log ee82a23 |
| E74 plumbing-Minors | PASS | src/app/sitemap.ts (the generated sitemap.xml's source; prod 200 re-captured at the exit re-dispatch) + `git ls-files` (six hygiene paths gone) |
| E75 readers ×4 routes ×2 locales | PASS | `prod-run/specs/readers--*.log` (8/8) |
| E76 audit:motion M-2/3/4/6 | PASS | `r1/E76/audit-motion.log` |
| E77 counters + zero RUM | PASS | `prod-run/house/counters.json` |
| E78 audit:twins | PASS | `r1/E78/audit-twins.log` |
| **E79 THE EXIT GATE** | **FAIL** | `prod-run/lighthouse/medians.md` (current raw = THE P6 EXIT DISPATCH, Actions run 31, on the fully-landed register ae2dc9c — the seven floors cost ZERO gate regressions) — CLS 0.0195/0.0000 · TBT 51/62ms all PASS; **THREE failing cells per the raw gates: /en LCP=3300ms (lcp:false) · /ar LCP=3907ms (lcp:false) · /ar performance=87 (score:false, below the ≥90 gate — the LCP weight drives the AR score down; EN performance=92 passes; the run-band history: 3340/3904/87 · 3349/3888/87 · 3522/4056/85 · 3361/3911/86 · 3335/3910/87 · 3301/3836/87 across runs 25–30).** Every other exit-gate component green in the same dispatch: 16/16 budgets, axe 0/0, honest 404, race guard, 0 spinners, six organs, ΣΔ≤0 ledger |
| E80 MATRIX from runs | PASS | `evidence/MATRIX.md` (machine-regenerated; 113 rows, every row cites raw) |
| E81 DONE report | PASS | this file |

## Known gaps (N24 — mandatory)

**E27 Lighthouse LCP medians (the only failing threshold), diagnosed from the runs' own raw artifacts:**

1. **The observed page is textbook.** Runs 23–25's LHR raw metrics: `observedLargestContentfulPaint = 152ms == observedFirstContentfulPaint` (EN; CLS 0.0000–0.0195, TBT 61–101ms). On the unthrottled instrument the hero paints with its font in the first frame.
2. **The simulation attributes ~3.3–3.9s to the H1 text-LCP.** Lighthouse's lantern throttling (simulate) models the text-LCP against the page's render-blocking font set with serialized per-request latency (562.5ms each at the mobile preset). Six legitimate optimization rounds each moved the number and each is committed with its own lesson:
   - run 18 → hero-line font subsets (13.6KB/21.2KB), preloaded (4ffb8dd)
   - run 19 → hero poster `fetchPriority="high"` (next/16 emits the preload link but not the attribute) (0a9e9d3)
   - run 20 → metric-matched fallbacks in the wordmark stacks + Arabic-capable local re-tuning (74f8bba)
   - run 21/22 → the full display families removed from the hero stack (e757b15)
   - run 23 → the full display families DEFERRED to a post-load stylesheet (the act-1-poster-lazy pattern for fonts) + the locale-switcher prefetch adoption killed (07d7998)
   - EN 3431→3340ms · AR 4194→3904ms across the six rounds; CLS 0.053→0.0000; perf score 90→92 / 83→87.
3. **The control experiment (run 20):** with every LCP-relevant resource confirmed in network wave 1 (hero font start=19ms end=35ms, poster start=22ms end=40ms, High priority — raw network tables committed), the simulated LCP still read 3647ms. The remaining attribution is structural to the simulated font queue, not to observable page behavior.
4. **What would close it is outside this round's honest reach:** deferring the above-fold body/CTA faces (plex 500/600) trades the conversion surface's typography for the instrument's model, and the serialized-latency arithmetic still floors above the threshold. Per §8 this is reported as FAIL with the diagnosis — never polished, never relabeled, never re-surfaced. **It is the recommended first work item of the next round (v2.0-I), where the instrument's configuration itself (LHCI's simulated throttling vs the devtools-method measurement the same runner can produce — devtools runs measured 1773/1854ms on the identical build) belongs to the conversation.**

## LANDED registry (the museum's first entries)

| Item | Commit |
|---|---|
| E34 ACK | 56d0713 |
| R0: C-1 chromeFlags + SITE_URL (E35/E36) | ae3d65d + 0ffcf3b (instrument fix 2) |
| R2: C-3 z-order + scrim + tempo (E39/E40) | 909ca3d |
| R3: B-1 honest 404 (E41) | f7dab8e |
| R4: P-022 budget unlock (E42) | ed9758d |
| R5: COP-1/2 · SEC-1/2/4 · BKG-1 · ARC/K-1 (E44–E49) | 2c66d48 |
| R1: C-2 doc-truth + verify-docs (E37/E38) + FRM-1 + DES-2 | 7f79eaa |
| R9a: P-082 gallery sizes + subsets + wordmarks (E64 part) | c80d621 |
| R8: P-075/P-084/P-079 house edges (E60–E63) | 401991f |
| R6+R9 residuals: PRF-3/4 · JRN-1 · RPL-4 · F3-5 re-shoot (E50–E56) | e15cfa9 |
| P-024 conversion + zod off the wire (E43/E65) | 0bfbf7f |
| R7: P-041/P-043/P-044 fences (E57–E59) | 126b4d0 |
| R10: P-035/P-037/P-078 idioms + motion (E66–E68) | df063ca |
| R11: P-027/P-028/P-081 + dead code + Minors (E69–E74) | ee82a23 + 71b0efe (announcer) |
| R12: P-042/P-087/P-086/P-091 gates arm (E75–E78) | 527c4c7 |
| R13 exit-gate lessons I (announcer collisions, evidence hygiene, P-081 completion) | ef15754 |
| R13 route census machine truth | d581fed |
| R13 inquiry spec hook | e389ea2 |
| R13 Q4c COP-2 gate + zero-safe greps | b95b3b1 |
| E79 LCP round 1: hero faces | 4ffb8dd |
| E79 LCP round 2: poster fetchPriority | 0a9e9d3 |
| E79 LCP round 3: wordmark/AR fallbacks | 74f8bba |
| E79 LCP round 4: hero stack diet | e757b15 |
| E79 LCP round 5: deferred full families + prefetch kill | 07d7998 |
| E79 LCP round 6: lint fix for the deferred link | e755c8f |
| Evidence batteries (raw, one commit per Actions run) | 644d174, ea2e8e8, 647f7d5, a007cc9, b43fb0f, 34abe8e, d2d8d2e, f44f78f, 9ec4d5a, c323317 + run 25's |

## Reproduction commands

```bash
# the full exit-gate battery (one dispatch — GitHub Actions = the only sanctioned prod surface)
gh workflow run production-evidence.yml   # or: POST /repos/…/actions/workflows/production-evidence.yml/dispatches {"ref":"main"}

# the deterministic local battery (dev surface)
bun scripts/gates.sh && bunx tsc --noEmit && bunx eslint . --max-warnings 0
DATABASE_URL=… bun run audit:fonts && bun run audit:tokens && bun run audit:copy
bun scripts/audit-idioms.ts && bun scripts/audit-motion.ts && bun scripts/audit-twins.ts
bun scripts/ledger.ts && bun scripts/exchange-ledger.ts && bun scripts/verify-gatebook.ts
bun scripts/verify-docs.ts --probe

# the E2E specs
bun evidence/tools/api-specs.ts capacity-race capacity-sequential ratelimit dupguard honeypot sec-r5
bun evidence/tools/browser-specs.ts locale-atomic webgl-kill sheet-z booking inquiry
bun evidence/tools/filter-pair.ts && bun evidence/tools/journey-emulation.ts
bun evidence/tools/readers.ts && bun evidence/tools/route-announcer.ts && bun evidence/tools/keyboard.ts
bun evidence/tools/dom-ac-probes.ts && bun evidence/tools/axe-run.ts && bun evidence/tools/console-probes.ts

# the exit gate's raw verdicts (from the latest prod-run commit)
cat evidence/prod-run/lighthouse/medians.md      # E27 — the FAIL lives here, honestly
bash evidence/tools/verify-battery.sh            # the verdict scan (fails the job on any FAIL)

# this report's own regeneration
bun evidence/tools/generate-matrix.ts             # E80 — MATRIX.md + 113 POINTER.md folders
```
