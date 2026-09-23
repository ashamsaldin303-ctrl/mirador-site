# E47

- check: oversized POST → 413 + limiter bound
- expected: 8KB cap + bounded Map
- actual: raw 413 pair + 10,000-bucket cap assert
- verdict: PASS
- evidence: /evidence/specs/sec-r5.log

(machine-generated from /evidence/MATRIX.md — 2026-09-23T23:45:07.451Z)
