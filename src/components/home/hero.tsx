// MIRADOR — Home hero (§4.1, spec 1-a "The Sixth-Floor Window"): full-bleed
// night-city poster (LCP element), dual-script wordmark lockup, hero line +
// CTA pair + the bottom data strip (hours · scroll cue · coordinates).
// Server shell — the interactive stage (ARM / scroll parallax / pointer FX)
// lives in hero-stage.tsx (client; journey.tsx precedent: the section ref
// must live client-side, so the whole <section> renders there).
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
}: {
  locale: Locale;
  line: string;
  cta: string;
  quiet: string;
  eyebrow: string;
  scroll: string;
  hoursShort: string;
  coords: string;
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
    />
  );
}
