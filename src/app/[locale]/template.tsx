"use client";
// MIRADOR — route template (loop2-I4 §3): THE PAGE TRANSITION. Next re-mounts
// templates on every soft navigation — this is the site's ONE arrival cue for
// route changes: a single 300ms settle rise (the existing `settle` keyframe,
// direction-neutral — RTL-free). First load / hard reload = NO animation (the
// LCP path stays untouched); only navigations AFTER the first client mount
// arm the class. The wrapper is a plain <div> — layout-neutral under <main>.
// The class is written straight to the DOM (the reveal-provider's own idiom —
// attributes/classes are the external system an effect synchronizes with; no
// setState, no re-render) and removed after 500ms so nothing lingers into
// hover/Flip transitions. RM contract: .route-in's animation lives inside the
// no-preference media in globals.css (LOOP2-I4 section) — reduced-motion
// users get instant routes.
// StrictMode note: the first-mount decision is captured into a ref during the
// instance's first render (before any effect), so reactStrictMode's dev-only
// setup→cleanup→setup double-invoke cannot flip the module flag early and
// accidentally animate the initial load.
import { useEffect, useRef } from "react";

// module-level sentinel — true only until the first client template instance
// has mounted (the hard load). Soft navigations mount fresh instances and
// see false. Server-side this is never mutated (effects don't run there).
let firstMount = true;

export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  // captured at THIS instance's first render — the decision, not the flag,
  // gates the effect (StrictMode-proof; see the file note above).
  const firstRef = useRef(firstMount);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (firstRef.current) {
      firstMount = false; // flip once, ever — the next mount is a navigation
      return;
    }
    const el = wrapRef.current;
    if (!el) return;
    el.classList.add("route-in");
    const t = window.setTimeout(() => el.classList.remove("route-in"), 500);
    return () => {
      window.clearTimeout(t);
      el.classList.remove("route-in");
    };
  }, []);

  return <div ref={wrapRef}>{children}</div>;
}
