// MIRADOR — ChapterIntro (§4.1): editorial paragraph, generous 96–128px rhythm,
// HUD micro-label. Server component.
export function ChapterIntro({ hud, paragraph }: { hud: string; paragraph: string }) {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-32 sm:px-6 lg:px-8">
      <div className="border-s border-line ps-6 sm:ps-8">
        <p className="hud-label mb-6">{hud}</p>
        <p className="font-sans text-body-lg text-ink/90">{paragraph}</p>
      </div>
    </section>
  );
}
