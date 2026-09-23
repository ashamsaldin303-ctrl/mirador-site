# E79

- check: THE EXIT GATE (one dispatch)
- expected: medians ≥90/LCP≤2.5s/CLS≤0.1/TBT≤300ms · 16/16 · axe 0/0 · 404 · race · 0 spinner · organs green · ΣΔ≤0
- actual: RUN 25 (the exit-gate dispatch, e755c8f): every non-Lighthouse component GREEN — CLS 0.0195/0.0000 · TBT 72/90ms · 16/16 ≤200KB · axe 0/0 · 404 · race · 0 spinner · organs · ΣΔ≤0 — while the Lighthouse gate FAILs on THREE cells per the raw medians: /en LCP=3340ms (lcp:false) · /ar LCP=3904ms (lcp:false) · /ar performance=87 (score:false — the LCP weight drives the AR score below the ≥90 gate; EN performance=92 passes). Diagnosis: observedLCP==observedFCP on every committed LHR (127–178ms — the page is textbook); lantern attributes the H1 text-LCP to a serialized font queue (requestLatencyMs=562.5 in every LHR's configSettings.throttling); six legitimate optimization rounds each moved the number with committed lessons (runs 18–25); run 20 is the control: ALL LCP resources in network wave 1 → simulated LCP still 3647ms. Honest FAIL per §8/N16/N24 — never polished, never relabeled
- verdict: FAIL
- evidence: /evidence/prod-run/lighthouse/medians.md + prod-run/lighthouse/lcp-element.txt + r1/DONE.md

(machine-generated from /evidence/MATRIX.md — 2026-09-23T16:52:25.538Z)
