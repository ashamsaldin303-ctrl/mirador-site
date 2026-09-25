"use client";
// MIRADOR — StoryTimeline (loop2-I4 §7): the story chapters' reading rail.
// Each chapter frame carries a 1px copper overlay on its border-s hairline
// (.story-draw, positioned by the page) — this component scrubs it
// scaleY 0→1 as the chapter crosses the viewport: the line draws with the
// reading, origin TOP. Vertical scale is direction-neutral — RTL-safe by
// construction (no x-axis, no logical mirroring needed). Ghost numerals
// counter-rotate ±2° on the same scrub (the quiet parallax counterweight).
// GSAP arrives ONLY through getMotion() in-effect; everything is built inside
// one gsap.context() and reverted on unmount (inline styles restored).
// RM: nothing wires — the CSS pre-scrub hidden state never applies under
// prefers-reduced-motion, so every hairline renders full (the designed static
// state). No-JS: same — the html[data-js] gate never matches.
import { useEffect } from "react";
import { getMotion, prefersReducedMotion } from "@/lib/motion";

export function StoryTimeline() {
  useEffect(() => {
    if (prefersReducedMotion()) return; // RM: full lines, still numerals
    let disposed = false;
    let revert: (() => void) | null = null;
    void getMotion().then(({ gsap }) => {
      if (disposed) return;
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".story-chapter").forEach((chapter, i) => {
          // the chapter's scroll window — one config for both systems below
          const scroll = {
            trigger: chapter,
            start: "top 85%",
            end: "bottom 65%",
            scrub: true as const,
          };
          const line = chapter.querySelector<HTMLElement>(".story-draw");
          if (line) {
            gsap.fromTo(
              line,
              { scaleY: 0 },
              { scaleY: 1, ease: "none", scrollTrigger: { ...scroll } },
            );
          }
          const ghost = chapter.querySelector<HTMLElement>(".ghost-numeral");
          if (ghost) {
            // counter-rotate ±2°: odd and even chapters swing opposite ways —
            // the scroll direction's counterweight, never a wobble you notice,
            // only one you feel
            const from = i % 2 === 0 ? -2 : 2;
            gsap.fromTo(
              ghost,
              { rotation: from },
              { rotation: -from, ease: "none", scrollTrigger: { ...scroll } },
            );
          }
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
