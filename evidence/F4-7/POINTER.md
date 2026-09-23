# F4-7

- check: E2E ratelimit
- expected: 6th POST in 60s → 429 + Retry-After
- actual: 6th=429 + Retry-After + X-RateLimit-Remaining:0 (limiter ACTIVE)
- verdict: PASS
- evidence: /evidence/specs/ratelimit.log

(machine-generated from /evidence/MATRIX.md — 2026-09-23T17:17:48.364Z)
