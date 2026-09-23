// MIRADOR — DishOverlay (P-100 · prompt-6 R3 · E93): the dish composes ON
// THE WINDOW (P-094) — the plate at the window. The dish image is staged
// on the lower third (a table by the window), the horizon hairline behind
// it (the primitive's own datum line), the allergen/diet facts as the
// quiet view notes above. Pure composition — the existing image machinery
// (plain next/image through the optimizer — the MENU MASTERS CARRY NO
// LADDER: the pre-graded rungs exist only for hero/journey/story/skyline,
// so the ladder loader would request nonexistent -750w rungs on mobile —
// the dev log caught the 404s) + the existing allergen table (role="table")
// — no new JS logic, no new deps. The zoom entrance died with the migration
// (E92); the window's settle descent + 100ms fade own the tempo now.
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  AtTheWindow,
  AtTheWindowTitle,
  AtTheWindowDescription,
} from "@/components/ui/at-the-window";
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
    <AtTheWindow
      trigger={
        <Button variant="quietOutline" size="flow" disabled={item.isSoldOut}>
          {strings.openDish}
        </Button>
      }
      closeLabel={strings.closeLabel}
    >
      {/* the plate at the window: the view notes (the dish's facts) above,
          the dish itself staged on the lower third — a framed photograph
          standing on the sill, the horizon line (the primitive's datum)
          behind it. The column anchors to the view's base (mt-auto — the
          classic safe pattern: the auto margin collapses when content
          overflows, so the pane scrolls normally) */}
      <div className="mx-auto mt-auto w-full max-w-lg px-4 pb-24 sm:px-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <AtTheWindowTitle className="font-display text-h3 text-ink">
              {item.name}
            </AtTheWindowTitle>
            <PriceTag price={item.price} />
          </div>
          <AtTheWindowDescription className="text-small text-muted">
            {item.desc}
          </AtTheWindowDescription>

          {(item.isSignature || item.isSoldOut) && (
            <div className="flex flex-wrap items-center gap-4">
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
        </div>

        {/* the quiet view notes — the allergen table + diet tags, unchanged
            semantics (role="table" rows, the bilingual marks) */}
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

        {/* the dish staged on the lower third — the table by the window:
            the portrait master at its own 4:5 aspect (no crop), width-
            bounded, standing on the sill; the horizon behind it. Plain
            next/image → the optimizer serves the right-sized AVIF rung
            (the menu masters carry no pre-graded ladder — dev-log caught
            the -750w 404s the ladder loader would request) */}
        {item.imageUrl && (
          <div className="media-grain mx-auto mt-6 w-48 overflow-hidden rounded-sm border border-line bg-surface sm:w-56">
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={1080}
              height={1350}
              sizes="224px"
              className="h-auto w-full"
            />
          </div>
        )}
      </div>
    </AtTheWindow>
  );
}
