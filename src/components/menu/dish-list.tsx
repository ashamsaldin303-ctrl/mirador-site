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
        {section.items.map((item) => (
          <DishRow
            key={item.slug}
            item={item}
            strings={strings}
            hidden={!matchesFilters(item, filters)}
          />
        ))}
      </ul>
    </section>
  );
}
