"use client";
// MIRADOR — Gallery masonry grid (§4.5): CSS columns (16:9 + 4:5 mix from the
// DB intrinsics). Below-fold items stay lazy (default loading=lazy; only the
// LCP trio {0, 1, 3} are priority — D3-L3, see the tile body). Hover = film
// grain + amber hairline + a slow image scale (transform on hover only —
// never a srcset swap mid-hover). Click/
// Enter opens the lightbox. Missing images degrade to the designed bilingual
// caption card (F7-4) — never an empty box.
// §3-1/§3-2 motion map: the LCP trio {0, 1, 3} is this route's candidate set —
// fully static (no reveal attributes). Tiles 2+ carry data-reveal="mask" on the
// button (already overflow-hidden) with the inner .reveal-scale wrapper
// around the Image (clip-path bottom-up reveal + counter-scale); the caption
// fades in 120ms later. The masonry columns give natural stagger — no group.
// The hover group sits on the FIGURE so the image scale, the amber hairline
// and the caption title warm together (the figure is one visual unit);
// focus-visible stays bound to the button itself.
//
// LOOP2-I2 rebuild · TILE PARALLAX (tiles 2+ only — the LCP trio {0, 1, 3}
// (D3-L3: column-major heads incl. fire-4) stays fully static, LCP doctrine): GSAP arrives
// via the getMotion() singleton in-effect; a gsap.context (reverted on
// cleanup) builds one scrub ScrollTrigger per tile — yPercent −4→+4 on a
// scale-1.09 cover (4.5% headroom per side — no edge gaps at the extremes),
// ease none (scrub owns time), invalidateOnRefresh. NEVER created under
// reduced-motion. The CSS hover scale lives on a WRAPPER div so GSAP owns
// the Image transform alone (no transition-vs-tween fight).
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@prisma/client";
import type { Locale } from "@/lib/i18n";
import { isLadderMaster, miradorImageLoader } from "@/lib/image-loader";
import { getMotion, prefersReducedMotion, type Motion } from "@/lib/motion";
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
  // parallax anchors: the figure is the ScrollTrigger's trigger; the Image
  // element is the tween's target (GSAP owns its transform exclusively).
  const tileRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLImageElement | null>(null);
  const title = locale === "ar" ? item.titleAr : item.titleEn;
  const caption = locale === "ar" ? item.captionAr : item.captionEn;
  // D3-L3: the masonry is CSS columns (column-major fill) — the lg first
  // visual row = column heads {0, 3, 6} (sm: {0, 4}; mobile: {0}). 0/1 are the
  // DOM-order doctrine; 3 (fire-4) is the measured flagged head (loop-2
  // evidence). 4/6 stay lazy — never flagged, and eagering them would
  // pre-fetch below-fold bytes on mobile (LCP contention with tile 0).
  const lcp = index < 2 || index === 3;
  const reveal = index >= 2 && index !== 3;

  // LOOP2-I2 · the tile parallax (see file header). LCP trio {0, 1, 3} exempt;
  // RM: the tween is never created (content renders statically, fully visible).
  useEffect(() => {
    if (index < 2 || index === 3 || prefersReducedMotion()) return;
    let disposed = false;
    let ctx: ReturnType<Motion["gsap"]["context"]> | null = null;
    void getMotion().then((motion) => {
      const tile = tileRef.current;
      const media = mediaRef.current;
      if (disposed || !tile || !media) return;
      const { gsap } = motion;
      ctx = gsap.context(() => {
        gsap.fromTo(
          media,
          { yPercent: -4 },
          {
            yPercent: 4,
            scale: 1.09,
            ease: "none",
            scrollTrigger: {
              trigger: tile,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    });
    return () => {
      disposed = true;
      ctx?.revert();
    };
  }, [index]);

  return (
    <figure ref={tileRef} className="group mb-6 break-inside-avoid">
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={title}
        data-reveal={reveal ? "mask" : undefined}
        className="media-grain relative block w-full overflow-hidden border border-line bg-surface transition-colors duration-200 group-hover:border-amber focus-visible:border-amber"
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
            {/* the hover-scale WRAPPER — GSAP owns the Image transform alone;
                this div carries the pointer-time scale (CSS/conductor rule) */}
            <div className="transition-transform duration-slow group-hover:scale-[1.03]">
              <Image
                ref={mediaRef}
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
                priority={lcp}
                // R13/E79 parity (hero-stage.tsx): next/16 emits the preload
                // link for `priority` but NOT the img-level fetchPriority —
                // explicit high keeps the LCP trio ahead of the lazy queue.
                fetchPriority={lcp ? ("high" as const) : undefined}
                onError={() => setFailed(true)}
                className="h-auto w-full"
              />
            </div>
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
