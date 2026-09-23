# Lighthouse medians (mobile emulation · production server · 3 runs) — machine-generated 2026-09-23T23:18:07.837Z
# gates (FROZEN): performance ≥90 · LCP ≤2500ms · CLS ≤0.1 · TBT ≤300ms
# source: 6 LHR reports + 6 raw trace JSONs (copied beside — see lhr-*.json / *.trace.json)
/en (median of 3 runs) — performance=92 · LCP=3335ms · CLS=0.0195 · TBT=67ms → FAIL {"score":true,"lcp":false,"cls":true,"tbt":true}
  per-run: 92/3265ms-lcp/0.020cls/68ms-tbt  |  92/3335ms-lcp/0.020cls/66ms-tbt  |  90/3519ms-lcp/0.020cls/67ms-tbt
/ar (median of 3 runs) — performance=87 · LCP=3910ms · CLS=0.0000 · TBT=84ms → FAIL {"score":false,"lcp":false,"cls":true,"tbt":true}
  per-run: 86/3932ms-lcp/0.000cls/106ms-tbt  |  87/3880ms-lcp/0.000cls/73ms-tbt  |  87/3910ms-lcp/0.000cls/84ms-tbt
GATE E27: FAIL — 2 locale gates failed
# instrument: lantern (throttlingMethod=simulate) — the sanctioned gate · Actions run 29

# ——— devtools-method — RECORDED, NOT THE SANCTIONED GATE (N27) ———
# recorded beside the lantern medians per prompt-5 R4/E86 · Actions run 29 · raws: devtools-lhr-*.json (+ devtools-localhost-*.trace.json) beside this file
# throttlingMethod observed in the raws: devtools (the config requests "devtools" — a mismatch here means the flag did not pass through and the run must be repeated)
devtools /en — performance=98 · LCP=1646ms · CLS=0.0196 · TBT=111ms (recorded; no gate — N27)
  per-run: 98/1655ms-lcp/0.020cls/108ms-tbt  |  98/1646ms-lcp/0.020cls/117ms-tbt  |  98/1636ms-lcp/0.020cls/111ms-tbt
devtools /ar — performance=98 · LCP=1650ms · CLS=0.0000 · TBT=107ms (recorded; no gate — N27)
  per-run: 98/1637ms-lcp/0.000cls/112ms-tbt  |  98/1659ms-lcp/0.000cls/105ms-tbt  |  98/1650ms-lcp/0.000cls/107ms-tbt
