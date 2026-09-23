# F4-8

- check: E2E dupguard + DB count
- expected: 409 DUPLICATE, no second row
- actual: 201 then 409 DUPLICATE; exactly 1 row
- verdict: PASS
- evidence: /evidence/specs/dupguard.log

(machine-generated from /evidence/MATRIX.md — 2026-09-23T16:47:36.246Z)
