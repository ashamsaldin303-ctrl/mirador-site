# MIRADOR — Idiom Contracts & Motion Primitives (P-035/P-037/P-078, prompt-4 R10)

## P-035 · THE BUTTON API (normative)

ONE surface — `src/components/ui/button.tsx`. Every button instance migrates;
`audit:idioms` (A1–A12) enforces zero ad-hoc variants (E66).

| | `cta` | `quiet` | `quietOutline` |
|---|---|---|---|
| surface | amber pill | underline link | 1px hairline pill |
| hover | `bg-amber/90` (brightness-not-wash) | text→ink, hairline→amber | border→amber, text→ink |
| role | the ONE call to action | the understated alternative | secondary/in-flow |

Sizes: `full` (px-8 — hero, 404, submit) · `compact` (px-6 — nav, success CTAs)
· `flow` (px-4 — in-flow secondary). Base invariants: `min-h-11` (the 44px
touch law) · `text-small` · `transition-colors duration-base` (the frozen
200ms) · focus = the site-wide BEZEL (no per-button focus classes, P-075).

### The ledger-family three laws (idiom contracts, binding on every control)

1. **1px = state, 2px = fact** — hairlines/borders declare state; the bezel
   (2px amber outline + 2px night offset) declares the fact of focus.
2. **Error = color, never weight** — `--color-error` carries invalidity; no
   bold/weight changes on error text.
3. **Inputs: no hover, caret amber, LTR island** — input surfaces don't
   hover-shift; the caret is city light; phone/reference values render in
   `dir="ltr"` islands inside RTL flow.

## P-037 · THE MOTION PRIMITIVES (usage map)

The conductor rule (binding): **CSS owns paint/pointer-time** (these
primitives + hover/focus transitions) · **GSAP owns scroll/diff-time** (journey
scrub, menu Flip) · **Lenis owns scroll-feel only** (the smooth-scroll layer).

| Primitive | Contract | Usage sites |
|---|---|---|
| `settle` | vertical arrival ≤600ms expo-out, 8px lift + fade, direction-neutral | confirmation header · not-found floor content · **THE WINDOW's pane arrival (P-094 — the descent; gated `[data-state=open] .window-arrive`, motion-safe)** |
| `draw` | hairline draw 200ms center-out (scale — RTL-free; 1px = state) | confirmation `hud-rule` · **the floor plates' base hairline (P-095 — plate reveal, mount-time)** |
| `breathe` | light breathe: opacity 1↔0.55 @2.4s — the busy state, NEVER a spinner (M-2) | reserve submit busy (`motion-safe:breathe` + `aria-busy`) |

Every primitive mounts behind `motion-safe:` (reduced-motion twin by
construction: static, content fully present); the global RM block
(`transition-duration: 0.01ms`) is the second net.

### The overlay entrance law (P-094, prompt-6 R2 · E92)

**ONE geometry: `<AtTheWindow>` is the only overlay entrance** — the graded
night scrim (`.window-scrim`) + the horizon hairline at `--horizon` + one
close affordance at `end-4` (the close law: size-11, localized sr-only label)
+ the content slot. Entrance = the `settle` descent (600ms); exit = the 100ms
fade (`duration-fast`). **THE REGISTERED EXCEPTION: the mobile sheet keeps its
slide ergonomics** (`sheet.tsx` — the nav's mobile menu; it inherits the
scrim grading + the close law, never the slide's retirement). The grep gate:
ad-hoc `data-[state=open]:animate-*` entrance families exist ONLY inside
`at-the-window.tsx` + `sheet.tsx` (the registered exception). The dead
`ui/dialog.tsx` (DialogContent with zero importers, and the whole file
post-migration) is DELETED — the window is the one Radix Dialog composition.

### Conductor inventory (M-4's reference)

| Mechanism | Owner | Sites |
|---|---|---|
| hover/focus color transitions | CSS | buttons, links, inputs (bezel), filter pills |
| arrival primitives (settle/draw/breathe) | CSS | confirmation, 404 floor, busy state |
| journey pinned scrub + act reveals | GSAP (+ScrollTrigger) | journey.tsx (lazy family) |
| menu filter reflow | GSAP Flip | menu-client.tsx (lazy family) |
| scroll feel | Lenis | smooth-scroll.tsx (lazy) |
| WebGL skyline | R3F/three | skyline-canvas.tsx (lazy, kill-switched) |

## P-078 · THE ONE CURVE

`EASE_OUT_SOFT` (the cubic-bezier alias) is DELETED from `src/lib/motion.ts`.
The one curve: `EASE_EXPO_OUT = "expo.out"` (gsap) — its CSS twin is
`--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` (globals.css @theme).
Keyframes census (authored, globals.css): `settle` · `draw` · `breathe` = 3 ≤ 7
(tw-animate-css's built-in fade/zoom/slide keyframes are library, not authored).

## P-094 · THE WINDOW (prompt-6 R2 · E92) — the overlay idiom register

| Surface | Entrance | Exit | Scrim | Close |
|---|---|---|---|---|
| `<AtTheWindow>` (dish overlay · lightbox) | settle descent 600ms (motion-safe, `[data-state=open] .window-arrive`) | fade `duration-fast` 100ms | `.window-scrim` — the graded night + the horizon hairline at `--horizon` | ONE affordance at `end-4`, size-11, localized sr-only |
| the mobile sheet (**the registered exception**) | the slide (its own ergonomics — kept) | slide-out `duration-fast` | `.window-scrim` — inherited grading | the close law — inherited (size-11 `end-4`, localized label via `closeLabel`) |

The a11y contract rides Radix Dialog unchanged on every surface: focus trap ·
Esc · `aria-modal` · described content (Title + Description per dialog). The
dead `ui/dialog.tsx` is deleted — the harvest documented in the Exchange
Ledger's round table (Appendix B's law: the measurements are the law).
