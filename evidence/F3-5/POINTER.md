# F3-5 (re-shot, prompt-4 R6/E50)

- check: filter evidence pair, REAL this time
- expected: 28 rows → 4 vegan rows + aria-live announcement change + md5s differ
- actual (dev run 2026-09-22T23:20Z): EN 28→4 "28 dishes"→"4 dishes" md5s differ · AR 28→4 «28 أطباق»→«4 أطباق» md5s differ
- verdict: PASS
- evidence: /evidence/specs/filter-pair--{en,ar}.log + /evidence/F3-5/menu--{en,ar}--{unfiltered,filtered-vegan}--1440.png
- history: the round-1 pair (menu--en--filter-{mid,after}.png) was byte-identical (md5 68182B×2) — DELETED and replaced by this re-shoot (spec: evidence/tools/filter-pair.ts)

(machine-generated from the E50 re-shoot — 2026-09-22)
