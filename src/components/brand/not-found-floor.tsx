// MIRADOR — the designed 404 brand floor (§4.8, §7.9, F11-1): night mini-poster
// + home CTA. Shared by the three not-found boundaries; locale arrives as a
// prop so each boundary picks its own resolution strategy (static default vs
// proxy-header detection — see the P-024 note in [locale]/not-found.tsx).
// P-101 (prompt-6 R8 · E98): THE UNBUILT FLOOR — the punchline: the floor
// dial stuck between plates (5 and 6 — the view you want is six floors up,
// and the dial can't get there). Two stacked numerals in the DEFERRED
// display face, overflow clip, a STATIC half-offset — a stuck dial does not
// move; that is the joke. aria-hidden stack; the H1 copy unchanged.
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDictionary, type Locale } from "@/lib/i18n";

export function NotFoundFloor({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <section className="media-grain relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <Image
        src="/img/404/night-mini.avif"
        alt={dict["meta.404.title"]}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-night/70" />
      {/* P-037 settle (R10): the floor arrives — 600ms expo-out, motion-safe. */}
      <div className="relative z-10 flex max-w-xl flex-col items-center gap-6 py-24 motion-safe:settle">
        <p className="hud-label">404 · FLOOR</p>
        {/* P-101: the stuck dial — static, clipped, aria-hidden (the H1 below
            carries the copy; the dial is the punchline, never announced) */}
        <div className="floor-dial" aria-hidden="true">
          <span>5</span>
          <span>6</span>
        </div>
        <h1 className="font-display text-h1 text-ink">{dict["meta.404.title"]}</h1>
        <p className="font-sans text-body-lg text-muted">{dict["meta.404.sub"]}</p>
        <Button variant="cta" size="full" asChild className="mt-4">
          <Link href={`/${locale}`}>{dict["meta.404.cta"]}</Link>
        </Button>
      </div>
    </section>
  );
}
