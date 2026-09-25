// MIRADOR — DishOverlay: per-dish details dialog (shadcn Dialog composed at
// the z-40 rung — scrim + panel BOTH z-40, below toasts, above the page).
// Full name, desc, dual price, allergen table (role="table", ✓ = present /
// — = not present — bilingual marks), diet tags, signature/sold-out state.
// Esc + focus trap come from Radix Dialog primitives.
//
// LOOP2-I2 rebuild · OPEN CHOREOGRAPHY: the panel opens by CLIP —
// inset(6% 4% 8px 4%) → inset(0), 300ms expo (vertical + symmetric
// horizontal insets → RTL-blind). Content blocks (title row, description,
// allergen/meta rows, diet tags) slot-in staggered i×40ms capped at 6 via
// nth-child. The close button sits OUTSIDE the cascade (absolute, instantly
// focusable). Bespoke focus-visible overrides are GONE — the global 2px
// amber bezel (P-075) owns focus on every element in here.
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ALLERGENS } from "@/lib/menu";
import type { DishDTO, MenuStrings } from "./menu-client";
import { PriceTag } from "./price-tag";

export function DishOverlay({
  item,
  strings,
}: {
  item: DishDTO;
  strings: MenuStrings;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="quietOutline" size="flow" disabled={item.isSoldOut}>
          {strings.openDish}
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="z-40 bg-overlay" />
        <DialogPrimitive.Content
          aria-modal={true}
          className="dish-panel elev-3 scroll-thin fixed inset-x-4 top-1/2 z-40 mx-auto max-h-dvh w-full max-w-lg -translate-y-1/2 rounded-lg p-6"
        >
          <div className="dish-overlay-cascade">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <DialogTitle className="font-display text-h3 text-ink">
                {item.name}
              </DialogTitle>
              <PriceTag price={item.price} />
            </div>
            <DialogDescription className="mt-2 text-small text-muted">
              {item.desc}
            </DialogDescription>

            {(item.isSignature || item.isSoldOut) && (
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {item.isSignature && (
                  <span className="hud-label text-amber">
                    {strings.signature}
                  </span>
                )}
                {item.isSoldOut && (
                  <span className="hud-label text-error">{strings.soldOut}</span>
                )}
              </div>
            )}

            <div
              role="table"
              aria-label={strings.allergensLabel}
              className="mt-6 border-t border-line"
            >
              {ALLERGENS.map((allergen) => {
                const present = item.allergens.includes(allergen);
                return (
                  <div
                    role="row"
                    key={allergen}
                    className="flex items-center justify-between border-b border-line py-2"
                  >
                    <span role="cell" className="text-small text-muted">
                      {strings.allergenNames[allergen]}
                    </span>
                    <span
                      role="cell"
                      className={
                        present ? "text-small text-success" : "text-small text-muted"
                      }
                    >
                      {present ? "✓" : "—"}
                    </span>
                  </div>
                );
              })}
            </div>

            {item.dietTags.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {item.dietTags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-line px-2 py-1 text-micro text-muted"
                  >
                    {strings.filters[tag]}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DialogClose
            className="absolute end-4 top-4 flex size-11 items-center justify-center rounded text-muted transition-colors duration-base hover:text-ink"
          >
            <X className="size-4" strokeWidth={1.5} aria-hidden />
            <span className="sr-only">{strings.closeLabel}</span>
          </DialogClose>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
