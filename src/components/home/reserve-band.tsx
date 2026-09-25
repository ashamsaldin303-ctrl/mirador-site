// MIRADOR — ReserveBand (§4.1 §7.4): the home page's final act — "The table
// is set." + sub-line + CTA pair + hours line. Professionalized per spec 2-a:
// HUD kicker (chapter-intro frame motif), the second display moment (text-h1;
// the AR token bump carries Arabic presence), the 0/70/140/210/280 reveal
// cascade (individual data-reveal attributes — NO group, so the draw rule and
// the fades never double-animate), and the lamp-dot ember on the hours line.
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

export function ReserveBand({
  locale,
  kicker,
  title,
  sub,
  cta,
  quiet,
  hours,
}: {
  locale: Locale;
  kicker: string;
  title: string;
  sub: string;
  cta: string;
  quiet: string;
  hours: string;
}) {
  return (
    <section className="border-t border-line">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 py-32 text-center sm:px-6">
        <p className="hud-label border-s border-line ps-6" data-reveal="fade">
          {kicker}
        </p>
        <h2 className="font-display text-h1 text-ink" data-reveal="up">
          {title}
        </h2>
        <p className="font-sans text-body-lg text-muted" data-reveal="up" data-reveal-delay="70">
          {sub}
        </p>
        <div
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
          data-reveal="up"
          data-reveal-delay="140"
        >
          <Button variant="cta" size="full" asChild>
            <Link href={`/${locale}/reserve`}>{cta}</Link>
          </Button>
          <Button variant="quiet" asChild>
            <Link href={`/${locale}/menu`}>{quiet}</Link>
          </Button>
        </div>
        <hr className="hud-rule w-24" data-reveal="draw" data-reveal-delay="210" />
        <p
          className="lamp-dot font-sans text-small text-muted"
          data-reveal="fade"
          data-reveal-delay="280"
        >
          {hours}
        </p>
      </div>
    </section>
  );
}
