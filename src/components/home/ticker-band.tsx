// MIRADOR — THE ENTRANCE ROUND · TickerBand: the hours ribbon. A slow
// marquee of the house's facts (hours · altitude · the room · the kitchen ·
// the table) running between the hero and the intro — the classic luxury
// restaurant band, in the house's own locution. Pure CSS (one linear loop,
// 38s, .ticker-track in globals.css); the RTL twin runs the reading
// direction. RM = the static first copy, clipped by the band.
// DECORATIVE BY DESIGN (aria-hidden): every fact lives readably elsewhere
// (hours: ReserveBand + footer · altitude: intro paragraph + FactStrip ·
// the room: intro · the kitchen: intro · the table: ReserveBand title) —
// the band is ambience, never the only home of a fact. The duplicated row
// (the loop's seamless seam) is aria-hidden in both directions.
import type { Locale } from "@/lib/i18n";

function TickerRow({ items, hidden }: { items: string[]; hidden: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-8 pe-8">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap">
          <span className="hud-label text-muted">{item}</span>
          {/* the city's diamond — CSS-drawn, no glyph dependency */}
          <span aria-hidden="true" className="ticker-sep" />
        </span>
      ))}
    </div>
  );
}

export function TickerBand({ items }: { items: string[] }) {
  return (
    <section aria-hidden="true" className="overflow-hidden border-y border-line bg-night py-4">
      <div className="ticker-track">
        <TickerRow items={items} hidden={false} />
        <TickerRow items={items} hidden={true} />
      </div>
    </section>
  );
}
