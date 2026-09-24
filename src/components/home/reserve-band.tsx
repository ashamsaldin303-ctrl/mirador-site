// MIRADOR — ReserveBand (§4.1 §7.4): "The table is set." + sub-line + CTA pair
// + hours line. THE ENTRANCE ROUND: the closing band settles in on scroll
// over the candle-warm glow (.night-glow — the amber pooling from below the
// fold), the hairline rule draws with the block, and the hours line rides
// the block's own settle cadence.
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import type { Locale } from "@/lib/i18n";

export function ReserveBand({
  locale,
  title,
  sub,
  cta,
  quiet,
  hours,
}: {
  locale: Locale;
  title: string;
  sub: string;
  cta: string;
  quiet: string;
  hours: string;
}) {
  return (
    <section className="night-glow border-t border-line">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 py-32 text-center sm:px-6">
        <Reveal>
          <h2 className="font-display text-h2 text-ink">{title}</h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="font-sans text-body-lg text-muted">{sub}</p>
        </Reveal>
        <Reveal delay={160} className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Button variant="cta" size="full" asChild>
            <Link href={`/${locale}/reserve`}>{cta}</Link>
          </Button>
          <Button variant="quiet" asChild>
            <Link href={`/${locale}/menu`}>{quiet}</Link>
          </Button>
        </Reveal>
        <Reveal delay={240} className="flex w-full flex-col items-center gap-8">
          <hr className="hud-rule motion-safe:draw w-24" />
          <p className="font-sans text-small text-muted">{hours}</p>
        </Reveal>
      </div>
    </section>
  );
}
