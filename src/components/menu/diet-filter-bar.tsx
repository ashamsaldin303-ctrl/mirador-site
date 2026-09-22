// MIRADOR — diet filter bar: 4 toggle chips (vegetarian · vegan · gf ·
// pescatarian) + a polite live region announcing the visible-dish count
// ("12 dishes" / «12 طبقاً» pattern via countSingular/countPlural).
// Presentational — state and Flip animation live in MenuClient.
import { Toggle } from "@/components/ui/toggle";
import type { DietTag } from "@/lib/menu";

export function DietFilterBar({
  tags,
  active,
  onToggle,
  count,
  countSingular,
  countPlural,
  labels,
}: {
  tags: readonly DietTag[];
  active: readonly DietTag[];
  onToggle: (tag: DietTag) => void;
  count: number;
  countSingular: string;
  countPlural: string;
  labels: Record<DietTag, string>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-6">
      {tags.map((tag) => (
        <Toggle
          key={tag}
          variant="outline"
          pressed={active.includes(tag)}
          onPressedChange={() => onToggle(tag)}
          className="min-h-11 rounded-full border-line bg-transparent px-4 font-sans text-small text-muted transition-colors duration-base hover:border-amber hover:bg-transparent hover:text-ink data-[state=on]:border-amber data-[state=on]:bg-amber/10 data-[state=on]:text-amber"
        >
          {labels[tag]}
        </Toggle>
      ))}
      <p aria-live="polite" className="ms-auto text-small tabular-nums text-muted">
        {count} {count === 1 ? countSingular : countPlural}
      </p>
    </div>
  );
}
