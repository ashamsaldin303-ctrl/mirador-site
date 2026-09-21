// MIRADOR — ReserveBand (§4.1 §7.4): "The table is set." + sub-line + CTA pair + hours line.
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <section className="border-t border-line">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 py-32 text-center sm:px-6">
        <h2 className="font-display text-h2 text-ink">{title}</h2>
        <p className="font-sans text-body-lg text-muted">{sub}</p>
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
        <hr className="hud-rule w-24" />
        <p className="font-sans text-small text-muted">{hours}</p>
      </div>
    </section>
  );
}
