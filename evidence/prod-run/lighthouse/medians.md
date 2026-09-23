# Lighthouse medians (mobile emulation · production server · 3 runs) — machine-generated 2026-09-23T02:45:38.383Z
# gates (FROZEN): performance ≥90 · LCP ≤2500ms · CLS ≤0.1 · TBT ≤300ms
# source: 6 LHR reports + 6 raw trace JSONs (copied beside — see lhr-*.json / *.trace.json)
/en (median of 3 runs) — performance=91 · LCP=3431ms · CLS=0.0302 · TBT=79ms → FAIL {"score":true,"lcp":false,"cls":true,"tbt":true}
  per-run: 91/3406ms-lcp/0.030cls/79ms-tbt  |  90/3439ms-lcp/0.035cls/85ms-tbt  |  91/3431ms-lcp/0.030cls/71ms-tbt
/ar (median of 3 runs) — performance=83 · LCP=4194ms · CLS=0.0255 · TBT=89ms → FAIL {"score":false,"lcp":false,"cls":true,"tbt":true}
  per-run: 83/4213ms-lcp/0.025cls/91ms-tbt  |  83/4194ms-lcp/0.025cls/79ms-tbt  |  83/4176ms-lcp/0.026cls/89ms-tbt
GATE E27: FAIL — 2 locale gates failed
