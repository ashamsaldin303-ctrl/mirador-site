// MIRADOR — the honest-404 boundary (R3/B-1 + P-024): catches notFound() from
// the [...rest] catch-all — every unmatched /[locale]/* URL lands HERE with
// its HTTP 404 + the DESIGNED localized floor. This segment is justified-
// dynamic (it matches every unknown path); the proxy header resolves the
// locale because not-found boundaries receive no params.
import { headers } from "next/headers";
import { isLocale } from "@/lib/i18n";
import { NotFoundFloor } from "@/components/brand/not-found-floor";

export default async function NotFound() {
  const h = await headers();
  const raw = h.get("x-mirador-locale") ?? "en";
  const locale = isLocale(raw) ? raw : "en";
  return <NotFoundFloor locale={locale} />;
}