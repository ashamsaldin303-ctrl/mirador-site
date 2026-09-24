"use client";
// MIRADOR — THE ENTRANCE ROUND · Reveal: the scroll-entrance wrapper. One
// IntersectionObserver per instance; the CSS (globals.css · .reveal) owns
// the transition — opacity + an 18px rise on the settle curve, 600ms.
// THE NO-FLASH LAW: `data-reveal` is armed IMPERATIVELY at effect-time,
// never in SSR markup — no-JS/crawler/server HTML stays canonical and
// fully visible (the hidden state cannot exist without the observer that
// guarantees its release). Below-fold usage only (an above-fold instance
// would dip at hydration: armed hidden → IO fires next frame → in).
// RM twin: prefers-reduced-motion users never arm — the CSS media gate is
// the second net (content static, fully present). Attributes are set on
// the DOM node directly (no re-render churn; React never reconciles props
// it does not own).
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  /** Stagger (ms) — rides the CSS transition as transition-delay. */
  delay?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // RM: never armed
    el.dataset.reveal = "pending";
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.reveal = "visible";
          io.disconnect();
        }
      },
      // the reveal completes only once the block clears the viewport's
      // lower tenth — never mid-curtain at the very edge
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms`, ...style } : style}
    >
      {children}
    </div>
  );
}
