"use client";
// MIRADOR — Gallery lightbox (§4.5, F7-1): fullscreen dark dialog on the
// shadcn/Radix Dialog primitives at the z-40 rung (§5.4 z-ladder — both the
// overlay and the content are pulled down from the default z-50).
// Keyboard: Esc closes, ArrowLeft/ArrowRight navigate — mirrored in RTL, where
// ArrowLeft means next. Focus trap + initial focus are provided by Radix.
// Missing images degrade to the bilingual caption card (F7-4).
//
// LOOP2-I2 rebuild · DIRECTIONAL SLIDE: every prev/next navigation stamps
// data-dir="next|prev" on the KEYED media wrapper (React key = index, so it
// remounts and the entry animation fires). Entry: translateX(±12px · dirSign)
// scale(.97) → settle, 300ms expo — dirSign next=+1 / prev=−1, multiplied by
// --dir-sign so RTL mirrors exactly (globals.css .lb-media). RM: fade only.
// D4 focus fixes folded in: NO outline-none anywhere (the global 2px amber
// bezel owns focus); close/prev/next are 44px (size-11) rounded-full targets
// with sr-only labels and size-5 icons.
import { useState, type KeyboardEvent } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import type { GalleryItem } from "@prisma/client";
import { Dialog, DialogOverlay, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
  // Direction of the LAST navigation — stamped on the keyed media wrapper so
  // the entry slide reads with the gesture (and mirrors under RTL).
  const [dir, setDir] = useState<"next" | "prev">("next");

  const total = items.length;
  const item = items[index];
  if (total === 0 || !item) return null;

  const isRtl = locale === "ar";
  const title = locale === "ar" ? item.titleAr : item.titleEn;
  const caption = locale === "ar" ? item.captionAr : item.captionEn;
  const imageFailed = failed.has(index);

  const go = (direction: 1 | -1) => {
    setDir(direction === 1 ? "next" : "prev");
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
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogOverlay className="z-40 bg-scrim" />
        <DialogPrimitive.Content
          aria-modal={true}
          onKeyDown={onKeyDown}
          className="fixed inset-0 z-40 flex flex-col bg-night duration-200 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        >
          <div className="flex items-center gap-4 border-b border-line px-4 py-3 sm:px-6">
            <DialogTitle className="min-w-0 flex-1 truncate font-display text-h3 text-ink">
              {title}
            </DialogTitle>
            <p className="shrink-0 text-small tabular-nums text-muted">
              {index + 1} {strings.counter} {total}
            </p>
            <DialogPrimitive.Close className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-base hover:text-amber">
              <X className="size-5" strokeWidth={1.5} aria-hidden />
              <span className="sr-only">{strings.close}</span>
            </DialogPrimitive.Close>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-8">
            {imageFailed ? (
              <div
                key={index}
                data-dir={dir}
                className="lb-media w-full max-w-lg border border-line bg-surface p-8 text-center"
              >
                <p className="text-small text-muted">{strings.imageFail}</p>
                <p className="mt-4 font-display text-h3 text-ink">{title}</p>
                <p className="mt-2 text-small text-muted">{caption}</p>
              </div>
            ) : (
              // keyed by index + data-dir: every prev/next swap remounts the
              // media wrapper and .lb-media settles it directionally (300ms
              // expo, RTL-mirrored; CSS-gated, fade-only under RM).
              <div
                key={index}
                data-dir={dir}
                className="lb-media media-grain relative h-full w-full"
              >
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
            <DialogDescription className="text-small text-muted">
              {caption}
            </DialogDescription>
            {/* the keyboard contract, HUD-register — threaded from the page dict */}
            <p className="hud-label mt-2">{strings.keyboardHint}</p>
          </div>

          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute start-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors duration-base hover:text-amber"
          >
            <ChevronLeft className="size-5 rtl:-scale-x-100" strokeWidth={1.5} aria-hidden />
            <span className="sr-only">{strings.prev}</span>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute end-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors duration-base hover:text-amber"
          >
            <ChevronRight className="size-5 rtl:-scale-x-100" strokeWidth={1.5} aria-hidden />
            <span className="sr-only">{strings.next}</span>
          </button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
