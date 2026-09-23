# Lighthouse medians (mobile emulation · production server · 3 runs) — machine-generated 2026-09-23T17:34:15.666Z
# gates (FROZEN): performance ≥90 · LCP ≤2500ms · CLS ≤0.1 · TBT ≤300ms
# source: 6 LHR reports + 6 raw trace JSONs (copied beside — see lhr-*.json / *.trace.json)
/en (median of 3 runs) — performance=90 · LCP=3522ms · CLS=0.0195 · TBT=75ms → FAIL {"score":true,"lcp":false,"cls":true,"tbt":true}
  per-run: 92/3273ms-lcp/0.020cls/75ms-tbt  |  90/3522ms-lcp/0.020cls/73ms-tbt  |  90/3535ms-lcp/0.020cls/86ms-tbt
/ar (median of 3 runs) — performance=85 · LCP=4056ms · CLS=0.0000 · TBT=81ms → FAIL {"score":false,"lcp":false,"cls":true,"tbt":true}
  per-run: 85/4048ms-lcp/0.000cls/81ms-tbt  |  84/4081ms-lcp/0.000cls/68ms-tbt  |  86/4056ms-lcp/0.000cls/87ms-tbt
GATE E27: FAIL — 2 locale gates failed
# instrument: lantern (throttlingMethod=simulate) — the sanctioned gate · Actions run 27

# ——— devtools-method — RECORDED, NOT THE SANCTIONED GATE (N27) ———
# recorded beside the lantern medians per prompt-5 R4/E86 · Actions run 27 · raws: devtools-lhr-*.json (+ devtools-localhost-*.trace.json) beside this file
# throttlingMethod observed in the raws: devtools (the config requests "devtools" — a mismatch here means the flag did not pass through and the run must be repeated)
devtools /en — performance=98 · LCP=1639ms · CLS=0.0196 · TBT=120ms (recorded; no gate — N27)
  per-run: 98/1639ms-lcp/0.020cls/118ms-tbt  |  98/1644ms-lcp/0.020cls/123ms-tbt  |  98/1635ms-lcp/0.020cls/120ms-tbt
devtools /ar — performance=98 · LCP=1640ms · CLS=0.0000 · TBT=125ms (recorded; no gate — N27)
  per-run: 98/1640ms-lcp/0.000cls/129ms-tbt  |  98/1640ms-lcp/0.000cls/113ms-tbt  |  98/1679ms-lcp/0.000cls/125ms-tbt
