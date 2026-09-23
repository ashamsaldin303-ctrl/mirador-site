// MIRADOR — /reserve (§4.3, task route): NO hero media — h1 + hairline + the
// ReserveForm client island. Time-dependent content (60-day strip starting
// today) → force-dynamic; days + initial date computed server-side so SSR and
// hydration agree. Default selected date = today when the kitchen is open,
// otherwise the first bookable day (Tuesday) — never a disabled Monday.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { damascusToday, dateStrip, isBookableDay, slotInstant } from "@/lib/slots";
// P-022 (prompt-4 R4): intent-hydrated split — this boundary SSRs the form
// shell; the ReserveForm motor imports on first interaction (see the component).
import { ReserveFormLazy as ReserveForm } from "@/components/reserve/reserve-form-lazy";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const dict = getDictionary(locale);
  return {
    title: dict["reserve.h1"],
    // R11 minor: per-route OG — each door carries its own social card
    // (title/description typed to the route; image pair ships JPEG, PRF-4).
    openGraph: {
      title: dict["meta.og.reserve.title"],
      description: dict["meta.og.reserve.desc"],
    },

    alternates: {
      canonical: `/${locale}/reserve`,
      languages: {
        en: "/en/reserve",
        ar: "/ar/reserve",
        "x-default": "/en/reserve",
      },
    },
  };
}

export default async function ReservePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const dict = getDictionary(locale);

  const days = dateStrip(60);
  // dateStrip(60) is non-empty by construction; the final ?? closes the
  // noUncheckedIndexedAccess chain (never taken in practice).
  const initialDate =
    days.find((d) => isBookableDay(slotInstant(d, "00:00"))) ?? days[0] ?? damascusToday();

  return (
    <section className="mx-auto w-full max-w-xl px-4 pb-24 pt-32 sm:px-6">
      <header className="flex flex-col gap-6">
        <h1 className="font-display text-h1">{dict["reserve.h1"]}</h1>
        <hr className="hud-rule" />
      </header>
      <ReserveForm
        locale={locale}
        days={days}
        initialDate={initialDate}
        strings={{
          name: dict["reserve.name"],
          phone: dict["reserve.phone"],
          partySize: dict["reserve.partySize"],
          date: dict["reserve.date"],
          time: dict["reserve.time"],
          submit: dict["reserve.submit"],
          submitting: dict["reserve.submitting"],
          decreaseParty: dict["reserve.decreaseParty"],
          increaseParty: dict["reserve.increaseParty"],
          partyUnit: dict["reserve.partyUnit"],
          loadingSlots: dict["reserve.loadingSlots"],
          retry: dict["reserve.retry"],
          slotSoldOut: dict["reserve.slotSoldOut"],
          slotPast: dict["reserve.slotPast"],
          largePartyNote: dict["reserve.largePartyNote"],
          largePartyLink: dict["reserve.largePartyLink"],
          tablesRemaining: dict["reserve.tablesRemaining"],
          closedMonday: dict["contact.closedMonday"],
          errors: {
            invalid_name: dict["errors.invalid_name"],
            invalid_phone: dict["errors.invalid_phone"],
            invalid_party: dict["errors.invalid_party"],
            invalid_slot: dict["errors.invalid_slot"],
            invalid_date: dict["errors.invalid_date"],
            required: dict["errors.required"],
            slotFull: dict["errors.slotFull"],
            duplicate: dict["errors.duplicate"],
            rateLimited: dict["errors.rateLimited"],
            validation: dict["errors.validation"],
            network: dict["errors.network"],
          },
        }}
      />
    </section>
  );
}
