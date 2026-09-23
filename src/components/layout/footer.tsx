// MIRADOR — Footer (§4.8): wordmark · address · hours · phone/WhatsApp/email ·
// SYP indicative line · legal line. Server component; constants from venue.ts.
import { VENUE, telHref } from "@/lib/venue";
import { waHref, generalMessage } from "@/lib/whatsapp";
import { WordmarkLockup } from "@/components/brand/wordmark-lockup";
import type { Locale } from "@/lib/i18n";

export type FooterStrings = {
  legal: string;
  hoursLabel: string;
  addressLabel: string;
  reservationsLabel: string;
  sypLine: string;
  whatsappCta: string;
  whatsappNote: string;
};

export function Footer({ locale, strings }: { locale: Locale; strings: FooterStrings }) {
  const dir = locale === "ar" ? "ar" : "en";
  return (
    <footer className="mt-auto border-t border-line bg-night">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:gap-8 lg:px-8">
        <div className="flex flex-col gap-6">
          <WordmarkLockup size="md" />
          <p className="text-small text-muted">{strings.sypLine}</p>
        </div>

        <div>
          <h2 className="hud-label mb-4">{strings.addressLabel}</h2>
          <address className="text-body text-muted not-italic">
            {dir === "ar" ? VENUE.addressAr : VENUE.addressEn}
          </address>
        </div>

        <div>
          <h2 className="hud-label mb-4">{strings.hoursLabel}</h2>
          {/* R11 minor (footer hours @375): the hours line carries the kitchen
              detail — text-balance keeps the wraps even on narrow phones
              (no orphaned fragments at 375px). */}
          <p className="text-balance text-body text-muted">
            {dir === "ar" ? VENUE.hoursAr : VENUE.hoursEn}
          </p>
        </div>

        <div>
          <h2 className="hud-label mb-4">{strings.reservationsLabel}</h2>
          <ul className="flex flex-col gap-2 text-body">
            <li>
              <a
                href={telHref()}
                className="min-h-11 inline-flex items-center text-muted transition-colors hover:text-ink"
                dir="ltr"
              >
                {VENUE.phone}
              </a>
            </li>
            <li>
              <a
                href={waHref(generalMessage(locale))}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 inline-flex items-center text-muted transition-colors hover:text-ink"
              >
                {strings.whatsappCta}
              </a>
              {/* R11 minor: the WhatsApp egress disclosure — the handoff leaves
                  the house (external app). */}
              <p className="text-micro text-muted">{strings.whatsappNote}</p>
            </li>
            <li>
              <a
                href={`mailto:${VENUE.email}`}
                className="min-h-11 inline-flex items-center text-muted transition-colors hover:text-ink"
                dir="ltr"
              >
                {VENUE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-small text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{strings.legal}</p>
        </div>
      </div>
    </footer>
  );
}
