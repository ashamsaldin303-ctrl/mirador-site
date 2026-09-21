// MIRADOR — one dish row: display name, one-line desc, dual price, allergen
// chips, signature marker (amber hairline on the inline-start edge + label),
// sold-out = dimmed disabled row with its label — never hidden by state.
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { DishDTO, MenuStrings } from "./menu-client";
import { PriceTag } from "./price-tag";
import { AllergenChips } from "./allergen-chips";
import { DishOverlay } from "./dish-overlay";

export function DishRow({
  item,
  strings,
  hidden,
}: {
  item: DishDTO;
  strings: MenuStrings;
  hidden: boolean;
}) {
  return (
    // aria-disabled on listitem is a deliberate task contract (F3-4 sold-out
    // DOM assert) — every major screen reader announces it even though the
    // ARIA spec omits it from listitem's supported states.
    // eslint-disable-next-line jsx-a11y/role-supports-aria-props
    <li
      data-dish-row
      hidden={hidden || undefined}
      aria-disabled={item.isSoldOut ? "true" : undefined}
      className={cn(
        "relative border-b border-line py-6",
        item.isSignature && "ps-4",
        item.isSoldOut && "opacity-50",
      )}
    >
      {item.isSignature && (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 start-0 w-0.5 bg-amber"
        />
      )}
      <div className="flex gap-4">
        {item.imageUrl && (
          <div className="relative size-20 shrink-0 overflow-hidden rounded border border-line bg-surface">
            {/* image files land with the image agent; until then the alt text
                renders inside the hairline frame — the designed fail state */}
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-h3 text-ink">{item.name}</h3>
            <PriceTag price={item.price} />
          </div>
          <p className="mt-1 text-small text-muted">{item.desc}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <AllergenChips
              allergens={item.allergens}
              names={strings.allergenNames}
              label={strings.allergensLabel}
            />
            {item.isSignature && (
              <span className="hud-label text-amber">{strings.signature}</span>
            )}
            {item.isSoldOut && (
              <span className="hud-label text-error">{strings.soldOut}</span>
            )}
            <span className="ms-auto inline-flex">
              <DishOverlay item={item} strings={strings} />
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}
