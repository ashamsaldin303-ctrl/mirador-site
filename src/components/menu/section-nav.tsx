"use client";
// MIRADOR — menu section nav: sticky under the fixed header (top-16 · z-10),
// 6 anchor links with scroll-spy active state, hairline + blur surface once
// the bar is stuck. Horizontal overflow on small screens uses .scroll-thin.
//
// LOOP2-I2 rebuild · THE INDICATOR GLIDE: a 1px amber bar rides the bottom
// of the scroll track. JS reads the active link's physical offsetLeft +
// offsetWidth and parks the bar there via transform:translateX + width
// (300ms expo glide). The positioning context is the track itself — the
// SAME relative container whose children's offsetLeft is measured — so the
// physical left:0 + physical translateX pair is self-consistent in LTR and
// RTL alike (the bar also scrolls with the track's content because it lives
// inside the scrollable box). Measurement is EVENT-DRIVEN ONLY —
// active-change / ResizeObserver (track + every link) / document.fonts.ready
// / focusin — never per-frame. RM: the site-wide reduce block makes the
// glide instant while the positioning stays exact. no-JS: the bar is gated
// off (html:not([data-js]) in CSS) and the server-rendered static amber
// underline on the active link keeps the state legible.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

// SSR-safe layout effect (useLayoutEffect warns during server render)
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export type SectionNavItem = { slug: string; title: string; count: number };

const HEADER_PX = 64; // fixed header height (h-16)

export function SectionNav({
  items,
  label,
}: {
  items: SectionNavItem[];
  label: string;
}) {
  const navRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<string | null>(
    items[0]?.slug ?? null,
  );
  const [stuck, setStuck] = useState(false);

  // scroll-spy: the section crossing the zone just below the bars is current
  useEffect(() => {
    const elements = items
      .map(({ slug }) => document.getElementById(slug))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-128px 0px -66% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  // stuck: the bar has reached its sticky slot under the fixed header
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let top = 0;
    const measure = () => {
      top = nav.getBoundingClientRect().top + window.scrollY;
    };
    const onScroll = () => setStuck(window.scrollY + HEADER_PX >= top);
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // THE GLIDE BAR — park the amber hairline under the active link. Physical
  // offsetLeft is read against the track (the links' offsetParent), and the
  // bar is absolutely positioned in that same track — one coordinate space.
  const measureBar = () => {
    const track = trackRef.current;
    const bar = barRef.current;
    if (!track || !bar) return;
    const link = track.querySelector<HTMLAnchorElement>(
      'a[aria-current="true"]',
    );
    if (!link) {
      bar.style.width = "0px";
      bar.style.transform = "translateX(0px)";
      return;
    }
    bar.style.width = `${link.offsetWidth}px`;
    bar.style.transform = `translateX(${link.offsetLeft}px)`;
  };

  // active-change (also re-runs when the filter diet re-counts the links —
  // the parent maps a fresh items array). Pre-paint on mount: no flash.
  useIsomorphicLayoutEffect(() => {
    measureBar();
  }, [active, items]);

  // event-driven re-measure only: ResizeObserver on the track AND every
  // link (font swaps, count text, viewport relayout) · fonts.ready · focusin
  // (keyboard entry). Never a per-frame loop.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ro = new ResizeObserver(() => measureBar());
    ro.observe(track);
    for (const link of track.querySelectorAll<HTMLAnchorElement>("a")) {
      ro.observe(link);
    }
    void document.fonts?.ready.then(() => measureBar());
    const onFocusIn = () => measureBar();
    track.addEventListener("focusin", onFocusIn);
    return () => {
      ro.disconnect();
      track.removeEventListener("focusin", onFocusIn);
    };
    // measureBar closes over refs only (stable); this effect arms the
    // observers exactly once on mount.
  }, []);

  const goTo = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    slug: string,
  ) => {
    const target = document.getElementById(slug);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    window.history.replaceState(null, "", `#${slug}`);
  };

  return (
    <nav
      ref={navRef}
      aria-label={label}
      className={cn(
        "sticky top-16 z-10 rounded transition-colors duration-slow",
        stuck
          ? "border-b border-line bg-night/90 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div
        ref={trackRef}
        className="section-track scroll-thin relative flex items-center gap-1 overflow-x-auto"
      >
        {/* the glide indicator — 1px amber, measured to the active link
            (aria-hidden: it is decoration; the active link itself carries
            aria-current). Gated OFF without JS via html:not([data-js]). */}
        <span ref={barRef} aria-hidden="true" className="section-nav-bar" />
        {items.map(({ slug, title, count }) => (
          <a
            key={slug}
            href={`#${slug}`}
            onClick={(event) => goTo(event, slug)}
            aria-current={active === slug ? "true" : undefined}
            className={cn(
              // the underline pair below is the NO-JS fallback; the
              // html[data-js] twin in globals.css hands the duty to the
              // glide bar once script is alive.
              "flex min-h-11 shrink-0 items-center whitespace-nowrap rounded px-3 text-small text-muted transition-colors duration-base hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber",
              active === slug &&
                "text-ink underline decoration-amber decoration-1 underline-offset-8",
            )}
          >
            {title}
            {/* per-link visible-dish count — HUD numeral, copper, tabular */}
            <span className="ms-1.5 text-micro tabular-nums text-copper">{count}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
