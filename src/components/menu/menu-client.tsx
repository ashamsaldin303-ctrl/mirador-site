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
import type { Locale } from "@/lib/i18n";
import { SectionNav } from "./section-nav";
import { DietFilterBar, type CountForms } from "./diet-filter-bar";
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
  countForms: CountForms;
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
  locale,
  sections,
  strings,
}: {
  locale: Locale;
  sections: MenuSectionDTO[];
  strings: MenuStrings;
}) {
  // R11 (prompt-4): filter state syncs to the URL (?diet=vegan,gf) — a filter
  // is shareable and survives refresh/back; replaceState keeps history clean
  // (no per-click entries). Initial state hydrates FROM the URL on mount
  // (after hydration, so SSR/ESR markup stays canonical — crawlers see all 28).
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

  // URL-sync arm 1: hydrate the filter state from ?diet= on mount.
  // One-time external-store hydration (the URL), post-mount by design — the
  // SSR markup stays canonical (all 28) so crawlers + first paint never see
  // a mismatch; no cascading renders (runs once, guarded, not derived state).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = (params.get("diet") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter((t): t is DietTag => (DIET_TAGS as readonly string[]).includes(t));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time URL hydration, not derived state
    if (fromUrl.length > 0) setFilters(fromUrl);
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
    // VB2-D2 fix (loop-2): the replaceState previously rode INSIDE the
    // setFilters updater — updaters run during render (and double-invoke under
    // StrictMode), so the history side-effect fired render-phase (React 19
    // router warning). Hoisted: compute next outside, sync the URL in the
    // event-handler context, then commit state once.
    const next = filters.includes(tag) ? filters.filter((t) => t !== tag) : [...filters, tag];
    // URL-sync arm 2: the filter state rides the query string (replaceState)
    const params = new URLSearchParams(window.location.search);
    if (next.length > 0) params.set("diet", next.join(","));
    else params.delete("diet");
    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
    setFilters(next);
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
        // FRM-1 (prompt-4 R6): sections emptied by the active filter drop out
        // of the nav too — a sticky link to an unmounted anchor is a dead link.
        // Per-link counts show the VISIBLE dish count (matches the rows the
        // link jumps to and the live-region announcer).
        items={sections
          .filter((section) => section.items.some((item) => matchesFilters(item, filters)))
          .map(({ slug, title, items }) => ({
            slug,
            title,
            count: items.filter((item) => matchesFilters(item, filters)).length,
          }))}
        label={strings.sectionsLabel}
      />
      <DietFilterBar
        locale={locale}
        tags={DIET_TAGS}
        active={filters}
        onToggle={toggleFilter}
        count={visibleCount}
        countForms={strings.countForms}
        labels={strings.filters}
      />
      <div ref={listRef}>
        {sections.map((section, index) => (
          <DishList
            key={section.slug}
            section={section}
            index={index}
            strings={strings}
            filters={filters}
          />
        ))}
      </div>
    </div>
  );
}
