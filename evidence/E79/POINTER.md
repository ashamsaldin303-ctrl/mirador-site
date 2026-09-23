# E79

- check: THE EXIT GATE (one dispatch)
- expected: medians ≥90/LCP≤2.5s/CLS≤0.1/TBT≤300ms · 16/16 · axe 0/0 · 404 · race · 0 spinner · organs green · ΣΔ≤0
- actual: RUN 25 (the exit-gate dispatch, e755c8f): every component GREEN — perf 92/87 · CLS 0.0195/0.0000 · TBT 72/90ms · 16/16 ≤200KB · axe 0/0 · 404 · race · 0 spinner · organs · verify-battery's ONLY failing verdicts = the E27 LCP medians (EN 3340ms · AR 3904ms vs ≤2500). Diagnosis: observedLCP 152ms == FCP (the real page is textbook — runs 23-25 raw metrics); lantern's simulation attributes ~3.3-3.9s to the H1 text-LCP regardless of six legitimate optimization rounds (hero-line subsets preloaded/CSS-tiers, poster fetchPriority, metric-matched wordmark+AR fallbacks, deferred full display families, prefetch adoption kills — runs 18-25 each carry its lesson) — run 20 is the control: ALL LCP resources in network wave 1 → simulated LCP still 3647ms. The serialized-latency model of the devtools-era font queue caps the modeled floor above the threshold; honest FAIL per §8/N16/N24 — never polished, never relabeled
- verdict: FAIL
- evidence: /evidence/prod-run/lighthouse/medians.md + lcp-element.txt + r1/DONE.md (known gaps)

(machine-generated from /evidence/MATRIX.md — 2026-09-23T06:00:29.007Z)
