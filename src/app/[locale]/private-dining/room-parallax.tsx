"use client";
// MIRADOR — RoomParallax (L3-I2 · D2 P5): the private-dining room figure's
// scrub island. The page wraps the room Image in an inner .private-parallax
// div (inside the CSS-owned .reveal-scale mask-settle wrapper) — this
// component scrubs that inner layer yPercent −3→+3 on a scale-1.06 cover
// (3% headroom per side, no edge gaps at the extremes — the LOOP2-I2 gallery
// tile-parallax law, sized down for a single full-bleed figure). ease none
// (the scrub owns time), invalidateOnRefresh. GSAP arrives ONLY through the
// getMotion() singleton in-effect; everything is built inside one
// gsap.context() and reverted on unmount (inline styles restored).
// RM: the tween is never created (the figure renders statically, fully
// visible). No-JS: same — nothing ever wires.
import { useEffect } from "react";
import { getMotion, prefersReducedMotion } from "@/lib/motion";

export function RoomParallax() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let disposed = false;
    let revert: (() => void) | null = null;
    void getMotion().then(({ gsap }) => {
      if (disposed) return;
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".private-parallax").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -3, scale: 1.06 },
            {
              yPercent: 3,
              scale: 1.06,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        });
      });
      revert = () => ctx.revert();
    });
    return () => {
      disposed = true;
      revert?.();
    };
  }, []);
  return null;
}
