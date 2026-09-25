// MIRADOR — one menu section: ghost numeral + amber tick + bilingual title,
// drawn hairline, staggered dish rows, copper-diamond terminus.
// The section element is the anchor target for the sticky section nav
// (scroll-mt-32 clears the fixed header + stuck bar).
//
// §3-2 jewelry-box register: the oversized ghost numeral (01–06, Western
// digits — site numerals policy) sits behind the title at ink@5% (copper@9%
// under RTL) via the .ghost-numeral class; the h2 needs relative z-10 to
// paint above the positioned ghost (positioned z-0 paints after in-flow
// content).
//
// THE FILTER-REMOUNT GUARD (Flip choreography, law): a diet filter that
// empties this section hides it (display:none) instead of unmounting — the
// ul's [data-revealed]/[data-done] reveal lifecycle survives the filter
// round-trip. Were the section to unmount and remount, its fresh
// [data-reveal-group] would never be re-observed by the route-scoped
// RevealProvider (it rescans only on pathname change) and the rows would
// mount stuck at the group's hidden-state opacity 0. FRM-1's contract holds
// exactly: no stub heading over an empty list is ever VISIBLE (hidden
// content is skipped by screen readers and takes no layout).
import type { DietTag } from "@/lib/menu";
import type { MenuSectionDTO, MenuStrings } from "./menu-client";
import { matchesFilters } from "./menu-client";
import { DishRow } from "./dish-row";

export function DishList({
  section,
  index,
  strings,
  filters,
}: {
  section: MenuSectionDTO;
  index: number;
  strings: MenuStrings;
  filters: readonly DietTag[];
}) {
  // FRM-1 (prompt-4 R6, NEVER-8): a filter that empties this section renders
  // NOTHING visible — no stub heading over an empty list. Sold-out rows are
  // state, not filters — they stay (dimmed) inside surviving sections.
  const visibleItems = section.items.filter((item) => matchesFilters(item, filters));
  const emptied = visibleItems.length === 0;

  return (
    <section
      id={section.slug}
      aria-labelledby={`${section.slug}-title`}
      className="scroll-mt-32 py-24"
      hidden={emptied || undefined}
    >
      <div className="relative">
        <span aria-hidden="true" className="ghost-numeral">
          {String(index + 1).padStart(2, "0")}
        </span>
        {/* amber eyebrow tick — the 12px hairline above every section title */}
        <span aria-hidden="true" className="relative z-10 block h-px w-12 bg-amber/70" />
        <h2
          id={`${section.slug}-title`}
          data-reveal="up"
          className="relative z-10 mt-4 font-display text-h2 text-ink"
        >
          {section.title}
        </h2>
      </div>
      <hr className="hud-rule mt-6" data-reveal="draw" data-reveal-delay="70" />
      {/* The rows themselves NEVER carry data-reveal (Flip law): the group
          staggers them once on scroll, then [data-done] strips the CSS so
          rows mounting after a diet filter appear instantly — never
          re-hidden. Last row drops its border so the diamond terminus below
          is the section's single closing line. */}
      <ul
        className="mt-2 [&>li:last-child]:border-b-0"
        data-reveal-group
        data-reveal-stagger="70"
        data-reveal-cap="5"
      >
        {visibleItems.map((item) => (
          <DishRow
            key={item.slug}
            item={item}
            strings={strings}
            hidden={false}
          />
        ))}
      </ul>
      {/* §3-2 terminus: the section closes on a full-width hairline with the
          copper diamond RIDING it — bg-night + px-2 mask the line behind the
          glyph so nothing clips; left-1/2 -translate-x-1/2 is symmetric
          centering (allowed), leading-none keeps the glyph's box tight. */}
      <div className="relative mt-8" aria-hidden="true">
        <hr className="hud-rule" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-night px-2 text-small leading-none text-copper/30">
          ◆
        </span>
      </div>
    </section>
  );
}
