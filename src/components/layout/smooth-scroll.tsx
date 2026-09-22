"use client";
// MIRADOR — Lenis + ScrollTrigger wiring WITH reduced-motion guard (§2.4-C exemplar).
// P-022 (prompt-4 R4): the motion family loads ONLY through getMotion()
// (in-effect) + Lenis via its own lazy import — no top-level gsap/lenis imports
// here. This component wraps the locale layout, so a static import would put
// the whole motion family into EVERY route's first-load JS.
import { useEffect } from "react";
import { getMotion } from "@/lib/motion";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let disposed = false;
    let lenis: import("lenis").default | null = null;
    let tick: ((time: number) => void) | null = null;
    let ticker: { remove: (f: (t: number) => void) => void } | null = null;

    void (async () => {
      const [motion, lenisModule] = await Promise.all([getMotion(), import("lenis")]);
      if (disposed) return; // unmounted while the lazy chunks loaded — nothing to wire
      const { gsap, ScrollTrigger } = motion;
      lenis = new lenisModule.default({ duration: 1.15, wheelMultiplier: 0.9 });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t: number) => lenis?.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ticker = gsap.ticker;
    })();

    return () => {
      disposed = true;
      if (tick && ticker) ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);
  return <>{children}</>;
}
