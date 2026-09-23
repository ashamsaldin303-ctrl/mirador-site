// MIRADOR — sitemap.xml (R11 minor): both locales × the seven indexable
// content routes. Confirmation ids are per-guest PII (COP-2 noindex) and the
// API routes are not documents — neither belongs here. PLACEHOLDER origin
// policy: URLs render against NEXT_PUBLIC_SITE_URL (venue.siteUrl()).
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/venue";

const ROUTES = ["", "menu", "story", "gallery", "reserve", "private-dining", "contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return ROUTES.flatMap((route) =>
    (["en", "ar"] as const).map((locale) => ({
      url: `${base}/${locale}${route ? `/${route}` : ""}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
  );
}
