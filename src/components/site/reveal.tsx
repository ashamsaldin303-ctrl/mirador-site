"use client";

/**
 * Reveal — the only motion system on the page (§7.1 discipline).
 * transform/opacity only · 350ms ease-out-soft · fires once per element ·
 * stagger capped so (N−1)×gap ≤ 300ms · fully inert without JS (content stays
 * visible — gate #10) and fully removed under prefers-reduced-motion.
 */

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Milliseconds — keep total stagger ≤ 300ms (cap at 5–6 items). */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style =
    delay > 0 ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined;

  return (
    <div ref={ref} data-reveal="" style={style} className={className}>
      {children}
    </div>
  );
}
