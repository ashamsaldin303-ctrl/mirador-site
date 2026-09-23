# F4-4

- check: E2E capacity-race (20 parallel)
- expected: exactly 12 rows + 8×409 + 0 orphans
- actual: PASS after 2 documented product fixes (SQLite single-writer safety); failure history verbatim in log
- verdict: PASS
- evidence: /evidence/specs/capacity-race.log

(machine-generated from /evidence/MATRIX.md — 2026-09-23T00:34:17.596Z)
