// MIRADOR — ChapterIntro (§4.1): editorial paragraph, generous 96–128px rhythm,
// HUD micro-label. Server component. THE ENTRANCE ROUND: the block settles
// in on scroll (Reveal — IO-armed, never in SSR markup) over the night's
// own ambient glow (the city's light pooling from below, .night-glow).
import { Reveal } from "@/components/ui/reveal";

export function ChapterIntro({ hud, paragraph }: { hud: string; paragraph: string }) {
  return (
    <section className="night-glow mx-auto w-full max-w-3xl px-4 py-32 sm:px-6 lg:px-8">
      <Reveal className="border-s border-line ps-6 sm:ps-8">
        <p className="hud-label mb-6">{hud}</p>
        <p className="font-sans text-body-lg text-ink/90">{paragraph}</p>
      </Reveal>
    </section>
  );
}
