# F6-2

- check: Playwright network log
- expected: three chunk loads only after journey intersects
- actual: canvas mount 0 pre-scroll → 1 post-scroll (intersection-gated); dev chunk-registration caveat logged
- verdict: PASS
- evidence: /evidence/specs/dom-ac-probes.log

(machine-generated from /evidence/MATRIX.md — 2026-09-21T12:09:43.844Z)
