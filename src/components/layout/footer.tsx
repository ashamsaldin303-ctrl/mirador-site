// MIRADOR — Footer (§4.8): wordmark · address · hours · phone/WhatsApp/email ·
// SYP indicative line · legal line. Server component; constants from venue.ts.
// P-100 (loop-1, design audit 2-d): terminal calm — color-only, no lifts (the
// ONE sanctioned exception: the legal-bar MetaStrip fades). Column 1 gains the
// quiet tagline (meta.og.description); hours split into two rows (days + times
// in ink, kitchen detail muted); the address reads text-ink/90; reservations
// links wear the quiet underline idiom (hairline → amber on hover); the legal
// bar carries the MetaStrip (floor · coords) start and the © line end; a ghost
// wordmark watermark bleeds off the grid's top edge.
import { VENUE, telHref } from "@/lib/venue";
import { waHref, generalMessage } from "@/lib/whatsapp";
import { WordmarkLockup } from "@/components/brand/wordmark-lockup";
import { MetaStrip } from "@/components/system/meta-strip";
import { getDictionary, type Locale } from "@/lib/i18n";

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
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  // Hours, split at the HUD dot separators: row 1 = days + times (the fact the
  // guest scans for), row 2 = kitchen last order + closed Monday (the detail).
  // Both verbatim from VENUE (F8-6); row 1 rides the dict's abbreviated short
  // form (hero.hoursShort) so it stays single-line at 375.
  const hoursDetail = (isAr ? VENUE.hoursAr : VENUE.hoursEn)
    .split(" · ")
    .slice(1)
    .join(" · ");

  return (
    <footer className="mt-auto border-t border-line bg-night">
      <div className="relative mx-auto grid max-w-7xl gap-12 overflow-hidden px-4 py-20 sm:px-6 lg:grid-cols-4 lg:gap-8 lg:px-8 lg:py-24">
        {/* the ghost watermark — the wordmark at 3% ink, bleeding off the top;
            loop2-I4 (§9): .watermark-shimmer breathes 0.03↔0.05 over 9s (the
            ink never quite settles — RM/no-JS hold the static 0.03) */}
        <span
          aria-hidden
          className="watermark-shimmer pointer-events-none absolute -top-6 start-4 font-display text-display-xl leading-none text-ink opacity-[0.03] select-none"
        >
          {isAr ? VENUE.nameAr : VENUE.nameEn}
        </span>

        <div className="flex flex-col gap-6">
          <div>
            <WordmarkLockup size="md" />
            <p className="mt-4 max-w-xs text-small text-muted">{dict["meta.og.description"]}</p>
          </div>
          <p className="text-micro text-muted/80">{strings.sypLine}</p>
        </div>

        <div>
          <h2 className="hud-label mb-4">{strings.addressLabel}</h2>
          <address className="text-body text-ink/90 not-italic">
            {isAr ? VENUE.addressAr : VENUE.addressEn}
          </address>
        </div>

        <div>
          <h2 className="hud-label mb-4">{strings.hoursLabel}</h2>
          <p className="text-body text-ink/90">{dict["hero.hoursShort"]}</p>
          {/* R11 minor (footer hours @375): text-balance keeps the detail row's
              wraps even on narrow phones (no orphaned fragments at 375px). */}
          <p className="mt-2 text-balance text-small text-muted">{hoursDetail}</p>
        </div>

        <div>
          <h2 className="hud-label mb-4">{strings.reservationsLabel}</h2>
          <ul className="flex flex-col gap-2 text-body">
            <li>
              <a
                href={telHref()}
                dir="ltr"
                className="min-h-11 inline-flex items-center text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-amber"
              >
                {VENUE.phone}
              </a>
            </li>
            <li>
              <a
                href={waHref(generalMessage(locale))}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 inline-flex items-center text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-amber"
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
                dir="ltr"
                className="min-h-11 inline-flex items-center text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-amber"
              >
                {VENUE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          {/* the footer's only reveal — a fade, no lift (terminal calm law) */}
          <div data-reveal="fade">
            <MetaStrip locale={locale} />
          </div>
          <p className="text-micro text-muted">{strings.legal}</p>
        </div>
      </div>
    </footer>
  );
}
