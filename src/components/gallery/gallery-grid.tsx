"use client";
// MIRADOR — Gallery masonry grid (§4.5): CSS columns (16:9 + 4:5 mix from the
// DB intrinsics). Below-fold items stay lazy (default loading=lazy; only the
// first 2 are priority). Hover = film grain + amber hairline + a slow image
// scale (transform on hover only — never a srcset swap mid-hover). Click/
// Enter opens the lightbox. Missing images degrade to the designed bilingual
// caption card (F7-4) — never an empty box.
// §3-1/§3-2 motion map: tiles 0–1 are this route's LCP candidates — fully
// static (no reveal attributes). Tiles 2+ carry data-reveal="mask" on the
// button (already overflow-hidden) with the inner .reveal-scale wrapper
// around the Image (clip-path bottom-up reveal + counter-scale); the caption
// fades in 120ms later. The masonry columns give natural stagger — no group.
// The hover group sits on the FIGURE so the image scale, the amber hairline
// and the caption title warm together (the figure is one visual unit);
// focus-visible stays bound to the button itself.
import { useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@prisma/client";
import type { Locale } from "@/lib/i18n";
import { isLadderMaster, miradorImageLoader } from "@/lib/image-loader";
import { Lightbox } from "./lightbox";

export type GalleryStrings = {
  counter: string;
  prev: string;
  next: string;
  close: string;
  imageFail: string;
  keyboardHint: string;
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
  // tiles 0–1 = priority images = the route's LCP candidates: NO reveal, no
  // mask, no caption delay — they paint exactly as the server sent them.
  const reveal = index >= 2;

  return (
    <figure className="group mb-6 break-inside-avoid">
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={title}
        data-reveal={reveal ? "mask" : undefined}
        className="media-grain relative block w-full overflow-hidden border border-line bg-surface transition-colors duration-200 outline-none group-hover:border-amber focus-visible:border-amber"
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
          <div className="reveal-scale">
            <Image
              src={item.imageUrl}
              alt={`${title} — ${caption}`}
              width={item.width}
              height={item.height}
              // P-082 (prompt-4 R9): the masonry tile is NEVER viewport-wide —
              // columns-1 <640px (minus 2rem page padding), 2 cols at sm, 3 cols
              // at lg inside the max-w-7xl (80rem) container. Without `sizes` the
              // optimizer assumed 100vw and shipped ~viewport-wide AVIF/WebP to
              // 375px phones (council estimate −378KB wire @375).
              sizes="(min-width: 1024px) calc((min(100vw - 4rem, 80rem) - 3rem) / 3), (min-width: 640px) calc((min(100vw - 3rem, 80rem) - 1.5rem) / 2), calc(100vw - 2rem)"
              // PRF-3: skyline masters carry the pre-graded AVIF ladder — they
              // serve rung files directly; every other tile keeps the optimizer.
              loader={isLadderMaster(item.imageUrl) ? miradorImageLoader : undefined}
              priority={index < 2}
              onError={() => setFailed(true)}
              className="h-auto w-full transition-transform duration-slow group-hover:scale-[1.03]"
            />
          </div>
        )}
      </button>
      <figcaption
        className="pt-4"
        data-reveal={reveal ? "fade" : undefined}
        data-reveal-delay={reveal ? "120" : undefined}
      >
        <p className="font-display text-h3 text-ink transition-colors group-hover:text-amber">
          {/* frame numeral 01–08 — Western digits, site numerals policy */}
          <span className="text-micro tabular-nums text-copper me-2">
            {String(index + 1).padStart(2, "0")}
          </span>
          {title}
        </p>
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
