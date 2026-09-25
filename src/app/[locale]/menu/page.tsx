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
import { MetaStrip } from "@/components/system/meta-strip";
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
    // R11 minor: per-route OG — this door carries its own social card.
    openGraph: {
      title: dict["meta.og.menu.title"],
      description: dict["meta.og.menu.desc"],
    },
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

  // "Menu updated October 2026" — request-time month+year, server-rendered
  // only (the page is force-dynamic; the client island never re-renders this
  // node, so there is no hydration surface). ar-SY-u-nu-latn = the Damascene
  // Levantine month names (تشرين الأول) with Western digits — the site
  // numerals policy (same convention as the reserve date strip).
  const formattedDate = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-SY-u-nu-latn" : "en",
    { month: "long", year: "numeric" },
  ).format(new Date());

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
    countForms: {
      one: dict["menu.filter.countOne"],
      two: dict["menu.filter.countTwo"],
      few: dict["menu.filter.countFew"],
      many: dict["menu.filter.countMany"],
      other: dict["menu.filter.countOther"],
    },
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
        dangerouslySetInnerHTML={{
          // R11 minor: \u003c hardening — < and > escaped so the inline
          // JSON-LD can never terminate its own <script> context.
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <header className="pt-32 pb-4">
        {/* Designed header block (§3-1 HUD motif): kicker in the border-s
            frame (chapter-intro idiom) → H1 (static — this route's LCP
            candidate) → drawn rule → count line + MetaStrip. */}
        <div className="border-s border-line ps-6">
          <p className="hud-label" data-reveal="up">
            {dict["menu.kicker"]}
          </p>
          <h1 className="mt-6 font-display text-h1 text-ink">
            {dict["menu.h1"]}
          </h1>
        </div>
        <hr className="hud-rule mt-8" data-reveal="draw" />
        <p className="hud-label mt-6" data-reveal="up" data-reveal-delay="70">
          {dict["menu.countLine"]}
        </p>
        <div className="mt-4" data-reveal="fade" data-reveal-delay="140">
          <MetaStrip locale={locale} hours={dict["hero.hoursShort"]} />
        </div>
      </header>

      <MenuClient locale={locale} sections={data} strings={strings} />

      <footer className="border-t border-line py-8">
        <p className="hud-label">{dict["menu.updated"].replace("{date}", formattedDate)}</p>
        <p className="mt-3 text-small text-muted">{dict["menu.notes.currency"]}</p>
        <p className="mt-2 text-small text-muted">{dict["menu.notes.halal"]}</p>
      </footer>
    </div>
  );
}
