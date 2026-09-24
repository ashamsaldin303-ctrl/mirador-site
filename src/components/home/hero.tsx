// MIRADOR — Home hero (§4.1): full-bleed night-city poster (LCP element),
// dual-script wordmark lockup, hero line + CTA pair. Server component.
// THE ENTRANCE ROUND: the choreographed arrival — the poster settles
// through its dawn (scale + brightness, compositor-only), the kicker and
// lockup settle in, the hero line's WORDS rise each through its own sill
// (the window motif — clip-path masks, .hero-word in globals.css; layout
// and baselines untouched), the CTAs settle last, and the scroll cue
// arrives at the floor and breathes. Delays are inline — server-rendered,
// deterministic, ZERO client JS for the entrance. RM = the static hero,
// fully present (the media gate + the global RM block, both nets).
import { Fragment } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LadderImage } from "@/components/ui/ladder-image";
import { WordmarkLockup } from "@/components/brand/wordmark-lockup";
import type { Locale } from "@/lib/i18n";

/** The choreography (ms) — the cascade the eye meets, top to bottom. The
 *  H1 is the LCP element: its first word starts at 160ms (before the
 *  lockup finishes settling) so the largest paint is never kept waiting. */
const CUE = {
  kicker: 0,
  wordmark: 80,
  word: 160,
  stagger: 40,
  cta: 600,
  ctaQuiet: 680,
  cue: 950,
} as const;

export function Hero({
  locale,
  line,
  cta,
  quiet,
  kicker,
  scroll,
}: {
  locale: Locale;
  line: string;
  cta: string;
  quiet: string;
  kicker: string;
  scroll: string;
}) {
  const words = line.split(" ");
  return (
    <section className="media-grain relative flex min-h-svh flex-col items-center justify-center overflow-hidden">
      <LadderImage
        src="/img/hero/poster.avif"
        alt={line}
        fill
        priority
        // R13/E79: next/16 emits the preload link for `priority` but NOT the
        // img-level fetchPriority — the full-bleed poster (the LCP candidate
        // on throttled mobile) fetched at LOW priority and lantern's modeled
        // LCP waited ~3.4s behind the queue (run-19 raw). Explicit high.
        fetchPriority="high"
        sizes="100vw"
        className="object-cover motion-safe:hero-dawn"
      />
      {/* legibility scrim over full-bleed media */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/25 to-night"
      />
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 py-24 text-center sm:gap-10">
        {/* the kicker — the altitude line, first voice of the arrival */}
        <p
          className="hud-label text-amber motion-safe:settle"
          style={{ animationDelay: `${CUE.kicker}ms` }}
        >
          {kicker}
        </p>
        <div className="motion-safe:settle" style={{ animationDelay: `${CUE.wordmark}ms` }}>
          {/* the xl lockup at display-xl floors at 3.5rem ≈ 430px wide —
              edge-cropped inside 375px viewports (the section's overflow
              clip hid it). The footer's own idiom: scale down under 480px,
              authored size from min-[480px] up (transform-only — the
              settle on THIS wrapper and the scale on the lockup never
              touch the same element's transform). */}
          <WordmarkLockup size="xl" className="scale-[0.76] min-[480px]:scale-100" />
        </div>
        {/* R13/E79: font-hero rides the PRELOADED hero-line subset (the LCP
            close — the full display family still serves every other heading).
            THE ENTRANCE: each word rises through its own sill (aria-hidden —
            the h1's aria-label carries the line whole for AT). */}
        <h1 aria-label={line} className="max-w-4xl font-hero text-h1 text-ink">
          {words.map((word, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <span aria-hidden="true" className="hero-word">
                <span style={{ animationDelay: `${CUE.word + i * CUE.stagger}ms` }}>{word}</span>
              </span>
            </Fragment>
          ))}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Button
            variant="cta"
            size="full"
            asChild
            className="motion-safe:settle"
            style={{ animationDelay: `${CUE.cta}ms` }}
          >
            <Link href={`/${locale}/reserve`}>{cta}</Link>
          </Button>
          <Button
            variant="quiet"
            asChild
            className="motion-safe:settle"
            style={{ animationDelay: `${CUE.ctaQuiet}ms` }}
          >
            <Link href={`/${locale}/menu`}>{quiet}</Link>
          </Button>
        </div>
      </div>
      {/* the scroll cue — the path down to the journey; the drop-line
          arrives, then breathes forever (globals.css · .cue-line) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-3 pb-6"
      >
        <span
          className="hud-label text-amber motion-safe:arrive"
          style={{ animationDelay: `${CUE.cue}ms` }}
        >
          {scroll}
        </span>
        <span className="cue-line block h-8 w-px bg-amber" />
      </div>
    </section>
  );
}
