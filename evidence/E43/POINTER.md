# E43

- check: 16/16 first-load ≤200KB gz (prod)
- expected: hard cap
- actual: post-zod-fix, re-proven on the exit-gate run: 16/16 ≤ 200KB — max 177.2KB (KiB display, 181,419B — the raw table's own units; run-11 recorded the 232.4KB breach honestly; the fix removed the 63,952B zod chunk)
- verdict: PASS
- evidence: /evidence/F12-2/prod-run/first-load-js-gz.txt

(machine-generated from /evidence/MATRIX.md — 2026-09-23T16:52:25.538Z)
