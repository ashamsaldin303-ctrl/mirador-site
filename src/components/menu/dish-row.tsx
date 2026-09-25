// MIRADOR — one dish row: name, one-line desc, dual price, allergen chips,
// signature marker (copper glyph + amber hairline on the inline-start edge +
// label), sold-out = dimmed disabled row with its label — never hidden by
// state.
// §3-1/§3-2 register (design audit): the name/desc block + price sit on a
// 2-column baseline grid so the price column snaps flush to the inline-end
// edge down the whole section (PriceTag is tabular-nums; the dual strings
// share one visual rhythm). Signature dishes are the ONLY display-face rows
// (font-display); every other name is font-sans font-medium at text-body-lg
// — display type stays scarce, so signatures read as events.
// Hover life (LOOP2-I2 rebuild): on hover/focus-within the INNER parts
// perform — the plate scales 1→1.04 (350ms expo, direction-neutral), the
// price nudges 2px toward the reading direction (translateX · --dir-sign),
// a copper hairline draws under the name from the inline-start edge
// (200ms, [dir=rtl] origin twin), and the title ink lifts ink/85→ink. The
// row itself carries NO transform (the gsap Flip filter choreography owns
// its layout); sold-out rows are excluded (:not([aria-disabled])) — their
// state stays a fact, not a performance. RM: color/wash only survive.
// Rows NEVER carry data-reveal — the section ul is the reveal group; rows
// mounting after a diet filter must appear instantly.
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
    // Hover wash lives on ::before (not bg-color on the li): the reveal
    // engine staggers group children via INLINE transition-delay, which is
    // non-inherited — a pseudo-element's own class-defined transition keeps
    // the 100ms hover response the row promises (a li-level transition would
    // inherit the stale 0–350ms reveal stagger and feel dead). transform/
    // opacity only; -z-10 + isolate keep the wash strictly behind content.
    // eslint-disable-next-line jsx-a11y/role-supports-aria-props
    <li
      data-dish-row
      hidden={hidden || undefined}
      aria-disabled={item.isSoldOut ? "true" : undefined}
      className={cn(
        "group relative isolate border-b border-line py-6",
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-surface/50 before:opacity-0 before:transition-opacity before:duration-fast hover:before:opacity-100 focus-within:before:opacity-100",
        item.isSignature && "ps-4",
        item.isSoldOut && "opacity-60",
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
          <div className="dish-plate relative size-20 shrink-0 overflow-hidden rounded border border-line bg-surface">
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
          {/* name/desc block + price: the 2-column baseline grid — the price
              track (minmax 13ch) hugs the inline-end edge, so dual prices
              align vertically down the section in both directions. */}
          <div className="grid grid-cols-[1fr_minmax(13ch,auto)] items-baseline gap-x-6">
            <div className="min-w-0">
              <h3
                className={cn(
                  "dish-title text-body-lg",
                  item.isSignature ? "font-display" : "font-sans font-medium",
                )}
              >
                {item.isSignature && (
                  <span aria-hidden="true" className="text-copper me-2">
                    ◆
                  </span>
                )}
                <span
                  className={cn(
                    item.isSoldOut ? "text-muted" : "dish-name-line inline-block",
                  )}
                >
                  {item.name}
                </span>
              </h3>
              <p className="mt-1 text-small text-muted">{item.desc}</p>
            </div>
            <PriceTag
              price={item.price}
              className={cn(
                "dish-price justify-self-end transition-colors",
                item.isSoldOut ? "text-muted" : "group-hover:text-amber",
              )}
            />
          </div>
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
              // sold-out label keeps its full error contrast — the row dims,
              // the state stays a fact
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
