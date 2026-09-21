"use client";
// MIRADOR — Gallery masonry grid (§4.5): CSS columns (16:9 + 4:5 mix from the
// DB intrinsics). Below-fold items stay lazy (default loading=lazy; only the
// first 2 are priority). Hover = film grain + amber hairline. Click/Enter opens
// the lightbox. Missing images degrade to the designed bilingual caption card
// (F7-4) — never an empty box.
import { useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@prisma/client";
import type { Locale } from "@/lib/i18n";
import { Lightbox } from "./lightbox";

export type GalleryStrings = {
  counter: string;
  prev: string;
  next: string;
  close: string;
  imageFail: string;
};

type TileProps = {
  item: GalleryItem;
  index: number;
  locale: Locale;
  strings: GalleryStrings;
  onOpen: (index: number) => void;
};

function GalleryTile({ item, index, locale, strings, onOpen }: TileProps) {
  const [failed, setFailed] = useState(false);
  const title = locale === "ar" ? item.titleAr : item.titleEn;
  const caption = locale === "ar" ? item.captionAr : item.captionEn;

  return (
    <figure className="mb-6 break-inside-avoid">
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={title}
        className="media-grain group relative block w-full overflow-hidden border border-line bg-surface transition-colors duration-200 outline-none hover:border-amber focus-visible:border-amber"
      >
        {failed ? (
          <span
            className="flex flex-col items-center justify-center gap-4 p-8 text-center"
            style={{ aspectRatio: `${item.width} / ${item.height}` }}
          >
            <span className="text-small text-muted">{strings.imageFail}</span>
            <span className="font-display text-h3 text-ink">{title}</span>
          </span>
        ) : (
          <Image
            src={item.imageUrl}
            alt={`${title} — ${caption}`}
            width={item.width}
            height={item.height}
            priority={index < 2}
            onError={() => setFailed(true)}
            className="h-auto w-full"
          />
        )}
      </button>
      <figcaption className="pt-4">
        <p className="font-display text-h3 text-ink">{title}</p>
        <p className="mt-1 text-small text-muted">{caption}</p>
      </figcaption>
    </figure>
  );
}

export function GalleryGrid({
  locale,
  items,
  strings,
}: {
  locale: Locale;
  items: GalleryItem[];
  strings: GalleryStrings;
}) {
  const [active, setActive] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <>
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {items.map((item, index) => (
          <GalleryTile
            key={item.id}
            item={item}
            index={index}
            locale={locale}
            strings={strings}
            onOpen={setActive}
          />
        ))}
      </div>

      <Lightbox
        open={active !== null}
        index={active ?? 0}
        items={items}
        locale={locale}
        strings={strings}
        onClose={() => setActive(null)}
        onNavigate={setActive}
      />
    </>
  );
}
