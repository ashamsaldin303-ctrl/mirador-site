# Lighthouse medians (mobile emulation · production server · 3 runs) — machine-generated 2026-09-22T18:22:39.753Z
# gates (FROZEN): performance ≥90 · LCP ≤2500ms · CLS ≤0.1 · TBT ≤300ms
# source: 6 LHR reports + 6 raw trace JSONs (copied beside — see lhr-*.json / *.trace.json)
/en (median of 3 runs) — performance=90 · LCP=3515ms · CLS=0.0532 · TBT=77ms → FAIL {"score":true,"lcp":false,"cls":true,"tbt":true}
  per-run: 90/3515ms-lcp/0.053cls/77ms-tbt  |  92/3001ms-lcp/0.053cls/145ms-tbt  |  90/3530ms-lcp/0.053cls/72ms-tbt
/ar (median of 3 runs) — performance=86 · LCP=3980ms · CLS=0.0043 · TBT=86ms → FAIL {"score":false,"lcp":false,"cls":true,"tbt":true}
  per-run: 83/4207ms-lcp/0.004cls/80ms-tbt  |  86/3980ms-lcp/0.004cls/86ms-tbt  |  87/3643ms-lcp/0.004cls/86ms-tbt
GATE E27: FAIL — 2 locale gates failed
