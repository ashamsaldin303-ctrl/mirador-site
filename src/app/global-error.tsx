"use client";
// MIRADOR — global-error (§4.8, §7.9, F11-2): designed brand surface, renders its
// own <html> (it replaces the root layout). Bilingual (emergency surface),
// night mini-poster + reload.
import Image from "next/image";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-dvh bg-night font-sans text-ink antialiased">
        <section className="media-grain relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 text-center">
          <Image
            src="/img/404/night-mini.avif"
            alt="The lights flickered."
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-night/75" />
          <div className="relative z-10 flex max-w-xl flex-col items-center gap-6 py-24">
            <p className="hud-label">MIRADOR</p>
            <h1 className="font-display text-h1 text-ink">The lights flickered.</h1>
            <p className="font-sans text-body-lg text-muted">
              Something failed on our side. Reload — the city is still there.
            </p>
            <p className="font-display text-h3 text-ink" dir="rtl" lang="ar">
              ارتجّ الضوء لحظة.
            </p>
            <p className="font-sans text-small text-muted" dir="rtl" lang="ar">
              خطأ من جهتنا. أعد التحميل — المدينة ما تزال هناك.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-amber px-8 font-sans text-small font-semibold text-night hover:bg-amber/90"
            >
              Reload · أعد التحميل
            </button>
            {error.digest ? (
              <p className="sr-only">Error digest: {error.digest}</p>
            ) : null}
          </div>
        </section>
      </body>
    </html>
  );
}
