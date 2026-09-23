# BLOCKED → EXECUTED — E8 · E9 — Lighthouse CI (prod-build form)

## Status (re-synced 2026-09-23 · prompt-4 R13, exit-gate run 25) — GATE E27: FAIL

The round-1/2 policy block is RESOLVED: the `production-evidence` workflow
(Actions, the sanctioned surface) builds production and runs Lighthouse CI on
every dispatch. The instrument is live: **6 LHR reports + 6 raw trace JSONs
per run** (3 mobile runs × /en + /ar), medians in
`evidence/prod-run/lighthouse/medians.md`.

Current raw verdict — **GATE E27: FAIL** (exit-gate run 25: perf 92/87 · CLS 0.0195/0.0000 · TBT 72/90ms — LCP medians EN 3340ms · AR 3904ms vs ≤2500ms the sole failing threshold; observedLCP 152ms == FCP; full diagnosis in evidence/r1/DONE.md known-gaps; runs 11-25 raw preserved beside).
the build):

- /en median: performance=90 · LCP=3515ms · CLS=0.0532 · TBT=77ms
  → score PASS · LCP FAIL · CLS PASS · TBT PASS
- /ar median: performance=86 · LCP=3980ms · CLS=0.0043 · TBT=86ms
  → score FAIL · LCP FAIL · CLS PASS · TBT PASS

The remaining gap is LCP (poster + font wire on mobile) — owned by Release-1's
R9 (gallery `sizes`, font subsets −31KB EN / −100KB AR, wordmark + digits
subsets). Thresholds are frozen (≥90 · LCP ≤2.5s · CLS ≤0.1 · TBT ≤300ms) and
never bend.

## History (round 1/2 — the policy block, superseded)

E8/E9 gates are defined on "Lighthouse CI (mobile, **prod build**, 3 runs,
median)" — parent §10.2 / Appendix A. Production builds were prohibited by the
platform in the round-2 container (see /evidence/F12-2/BLOCKED.md), so the
gate-form run was BLOCKED-by-policy there; dev-mode numbers were categorically
NOT submitted as gate evidence. Resolved by the round-3 Actions surface.

- LCP element = hero poster `<img>` on /en + /ar (E9): lcpElement rows ship in
  `evidence/prod-run/lighthouse/lcp-element.txt` beside the medians.
