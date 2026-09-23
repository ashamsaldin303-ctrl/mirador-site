# Lighthouse medians (mobile emulation · production server · 3 runs) — machine-generated 2026-09-23T23:47:34.314Z
# gates (FROZEN): performance ≥90 · LCP ≤2500ms · CLS ≤0.1 · TBT ≤300ms
# source: 6 LHR reports + 6 raw trace JSONs (copied beside — see lhr-*.json / *.trace.json)
/en (median of 3 runs) — performance=92 · LCP=3301ms · CLS=0.0195 · TBT=47ms → FAIL {"score":true,"lcp":false,"cls":true,"tbt":true}
  per-run: 92/3301ms-lcp/0.020cls/50ms-tbt  |  93/3291ms-lcp/0.020cls/47ms-tbt  |  91/3403ms-lcp/0.020cls/43ms-tbt
/ar (median of 3 runs) — performance=87 · LCP=3836ms · CLS=0.0000 · TBT=46ms → FAIL {"score":false,"lcp":false,"cls":true,"tbt":true}
  per-run: 87/3836ms-lcp/0.000cls/46ms-tbt  |  87/3845ms-lcp/0.000cls/52ms-tbt  |  87/3824ms-lcp/0.000cls/42ms-tbt
GATE E27: FAIL — 2 locale gates failed
# instrument: lantern (throttlingMethod=simulate) — the sanctioned gate · Actions run 30

# ——— devtools-method — RECORDED, NOT THE SANCTIONED GATE (N27) ———
# recorded beside the lantern medians per prompt-5 R4/E86 · Actions run 30 · raws: devtools-lhr-*.json (+ devtools-localhost-*.trace.json) beside this file
# throttlingMethod observed in the raws: devtools (the config requests "devtools" — a mismatch here means the flag did not pass through and the run must be repeated)
devtools /en — performance=99 · LCP=1625ms · CLS=0.0196 · TBT=60ms (recorded; no gate — N27)
  per-run: 99/1625ms-lcp/0.020cls/59ms-tbt  |  99/1632ms-lcp/0.020cls/60ms-tbt  |  99/1624ms-lcp/0.020cls/62ms-tbt
devtools /ar — performance=99 · LCP=1622ms · CLS=0.0000 · TBT=59ms (recorded; no gate — N27)
  per-run: 99/1628ms-lcp/0.000cls/56ms-tbt  |  99/1619ms-lcp/0.000cls/77ms-tbt  |  99/1622ms-lcp/0.000cls/59ms-tbt
