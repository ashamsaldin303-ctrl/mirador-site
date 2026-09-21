// MIRADOR — menu typed accessors + price formatting (SQLite JSON adaptation + §7.5 rule)
import { VENUE } from "./venue";

export const ALLERGENS = ["gluten", "dairy", "nuts", "shellfish", "fish", "egg"] as const;
export const DIET_TAGS = ["vegetarian", "vegan", "gf", "pescatarian"] as const;
export type Allergen = (typeof ALLERGENS)[number];
export type DietTag = (typeof DIET_TAGS)[number];

/** Parse the JSON-encoded allergens/dietTags column into a typed list. */
export function parseTags<T extends string>(raw: string, allowed: readonly T[]): T[] {
  try {
    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter((v): v is T => typeof v === "string" && (allowed as readonly string[]).includes(v));
  } catch {
    return [];
  }
}

export function parseAllergens(raw: string): Allergen[] {
  return parseTags(raw, ALLERGENS);
}

export function parseDietTags(raw: string): DietTag[] {
  return parseTags(raw, DIET_TAGS);
}

/** SYP = round(usd × 12500 / 500) × 500 (§7.5) */
function sypAmount(usd: number): number {
  return Math.round((usd * VENUE.sypPerUsd) / VENUE.sypRounding) * VENUE.sypRounding;
}

/** EN `$28 · 350,000 SYP` — Western digits, thousands separators. */
export function formatPriceEn(usdCents: number): string {
  const usd = usdCents / 100;
  return `$${usd.toLocaleString("en-US")} · ${sypAmount(usd).toLocaleString("en-US")} SYP`;
}

/** AR `28$ · 350,000 ل.س` — Western digits, thousands separators. */
export function formatPriceAr(usdCents: number): string {
  const usd = usdCents / 100;
  return `${usd.toLocaleString("en-US")}$ · ${sypAmount(usd).toLocaleString("en-US")} ل.س`;
}

export function formatPrice(usdCents: number, locale: "en" | "ar"): string {
  return locale === "ar" ? formatPriceAr(usdCents) : formatPriceEn(usdCents);
}
