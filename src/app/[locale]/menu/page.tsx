// MIRADOR — /menu (task route · LCP-first): no hero media, H1 leads, editorial
// calm. Server-renders all 28 dishes from the DB (F3-2), the interactive
// island (filters + overlays) hydrates on top with everything visible.
// P-024 (prompt-4 R9): pinned force-dynamic below — menu SSR is a JUSTIFIED ●
// in the route census (fresh DB data per request, the contract's own list);
// without the pin the segment would prerender at build and freeze the menu.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getDictionary, isLocale } from "@/lib/i18n";
import {
  ALLERGENS,
  formatPrice,
  parseAllergens,
  parseDietTags,
  type Allergen,
} from "@/lib/menu";
import {
  MenuClient,
  type MenuSectionDTO,
  type MenuStrings,
} from "@/components/menu/menu-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw === "ar" ? "ar" : "en";
  const dict = getDictionary(locale);
  return {
    title: dict["menu.h1"],
    alternates: {
      canonical: `/${locale}/menu`,
      languages: {
        en: "/en/menu",
        ar: "/ar/menu",
        "x-default": "/en/menu",
      },
    },
  };
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dict = getDictionary(locale);

  const sections = await db.menuSection.findMany({
    include: { items: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  const data: MenuSectionDTO[] = sections.map((section) => ({
    slug: section.slug,
    title: locale === "ar" ? section.titleAr : section.titleEn,
    items: section.items.map((item) => ({
      slug: item.slug,
      name: locale === "ar" ? item.nameAr : item.nameEn,
      desc: locale === "ar" ? item.descAr : item.descEn,
      price: formatPrice(item.priceUsd, locale),
      allergens: parseAllergens(item.allergens),
      dietTags: parseDietTags(item.dietTags),
      isSignature: item.isSignature,
      isSoldOut: item.isSoldOut,
      imageUrl: item.imageUrl,
    })),
  }));

  const allergenNames = Object.fromEntries(
    ALLERGENS.map((allergen) => [allergen, dict[`menu.allergen.${allergen}`]]),
  ) as Record<Allergen, string>;

  const strings: MenuStrings = {
    sectionsLabel: dict["menu.sections"],
    closeLabel: dict["gallery.close"],
    soldOut: dict["menu.labels.soldOut"],
    signature: dict["menu.labels.signature"],
    allergensLabel: dict["menu.labels.allergens"],
    openDish: dict["menu.filter.openDish"],
    filters: {
      vegetarian: dict["menu.filter.vegetarian"],
      vegan: dict["menu.filter.vegan"],
      gf: dict["menu.filter.gf"],
      pescatarian: dict["menu.filter.pescatarian"],
    },
    countSingular: dict["menu.filter.countSingular"],
    countPlural: dict["menu.filter.countPlural"],
    allergenNames,
  };

  // JSON-LD Menu (F11-4) — USD prices (authoritative per §7.5)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: dict["menu.h1"],
    inLanguage: locale,
    hasMenuSection: sections.map((section) => ({
      "@type": "MenuSection",
      name: locale === "ar" ? section.titleAr : section.titleEn,
      hasMenuItem: section.items.map((item) => ({
        "@type": "MenuItem",
        name: locale === "ar" ? item.nameAr : item.nameEn,
        description: locale === "ar" ? item.descAr : item.descEn,
        offers: {
          "@type": "Offer",
          price: (item.priceUsd / 100).toFixed(0),
          priceCurrency: "USD",
        },
      })),
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="pt-24">
        <h1 className="font-display text-h1 text-ink">{dict["menu.h1"]}</h1>
        <hr className="hud-rule mt-8" />
      </header>

      <MenuClient sections={data} strings={strings} />

      <footer className="border-t border-line py-8">
        <p className="text-small text-muted">{dict["menu.notes.currency"]}</p>
        <p className="mt-2 text-small text-muted">{dict["menu.notes.halal"]}</p>
      </footer>
    </div>
  );
}
