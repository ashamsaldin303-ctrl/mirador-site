// MIRADOR — menu typed accessors + price formatting (canonical §6.1 String[]
// columns; the array-OR-json seam keeps the accessors total under either
// client shape — canonical PostgreSQL returns string[] natively)
import { VENUE } from "./venue";

export const ALLERGENS = ["gluten", "dairy", "nuts", "shellfish", "fish", "egg"] as const;
export const DIET_TAGS = ["vegetarian", "vegan", "gf", "pescatarian"] as const;
export type Allergen = (typeof ALLERGENS)[number];
export type DietTag = (typeof DIET_TAGS)[number];

/** Read the allergens/dietTags column into a typed list (native string[]). */
export function parseTags<T extends string>(raw: string[] | string, allowed: readonly T[]): T[] {
  const arr: unknown = Array.isArray(raw)
    ? raw
    : (() => {
        try {
          return JSON.parse(raw);
        } catch {
          return [];
        }
      })();
  if (!Array.isArray(arr)) return [];
  return arr.filter((v): v is T => typeof v === "string" && (allowed as readonly string[]).includes(v));
}

export function parseAllergens(raw: string[] | string): Allergen[] {
  return parseTags(raw, ALLERGENS);
}

export function parseDietTags(raw: string[] | string): DietTag[] {
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
