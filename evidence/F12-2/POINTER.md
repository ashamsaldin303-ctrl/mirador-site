# F12-2

- check: build size table (prod, prompt-4 E43)
- expected: first-load JS ≤165KB gz soft, standing default (a) — hard 200KB
- actual: EXECUTED — 16/16 under the 200KB hard cap post-zod-fix (run-11 recorded the 232.4KB private-dining breach honestly; the soft ${SOFT_CAP_KB}KB standing-default FAIL remains, gates Release 2)
- verdict: PASS*
- evidence: /evidence/F12-2/prod-run/first-load-js-gz.txt

(machine-generated from /evidence/MATRIX.md — 2026-09-23T17:39:49.896Z)
