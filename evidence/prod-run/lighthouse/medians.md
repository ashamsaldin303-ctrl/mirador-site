# Lighthouse medians (mobile emulation · production server · 3 runs) — machine-generated 2026-09-23T17:13:55.096Z
# gates (FROZEN): performance ≥90 · LCP ≤2500ms · CLS ≤0.1 · TBT ≤300ms
# source: 6 LHR reports + 12 raw trace JSONs (copied beside — see lhr-*.json / *.trace.json)
/en (median of 3 runs) — performance=92 · LCP=3349ms · CLS=0.0195 · TBT=80ms → FAIL {"score":true,"lcp":false,"cls":true,"tbt":true}
  per-run: 92/3354ms-lcp/0.020cls/80ms-tbt  |  92/3349ms-lcp/0.020cls/81ms-tbt  |  92/3328ms-lcp/0.020cls/71ms-tbt
/ar (median of 3 runs) — performance=87 · LCP=3888ms · CLS=0.0000 · TBT=87ms → FAIL {"score":false,"lcp":false,"cls":true,"tbt":true}
  per-run: 87/3882ms-lcp/0.000cls/87ms-tbt  |  87/3888ms-lcp/0.000cls/73ms-tbt  |  84/4074ms-lcp/0.000cls/107ms-tbt
GATE E27: FAIL — 2 locale gates failed
# instrument: lantern (throttlingMethod=simulate) — the sanctioned gate · Actions run 26

# ——— devtools-method — RECORDED, NOT THE SANCTIONED GATE (N27) ———
# (no devtools battery recorded yet — this regeneration had no devtools raws and no prior block to carry)
