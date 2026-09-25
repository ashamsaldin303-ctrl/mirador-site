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
import { RouteAnnouncer } from "@/components/layout/route-announcer";
import { RevealProvider } from "@/components/system/reveal-provider";
import { ScrollArtifacts } from "@/components/system/scroll-artifacts";

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
      {/* E-HYD (re-applied loop-2; lost to the box snapshot-restore): an
          EXPLICIT <head> wrapper — React 19 refuses to manage <link>/<script>
          rendered as direct children of <html> ("outside the main document
          without knowing its precedence/order") and flags the tree as a
          hydration mismatch (6 console diagnostics on every route, VB2's
          finding). Hosting the font preloads, the deferred-font sheet and the
          two parse-time inline scripts inside a real <head> keeps the SSR
          stream and the hydrated tree identical. */}
      <head>
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
        {/* R13/E79 (run-23 lesson): the FULL display families (Fraunces + Amiri,
          below-fold h2/h3 text) ride a print-media stylesheet that flips to
          all once fetched — non-render-blocking, so the LCP's dependency
          graph carries only the eager above-fold faces. The stacks fall to
          the metric-matched fallbacks until the flip (box-stable, CLS-safe).
          The flip is wired at PARSE TIME by the inline script below (a
          hydration-attached onLoad would MISS the load event on slow
          devices — the sheet loads well before React hydrates). CSP: the
          inline script rides script-src 'unsafe-inline' — the documented
          Next Flight bootstrap allowance. */}
        {/* eslint-disable-next-line @next/next/no-css-tags -- the deferred-font
            pattern REQUIRES a manual link: the media print→all flip (parse-time
            inline script below) is impossible with imported CSS, and imported
            CSS would be render-blocking — the whole point (R13/E79 run-23). */}
        <link
          id="fonts-deferred"
          rel="stylesheet"
          href="/fonts-deferred.css"
          media="print"
          suppressHydrationWarning
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.getElementById('fonts-deferred');if(d){d.addEventListener('load',function(){d.media='all'});if(d.sheet)d.media='all';}})();",
          }}
        />
        {/* P-100 (loop-1) · THE JS GATE (spec 1-e §5.2 — the ONE canonical gate
            site-wide): parse-time attribute so reveal/hero hidden-state CSS
            only ever matches when JS is alive. No-JS browsers and crawlers see
            final-state content from the raw SSR stream. The 1400ms self-heal
            arms the hero entrance even if hydration is slow or dies — the
            composition always completes. CSP: rides the same documented
            script-src 'unsafe-inline' allowance as the fonts-deferred flip. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var h=document.documentElement;h.setAttribute('data-js','1');setTimeout(function(){var s=document.querySelector('.hero');if(s&&!s.hasAttribute('data-armed'))s.setAttribute('data-armed','1')},1400)})();",
          }}
        />
      </head>
      <body className="min-h-dvh bg-night font-sans text-ink">
        {/* P-028 (prompt-4 R11): the route announcer — soft navigations speak
            their landing title to screen readers (the aural route change). */}
        <RouteAnnouncer />
        {/* P-100 (loop-1): the reveal engine + scroll artifacts (progress
            hairline + back-to-top) — one IO site-wide, rAF-coalesced. */}
        <RevealProvider />
        <ScrollArtifacts backToTopLabel={dict["nav.backToTop"]} />
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
