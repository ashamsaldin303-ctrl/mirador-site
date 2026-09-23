// MIRADOR — Private Dining (§4.6 · §7.8): brand route. Offer block + inquiry
// form. The WhatsApp href is computed server-side (env-resolved number) and
// passed into the client island; per-field bilingual errors come from the
// shared wire schema (src/lib/validation.ts) and the API's 400 fields map.
import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/lib/i18n";
import { waHref, generalMessage } from "@/lib/whatsapp";
import { InquiryForm } from "@/components/private/inquiry-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const dict = getDictionary(locale);
  return {
    title: dict["private.h1"],
    // R11 minor: per-route OG — each door carries its own social card
    // (title/description typed to the route; image pair ships JPEG, PRF-4).
    openGraph: {
      title: dict["meta.og.private.title"],
      description: dict["meta.og.private.desc"],
    },

    alternates: {
      canonical: `/${locale}/private-dining`,
      languages: {
        en: "/en/private-dining",
        ar: "/ar/private-dining",
        "x-default": "/en/private-dining",
      },
    },
  };
}

export default async function PrivateDiningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const dict = getDictionary(locale);

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6">
      <header className="py-24 sm:py-32">
        <h1 className="font-display text-h1 text-ink">{dict["private.h1"]}</h1>
      </header>

      <section className="py-24">
        <h2 className="font-display text-h2 text-ink">{dict["private.offerTitle"]}</h2>
        <hr aria-hidden className="mt-6 w-16 border-amber" />
        <p className="mt-6 max-w-[34rem] font-sans text-body-lg text-ink/90">
          {dict["private.offerBody"]}
        </p>
      </section>

      <section className="py-24">
        <InquiryForm
          locale={locale}
          whatsappHref={waHref(generalMessage(locale))}
          partyHint={dict["private.partyHint"]}
          whatsappNote={dict["contact.whatsappNote"]}
          labels={{
            name: dict["forms.name"],
            phone: dict["forms.phone"],
            preferredDate: dict["forms.preferredDate"],
            partySize: dict["forms.partySize"],
            message: dict["forms.message"],
            submit: dict["forms.submit"],
            submitting: dict["forms.submitting"],
          }}
          errors={{
            invalidName: dict["errors.invalid_name"],
            invalidPhone: dict["errors.invalid_phone"],
            invalidDate: dict["errors.invalid_date"],
            invalidParty: dict["errors.invalid_party"],
            invalidMessage: dict["errors.invalid_message"],
            required: dict["errors.required"],
            validation: dict["errors.validation"],
            rateLimited: dict["errors.rateLimited"],
            network: dict["errors.network"],
          }}
          success={{
            message: dict["private.success"],
            referenceLabel: dict["private.successReference"],
            whatsappCta: dict["private.whatsappCta"],
          }}
        />
      </section>
    </article>
  );
}
