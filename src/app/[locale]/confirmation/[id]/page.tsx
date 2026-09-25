// MIRADOR — /confirmation/[id] (§4.3, §7.9): "The table is yours." — the
// reservation persisted (F4-5), the summary renders from the DB, the
// WhatsApp deep link is rebuilt server-side (§8.4). Unknown id → notFound()
// (the designed 404 surface). Next 16: params is a Promise — awaited (§2.4-B).
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getDictionary, type Locale } from "@/lib/i18n";
import { damascusDate, damascusTime } from "@/lib/slots";
import { confirmationMessage, waHref } from "@/lib/whatsapp";
import { ReservationSummary, WhatsAppConfirm } from "@/components/reserve/summary";
import { MetaStrip } from "@/components/system/meta-strip";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: raw, id } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  // NOTE (P-024/R3): the 404 status is committed by the PAGE's notFound() —
  // the segment's loading.tsx was removed (it flushed a 200 shell first),
  // and a notFound() thrown from generateMetadata resolves through the
  // LAYOUT-level boundary (locale-blind), while the page's throw resolves
  // through THIS segment's localized boundary.
  return {
    title: getDictionary(locale)["confirm.title"],
    // COP-2 (prompt-4 R5): guest PII surface — noindex + demotion.
    // Self-canonical ONLY; NO per-id hreflang alternates (each confirmation id
    // is a single-guest artifact, not a locale-parallel page — per-id alternates
    // made every reservation id indexable in both locales).
    robots: { index: false, follow: false },
    alternates: {
      canonical: `/${locale}/confirmation/${id}`,
    },
  };
}

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const dict = getDictionary(locale);

  const reservation = await db.reservation.findUnique({ where: { id } });
  if (!reservation) notFound();

  const date = damascusDate(reservation.slot);
  const time = damascusTime(reservation.slot);
  const href = waHref(
    confirmationMessage(locale, {
      name: reservation.name,
      partySize: reservation.partySize,
      date,
      time,
      id: reservation.id,
    }),
  );

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-8 px-4 pb-24 pt-32 sm:px-6">
      {/* P-037 primitives (R10): the confirmation arrives — the summary settles
          (600ms expo-out vertical arrival, the §2 law) and the hairline draws
          (200ms center-out). Both direction-neutral (RTL-free) + motion-safe.
          loop2-I4 (§6) — the success mark above the headline: a copper ring
          draws (600ms expo, dasharray stroke) with the amber check landing
          ~620ms behind it, and three amber motes rise once (2.4s). Jewelry
          only — the h1 text carries the meaning; the whole SVG + motes layer
          is aria-hidden. RM / no-JS: the completed mark renders instantly and
          the motes never ignite (globals.css LOOP2-I4 section). */}
      <header className="relative flex flex-col gap-6 motion-safe:settle">
        <div className="relative">
          <svg viewBox="0 0 48 48" className="size-12" aria-hidden="true">
            <circle className="confirm-ring" cx="24" cy="24" r="21" fill="none" strokeWidth="1" />
            <path
              className="confirm-check"
              d="M15 24.5 L21.5 31 L33 19"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* the three motes — one-shot embers drifting up off the mark */}
          <span className="confirm-motes" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </div>
        <h1 className="font-display text-h1 text-amber">{dict["confirm.title"]}</h1>
        <hr className="hud-rule motion-safe:draw" />
      </header>
      <ReservationSummary
        strings={{
          name: dict["confirm.name"],
          party: dict["confirm.party"],
          date: dict["confirm.date"],
          time: dict["confirm.time"],
          table: dict["confirm.table"],
          partyUnit: dict["reserve.partyUnit"],
        }}
        name={reservation.name}
        partySize={reservation.partySize}
        slot={reservation.slot}
        tableNumber={reservation.tableNumber}
      />
      {/* P-100 (design audit 2-d): the geography motif under the summary —
          floor + coords (no hours here; the guest already picked one). */}
      <MetaStrip locale={locale} />
      <WhatsAppConfirm href={href} label={dict["confirm.whatsapp"]} note={dict["contact.whatsappNote"]} />
      <p className="text-small text-muted" data-reveal="fade" data-reveal-delay="200">
        {dict["confirm.note"]}
      </p>
    </section>
  );
}
