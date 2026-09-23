"use client";
// MIRADOR — menu section nav: sticky under the fixed header (top-16 · z-10),
// 6 anchor links with scroll-spy active state, hairline + blur surface once
// the bar is stuck. Horizontal overflow on small screens uses .scroll-thin.
import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";

export type SectionNavItem = { slug: string; title: string; floor: number };

const HEADER_PX = 64; // fixed header height (h-16)

export function SectionNav({
  items,
  label,
}: {
  items: SectionNavItem[];
  label: string;
}) {
  const navRef = useRef<HTMLElement>(null);
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
      <div className="scroll-thin flex items-center gap-1 overflow-x-auto">
        {items.map(({ slug, title, floor }) => (
          <a
            key={slug}
            href={`#${slug}`}
            onClick={(event) => goTo(event, slug)}
            aria-current={active === slug ? "true" : undefined}
            className={cn(
              "flex min-h-11 shrink-0 items-center whitespace-nowrap rounded px-3 text-small text-muted transition-colors duration-base hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber",
              active === slug &&
                "text-ink underline decoration-amber decoration-1 underline-offset-8",
            )}
          >
            {/* P-095 (prompt-6 R4 · E94): the nav re-keyed to floor numerals —
                the amber numeral (aria-hidden decoration, Western digits)
                keys each anchor beside its title */}
            <span
              aria-hidden="true"
              className="me-2 font-display tabular-nums text-amber"
            >
              {floor}
            </span>
            {title}
          </a>
        ))}
      </div>
    </nav>
  );
}
