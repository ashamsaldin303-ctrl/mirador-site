// MIRADOR — THE ENTRANCE ROUND · FactStrip: the house in numbers. Four
// facts — the floors, the window, the ninety seconds, the hour the doors
// open — as display numerals over micro labels, hairline-divided (the
// gap-px-on-line trick: direction-proof, no divide-* RTL questions).
// Numerals ride the DEFERRED display face (below-fold by design — the
// full families arrive via the print-media flip); Western digits (the
// locked numeral policy). Server component; settles in on scroll (Reveal).
import { Reveal } from "@/components/ui/reveal";
import type { Locale } from "@/lib/i18n";

export type Fact = { value: string; label: string };

export function FactStrip({ hud, facts }: { hud: string; facts: Fact[] }) {
  return (
    <section aria-label={hud} className="border-t border-line">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal className="mb-10 border-s border-line ps-6">
          <p className="hud-label">{hud}</p>
        </Reveal>
        <Reveal delay={80} className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-3 bg-night px-6 py-8 sm:py-10">
              <p className="font-display text-h2 tabular-nums text-amber">{fact.value}</p>
              <p className="max-w-40 text-small text-muted">{fact.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
