# E42 — P-022 import-graph + singleton/split code (prompt-4 R4) [surface: dev]

`import-graph.log` (beside this manifest) is the raw machine grep: the motion family
(gsap · gsap/ScrollTrigger · gsap/Flip · lenis · three · @react-three/fiber) is statically
imported in **0/16 routes**, and outside the THREE lazy chunk (`skyline-canvas.tsx`, mounted
via `dynamic(ssr:false)` in journey.tsx) there are **zero static imports anywhere in src/**.

## The singleton (src/lib/motion.ts, quoted)

```ts
export function getMotion(): Promise<Motion> {
  if (!motionPromise) {
    motionPromise = (async () => {
      const [gsapModule, scrollTriggerModule, flipModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("gsap/Flip"),
      ]);
      const gsap = gsapModule.default;
      gsap.registerPlugin(scrollTriggerModule.ScrollTrigger, flipModule.Flip);
      return { gsap, ScrollTrigger: scrollTriggerModule.ScrollTrigger, Flip: flipModule.Flip };
    })();
  }
  return motionPromise;
}
```

## The consumers (in-effect only, never top-level)

- `layout/smooth-scroll.tsx` (wraps EVERY route — the layout-level leak): effect does
  `await Promise.all([getMotion(), import("lenis")])` — Lenis has its own lazy import;
  dispose-safe (unmount during load wires nothing).
- `home/journey.tsx`: the pinned-scrub effect does `void getMotion().then(({gsap}) => …build
  gsap.context…)` with a `disposed` flag + `revert()` cleanup.
- `menu/menu-client.tsx`: `motionRef` pattern — family loads in-effect; the FLIP "First"
  capture stays synchronous once loaded; a click in the rare pre-load window snaps rows
  (identical to the reduced-motion fallback), disclosed in the component header.

## The intent-hydrated reserve split (src/components/reserve/reserve-form-lazy.tsx, quoted)

```ts
const INTENT_EVENTS = ["pointerdown", "keydown", "focusin", "touchstart"] as const;
// …
const hydrate = useCallback(() => {
  if (importingRef.current) return;
  importingRef.current = true;
  void import("./reserve-form").then((module) => {
    setForm(() => module.ReserveForm);
  });
}, []);
```

The SHELL (what the route's first-load JS pays for): one labelled `role="group"
aria-busy="true"` focusable region + a decorative `aria-hidden` skeleton in the form's
visual rhythm. The MOTOR (live availability grid · zod pre-validation · submit · WhatsApp
encode) imports on first interaction. Keyboard intent = Tab into the region (focusin).

## Canonical prod-run proof

The Actions run's `F12-2/prod-run/` set (build-manifest.json · first-load-js-gz.txt ·
motion-stack.txt · chunk-manifest.txt) is the build-manifest side of this proof — cited from
the run that carries R4 (run 11+). Local dev-surface verification of behavior (booking 3.0s
with intent-hydration, menu Flip green, webgl control run green) lives in
`evidence/specs/*.log` runs of 2026-09-22T18:0x.

REPLAY:
```
rg -n '^import .* from "(gsap|gsap/|lenis|three|@react-three)' src/app/     # → 0 hits (16 routes)
rg -n '^import .* from "(gsap|gsap/|lenis|three|@react-three)' src/ --glob '!**/skyline-canvas.tsx'  # → 0 hits
bun evidence/tools/browser-specs.ts booking webgl-kill                      # → evidence/specs/*.log
bun evidence/tools/keyboard.ts                                              # → evidence/specs/*.log ×6
bun evidence/tools/dom-ac-probes.ts                                         # → F4-1/F4-2/F3-5/F11-3 green
```
