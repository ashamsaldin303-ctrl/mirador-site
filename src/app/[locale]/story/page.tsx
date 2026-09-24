// MIRADOR — Story (§4.4 · §7.6): brand route, editorial-calm. 3 chapters + one
// full-bleed night image between chapters 2–3 + pull-quote. No hero, no cards.
// Typography-led: HUD micro-labels, H2 display titles, body capped at 34rem
// (brief-sanctioned §4.4). Line-heights come from the type tokens (AR auto ≥1.7,
// F8-2) — no leading-* overrides. All copy from content/{en,ar}.json.
import type { Metadata } from "next";
import { LadderImage } from "@/components/ui/ladder-image";
import { Reveal } from "@/components/ui/reveal";
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
      <header className="mx-auto max-w-3xl px-4 py-32 sm:px-6">
        <h1 className="font-display text-h1 text-ink">{dict["story.h1"]}</h1>
      </header>

      {chapters.map((chapter, i) => (
        <div key={chapter.hud}>
          {/* THE ENTRANCE ROUND (phase 2): each chapter's block rises in on
              encounter — one Reveal per chapter, the house stagger 0/80/160
              (chapter 1 rides delay 0: nearest the fold, never waits). */}
          <Reveal delay={i * 80}>
            <section className="mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32">
              <p className="hud-label">{chapter.hud}</p>
              <h2 className="mt-4 font-display text-h2 text-ink">{chapter.title}</h2>
              <p className="mt-6 max-w-[34rem] font-sans text-body-lg text-ink/90">
                {chapter.body}
              </p>
            </section>
          </Reveal>

          {i === 1 &&
            (hasNightImage ? (
              <figure className="media-grain relative h-[60vh] border-y border-line bg-surface">
                <LadderImage
                  src={NIGHT_IMAGE}
                  alt={dict["story.pullQuote"]}
                  fill
                  priority={false}
                  sizes="100vw"
                  className="object-cover"
                />
              </figure>
            ) : (
              <figure className="relative flex h-[60vh] items-center justify-center border-y border-line bg-surface px-4">
                <p className="max-w-[34rem] text-center font-display text-h2 text-amber">
                  {dict["story.pullQuote"]}
                </p>
              </figure>
            ))}
        </div>
      ))}

      {/* the closing quote — the city's light pools from below
          (night-glow) as the line rises in on encounter */}
      <section className="night-glow mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-32">
        <hr className="hud-rule" />
        <Reveal>
          <blockquote className="py-16 text-center font-display text-h2 text-amber">
            {dict["story.pullQuote"]}
          </blockquote>
        </Reveal>
        <hr className="hud-rule" />
      </section>
    </article>
  );
}
