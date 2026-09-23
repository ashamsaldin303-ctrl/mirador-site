// MIRADOR — Home hero (§4.1): full-bleed night-city poster (LCP element),
// dual-script wordmark lockup, hero line + CTA pair. Server component.
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LadderImage } from "@/components/ui/ladder-image";
import { WordmarkLockup } from "@/components/brand/wordmark-lockup";
import type { Locale } from "@/lib/i18n";

export function Hero({
  locale,
  line,
  cta,
  quiet,
}: {
  locale: Locale;
  line: string;
  cta: string;
  quiet: string;
}) {
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
        className="object-cover"
      />
      {/* legibility scrim over full-bleed media */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/25 to-night"
      />
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 py-24 text-center sm:gap-10">
        <WordmarkLockup size="xl" />
        {/* R13/E79: font-hero rides the PRELOADED hero-line subset (the LCP
            close — the full display family still serves every other heading) */}
        <h1 className="max-w-4xl font-hero text-h1 text-ink">{line}</h1>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Button variant="cta" size="full" asChild>
            <Link href={`/${locale}/reserve`}>{cta}</Link>
          </Button>
          <Button variant="quiet" asChild>
            <Link href={`/${locale}/menu`}>{quiet}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
