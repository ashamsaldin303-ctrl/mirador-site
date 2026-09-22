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
        <h1 className="max-w-4xl font-display text-h1 text-ink">{line}</h1>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Button
            asChild
            className="min-h-11 rounded-full bg-amber px-8 font-sans text-small font-semibold text-night hover:bg-amber/90"
          >
            <Link href={`/${locale}/reserve`}>{cta}</Link>
          </Button>
          <Link
            href={`/${locale}/menu`}
            className="inline-flex min-h-11 items-center text-small text-muted underline decoration-line underline-offset-8 transition-colors duration-200 hover:text-ink hover:decoration-amber"
          >
            {quiet}
          </Link>
        </div>
      </div>
    </section>
  );
}
