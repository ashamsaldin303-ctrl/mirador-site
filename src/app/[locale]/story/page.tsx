// MIRADOR — Story (§4.4 · §7.6): brand route, editorial-calm. 3 chapters + one
// full-bleed night image between chapters 2–3 + pull-quote. No hero, no cards.
// Typography-led: HUD micro-labels, H2 display titles, body capped at 34rem
// (brief-sanctioned §4.4). Line-heights come from the type tokens (AR auto ≥1.7,
// F8-2) — no leading-* overrides. All copy from content/{en,ar}.json.
// P-100 (loop-1, design audit 2-d): each chapter opens in the editorial kicker
// frame (border-s + ps-6, the chapter-intro idiom) with a ghost numeral behind
// the display title; the night figure wears the mask reveal (clip-path wipe +
// reveal-scale settle) and carries an overlaid HUD caption; the pull-quote is
// ink (amber is earned by CTA/active/signature/success only) between centered
// copper ticks — the page's ONE settle is its signature line.
import type { Metadata } from "next";
import { LadderImage } from "@/components/ui/ladder-image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getDictionary, type Locale } from "@/lib/i18n";

const NIGHT_IMAGE = "/img/story/night.avif";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const dict = getDictionary(locale);
  return {
    title: dict["story.h1"],
    // R11 minor: per-route OG — each door carries its own social card
    // (title/description typed to the route; image pair ships JPEG, PRF-4).
    openGraph: {
      title: dict["meta.og.story.title"],
      description: dict["meta.og.story.desc"],
    },

    alternates: {
      canonical: `/${locale}/story`,
      languages: { en: "/en/story", ar: "/ar/story", "x-default": "/en/story" },
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const dict = getDictionary(locale);

  const chapters = [
    { hud: dict["story.ch1.hud"], title: dict["story.ch1.title"], body: dict["story.ch1.body"] },
    { hud: dict["story.ch2.hud"], title: dict["story.ch2.title"], body: dict["story.ch2.body"] },
    { hud: dict["story.ch3.hud"], title: dict["story.ch3.title"], body: dict["story.ch3.body"] },
  ];

  // SSR-true image-fail detection (§6.6): the night poster is referenced before
  // the image agent lands it at public/img/story/night.avif. When missing, the
  // full-bleed block degrades to the designed night-tinted surface carrying the
  // pull-quote — never an empty box. Dev renders per request, so the real image
  // takes over the moment the file appears.
  const hasNightImage = existsSync(join(process.cwd(), "public", NIGHT_IMAGE));

  return (
    <article>
      <header className="mx-auto max-w-3xl px-4 pt-32 sm:px-6">
        {/* pt-32 pb-0 — chapter 1's own padding owns the gap below the H1. */}
        <h1 className="font-display text-h1 text-ink">{dict["story.h1"]}</h1>
      </header>

      {chapters.map((chapter, i) => (
        <div key={chapter.hud}>
          <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32">
            {/* The editorial kicker frame (chapter-intro idiom) carries the whole
                chapter; the ghost numeral sits behind the display title. */}
            <div className="border-s border-line ps-6 sm:ps-8">
              <p className="hud-label" data-reveal="fade">
                {chapter.hud}
              </p>
              <div className="relative mt-4">
                <span aria-hidden className="ghost-numeral">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2
                  className="relative z-10 font-display text-h2 text-ink"
                  data-reveal="up"
                  data-reveal-delay="70"
                >
                  {chapter.title}
                </h2>
              </div>
              <p
                className="mt-6 max-w-[34rem] font-sans text-body-lg text-ink/90"
                data-reveal="up"
                data-reveal-delay="140"
              >
                {chapter.body}
              </p>
            </div>
          </section>

          {i === 1 &&
            (hasNightImage ? (
              <figure
                className="media-grain relative h-[60vh] overflow-hidden border-y border-line bg-surface"
                data-reveal="mask"
              >
                <div className="reveal-scale absolute inset-0">
                  <LadderImage
                    src={NIGHT_IMAGE}
                    alt={dict["story.figureAlt"]}
                    fill
                    priority={false}
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                {/* bottom-start overlaid HUD micro on a night scrim — the mask
                    wipe (bottom-up) delivers the caption with the frame edge. */}
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/70 to-transparent p-4 text-start hud-label">
                  {dict["story.figureCaption"]}
                </figcaption>
              </figure>
            ) : (
              <figure className="relative flex h-[60vh] items-center justify-center border-y border-line bg-surface px-4">
                <p className="max-w-[34rem] text-center font-display text-h2 text-ink">
                  {dict["story.pullQuote"]}
                </p>
              </figure>
            ))}
        </div>
      ))}

      <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32">
        {/* The pull-quote: ink, not amber (amber is earned by CTA/active/
            signature/success only), between centered copper ticks. The ONE
            settle on this page — its signature line. */}
        <span
          aria-hidden
          data-reveal="draw"
          className="mx-auto block w-24 border-t border-copper/60"
        />
        <blockquote
          className="py-16 text-center font-display text-h2 text-ink"
          data-reveal="settle"
        >
          {dict["story.pullQuote"]}
        </blockquote>
        <span
          aria-hidden
          data-reveal="draw"
          className="mx-auto block w-24 border-t border-copper/60"
        />
      </section>
    </article>
  );
}
