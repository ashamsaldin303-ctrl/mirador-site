// MIRADOR — Home (§4.1): hero → chapter intro → signature journey → reserve band.
// Brand route: cinematic budget. LCP = the hero poster (priority).
import { getDictionary, isLocale } from "@/lib/i18n";
import { VENUE, siteUrl, telHref } from "@/lib/venue";
import { Hero } from "@/components/home/hero";
import { ChapterIntro } from "@/components/home/chapter-intro";
import { Journey, type Act } from "@/components/home/journey";
import { ReserveBand } from "@/components/home/reserve-band";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const dict = getDictionary(locale);
  const dir = locale === "ar" ? "ar" : "en";

  const acts: [Act, Act, Act] = [
    { numeral: dict["acts.act1.numeral"], title: dict["acts.act1.title"], copy: dict["acts.act1.copy"], image: "/img/journey/act-1.avif" },
    { numeral: dict["acts.act2.numeral"], title: dict["acts.act2.title"], copy: dict["acts.act2.copy"], image: "/img/journey/act-2.avif" },
    { numeral: dict["acts.act3.numeral"], title: dict["acts.act3.title"], copy: dict["acts.act3.copy"], image: "/img/journey/act-3.avif" },
  ];

  // JSON-LD Restaurant (F11-4) — values from the venue constants (fictional per A5)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: dir === "ar" ? VENUE.nameAr : VENUE.nameEn,
    description: dict["meta.og.description"],
    telephone: VENUE.phone,
    email: VENUE.email,
    servesCuisine: "International",
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Lighthouse Tower, Abu Rummaneh Street",
      addressLocality: "Damascus",
      addressCountry: "SY",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "18:00",
        closes: "23:30",
      },
    ],
    url: `${siteUrl()}/${locale}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // R11 minor: \u003c hardening — < and > escaped so the inline
          // JSON-LD can never terminate its own <script> context.
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <Hero locale={locale} line={dict["hero.line"]} cta={dict["hero.cta"]} quiet={dict["hero.quiet"]} />
      <ChapterIntro hud={dict["intro.hud"]} paragraph={dict["intro.paragraph"]} />
      <Journey hud={dict["journey.hud"]} acts={acts} />
      <ReserveBand
        locale={locale}
        title={dict["band.title"]}
        sub={dict["band.sub"]}
        cta={dict["band.cta"]}
        quiet={dict["hero.quiet"]}
        hours={dict["band.hours"]}
      />
    </>
  );
}
