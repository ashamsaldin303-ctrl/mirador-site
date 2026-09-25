"use client";
// MIRADOR — THE SCROLL ARTIFACTS (spec 1-c §7): (A) the amber progress
// hairline — 2px, fixed under the nav, scaleX readout, logical-side origin
// (flips under RTL via .progress-hairline in globals.css), rAF-coalesced
// passive listener, transform-only. (B) the back-to-top affordance — appears
// past 1.5 viewports, quietOutline idiom, dispatches "mirador:scroll-top"
// which SmoothScroll's Lenis bridge answers (instant window.scrollTo under
// RM / pre-Lenis). Never bypasses Lenis with native smooth scrolling.
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollArtifacts({ backToTopLabel }: { backToTopLabel: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
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
      {/* (A) the progress hairline — flush under the fixed h-16 nav */}
      <div
        aria-hidden="true"
        className="progress-hairline pointer-events-none fixed inset-x-0 top-16 z-20 h-0.5 origin-left bg-amber/80"
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
          className="fixed bottom-6 end-6 z-20 flex size-11 items-center justify-center rounded-full border border-line bg-night/80 text-muted backdrop-blur-md transition-colors duration-base hover:border-amber hover:text-amber"
        >
          <ArrowUp className="size-5" aria-hidden="true" />
        </button>
      ) : null}
    </>
  );
}
