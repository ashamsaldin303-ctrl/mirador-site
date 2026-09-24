# E94

- check: THE FLOOR-PLATE MENU — six sections keyed to the building's floors
- expected: menu screenshots ×2 locales ×3 widths · heading hierarchy unchanged · zero client JS added · zero new font bytes · the CSS cost carried honestly
- actual: the floor numeral (aria-hidden decoration, Western digits — the locked numeral policy) rides the DEFERRED display face beside the existing H2 (font-display resolves through --font-display-stack → Fraunces/Amiri deferred + metric-matched fallbacks); the base hairline draws on plate reveal (motion-safe:draw, mount-time, SSR-only); the section-nav re-keyed to floor numerals (the amber numeral keys each anchor; floors derived at render from the collection index — NO schema change, pinned through filtering); screenshots ×6 (2 locales × 375/768/1440); zero client JS added (markup inside the existing island); zero new font faces (grep: no new @font-face declarations); the CSS cost ≈ 0B bespoke (existing utilities — the measured truth vs Appendix B's +0.4KB projection: the measurements are the law)
- verdict: PASS
- evidence: /evidence/ui/E94/menu--floor-plates--en--375.png + ui/E94/menu--floor-plates--ar--1440.png

(machine-generated from /evidence/MATRIX.md — 2026-09-24T00:14:41.660Z)
