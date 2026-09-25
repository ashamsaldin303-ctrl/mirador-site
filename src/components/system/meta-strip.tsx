// MIRADOR — THE META STRIP (design audit §3-1): the recurring brand motif —
// geography as identity. HUD micro type, copper dot separators, tabular
// numerals, the coordinates always an LTR island (digits/degrees never
// bidi-mangle). Server component — consumes VENUE constants + dict strings.
import { VENUE } from "@/lib/venue";
import type { Locale } from "@/lib/i18n";

export function MetaStrip({
  locale,
  coords = true,
  hours,
  floor = true,
  className = "",
}: {
  locale: Locale;
  coords?: boolean;
  hours?: string;
  floor?: boolean;
  className?: string;
}) {
  const floorLabel = locale === "ar" ? VENUE.floorLabelAr : VENUE.floorLabelEn;
  const parts: { key: string; content: React.ReactNode; ltr?: boolean }[] = [];
  if (floor) parts.push({ key: "floor", content: floorLabel });
  if (coords) parts.push({ key: "coords", content: VENUE.coords, ltr: true });
  if (hours) parts.push({ key: "hours", content: hours });
  if (parts.length === 0) return null;
  return (
    <p
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-micro tabular-nums text-muted ${className}`}
    >
      {parts.map((p, i) => (
        <span key={p.key} className="flex items-center gap-x-3">
          {i > 0 ? (
            <span aria-hidden="true" className="text-copper">
              ·
            </span>
          ) : null}
          <span dir={p.ltr ? "ltr" : undefined}>{p.content}</span>
        </span>
      ))}
    </p>
  );
}
