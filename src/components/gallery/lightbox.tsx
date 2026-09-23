"use client";
// MIRADOR — Gallery lightbox (§4.5, F7-1): fullscreen night view, entered
// via THE WINDOW (P-094, prompt-6 R2 · E92) — the bespoke fade entrance
// died with the migration; the window's settle descent + 100ms fade own
// the tempo, and the one close affordance (end-4, the close law) replaced
// the header's own close. Keyboard: Esc closes, ArrowLeft/ArrowRight
// navigate — mirrored in RTL, where ArrowLeft means next. Focus trap +
// initial focus from Radix. Missing images degrade to the bilingual
// caption card (F7-4).
import { useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import type { GalleryItem } from "@prisma/client";
import {
  AtTheWindow,
  AtTheWindowTitle,
  AtTheWindowDescription,
} from "@/components/ui/at-the-window";
import type { Locale } from "@/lib/i18n";
import type { GalleryStrings } from "./gallery-grid";

type LightboxProps = {
  open: boolean;
  index: number;
  items: GalleryItem[];
  locale: Locale;
  strings: GalleryStrings;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function Lightbox({
  open,
  index,
  items,
  locale,
  strings,
  onClose,
  onNavigate,
}: LightboxProps) {
  // Per-index failure memory: navigating away and back keeps the designed
  // caption card for an image that already failed — no state-reset effects.
  const [failed, setFailed] = useState<ReadonlySet<number>>(new Set());

  const total = items.length;
  const item = items[index];
  if (total === 0 || !item) return null;

  const isRtl = locale === "ar";
  const title = locale === "ar" ? item.titleAr : item.titleEn;
  const caption = locale === "ar" ? item.captionAr : item.captionEn;
  const imageFailed = failed.has(index);

  const go = (direction: 1 | -1) => {
    onNavigate((index + direction + total) % total);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.defaultPrevented) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      // RTL mirrors: the arrow pointing toward the reading start goes back.
      go(isRtl ? -1 : 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(isRtl ? 1 : -1);
    }
  };

  return (
    <AtTheWindow
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      onKeyDown={onKeyDown}
      closeLabel={strings.close}
      contentClassName="bg-night"
    >
      {/* the night view fills the window — the header, the view, the caption */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-4 border-b border-line px-4 py-3 pe-20 sm:px-6">
          <AtTheWindowTitle className="min-w-0 flex-1 truncate font-display text-h3 text-ink">
            {title}
          </AtTheWindowTitle>
          <p className="shrink-0 text-small text-muted">
            {index + 1} {strings.counter} {total}
          </p>
        </div>

        <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-8">
          {imageFailed ? (
            <div className="w-full max-w-lg border border-line bg-surface p-8 text-center">
              <p className="text-small text-muted">{strings.imageFail}</p>
              <p className="mt-4 font-display text-h3 text-ink">{title}</p>
              <p className="mt-2 text-small text-muted">{caption}</p>
            </div>
          ) : (
            <div className="media-grain relative h-full w-full">
              <Image
                src={item.imageUrl}
                alt={`${title} — ${caption}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1200px"
                onError={() =>
                  setFailed((prev) => {
                    if (prev.has(index)) return prev;
                    const next = new Set(prev);
                    next.add(index);
                    return next;
                  })
                }
                className="object-contain"
              />
            </div>
          )}
        </div>

        <div className="border-t border-line px-4 py-4 text-center sm:px-6">
          <AtTheWindowDescription className="text-small text-muted">
            {caption}
          </AtTheWindowDescription>
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label={strings.prev}
        className="absolute start-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-night/80 text-ink transition-colors duration-200 outline-none hover:border-amber "
      >
        <ChevronLeft className="size-6 rtl:-scale-x-100" strokeWidth={1.5} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label={strings.next}
        className="absolute end-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-night/80 text-ink transition-colors duration-200 outline-none hover:border-amber "
      >
        <ChevronRight className="size-6 rtl:-scale-x-100" strokeWidth={1.5} aria-hidden />
      </button>
    </AtTheWindow>
  );
}
