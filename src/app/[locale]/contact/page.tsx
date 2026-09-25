// MIRADOR — Contact (§4.7 · §7.10): task route, zero hero media — the LCP is
// the H1 itself. Facts render verbatim from src/lib/venue.ts (F8-6:
// DOM-vs-constants match): hours, address, phone (tel: link), email (mailto:),
// plus the WhatsApp deep-link CTA built with waHref(generalMessage(locale)).
// Definition-list rows with hud-label labels; closed-Monday line in the
// semantic error tone.
// P-100 (loop-1, design audit 2-d): the dl rows rise as one staggered gesture
// (group 80/4); the facts carry the quiet underline idiom (hairline → amber on
// hover — color-only, no lifts); the MetaStrip closes the fact block with the
// geography motif; the CTA is the ONE Button API (cta/compact), fading in last.
import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/lib/i18n";
import { VENUE, telHref } from "@/lib/venue";
import { waHref, generalMessage } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { MetaStrip } from "@/components/system/meta-strip";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const dict = getDictionary(locale);
  return {
    title: dict["contact.h1"],
    // R11 minor: per-route OG — each door carries its own social card
    // (title/description typed to the route; image pair ships JPEG, PRF-4).
    openGraph: {
      title: dict["meta.og.contact.title"],
      description: dict["meta.og.contact.desc"],
    },

    alternates: {
      canonical: `/${locale}/contact`,
      languages: { en: "/en/contact", ar: "/ar/contact", "x-default": "/en/contact" },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const dict = getDictionary(locale);
  const isAr = locale === "ar";

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6">
      <h1 className="font-display text-h1 text-ink">{dict["contact.h1"]}</h1>

      <dl
        className="mt-12 border-t border-line"
        data-reveal-group
        data-reveal-stagger="80"
        data-reveal-cap="4"
      >
        <div className="grid gap-3 border-b border-line py-8 sm:grid-cols-4 sm:gap-8">
          <dt className="hud-label sm:pt-1">{dict["contact.hoursLabel"]}</dt>
          <dd className="sm:col-span-3">
            <p className="text-body text-ink/90">{isAr ? VENUE.hoursAr : VENUE.hoursEn}</p>
            <p className="mt-2 text-small text-error">{dict["contact.closedMonday"]}</p>
          </dd>
        </div>

        <div className="grid gap-3 border-b border-line py-8 sm:grid-cols-4 sm:gap-8">
          <dt className="hud-label sm:pt-1">{dict["contact.addressLabel"]}</dt>
          <dd className="sm:col-span-3">
            <address className="text-body not-italic text-ink/90">
              {isAr ? VENUE.addressAr : VENUE.addressEn}
            </address>
          </dd>
        </div>

        <div className="grid gap-3 border-b border-line py-8 sm:grid-cols-4 sm:gap-8">
          <dt className="hud-label sm:pt-1">{dict["contact.phoneLabel"]}</dt>
          <dd className="sm:col-span-3">
            <a
              href={telHref()}
              dir="ltr"
              className="inline-flex min-h-11 items-center text-body text-ink/90 underline decoration-line underline-offset-4 transition-colors duration-200 hover:decoration-amber"
            >
              {VENUE.phone}
            </a>
          </dd>
        </div>

        <div className="grid gap-3 border-b border-line py-8 sm:grid-cols-4 sm:gap-8">
          <dt className="hud-label sm:pt-1">{dict["contact.emailLabel"]}</dt>
          <dd className="sm:col-span-3">
            <a
              href={`mailto:${VENUE.email}`}
              dir="ltr"
              className="inline-flex min-h-11 items-center text-body text-ink/90 underline decoration-line underline-offset-4 transition-colors duration-200 hover:decoration-amber"
            >
              {VENUE.email}
            </a>
          </dd>
        </div>
      </dl>

      {/* the geography motif closes the fact block — floor · coords · hours */}
      <MetaStrip
        locale={locale}
        hours={isAr ? VENUE.hoursAr : VENUE.hoursEn}
        className="mt-8"
      />

      <div className="mt-12">
        <Button
          variant="cta"
          size="compact"
          asChild
          data-reveal="fade"
          data-reveal-delay="240"
        >
          <a href={waHref(generalMessage(locale))} target="_blank" rel="noopener noreferrer">
            {dict["contact.whatsappCta"]}
          </a>
        </Button>
      </div>
    </div>
  );
}
