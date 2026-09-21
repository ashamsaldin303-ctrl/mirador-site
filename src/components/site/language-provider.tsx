"use client";

/**
 * Language provider — the bilingual execution core (§12).
 * SSR renders <html lang="ar" dir="rtl">; the initial client state matches it
 * exactly (deterministic → zero hydration mismatch). Toggling flips
 * documentElement lang/dir, and every consumer re-renders from the catalog.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Bi, Locale } from "@/lib/manual-content";

type LanguageContextValue = {
  locale: Locale;
  dir: "rtl" | "ltr";
  toggleLocale: () => void;
  /** Pick the current-language variant of a bilingual contract string. */
  t: <T>(b: Bi<T>) => T;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale((current) => (current === "ar" ? "en" : "ar"));
  }, []);

  const t = useCallback(<T,>(b: Bi<T>) => b[locale], [locale]);

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ locale, dir, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return ctx;
}
