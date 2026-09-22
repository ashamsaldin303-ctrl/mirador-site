// MIRADOR — confirmation 404 boundary (COP-2 + P-024): a bad/expired
// reservation id calls notFound() from the confirmation page — this segment
// is already force-dynamic (per-id lookup), so the localized floor resolves
// its locale from the proxy header here without taxing any static sibling.
import { headers } from "next/headers";
import { isLocale } from "@/lib/i18n";
import { NotFoundFloor } from "@/components/brand/not-found-floor";

export default async function NotFound() {
  const h = await headers();
  const raw = h.get("x-mirador-locale") ?? "en";
  const locale = isLocale(raw) ? raw : "en";
  return <NotFoundFloor locale={locale} />;
}