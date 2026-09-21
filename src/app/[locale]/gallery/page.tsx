// MIRADOR — Gallery (§4.5 · §7.7): brand route, "the scenery as exhibit".
// Server Component: SSR the 8 GalleryItem rows (sortOrder asc) and hand them to
// the client masonry grid + lightbox. Captions render per locale (F7-3);
// images degrade to the designed bilingual caption card when missing (F7-4).
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getDictionary, type Locale } from "@/lib/i18n";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  return {
    title: getDictionary(locale)["gallery.h1"],
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
      <header className="py-24 sm:py-32">
        <h1 className="font-display text-h1 text-ink">{dict["gallery.h1"]}</h1>
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
          }}
        />
      </section>
    </div>
  );
}
