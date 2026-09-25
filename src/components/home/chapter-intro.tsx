// MIRADOR — ChapterIntro (§4.1): editorial paragraph, generous 96–128px rhythm,
// HUD micro-label. Server component. The section is the hero scroll-cue anchor
// target (#chapter — scroll-mt-24 clears the fixed nav); the framed block
// rises as one gesture (data-reveal-group, 90ms child stagger).
// loop2-I4 (§8): the frame closes with the HUD stat row — floor · seats ·
// tables (VENUE facts; labels from the stats.* dictionary keys). SSR renders
// the finals; StatCounters (client) runs the one-shot 0→final tween off the
// group's own [data-revealed]. The row is the group's last child — it rides
// the same staggered rise before the digits start climbing.
import { getDictionary, type Locale } from "@/lib/i18n";
import { VENUE } from "@/lib/venue";
import { StatCounters } from "@/components/home/stat-counters";

export function ChapterIntro({
  locale,
  hud,
  paragraph,
}: {
  locale: Locale;
  hud: string;
  paragraph: string;
}) {
  const dict = getDictionary(locale);
  return (
    <section
      id="chapter"
      className="mx-auto w-full max-w-3xl scroll-mt-24 px-4 py-32 sm:px-6 lg:px-8"
    >
      <div className="border-s border-line ps-6 sm:ps-8" data-reveal-group data-reveal-stagger="90">
        <p className="hud-label mb-6">{hud}</p>
        <p className="font-sans text-body-lg text-ink/90">{paragraph}</p>
        <StatCounters
          stats={[
            { value: VENUE.floorNumber, label: dict["stats.floor"] },
            { value: VENUE.seats, label: dict["stats.seats"] },
            { value: VENUE.tablesPerSlot, label: dict["stats.tables"] },
          ]}
        />
      </div>
    </section>
  );
}
