// MIRADOR — one menu section: bilingual title, hairline, dish rows.
// P-095 (prompt-6 R4 · E94): THE FLOOR PLATE — the section header keys to
// the building's floor: the numeral (Western digits — the locked numeral
// policy; aria-hidden decoration) in the DEFERRED display face BESIDE the
// existing title, the hairline at the plate's base drawing on reveal
// (the draw verb, 200ms — mount-time, SSR-only, zero client JS). The
// section element is the anchor target for the sticky section nav
// (scroll-mt-32 clears the fixed header + stuck bar).
import type { DietTag } from "@/lib/menu";
import type { MenuSectionDTO, MenuStrings } from "./menu-client";
import { matchesFilters } from "./menu-client";
import { DishRow } from "./dish-row";

export function DishList({
  section,
  floor,
  strings,
  filters,
}: {
  section: MenuSectionDTO;
  floor: number;
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
      <div className="flex items-baseline gap-4">
        {/* the floor numeral — decoration (aria-hidden): the H2 remains the
            section's accessible title; the numeral rides the deferred face */}
        <span
          aria-hidden="true"
          className="font-display text-h3 tabular-nums text-amber"
        >
          {floor}
        </span>
        <h2
          id={`${section.slug}-title`}
          className="font-display text-h2 text-ink"
        >
          {section.title}
        </h2>
      </div>
      {/* the hairline at the plate's base — the draw verb on plate reveal */}
      <hr className="hud-rule motion-safe:draw mt-6" />
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
