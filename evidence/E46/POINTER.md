# E46

- check: four security headers + no X-Powered-By
- expected: CSP/XFO/RP/XCTO live
- actual: the four headers live in the raw curl -is dumps of both locales (no X-Powered-By anywhere in the pair)
- verdict: PASS
- evidence: /evidence/prod-run/http/{en,ar}--200.txt + prod-run/http/summary.txt

(machine-generated from /evidence/MATRIX.md — 2026-09-23T23:45:07.451Z)
