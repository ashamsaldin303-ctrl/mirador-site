# F6-1

- check: Lighthouse CI LCP-element label (prod, run-11+)
- expected: the hero H1 (font-hero text) is the LCP element on /en + /ar (runs 18+ raw; the poster rides below the H1 in the LCP graph)
- actual: EXECUTED on the prod surface (E28 cell) — lcpElement = the hero H1 on every committed run; per-run selector + snippet captured
- verdict: PASS*
- evidence: /evidence/prod-run/lighthouse/medians.md + prod-run/lighthouse/lcp-element.txt

(machine-generated from /evidence/MATRIX.md — 2026-09-23T16:47:36.246Z)
