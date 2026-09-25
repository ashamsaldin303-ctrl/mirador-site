// MIRADOR — ChapterIntro (§4.1): editorial paragraph, generous 96–128px rhythm,
// HUD micro-label. Server component. The section is the hero scroll-cue anchor
// target (#chapter — scroll-mt-24 clears the fixed nav); the framed block
// rises as one gesture (data-reveal-group, 90ms child stagger).
export function ChapterIntro({ hud, paragraph }: { hud: string; paragraph: string }) {
  return (
    <section
      id="chapter"
      className="mx-auto w-full max-w-3xl scroll-mt-24 px-4 py-32 sm:px-6 lg:px-8"
    >
      <div className="border-s border-line ps-6 sm:ps-8" data-reveal-group data-reveal-stagger="90">
        <p className="hud-label mb-6">{hud}</p>
        <p className="font-sans text-body-lg text-ink/90">{paragraph}</p>
      </div>
    </section>
  );
}
