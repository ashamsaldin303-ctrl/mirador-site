# E85 — the remaining honest closes (prompt-5 R3): bounded, fenced, evaluate-then-decide

Every candidate that could move lantern LCP without doctrine damage, priced against the floor
model (`docs/lcp-floor-derivation.md`, machine-derived from the committed LHRs — E84). The
constants used below: TTFB 456ms · serialized slot 562.5ms · residual +72ms (EN) / +17ms (AR) ·
**the closing requirement: ≤3 post-TTFB slots = CSS + the LCP face + at most ONE more
render-blocking face** (EN currently 4 font slots → defer 3 non-LCP faces; AR 5 → defer 4).

The fences (§5, frozen): ΣΔ≤0 · CSS +3KB (≈2.97KB subscribed, 0.03KB slack) · faces ≤60KB each ·
disk ≤334,880B (current 334,200B) · **damage no conversion typography** · no threshold/instrument
change (N27). A candidate that cannot close → documented, not landed.

## The enumeration

| # | candidate | byte cost / ΣΔ | CSS ⑤ | faces ≤60KB | metric identity | projected lantern LCP (floor model) | typography trade (product terms) | verdict |
|---|---|---|---|---|---|---|---|---|
| C1 | Defer the body faces only — EN `instrument-sans-var` (34,823B), AR the five Plex arms (400-latin 6,186 · 500-ar 32,327 · 500-lat 6,366 · 600-ar 32,415 · 600-lat 6,474) — via the run-23 print-flip sheet | ΣΔ = 0B moved, not removed (same faces, post-load) | +0B (the pattern reuses `/fonts-deferred.css` mechanics; one more `@font-face` block moves, net ~0) | unchanged | stacks unchanged — fallbacks already metric-matched (run 20) | EN 5→4 slots = 2778ms ✗ · AR 6→4–5 slots = 2728–3291ms ✗ — **neither locale closes** | every paragraph, button label, price and time renders in the metric-matched fallback until the flip — the conversion surface's READING layer in substitute type on first paint | **REJECT — arithmetic (cannot close) + conversion-typography damage** |
| C2 | Hero-only blocking — defer ALL non-LCP above-fold faces (both wordmarks, the switcher script face, the body faces, the digits arms); only the H1's face stays render-blocking | ΣΔ = 0B (same mechanism) | +0B | unchanged | unchanged | EN 5→3 = 2216ms ✓ · AR 6→3 = 2216ms ✓ — **both close** | the logo lockup, the nav, the locale switcher, ALL body text and the CTA render in fallback type until post-load — the first paint of the conversion surface is NOT the brand | **REJECT — the only candidate that closes, and it closes by deferring the conversion surface's typography itself (the fence: "damage no conversion typography"); the standing refusal in `r1/DONE.md` known-gaps re-affirmed** |
| C3 | AR font-set consolidation — merge the six Plex arms into three per-weight combined faces (both scripts' unicode-ranges in one file): 400→36,205B · 500→38,693B · 600→38,889B | ΣΔ ≈ 0B (combined = sum of arms; woff2 per-face optimization already applied — no further compression) | +0B | 36,205 / 38,693 / 38,889 ≤ 60KB ✓ | same glyph data, disjoint ranges concatenated — metrics identical by construction; re-verified as a receipt if ever landed | AR requests 6→3 but slots → 4–5 (CSS + hero + wordmark + ≥1 body weight) = 2728–3291ms ✗ — **does not close** (the body still needs ≥1 weight face besides the hero/wordmark) | none — same faces, same rendering (the only damage-free candidate) | **REJECT — arithmetic: even fully consolidated the set exceeds the 3-slot closing requirement; the slot currency is request count, and ≥2 non-LCP faces must remain** |
| C4 | Inline the hero face as a data-URI inside the render-blocking CSS | −1 request, +~5,7KB wire (base64 inflation of 14,227B → ~19KB) — ΣΔ wire **> 0** | **+~19KB — breaches the +3KB ceiling (cell ⑤ has 0.03KB slack) by ~6×** | n/a (no separate face) | identical glyphs | EN 5→4 slots = 2778ms ✗ (the slot merges into the CSS's own transfer time, not away) | none | **REJECT — CSS-fence breach (hard) + does not close + ΣΔ>0** |
| C5 | Swap the LCP element — resize/reorder the hero so the poster `<img>` out-sizes the H1 (image-LCP chains HTML→poster, ~2 slots ≈ 1330ms) | product markup/CSS changes on the hero | product CSS | n/a | n/a | ~1330ms ✓ (would close) | the hero's visual design changes to make the instrument pick a different element — the H1 renders exactly as fast as before; nothing on the page improves | **REJECT — §3 OUT (new product surface) + instrument-gaming, not optimization; fragile (LCP candidate selection is content-dependent)** |
| C6 | Server push / 103 Early Hints for the font set | infra | n/a | n/a | n/a | lantern does not model server push — the serialized slots stand | none | **REJECT — outside the model's reach; the standalone runner has no push; outside the roster** |
| C7 | `font-display: optional` on non-LCP faces | 0B | 0B | unchanged | unchanged | **no modeled effect** — lantern ignores font-display (the phase table's Load 0/Render 86–88% is the proof) | worse than damage: text may never swap (permanent fallback or invisible-then-jump) on slow devices | **REJECT — instrument-invariant + typography damage + CLS risk** |
| C8 | Subset the body faces harder (above-fold-glyphs-only) | −bytes (e.g. instrument-sans 34,823→~8–10KB) — ΣΔ < 0 ✓ | 0B | ✓ | ✓ | slots UNCHANGED (still one serialized request each) — the residual shrinks ~100–140ms; EN ≈ 3200ms ✗ | none (same faces, smaller) | **REJECT — arithmetic: the slot currency is request count, not bytes; the six committed optimization rounds already proved bytes don't move the number (run 18's subsets cut 41KB and moved nothing)** |
| C9 | Preload-cut — remove the non-LCP preloads (let CSS discover them) | 0B | 0B | unchanged | unchanged | the CRC already models them as CSS-discovered (fonts sit UNDER the CSS node in every chain) — slots unchanged; the OBSERVED wave-1 position is lost (real-world regression) | none | **REJECT — no modeled gain + real-world regression** |
| C10 | Head-order shuffle — move the hero preload above the CSS link | 0B | 0B | unchanged | unchanged | the hero face is already at its model floor (its slot is one of the mandatory two); head order is not a modeled variable | none | **REJECT — no modeled effect** |

## The verdict — zero candidates landed; the floor proof carries the round

Per §4 R3: "Land only candidates that project ≤2500ms AND violate no fence AND damage no
conversion typography. … Zero candidates landing is an acceptable, honest outcome (the floor
proof then carries the round)."

- **The only candidate that projects ≤2500ms on both locales (C2) is precisely the one the
  conversion-typography fence exists to refuse**: it closes the instrument's number by deferring
  the brand's first paint — the logo, the nav, the locale switcher, the body and the CTA — to
  substitute type. That is not an optimization; it is trading the product for the model.
- **Every damage-free candidate (C3, C8, C9, C10) fails the arithmetic**: the lantern slot
  currency is the serialized REQUEST COUNT, and the render-blocking set must keep ≥2 non-LCP
  faces (body weight + wordmark) on any typography-preserving configuration — 4+ slots —
  above the ≤3-slot closing requirement by construction.
- **The two fence-breaching candidates (C4 CSS +19KB; C5 product-surface change) are rejected
  on the fences alone**, independently of their (mixed) projections.

No fence was bent; no threshold was touched; no instrument was substituted (N27). The E79
disposition for the close-out report is therefore **`carried — Option A standing`**: the honest
FAIL (three cells), the floor proof (E84), this enumeration (E85), and the human's decision form
(E87) travel together into v2.0-I's backlog.

## Reproduction (REPLAY)

- The constants this table projects from: `bun evidence/tools/lcp-floor.ts` → `docs/lcp-floor-derivation.md` (§ per-locale closing arithmetic).
- The font inventories/tiers per locale: the derivation's network-requests tables (bytes + priority per face, LHR paths cited inline).
- The fences: `docs/gatebook.md` + `docs/exchange-ledger.md` (cell ⑤ slack 0.03KB; disk 334,200B of 334,880B).
- The six committed optimization rounds' ledger (what already moved and why the survivors are structural): `evidence/r1/DONE.md` known-gaps + this round's batch ledger.
