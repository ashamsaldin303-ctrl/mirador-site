// MIRADOR — motion constants (§5.4; mirror of the globals.css @theme duration/easing tokens)
// GSAP code imports THESE — never inline magic numbers.
export const DURATIONS = {
  fast: 0.1, // 100ms
  base: 0.2, // 200ms
  slow: 0.35, // 350ms
  signature: 0.6, // 600ms — the cap for signature moments (scrub-owned time exempt)
} as const;

export const ENTRANCE_MAX = 0.4; // entrances ≤400ms
export const STAGGER = { min: 0.06, max: 0.12 } as const; // 60–120ms

// — P-100 (loop-1): THE REVEAL SYSTEM constants (spec 1-c §1.7 — the
//   data-reveal IO engine in components/system/reveal-provider.tsx).
//   CSS twins live in globals.css under html[data-js] gating. —
export const REVEAL_STAGGER = 70; // ms — default group child stagger
export const REVEAL_CHILD_LIFT = 6; // px — group children lift (lighter than 8)
export const REVEAL_DONE_MS = 450; // ms — post-reveal window before data-done strips CSS

// easings: P-078 (prompt-4 R10) — THE ONE CURVE. EASE_OUT_SOFT (the duplicate
// cubic-bezier alias for the same expo.out) is DELETED; gsap accepts "expo.out"
// everywhere it was used. The CSS twin is --ease-out-expo (globals.css).
export const EASE_EXPO_OUT = "expo.out" as const;

// reduced-motion designed fallbacks (§5.4): ≤0.3s fades, ≤8px lifts, all content present
export const RM_FADE_MAX = 0.3;
export const RM_LIFT_MAX = 8;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ————————————————————————————————————————————————————————————————
// P-022 (prompt-4 R4) — THE motion loader. The gsap family (core + ScrollTrigger
// + Flip) loads ONLY through this singleton, always via in-effect `await` /
// `.then()` — NEVER a top-level import in any route or component. One lazy
// chunk for the whole family; plugins registered exactly once.
// ————————————————————————————————————————————————————————————————

export type Motion = {
  gsap: typeof import("gsap")["default"];
  ScrollTrigger: typeof import("gsap/ScrollTrigger")["ScrollTrigger"];
  Flip: typeof import("gsap/Flip")["Flip"];
};

let motionPromise: Promise<Motion> | null = null;

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
      return {
        gsap,
        ScrollTrigger: scrollTriggerModule.ScrollTrigger,
        Flip: flipModule.Flip,
      };
    })();
  }
  return motionPromise;
}
