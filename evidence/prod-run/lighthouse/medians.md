# Lighthouse medians (mobile emulation · production server · 3 runs) — machine-generated 2026-09-23T05:54:39.686Z
# gates (FROZEN): performance ≥90 · LCP ≤2500ms · CLS ≤0.1 · TBT ≤300ms
# source: 6 LHR reports + 6 raw trace JSONs (copied beside — see lhr-*.json / *.trace.json)
/en (median of 3 runs) — performance=92 · LCP=3340ms · CLS=0.0195 · TBT=72ms → FAIL {"score":true,"lcp":false,"cls":true,"tbt":true}
  per-run: 92/3360ms-lcp/0.020cls/81ms-tbt  |  92/3340ms-lcp/0.020cls/72ms-tbt  |  96/2649ms-lcp/0.020cls/61ms-tbt
/ar (median of 3 runs) — performance=87 · LCP=3904ms · CLS=0.0000 · TBT=90ms → FAIL {"score":false,"lcp":false,"cls":true,"tbt":true}
  per-run: 87/3904ms-lcp/0.000cls/90ms-tbt  |  84/4141ms-lcp/0.000cls/101ms-tbt  |  87/3848ms-lcp/0.000cls/71ms-tbt
GATE E27: FAIL — 2 locale gates failed
