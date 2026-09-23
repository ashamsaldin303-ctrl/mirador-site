# E84

- check: the lantern floor derivation — machine-checked from the committed LHRs
- expected: script + doc committed · reproducible cold · every number cites its LHR path
- actual: evidence/tools/lcp-floor.ts regenerates docs/lcp-floor-derivation.md from the 48 committed simulate LHRs: observed==FCP 48/48 (127–178ms) · the render-blocking chains itemized (EN: CSS+2 chain fonts, 4 queued faces / AR: CSS+7 chain fonts) with bytes+tiers · Lighthouse's own phase attribution (Load Delay 0 · Load Time 0 · Render Delay 86–88%) · the slot arithmetic (EN 5×562.5+72ms · AR 6×562.5+17ms) · the floors (EN 1653ms · AR 1598ms) · the closing requirement (≤3 post-TTFB slots → defer 3 non-LCP faces on EN · 4 on AR — the conversion-surface typography trade) · AR−EN = +562.5ms exactly (one serialized face) · the run-20 control regenerated from its own LHR (all LCP resources in observed wave 1 ≤329ms, simulated LCP still 3647ms)
- verdict: PASS
- evidence: /evidence/tools/lcp-floor.ts + ../../docs/lcp-floor-derivation.md

(machine-generated from /evidence/MATRIX.md — 2026-09-23T17:17:48.365Z)
