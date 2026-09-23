# E50

- check: filter pair RE-SHOT
- expected: md5s differ + 28→4 + aria-live
- actual: PROD re-shot (runs 15+): EN 28→4 + "28 dishes"→"4 dishes" + md5s differ · AR 28→4 + "28 طبقاً"→"4 أطباق" + md5s differ; byte-identical round-1 pair deleted; data-dish-count hook after the announcer collision (run-14 lesson)
- verdict: PASS
- evidence: /evidence/prod-run/specs/filter-pair--{en,ar}.log + prod-run/F3-5/

(machine-generated from /evidence/MATRIX.md — 2026-09-23T18:01:42.272Z)
