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

// easings: expo.out + cubic-bezier(0.16,1,0.3,1)
export const EASE_EXPO_OUT = "expo.out" as const;
export const EASE_OUT_SOFT = "cubic-bezier(0.16,1,0.3,1)" as const;

// reduced-motion designed fallbacks (§5.4): ≤0.3s fades, ≤8px lifts, all content present
export const RM_FADE_MAX = 0.3;
export const RM_LIFT_MAX = 8;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
