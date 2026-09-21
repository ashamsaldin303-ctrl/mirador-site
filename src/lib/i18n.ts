// MIRADOR — i18n dictionary contract (§7.11: flat { "key": "string" }, namespaces per §7)
import en from "../../content/en.json";
import ar from "../../content/ar.json";

export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export type Dictionary = typeof en;

// compile-time AR/EN structural parity (missing keys fail typecheck)
const _arParity: Dictionary = ar;

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return locale === "ar" ? ar : en;
}

export function localeDir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "ar" : "en";
}

export { _arParity };
