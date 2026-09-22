// MIRADOR — one menu section: bilingual title, hairline, dish rows.
// The section element is the anchor target for the sticky section nav
// (scroll-mt-32 clears the fixed header + stuck bar).
import type { DietTag } from "@/lib/menu";
import type { MenuSectionDTO, MenuStrings } from "./menu-client";
import { matchesFilters } from "./menu-client";
import { DishRow } from "./dish-row";

export function DishList({
  section,
  strings,
  filters,
}: {
  section: MenuSectionDTO;
  strings: MenuStrings;
  filters: readonly DietTag[];
}) {
  // FRM-1 (prompt-4 R6, NEVER-8): a filter that empties this section renders
  // NOTHING — no stub heading over an empty list. Sold-out rows are state, not
  // filters — they stay (dimmed) inside surviving sections.
  const visibleItems = section.items.filter((item) => matchesFilters(item, filters));
  if (visibleItems.length === 0) return null;

  return (
    <section
      id={section.slug}
      aria-labelledby={`${section.slug}-title`}
      className="scroll-mt-32 py-24"
    >
      <h2
        id={`${section.slug}-title`}
        className="font-display text-h2 text-ink"
      >
        {section.title}
      </h2>
      <hr className="hud-rule mt-6" />
      <ul className="mt-2">
        {visibleItems.map((item) => (
          <DishRow
            key={item.slug}
            item={item}
            strings={strings}
            hidden={false}
          />
        ))}
      </ul>
    </section>
  );
}
