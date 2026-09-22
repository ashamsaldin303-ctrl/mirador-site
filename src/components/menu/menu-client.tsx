"use client";
// MIRADOR — menu interactive island: owns the diet-filter state, animates the
// visible rows with gsap Flip (DURATIONS.slow · EASE_EXPO_OUT), and renders the
// section nav + filter bar + every dish list. Initial state = no filters →
// all 28 dishes SSR in the raw HTML (F3-2) and hydrate in place.
// P-022 (prompt-4 R4): gsap+Flip arrive via the getMotion() singleton — the
// module loads in-effect (motionRef); the FIRST filter click in the rare
// pre-load window simply snaps rows (identical to the reduced-motion fallback)
// — every click after the family lands captures and plays the Flip.
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DURATIONS, EASE_EXPO_OUT, getMotion, prefersReducedMotion, type Motion } from "@/lib/motion";
import { DIET_TAGS, type Allergen, type DietTag } from "@/lib/menu";
import { SectionNav } from "./section-nav";
import { DietFilterBar } from "./diet-filter-bar";
import { DishList } from "./dish-list";

// SSR-safe layout effect (useLayoutEffect warns during server render)
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export type DishDTO = {
  slug: string;
  name: string;
  desc: string;
  price: string;
  allergens: Allergen[];
  dietTags: DietTag[];
  isSignature: boolean;
  isSoldOut: boolean;
  imageUrl: string | null;
};

export type MenuSectionDTO = {
  slug: string;
  title: string;
  items: DishDTO[];
};

export type MenuStrings = {
  sectionsLabel: string;
  closeLabel: string;
  soldOut: string;
  signature: string;
  allergensLabel: string;
  openDish: string;
  filters: Record<DietTag, string>;
  countSingular: string;
  countPlural: string;
  allergenNames: Record<Allergen, string>;
};

/** A row survives a filter when no filter is active or it matches any active
 *  filter (union semantics — the four diets are alternatives, not constraints). */
export function matchesFilters(
  item: DishDTO,
  filters: readonly DietTag[],
): boolean {
  return (
    filters.length === 0 ||
    item.dietTags.some((tag) => filters.includes(tag))
  );
}

export function MenuClient({
  sections,
  strings,
}: {
  sections: MenuSectionDTO[];
  strings: MenuStrings;
}) {
  const [filters, setFilters] = useState<DietTag[]>([]);
  // FlipState derived from the singleton's own getState signature (type-level only)
  const flipStateRef = useRef<ReturnType<Motion["Flip"]["getState"]> | null>(null);
  const motionRef = useRef<Motion | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // P-022: load the motion family in-effect (never top-level) — Flip captures
  // become available from the first interaction AFTER this resolves.
  useEffect(() => {
    let disposed = false;
    void getMotion().then((motion) => {
      if (!disposed) motionRef.current = motion;
    });
    return () => {
      disposed = true;
    };
  }, []);

  const visibleCount = sections.reduce(
    (sum, section) =>
      sum + section.items.filter((item) => matchesFilters(item, filters)).length,
    0,
  );

  const toggleFilter = (tag: DietTag) => {
    const motion = motionRef.current;
    // capture the FLIP "First" state BEFORE the DOM mutates — only when the
    // family has landed; otherwise the layout effect snaps (RM-equivalent).
    const root = listRef.current;
    if (motion && root) {
      flipStateRef.current = motion.Flip.getState(
        root.querySelectorAll("[data-dish-row]"),
      );
    }
    setFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  useIsomorphicLayoutEffect(() => {
    const state = flipStateRef.current;
    const motion = motionRef.current;
    if (!state || !motion) return;
    flipStateRef.current = null;
    if (prefersReducedMotion()) return; // static fallback — rows snap, all content present
    const { Flip, gsap } = motion;
    Flip.from(state, {
      duration: DURATIONS.slow,
      ease: EASE_EXPO_OUT,
      absolute: true,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0 },
          {
            opacity: 1,
            duration: DURATIONS.slow,
            ease: EASE_EXPO_OUT,
            clearProps: "opacity",
          },
        ),
      onLeave: (elements) =>
        gsap.to(elements, {
          opacity: 0,
          duration: DURATIONS.slow,
          ease: EASE_EXPO_OUT,
          clearProps: "opacity",
        }),
    });
  }, [filters]);

  return (
    <div>
      <SectionNav
        items={sections.map(({ slug, title }) => ({ slug, title }))}
        label={strings.sectionsLabel}
      />
      <DietFilterBar
        tags={DIET_TAGS}
        active={filters}
        onToggle={toggleFilter}
        count={visibleCount}
        countSingular={strings.countSingular}
        countPlural={strings.countPlural}
        labels={strings.filters}
      />
      <div ref={listRef}>
        {sections.map((section) => (
          <DishList
            key={section.slug}
            section={section}
            strings={strings}
            filters={filters}
          />
        ))}
      </div>
    </div>
  );
}
