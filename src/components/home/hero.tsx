// MIRADOR — Home hero v2 "DUSK OVER DAMASCUS" (§4.1, loop2-I1r): full-bleed
// night-city poster (LCP element), dual-script wordmark lockup, hero line +
// CTA pair + the hours · scroll-cue row, framed by the desktop chrome (rail,
// corner brackets, live Damascus clock — coords live in the bottom bracket).
// Server shell — the interactive stage (ARM / scroll parallax / pointer FX /
// ambient canvas) lives in hero-stage.tsx (client; journey.tsx precedent:
// the section ref must live client-side, so the whole <section> renders there).
import type { Locale } from "@/lib/i18n";
import { HeroStage } from "./hero-stage";

export function Hero({
  locale,
  line,
  cta,
  quiet,
  eyebrow,
  scroll,
  hoursShort,
  coords,
  rail,
  clockLabel,
  clockCity,
}: {
  locale: Locale;
  line: string;
  cta: string;
  quiet: string;
  eyebrow: string;
  scroll: string;
  hoursShort: string;
  coords: string;
  rail: string;
  clockLabel: string;
  clockCity: string;
}) {
  return (
    <HeroStage
      locale={locale}
      line={line}
      cta={cta}
      quiet={quiet}
      eyebrow={eyebrow}
      scroll={scroll}
      hoursShort={hoursShort}
      coords={coords}
      rail={rail}
      clockLabel={clockLabel}
      clockCity={clockCity}
    />
  );
}
