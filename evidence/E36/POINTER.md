# E36

- check: NEXT_PUBLIC_SITE_URL in workflow env + .env.example
- expected: PLACEHOLDER https://mirador.example
- actual: workflow env + .env.example carry the placeholder; COP-1 build guard enforces
- verdict: PASS
- evidence: /evidence/.github/workflows/production-evidence.yml + .env.example

(machine-generated from /evidence/MATRIX.md — 2026-09-23T18:01:42.271Z)
