// MIRADOR — Gallery (§4.5 · §7.7): brand route, "the scenery as exhibit".
// Server Component: SSR the 8 GalleryItem rows (sortOrder asc) and hand them to
// the client masonry grid + lightbox. Captions render per locale (F7-3);
// images degrade to the designed bilingual caption card when missing (F7-4).
// P-024 (prompt-4 R9): pinned force-dynamic — gallery SSR is a JUSTIFIED ● in
// the route census (fresh DB tiles per request); without the pin the segment
// would prerender at build and freeze the exhibit.
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getDictionary, type Locale } from "@/lib/i18n";
import { MetaStrip } from "@/components/system/meta-strip";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const dict = getDictionary(locale);
  return {
    title: dict["gallery.h1"],
    // R11 minor: per-route OG — each door carries its own social card
    // (title/description typed to the route; image pair ships JPEG, PRF-4).
    openGraph: {
      title: dict["meta.og.gallery.title"],
      description: dict["meta.og.gallery.desc"],
    },

    alternates: {
      canonical: `/${locale}/gallery`,
      languages: { en: "/en/gallery", ar: "/ar/gallery", "x-default": "/en/gallery" },
    },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const dict = getDictionary(locale);

  const items = await db.galleryItem.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <header className="pt-32 pb-12">
        {/* Designed header block (§3-1 HUD motif — mirrors the menu door):
            kicker in the border-s frame → H1 (static — this route's LCP
            candidates are the first two priority tiles) → drawn rule →
            count line + MetaStrip. */}
        <div className="border-s border-line ps-6">
          <p className="hud-label" data-reveal="up">
            {dict["gallery.kicker"]}
          </p>
          <h1 className="mt-6 font-display text-h1 text-ink">
            {dict["gallery.h1"]}
          </h1>
        </div>
        <hr className="hud-rule mt-8" data-reveal="draw" />
        <p className="hud-label mt-6" data-reveal="up" data-reveal-delay="70">
          {dict["gallery.countLine"]}
        </p>
        <div className="mt-4" data-reveal="fade" data-reveal-delay="140">
          <MetaStrip locale={locale} hours={dict["hero.hoursShort"]} />
        </div>
      </header>

      <section className="pb-24">
        <GalleryGrid
          locale={locale}
          items={items}
          strings={{
            counter: dict["gallery.counter"],
            prev: dict["gallery.prev"],
            next: dict["gallery.next"],
            close: dict["gallery.close"],
            imageFail: dict["gallery.imageFail"],
            keyboardHint: dict["gallery.keyboardHint"],
          }}
        />
      </section>
    </div>
  );
}
