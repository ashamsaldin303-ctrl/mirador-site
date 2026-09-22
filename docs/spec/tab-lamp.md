# SPEC — THE TAB-LAMP (P-075 §10) · SPEC-ONLY (Release-1, prompt-4 R8)

**Status: SPEC-ONLY.** The pixel table below is the committed contract for the
tab-lamp's implementation; **the implementation itself belongs to the arrival
release (v2.0-I THE HONEST DOOR) — N26 forbids landing it here.** This document
is the museum's drawer: the spec ships now, the mechanism ships on schedule.

## What it is

The tab-lamp is the ceremony cluster's tab affordance: a soft amber "lamp" —
a 1px-state hairline that thickens to a 2px fact under the ACTIVE tab, with a
breathing light (the `breathe` primitive, P-037) whose glow is bounded by the
bezel's contrast invariant. It never animates layout (transform/opacity only),
never exceeds the frozen tempos, and dies completely under reduced motion
(fade ≤0.3s, lift ≤8px — P-027).

## The pixel table (frozen — implementation must match exactly)

| Element | Value | Law |
|---|---|---|
| Lamp track (inactive) | 1px height · `--color-line` #26262B | 1px = state |
| Lamp (active tab) | 2px height · `--color-amber` #CBA35C | 2px = fact |
| Lamp glow (breathe) | 6px blur · amber at 12% opacity · 4s cycle | light breathes, geometry waits |
| Lamp travel (tab→tab) | transform: translateX only · 200ms (`--duration-base`) · `--ease-out-expo` | the one curve |
| Lamp settle | opacity 0.6→1.0 · 100ms (`--duration-fast`) | |
| Vertical offset | 2px below the tab text baseline block (matches the bezel's 2px offset) | |
| Focus (tab key) | the BEZEL (2px amber outline + 2px night offset) — the lamp never replaces focus | P-075 bezel invariant 8.42:1 |
| Reduced motion | no travel, no breathe — the active lamp renders static at full opacity | P-027 twin |
| RTL | lamp anchors logical `inset-inline-start` of the active tab; travel direction mirrors | logical corners law |
| Hit target | every tab ≥44×44px (min-h-11) | touch law |

## Integration contract (for the arrival release)

- Rides the tab strip's DOM order via FLIP-style `left/right` measurement →
  `translateX` (no layout thrash; the conductor rule: CSS owns paint-time).
- The breathe primitive is shared (P-037) — the tab-lamp does not own animation
  code; it consumes `settle / draw / breathe`.
- Kill-switch discipline: `prefers-reduced-motion` collapses the breathe AND the
  travel in ONE media query twin (no JS check per frame).
- Budget: the lamp adds ZERO first-load JS (pure CSS + the shared primitives)
  and ≤0.3KB CSS — counted against the arrival release's Exchange Ledger, not
  this one.

*Authored at prompt-4 R8 · E61 (spec doc). Implementation = N26-out of Release-1.*
