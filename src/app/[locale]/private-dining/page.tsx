// MIRADOR — Private Dining (§4.6 · §7.8): brand route. Offer block + room
// figure + inquiry form. The WhatsApp href is computed server-side (env-resolved
// number) and passed into the client island; per-field bilingual errors come from
// the shared wire schema (src/lib/validation.ts) and the API's 400 fields map.
// P-100 (loop-1, design audit 2-d): the offer keeps its amber rule (normalized
// w-12) with up/draw/up reveals; a mask-revealed room figure (the ONLY new
// image — /img/gallery/room-7.avif, existing) bridges offer → form; the form
// section gains its kicker-frame heading (private.formKicker/formTitle).
// L3-I2 (D2): both sections become .story-chapter frames (border-s rail +
// .story-draw copper overlay scrubbed by the CROSS-ROUTE StoryTimeline import
// — zero story-file changes); ghost "01" on the offer title only (no ghost
// over the inputs — reserve-page precedent); the offer closes with the
// capability HUD (StatCounters: floor · private table · full venue — SSR
// finals, tween off the reveal); the room figure's inner .private-parallax
// wrapper is scrubbed by RoomParallax (yPercent ±3 on scale 1.06 — the gallery
// parallax law; the CSS mask-settle owns the OUTER .reveal-scale).
import type { Metadata } from "next";
import Image from "next/image";
import { getDictionary, type Locale } from "@/lib/i18n";
import { VENUE } from "@/lib/venue";
import { waHref, generalMessage } from "@/lib/whatsapp";
import { InquiryForm } from "@/components/private/inquiry-form";
import { StatCounters } from "@/components/home/stat-counters";
import { StoryTimeline } from "../story/story-timeline";
import { RoomParallax } from "./room-parallax";

// The west room (existing gallery asset — the only image this page references).
const ROOM_IMAGE = "/img/gallery/room-7.avif";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const dict = getDictionary(locale);
  return {
    title: dict["private.h1"],
    // R11 minor: per-route OG — each door carries its own social card
    // (title/description typed to the route; image pair ships JPEG, PRF-4).
    openGraph: {
      title: dict["meta.og.private.title"],
      description: dict["meta.og.private.desc"],
    },

    alternates: {
      canonical: `/${locale}/private-dining`,
      languages: {
        en: "/en/private-dining",
        ar: "/ar/private-dining",
        "x-default": "/en/private-dining",
      },
    },
  };
}

