// MIRADOR — diet filter bar: 4 toggle chips (vegetarian · vegan · gf ·
// pescatarian) + a polite live region announcing the visible-dish count.
// R11 (prompt-4): the count rides Intl.PluralRules — AR's real grammar
// (1 «طبق» · 2 «طبقان» · 3–10 «أطباق» · 11+ «طبقاً», the council's «28 طبقاً»
// example) instead of the singular/plural pair. EN: one/other.
// Presentational — state and Flip animation live in MenuClient.
import { Toggle } from "@/components/ui/toggle";
import type { DietTag } from "@/lib/menu";
import type { Locale } from "@/lib/i18n";

export type CountForms = {
  one: string;
  two: string;
  few: string;
  many: string;
  other: string;
};

/** «28 طبقاً» / "28 dishes" — the plural form for a count in the active locale. */
export function pluralUnit(locale: Locale, forms: CountForms, count: number): string {
  const cat = new Intl.PluralRules(locale === "ar" ? "ar" : "en").select(count);
  const key = cat as keyof CountForms;
  return key in forms ? forms[key] : forms.other;
}

export function DietFilterBar({
  locale,
  tags,
  active,
  onToggle,
  count,
  countForms,
  labels,
}: {
  locale: Locale;
  tags: readonly DietTag[];
  active: readonly DietTag[];
  onToggle: (tag: DietTag) => void;
  count: number;
  countForms: CountForms;
  labels: Record<DietTag, string>;
}) {
  const unit = pluralUnit(locale, countForms, count);
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
        {count} {unit}
      </p>
    </div>
  );
}
