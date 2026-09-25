"use client";
// MIRADOR — THE REVEAL ENGINE (spec 1-c §1.5): ONE shared IntersectionObserver
// for the whole site. Mounted once in [locale]/layout. Rescans on pathname
// change (soft navigation re-render). Single-shot per element: unobserve on
// fire. Sets [data-revealed] (fires the CSS transition) then [data-done]
// (delay + window) which strips all reveal CSS — hover/Flip/GSAP own the
// element afterwards. RM fast-path: everything revealed + done immediately
// (the CSS RM twins are the belt; this is the braces).
// Hidden initial states live ONLY under the html[data-js] CSS gate — no-JS
// and crawlers always see final-state content (spec 1-e §5).
// g3-V4 fix — THE TELEPORT HEALER: the -10% bottom rootMargin line can be
// geometrically unreachable for elements that park inside the last 10% of
// the viewport at max scroll (the footer meta-strip: py-6 below it, parks at
// y≈860 — the line sits at 810), and instant jumps (anchors, End key) can
// teleport elements clean past the IO line without ever intersecting it.
// A debounced scroll-end sweep reveals anything already on-screen — the
// healer covers both corner cases; the IO keeps the designed feel.
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { REVEAL_DONE_MS, REVEAL_STAGGER } from "@/lib/motion";

export function RevealProvider() {
  const pathname = usePathname();
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-reveal]:not([data-done]), [data-reveal-group]:not([data-done])",
      ),
    );
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const n of nodes) {
        n.setAttribute("data-revealed", "");
        n.setAttribute("data-done", "");
      }
      return;
    }
    const timers: number[] = [];

    const reveal = (el: HTMLElement) => {
      el.setAttribute("data-revealed", "");
      if (el.hasAttribute("data-reveal-group")) {
        // per-child stagger via inline transition-delay (DOM order =
        // reading order in both dirs — RTL-safe by construction)
        const stagger = Number(el.dataset.revealStagger ?? String(REVEAL_STAGGER));
        const cap = Number(el.dataset.revealCap ?? "6");
        Array.from(el.children).forEach((child, i) => {
          (child as HTMLElement).style.transitionDelay = `${Math.min(i, cap) * stagger}ms`;
        });
      }
      const delay = Number(el.dataset.revealDelay ?? "0");
      timers.push(
        window.setTimeout(() => el.setAttribute("data-done", ""), delay + REVEAL_DONE_MS),
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          reveal(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    for (const n of nodes) io.observe(n);

    // the teleport healer — debounced scroll-end sweep: anything not yet
    // revealed but already inside the viewport reveals NOW.
    let healTimer = 0;
    const onScroll = () => {
      if (healTimer) return;
      healTimer = window.setTimeout(() => {
        healTimer = 0;
        for (const n of nodes) {
          if (n.hasAttribute("data-revealed")) continue;
          const r = n.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) {
            io.unobserve(n);
            reveal(n);
          }
        }
      }, 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (healTimer) window.clearTimeout(healTimer);
      for (const t of timers) window.clearTimeout(t);
    };
  }, [pathname]);
  return null;
}
