// MIRADOR — [locale] ROOT layout (Next i18n pattern): renders <html lang dir>,
// preloads display+body font weights per active locale (§5.3), mounts the global
// shell (Nav / Footer / Lenis+GSAP). Locale validity is guarded → notFound().
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { isLocale, localeDir, getDictionary, LOCALES, type Locale } from "@/lib/i18n";
import { siteUrl } from "@/lib/venue";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { SmoothScroll } from "@/components/layout/smooth-scroll";

export const viewport: Viewport = {
  themeColor: "rgb(10 10 11)", // --color-night, rgb form (G2-safe)
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const dict = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: dict["meta.og.title"],
      template: `%s — ${locale === "ar" ? "ميرادور" : "MIRADOR"}`,
    },
    description: dict["meta.og.description"],
    openGraph: {
      type: "website",
      siteName: "MIRADOR",
      title: dict["meta.og.title"],
      description: dict["meta.og.description"],
      // PRF-4 (prompt-4 R6): JPEG — social crawlers (facebookexternalhit /
      // Twitterbot / WhatsApp preview) do not decode AVIF; the pair ships
      // 1200×630 JPEG so the preview card renders everywhere.
      images: [
        {
          url: `/img/og/og-image-${locale}.jpg`,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: dict["meta.og.title"],
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
        "x-default": "/en",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dir = localeDir(locale);
  const dict = getDictionary(locale);

  const fontPreloads =
    locale === "ar"
      ? [
          // R9 (P-082/P-025): preload the WORDMARK face (nav lockup, 6,020B) — the
          // full Amiri display face arrives via swap for headings. Body stays.
          { href: "/fonts/amiri-wordmark-arabic.woff2", as: "font" },
          { href: "/fonts/plex-arabic-400-arabic.woff2", as: "font" },
        ]
      : [
          // R9: same rule EN — wordmark subset (7,176B) over the full Fraunces.
          { href: "/fonts/fraunces-wordmark-latin.woff2", as: "font" },
          { href: "/fonts/instrument-sans-var-latin.woff2", as: "font" },
        ];

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      {fontPreloads.map((f) => (
        <link
          key={f.href}
          rel="preload"
          href={f.href}
          as={f.as}
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
      <body className="min-h-dvh bg-night font-sans text-ink">
        <SmoothScroll>
          <div className="flex min-h-dvh flex-col">
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-50 focus:rounded-full focus:bg-amber focus:px-4 focus:py-2 focus:text-small focus:font-semibold focus:text-night"
            >
              {dict["nav.skip"]}
            </a>
            <Nav
              locale={locale}
              strings={{
                home: dict["nav.home"],
                menu: dict["nav.menu"],
                story: dict["nav.story"],
                gallery: dict["nav.gallery"],
                privateDining: dict["nav.privateDining"],
                contact: dict["nav.contact"],
                cta: dict["nav.cta"],
                localeSwitch: dict["nav.localeSwitch"],
                openMenu: dict["nav.openMenu"],
                closeMenu: dict["nav.closeMenu"],
              }}
            />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer
              locale={locale}
              strings={{
                legal: dict["footer.legal"],
                hoursLabel: dict["footer.hoursLabel"],
                addressLabel: dict["footer.addressLabel"],
                reservationsLabel: dict["footer.reservationsLabel"],
                sypLine: dict["footer.sypLine"],
                whatsappCta: dict["contact.whatsappCta"],
                whatsappNote: dict["contact.whatsappNote"],
              }}
            />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
