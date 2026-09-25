"use client";
// MIRADOR — THE SCROLL ARTIFACTS (spec 1-c §7): (A) the progress hairline —
// 2px, fixed under the nav, scaleX readout, logical-side origin (flips under
// RTL via .progress-hairline in globals.css), rAF-coalesced passive listener,
// transform-only. loop2-I4 (§4a) v2: the track reads as a copper→amber
// hairline gradient (.progress-hairline in globals.css — the gradient's
// direction mirrors with the origin under RTL, so copper always anchors the
// reading side). (B) the back-to-top affordance — appears past 1.5 viewports,
// quietOutline idiom + an SVG progress ring (viewBox 44 · r 19 · dasharray
// 119.4 — the offset is written by the SAME rAF apply() as the hairline:
// offset = 119.4 × (1 − y/max); copper stroke → amber on hover), dispatches
// "mirador:scroll-top" which SmoothScroll's Lenis bridge answers (instant
// window.scrollTo under RM / pre-Lenis). Never bypasses Lenis with native
// smooth scrolling. RM: the ring renders full (no readout motion) and the
// button stays fully functional.
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

// 2πr for r=19 — the ring's full circumference (spec'd dasharray).
const RING_CIRCUMFERENCE = 119.4;

export function ScrollArtifacts({ backToTopLabel }: { backToTopLabel: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(y / max, 1) : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
      if (ringRef.current) {
        // the ring empties as you descend and refills toward the top; RM keeps
        // it full — a readout is motion too, and the button's job is the tap.
        ringRef.current.style.strokeDashoffset = reduced
          ? "0"
          : String(RING_CIRCUMFERENCE * (1 - progress));
      }
      setShowTop((prev) => {
        const next = y > window.innerHeight * 1.5;
        return prev === next ? prev : next;
      });
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* (A) the progress hairline — flush under the fixed h-16 nav; the
          copper→amber gradient + the logical-side origin live with the
          .progress-hairline class in globals.css (RTL mirrors both) */}
      <div
        aria-hidden="true"
        className="progress-hairline pointer-events-none fixed inset-x-0 top-16 z-20 h-0.5"
        ref={barRef}
        style={{ transform: "scaleX(0)" }}
      />
      {/* (B) back-to-top — logical `end` mirrors under RTL */}
      {showTop ? (
        <button
          type="button"
          onClick={() => {
            // SmoothScroll's Lenis bridge answers this (smooth when Lenis is
            // alive, instant window.scrollTo otherwise — RM/pre-Lenis paths).
            window.dispatchEvent(new CustomEvent("mirador:scroll-top"));
          }}
          aria-label={backToTopLabel}
          className="group relative fixed bottom-6 end-6 z-20 flex size-11 items-center justify-center rounded-full border border-line bg-night/80 text-muted backdrop-blur-md transition-colors duration-base hover:border-amber hover:text-amber"
        >
          {/* the progress ring — the button's own border is the track; the
              copper arc refills as the climb back to the top shortens */}
          <svg viewBox="0 0 44 44" className="pointer-events-none absolute inset-0" aria-hidden="true">
            <circle
              ref={ringRef}
              cx="22"
              cy="22"
              r="19"
              fill="none"
              strokeWidth="1"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset="0"
              className="stroke-copper transition-colors duration-base group-hover:stroke-amber"
            />
          </svg>
          <ArrowUp className="size-5" aria-hidden="true" />
        </button>
      ) : null}
    </>
  );
}
