// MIRADOR — AllergenChips: small hairline pills for the dish's allergens.
import type { Allergen } from "@/lib/menu";

export function AllergenChips({
  allergens,
  names,
  label,
}: {
  allergens: readonly Allergen[];
  names: Record<Allergen, string>;
  label: string;
}) {
  if (allergens.length === 0) return null;
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label={label}>
      {allergens.map((allergen) => (
        <li
          key={allergen}
          className="rounded-full border border-line px-2 py-1 text-micro text-muted"
        >
          {names[allergen]}
        </li>
      ))}
    </ul>
  );
}
