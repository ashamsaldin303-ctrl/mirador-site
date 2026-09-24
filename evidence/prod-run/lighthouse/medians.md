# Lighthouse medians (mobile emulation · production server · 3 runs) — machine-generated 2026-09-24T00:09:55.277Z
# gates (FROZEN): performance ≥90 · LCP ≤2500ms · CLS ≤0.1 · TBT ≤300ms
# source: 6 LHR reports + 6 raw trace JSONs (copied beside — see lhr-*.json / *.trace.json)
/en (median of 3 runs) — performance=92 · LCP=3300ms · CLS=0.0195 · TBT=51ms → FAIL {"score":true,"lcp":false,"cls":true,"tbt":true}
  per-run: 93/3300ms-lcp/0.020cls/61ms-tbt  |  90/3490ms-lcp/0.020cls/51ms-tbt  |  92/3282ms-lcp/0.020cls/45ms-tbt
/ar (median of 3 runs) — performance=87 · LCP=3907ms · CLS=0.0000 · TBT=62ms → FAIL {"score":false,"lcp":false,"cls":true,"tbt":true}
  per-run: 87/3907ms-lcp/0.000cls/62ms-tbt  |  89/3669ms-lcp/0.000cls/64ms-tbt  |  84/4136ms-lcp/0.000cls/62ms-tbt
GATE E27: FAIL — 2 locale gates failed
# instrument: lantern (throttlingMethod=simulate) — the sanctioned gate · Actions run 31

# ——— devtools-method — RECORDED, NOT THE SANCTIONED GATE (N27) ———
# recorded beside the lantern medians per prompt-5 R4/E86 · Actions run 31 · raws: devtools-lhr-*.json (+ devtools-localhost-*.trace.json) beside this file
# throttlingMethod observed in the raws: devtools (the config requests "devtools" — a mismatch here means the flag did not pass through and the run must be repeated)
devtools /en — performance=99 · LCP=1641ms · CLS=0.0196 · TBT=78ms (recorded; no gate — N27)
  per-run: 99/1638ms-lcp/0.020cls/78ms-tbt  |  99/1641ms-lcp/0.020cls/74ms-tbt  |  99/1705ms-lcp/0.020cls/84ms-tbt
devtools /ar — performance=99 · LCP=1638ms · CLS=0.0000 · TBT=71ms (recorded; no gate — N27)
  per-run: 99/1638ms-lcp/0.000cls/76ms-tbt  |  99/1637ms-lcp/0.000cls/71ms-tbt  |  99/1641ms-lcp/0.000cls/61ms-tbt
