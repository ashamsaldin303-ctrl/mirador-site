# Lighthouse medians (mobile emulation · production server · 3 runs) — machine-generated 2026-09-23T17:56:36.136Z
# gates (FROZEN): performance ≥90 · LCP ≤2500ms · CLS ≤0.1 · TBT ≤300ms
# source: 6 LHR reports + 6 raw trace JSONs (copied beside — see lhr-*.json / *.trace.json)
/en (median of 3 runs) — performance=91 · LCP=3361ms · CLS=0.0195 · TBT=87ms → FAIL {"score":true,"lcp":false,"cls":true,"tbt":true}
  per-run: 91/3201ms-lcp/0.020cls/147ms-tbt  |  90/3533ms-lcp/0.020cls/77ms-tbt  |  92/3361ms-lcp/0.020cls/87ms-tbt
/ar (median of 3 runs) — performance=86 · LCP=3911ms · CLS=0.0000 · TBT=94ms → FAIL {"score":false,"lcp":false,"cls":true,"tbt":true}
  per-run: 86/3911ms-lcp/0.000cls/94ms-tbt  |  86/3933ms-lcp/0.000cls/93ms-tbt  |  92/3180ms-lcp/0.000cls/94ms-tbt
GATE E27: FAIL — 2 locale gates failed
# instrument: lantern (throttlingMethod=simulate) — the sanctioned gate · Actions run 28

# ——— devtools-method — RECORDED, NOT THE SANCTIONED GATE (N27) ———
# recorded beside the lantern medians per prompt-5 R4/E86 · Actions run 28 · raws: devtools-lhr-*.json (+ devtools-localhost-*.trace.json) beside this file
# throttlingMethod observed in the raws: devtools (the config requests "devtools" — a mismatch here means the flag did not pass through and the run must be repeated)
devtools /en — performance=98 · LCP=1672ms · CLS=0.0196 · TBT=123ms (recorded; no gate — N27)
  per-run: 98/1666ms-lcp/0.020cls/123ms-tbt  |  98/1672ms-lcp/0.020cls/114ms-tbt  |  97/1685ms-lcp/0.020cls/148ms-tbt
devtools /ar — performance=98 · LCP=1667ms · CLS=0.0000 · TBT=124ms (recorded; no gate — N27)
  per-run: 98/1667ms-lcp/0.000cls/118ms-tbt  |  98/1663ms-lcp/0.000cls/133ms-tbt  |  98/1668ms-lcp/0.000cls/124ms-tbt
