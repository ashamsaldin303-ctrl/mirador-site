# Lighthouse medians (mobile emulation · production server · 3 runs) — machine-generated 2026-09-23T04:37:10.475Z
# gates (FROZEN): performance ≥90 · LCP ≤2500ms · CLS ≤0.1 · TBT ≤300ms
# source: 6 LHR reports + 6 raw trace JSONs (copied beside — see lhr-*.json / *.trace.json)
/en (median of 3 runs) — performance=90 · LCP=3564ms · CLS=0.0004 · TBT=71ms → FAIL {"score":true,"lcp":false,"cls":true,"tbt":true}
  per-run: 90/3566ms-lcp/0.000cls/71ms-tbt  |  90/3560ms-lcp/0.000cls/78ms-tbt  |  90/3564ms-lcp/0.000cls/66ms-tbt
/ar (median of 3 runs) — performance=82 · LCP=4363ms · CLS=0.0004 · TBT=79ms → FAIL {"score":false,"lcp":false,"cls":true,"tbt":true}
  per-run: 87/3796ms-lcp/0.000cls/111ms-tbt  |  82/4470ms-lcp/0.000cls/79ms-tbt  |  82/4363ms-lcp/0.000cls/70ms-tbt
GATE E27: FAIL — 2 locale gates failed