export default async function PrivateDiningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const dict = getDictionary(locale);

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6">
      <header className="pb-4 pt-32">
        <h1 className="font-display text-h1 text-ink">{dict["private.h1"]}</h1>
      </header>

      {/* L3-I2 (P1) · CHAPTER 01 — THE OFFER. The story-chapter frame carries
          the reading rail (.story-draw scrubbed by StoryTimeline) + the ghost
          numeral behind the display title (counter-rotated ±2° on the same
          scrub). Kicker fades in first; h2 rises behind the "01". */}
      <section className="pb-24 pt-16">
        <div className="story-chapter relative border-s border-line ps-6 sm:ps-8">
          <span
            aria-hidden="true"
            className="story-draw pointer-events-none absolute inset-y-0 start-[-1px] w-px bg-copper/70"
          />
          <p className="hud-label" data-reveal="fade">
            {dict["private.offerKicker"]}
          </p>
          <div className="relative mt-4">
            <span aria-hidden="true" className="ghost-numeral">
              01
            </span>
            <h2 className="relative z-10 font-display text-h2 text-ink" data-reveal="up">
              {dict["private.offerTitle"]}
            </h2>
          </div>
          <hr
            aria-hidden
            className="mt-6 w-12 border-amber"
            data-reveal="draw"
            data-reveal-delay="70"
          />
          <p
            className="mt-6 max-w-[34rem] font-sans text-body-lg text-ink/90"
            data-reveal="up"
            data-reveal-delay="140"
          >
            {dict["private.offerBody"]}
          </p>
          {/* L3-I2 (P2) · the capability HUD — 06 floor · 12 private table ·
              40 full venue. SSR renders the finals (no-JS reads the facts);
              StatCounters tweens off the section's reveal, RM: finals only. */}
          <div data-reveal="fade" data-reveal-delay="210">
            <StatCounters
              stats={[
                { value: VENUE.floorNumber, label: dict["stats.floor"] },
                { value: VENUE.privateSeats, label: dict["private.statsTable"] },
                { value: VENUE.seats, label: dict["private.statsVenue"] },
              ]}
            />
          </div>
        </div>
      </section>

      {/* The west room — the ONLY new image on this page (room-7.avif, already
          shipped in the gallery assets). Plain next/image (the gallery-grid
          pattern): room-7 is NOT a ladder master, so it keeps the standard
          optimizer — the LadderImage wrapper would mint a non-existent
          -1080w rung. Mask reveal + HUD caption, the story figure idiom.
          unoptimized: the file is ALREADY pre-graded (1080px AVIF, 16KB —
          PRF-3 doctrine: serve the graded bytes, no per-request re-encode);
          also dodges the sandbox's hanging sharp-avif optimizer path (see
          worklog 2-d verification notes).
          L3-I2 (P5): the inner .private-parallax wrapper is GSAP's alone
          (RoomParallax scrubs yPercent −3→+3 on scale 1.06 — 3% headroom per
          side, no edge gaps); the OUTER .reveal-scale stays the CSS
          mask-settle's. RM/no-JS: static, fully visible. */}
      <figure
        className="media-grain relative h-[40vh] overflow-hidden border-y border-line bg-surface"
        data-reveal="mask"
      >
        <div className="reveal-scale absolute inset-0">
          <div className="private-parallax absolute inset-0">
            <Image
              src={ROOM_IMAGE}
              alt={dict["private.figureCaption"]}
              fill
              priority={false}
              loading="lazy"
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
        <figcaption className="hud-label absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/70 to-transparent p-4 text-start">
          {dict["private.figureCaption"]}
        </figcaption>
      </figure>

      {/* L3-I2 (P1) · CHAPTER 02 — THE INQUIRY. Same story-chapter frame +
          reading rail; NO ghost numeral over the inputs (reserve-page
          precedent — the bezel owns focus, facts stay instant). The frame owns
          the rail: the kicker drops its own border-s/ps-6. */}
      <section className="pb-24 pt-16">
        <div className="story-chapter relative border-s border-line ps-6 sm:ps-8">
          <span
            aria-hidden="true"
            className="story-draw pointer-events-none absolute inset-y-0 start-[-1px] w-px bg-copper/70"
          />
          <p className="hud-label" data-reveal="fade">
            {dict["private.formKicker"]}
          </p>
          <h2
            className="mt-4 font-display text-h2 text-ink"
            data-reveal="up"
            data-reveal-delay="70"
          >
            {dict["private.formTitle"]}
          </h2>
          <div className="mt-12">
            <InquiryForm
              locale={locale}
              whatsappHref={waHref(generalMessage(locale))}
              partyHint={dict["private.partyHint"]}
              whatsappNote={dict["contact.whatsappNote"]}
              labels={{
                name: dict["forms.name"],
                phone: dict["forms.phone"],
                preferredDate: dict["forms.preferredDate"],
                partySize: dict["forms.partySize"],
                message: dict["forms.message"],
                submit: dict["forms.submit"],
                submitting: dict["forms.submitting"],
              }}
              errors={{
                invalidName: dict["errors.invalid_name"],
                invalidPhone: dict["errors.invalid_phone"],
                invalidDate: dict["errors.invalid_date"],
                invalidParty: dict["errors.invalid_party"],
                invalidMessage: dict["errors.invalid_message"],
                required: dict["errors.required"],
                validation: dict["errors.validation"],
                rateLimited: dict["errors.rateLimited"],
                network: dict["errors.network"],
              }}
              success={{
                message: dict["private.success"],
                referenceLabel: dict["private.successReference"],
                whatsappCta: dict["private.whatsappCta"],
              }}
            />
          </div>
        </div>
      </section>

      {/* L3-I2 (P1/P5): the reading rail + the room-figure parallax — two
          null-rendering client islands at the article's end; nothing here
          touches SSR content. */}
      <StoryTimeline />
      <RoomParallax />
    </article>
  );
}
