# E37/E38 · doc-truth layer (prompt-4 R1 / C-2) — machine-generated 2026-09-22T18:27:28Z

## E37 — before/after quotes of the three corrected passages (raw source: run 11, evidence/prod-run/**)

### 1. evidence/BLOCKED.md · B2 row
```diff
- | B2 | production Lighthouse medians + raw traces | **CLOSED** — `prod-run/lighthouse/` (E27/E28) |
+ | B2 | production Lighthouse medians + raw traces | **EXECUTED — GATE E27: FAIL** (instrument live: 6 LHRs + 6 traces on run 11; EN 90/3515ms-LCP/0.053-CLS/77ms-TBT · AR 86/3980ms/0.0043/86ms — thresholds ≥90 · LCP ≤2.5s not yet met; the R9 wire/font work owns the LCP gap) — `prod-run/lighthouse/medians.md` |
```
raw: GATE E27: FAIL — 2 locale gates failed

### 2. evidence/BLOCKED.md · B4 row
```diff
- | B4 | prod-form 404 status semantics | **PARTIALLY CLOSED — see BLK-R3-1 below** |
+ | B4 | prod-form 404 status semantics | **CLOSED — GATE E22: PASS** (run 11: R3 loading-boundary relocation landed — /{en,ar}/nonexistent-page → HTTP 404 + the six §7.9 copy strings + noindex on the Actions production server) — `prod-run/http/summary.txt` |
```
raw: GATE E22: PASS — real 404 semantics + designed §7.9 copy on the production server

### 3. docs/deploy-pre.md · §3 + §4
```diff
- ## §3 Lighthouse CI on the production build (B3) — EXECUTED + EVIDENCED
+ ## §3 Lighthouse CI on the production build (B3) — EXECUTED; GATE E27: FAIL (re-synced 2026-09-22, run 11)
- ## §4 404 status commit (B4) — **EXECUTED + EVIDENCED**
+ ## §4 404 status commit (B4) — **EXECUTED — GATE E22: PASS** (re-synced 2026-09-22, run 11)
```

Also corrected: evidence/lighthouse/BLOCKED.md (stale round-1 policy-block narrative → the EXECUTED/GATE E27: FAIL state) · BLK-R3-1 marked RESOLVED by R3 · BLK-R3-2 re-scoped to the Release-1 hard-200KB gate (run 11: 170.3–180.9KB 16/16).

## E38 — verify-docs committed, CI-wired, green on HEAD; a contradicting claim fails the job

Check logic (scripts/verify-docs.ts, verbatim):
```ts
function docQuotesGate(docText: string, gate: string, verdict: string): boolean {
  return docText.includes(\`${gate}: \${verdict}\`);
}
// 7 checks: A1 BLOCKED.md↔E27 · A2 lighthouse/BLOCKED.md↔E27 · A3 deploy-pre §3↔E27
//           B1 BLOCKED.md↔E22 · B2 deploy-pre §4↔E22 · C1 versions.md↔tsconfig
//           PROBE-1 (—probe): synthetic contradicting claim MUST fire
```

Green run on HEAD (with probe):
```
  PASS  A1  evidence/BLOCKED.md quotes the raw verdict — GATE E27: FAIL
  PASS  A2  evidence/lighthouse/BLOCKED.md quotes the raw verdict — GATE E27: FAIL
  PASS  A3  docs/deploy-pre.md (## §3) quotes the raw verdict — GATE E27: FAIL
  PASS  B1  evidence/BLOCKED.md quotes the raw verdict — GATE E22: PASS
  PASS  B2  docs/deploy-pre.md (## §4) quotes the raw verdict — GATE E22: PASS
  PASS  C1  docs/versions.md TypeScript row claim (enabled) matches tsconfig noUncheckedIndexedAccess=true
  PASS  PROBE-1  probe: a contradicting claim (GATE E27: PASS) IS caught; the true one passes
  verify-docs: PASS — 7 checks green (raw: E27=FAIL · E22=PASS · noUncheckedIndexedAccess=true)
```

CI wiring: .github/workflows/ci.yml — job verify-docs on every push to main + workflow_dispatch; runs `bun scripts/verify-docs.ts --probe`.
