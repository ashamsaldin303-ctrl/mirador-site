# E49

- check: tsconfig noUncheckedIndexedAccess + no noImplicitAny:false
- expected: typecheck green
- actual: flag present + tsc 0 errors
- verdict: PASS
- evidence: /evidence/tsconfig.json + gates/deterministic-suite.log

(machine-generated from /evidence/MATRIX.md — 2026-09-23T18:01:42.272Z)
