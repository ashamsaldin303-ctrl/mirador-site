"use client";
// MIRADOR — THE HERO STAGE v2 "DUSK OVER DAMASCUS" (loop2-I1r rebuild of the
// lost wave, with its two defect fixes folded in: the AR clock numbering law
// and the pointer-loop idle bail). The full hero shell as ONE client
// component (journey.tsx precedent — the section ref and the scroll/pointer
// effects must live client-side; hero.tsx is the thin server wrapper passing
// dictionary strings).
//
// LAYER STACK (z):
//   0  poster dolly   — .hero-media/.hero-media-in/.hero-media-pointer,
//                       LadderImage priority + fetchPriority="high" = the LCP
//                       (UNCHANGED from v1 — the campaign's core)
//   1  scrim          — from-night/70 via-night/10 to-night/92 (retuned)
//                       + the through-glass vignette companion
//   2  dusk pair      — two gradient divs cross-fading 0.9↔0.4 over 26s
//                       (CSS-only, RM-dead); the WRAPPER is what the GSAP
//                       scrub fades (child animations beat inline opacity)
//   3  skyline canvas — hero-skyline.tsx via next/dynamic ssr:false, 2D
//                       ambient bands/windows/embers, pointer-events-none
//   4  darkening      — GSAP scroll overlay (opacity 0 → 0.55)
//   5  glint          — the pointer sheen (desktop, --gx/--gy)
//   6  chrome         — vertical rail + corner brackets + the live Damascus
//                       clock (desktop-only layer; ±3px pointer drift)
//   10 content        — lg: 12-col grid, col-span-6 inline-start, self-end,
//                       pb-[35vh] horizon zone; <lg: bottom-anchored column
//
// EFFECTS (transform/opacity only outside the canvas; P-022: gsap ONLY via
// getMotion() in-effect):
//   1) ARM    — [data-armed] one rAF after mount (CSS entrance gate)
//   2) CLOCK  — Intl.DateTimeFormat, WESTERN digits in AR too (ar-u-nu-latn
//               — the site-wide numerals law), 30s textContent ref writes,
//               NEVER React state; dir="ltr" bidi island; no-JS keeps the
//               SSR static "{clockCity} · {clockLabel}" label
//   3) SCROLL — parallax dolly + darkening + content exit (scrub 0.5) and
//               onUpdate feeds progressRef (canvas) + fades the dusk
//               wrapper to 0 by 50% scroll — all ref writes, no state
//   4) POINTER — desktop-only media ±10/±6 lerp 0.08 + glint lerp 0.12 +
//               chrome ±3 lerp 0.04 in ONE IO-gated rAF loop, with the
//               IDLE BAIL: converged + glint off → zero style writes until
//               the next pointermove restarts the loop
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { LadderImage } from "@/components/ui/ladder-image";
import { WordmarkLockup } from "@/components/brand/wordmark-lockup";
import { getMotion, prefersReducedMotion } from "@/lib/motion";
import type { Locale } from "@/lib/i18n";

const HeroSkyline = dynamic(() => import("./hero-skyline"), {
  ssr: false,
  loading: () => null,
});

export function HeroStage({
  locale,
  line,
  cta,
  quiet,
  eyebrow,
  scroll,
  hoursShort,
  coords,
  rail,
  clockLabel,
  clockCity,
}: {
  locale: Locale;
  line: string;
  cta: string;
  quiet: string;
  eyebrow: string;
  scroll: string;
  hoursShort: string;
  coords: string;
  rail: string;
  clockLabel: string;
  clockCity: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const mediaPointerRef = useRef<HTMLDivElement>(null);
  const darkeningRef = useRef<HTMLDivElement>(null);
  const duskRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glintRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const clockSpanRef = useRef<HTMLSpanElement>(null);
  const clockSepRef = useRef<HTMLSpanElement>(null);
  // the scroll progress feed consumed INSIDE the canvas rAF (near-band lift
  // + ember fade) — a ref, never state
  const progressRef = useRef(0);

  // 1) ARM — the CSS entrance ([data-armed]) fires one frame after hydration.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => el.setAttribute("data-armed", "1"));
    return () => cancelAnimationFrame(raf);
  }, []);

  // 2) THE LIVE CLOCK — Damascus local time. CRITICAL numbering law (the
  //    lost run's defect): plain "ar" renders Arabic-Indic digits (٢١:٤٧),
  //    contradicting every other AR numeral on the site (hoursShort, coords,
  //    stats, dates are all latn) → the AR locale extends to "ar-u-nu-latn"
  //    (WESTERN digits); EN rides en-GB. 30s tick, textContent writes on the
  //    <span data-clock> only — never React state; cleanup on unmount. The
  //    time span is a dir="ltr" bidi island; the separator materializes only
  //    under JS so no-JS keeps the complete static SSR label.
  useEffect(() => {
    const span = clockSpanRef.current;
    if (!span) return;
    const fmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Damascus",
    });
    const sep = clockSepRef.current;
    const write = () => {
      span.textContent = fmt.format(new Date());
      if (sep && sep.textContent !== "·") sep.textContent = "·";
    };
    write();
    const t = setInterval(write, 30_000);
    return () => clearInterval(t);
  }, [locale]);

  // 3) SCROLL FX — cinematic exit: the city drifts up slower than the page,
  //    the glass darkens, the content lifts away and fades — and the dusk
  //    pair fades to 0 by 50% scroll while self.progress feeds the canvas.
  //    Skipped entirely under prefers-reduced-motion (static composition:
  //    progressRef stays 0 → the canvas paints its static frame).
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let disposed = false;
    let revert: (() => void) | null = null;
    void getMotion().then(({ gsap }) => {
      const section = sectionRef.current;
      const media = mediaRef.current;
      const darkening = darkeningRef.current;
      const dusk = duskRef.current;
      const content = contentRef.current;
      if (disposed || !section || !media || !darkening || !dusk || !content) return;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            invalidateOnRefresh: true, // function-based y re-measures on resize
            onUpdate: (self) => {
              // canvas feed (near-band lift + ember fade) — no React state
              progressRef.current = self.progress;
              // dusk pair → 0 by 50% scroll (ref write on the WRAPPER — the
              // children's breathing animations would beat inline opacity)
              dusk.style.opacity = String(1 - Math.min(1, self.progress * 2));
            },
          },
        });
        tl.to(media, { y: () => -0.07 * window.innerHeight, scale: 1.16, ease: "none", duration: 1 }, 0)
          .to(darkening, { opacity: 0.55, ease: "none", duration: 1 }, 0)
          .to(content, { y: () => -0.08 * window.innerHeight, ease: "none", duration: 1 }, 0)
          .to(content, { autoAlpha: 0, ease: "none", duration: 0.7 }, 0);
      }, section);
      revert = () => ctx.revert();
    });
    return () => {
      disposed = true;
      revert?.();
    };
  }, []);

  // 4) POINTER FX — desktop (hover+fine pointer) only: the window answers
  //    the hand. Media drifts ±10/±6px (lerp 0.08); the chrome layer trails
  //    at ±3px (lerp 0.04); the amber glint disc follows at lerp 0.12 via
  //    --gx/--gy, fading in on first move, out on leave. ONE rAF loop gated
  //    by IntersectionObserver. IDLE BAIL (the lost run's defect fix): when
  //    every channel is within 0.01px of its target AND the glint is off,
  //    the loop snaps to the converged values, parks (ZERO style writes at
  //    rest) and only re-arms on the next pointermove.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const section = sectionRef.current;
    const mediaPointer = mediaPointerRef.current;
    const glint = glintRef.current;
    if (!section || !mediaPointer || !glint) return;
    const chrome = chromeRef.current; // may be null-adjacent — guarded per write

    // glint opacity cross-fade (the one non-transform property; compositor-only)
    glint.style.transition = "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)";

    let targetX = 0; // -1..1 from viewport center (media drift target)
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let chromeX = 0; // chrome trails the same target at a slower lerp
    let chromeY = 0;
    let glintX = 0; // px (glint disc position)
    let glintY = 0;
    let glintTargetX = 0;
    let glintTargetY = 0;
    let glintOn = false;
    let raf = 0;
    let running = false;

    const tick = () => {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      chromeX += (targetX - chromeX) * 0.04;
      chromeY += (targetY - chromeY) * 0.04;
      // IDLE BAIL — converged on every channel and the glint is off: snap,
      // write once, park the loop until the next pointermove
      if (
        !glintOn &&
        Math.abs(targetX - curX) < 0.01 &&
        Math.abs(targetY - curY) < 0.01 &&
        Math.abs(targetX - chromeX) < 0.01 &&
        Math.abs(targetY - chromeY) < 0.01
      ) {
        curX = targetX;
        curY = targetY;
        chromeX = targetX;
        chromeY = targetY;
        mediaPointer.style.transform = `translate3d(${(curX * 10).toFixed(2)}px, ${(curY * 6).toFixed(2)}px, 0)`;
        if (chrome) {
          chrome.style.transform = `translate3d(${(chromeX * 3).toFixed(2)}px, ${(chromeY * 3).toFixed(2)}px, 0)`;
        }
        running = false;
        return;
      }
      mediaPointer.style.transform = `translate3d(${(curX * 10).toFixed(2)}px, ${(curY * 6).toFixed(2)}px, 0)`;
      if (chrome) {
        chrome.style.transform = `translate3d(${(chromeX * 3).toFixed(2)}px, ${(chromeY * 3).toFixed(2)}px, 0)`;
      }
      if (glintOn) {
        glintX += (glintTargetX - glintX) * 0.12;
        glintY += (glintTargetY - glintY) * 0.12;
        glint.style.setProperty("--gx", `${glintX.toFixed(1)}px`);
        glint.style.setProperty("--gy", `${glintY.toFixed(1)}px`);
      }
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - window.innerWidth / 2;
      const dy = e.clientY - window.innerHeight / 2;
      // 8px center dead-zone (per-axis) — no micro-jitter at rest
      targetX = Math.abs(dx) < 8 ? 0 : Math.max(-1, Math.min(1, dx / (window.innerWidth / 2)));
      targetY = Math.abs(dy) < 8 ? 0 : Math.max(-1, Math.min(1, dy / (window.innerHeight / 2)));
      glintTargetX = e.clientX;
      glintTargetY = e.clientY;
      if (!glintOn) {
        glintOn = true;
        glintX = e.clientX; // seed at the pointer — no fly-in from the default
        glintY = e.clientY;
        glint.style.opacity = "1";
      }
      start(); // restart after an idle bail
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      glintOn = false;
      glint.style.opacity = "0";
      // no stop here — the loop converges home and bails on its own
    };

    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) start();
      else stop();
    });
    io.observe(section);
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      io.disconnect();
      stop();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const railRuns = rail.split(" — ");

  return (
    <section ref={sectionRef} className="hero media-grain relative min-h-svh overflow-hidden">
      {/* z-0 — media stack: GSAP dolly (outer) → CSS entrance (middle) → pointer drift (inner) */}
      <div ref={mediaRef} aria-hidden="true" className="hero-media absolute inset-0 z-0">
        <div aria-hidden="true" className="hero-media-in absolute inset-0">
          <div ref={mediaPointerRef} aria-hidden="true" className="hero-media-pointer absolute inset-0">
            <LadderImage
              src="/img/hero/poster.avif"
              alt="" /* presentational background — the H1 owns the meaning (audit #8) */
              fill
              priority
              // R13/E79: next/16 emits the preload link for `priority` but NOT
              // the img-level fetchPriority — the full-bleed poster (the LCP
              // candidate on throttled mobile) fetched at LOW priority and
              // lantern's modeled LCP waited ~3.4s behind the queue (run-19
              // raw). Explicit high. THE LCP campaign's core — preserved.
              fetchPriority="high"
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
      {/* z-1 — legibility scrim, retuned for the dusk composition + the
          through-glass vignette companion */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] bg-gradient-to-b from-night/70 via-night/10 to-night/92"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 30%, transparent 52%, rgba(10, 10, 11, 0.55) 100%)",
        }}
      />
      {/* z-2 — the dusk pair: two cross-fading gradients breathing 0.9↔0.4
          over 26s (CSS-only, RM-dead); the GSAP scrub fades this wrapper */}
      <div ref={duskRef} aria-hidden="true" className="absolute inset-0 z-[2]">
        <div className="hero-dusk hero-dusk-a absolute inset-0" />
        <div className="hero-dusk hero-dusk-b absolute inset-0" />
      </div>
      {/* z-3 — the ambient skyline canvas (2D bands + window lights + embers;
          RM → static paint inside the component) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[3]">
        <HeroSkyline progressRef={progressRef} />
      </div>
      {/* z-4 — scroll darkening; GSAP owns the opacity (0→0.55) */}
      <div ref={darkeningRef} aria-hidden="true" className="hero-darkening absolute inset-0 z-[4] bg-night opacity-0" />
      {/* z-5 — the pointer glint layer (desktop; JS drives --gx/--gy) */}
      <div ref={glintRef} aria-hidden="true" className="hero-glint" />

      {/* z-6 — the chrome: vertical rail + corner brackets (desktop only; the
          top bracket hosts the live Damascus clock, the bottom one coords) */}
      <div ref={chromeRef} className="hero-chrome">
        {/* the vertical rail — writing-mode vertical-rl, one <bdi> per script
            run so the mixed EN/AR line can never bidi-scramble */}
        <div aria-hidden="true" className="hero-rail">
          <p className="hud-label hero-rail-text">
            {railRuns.map((run, i) => (
              <span key={run}>
                {i > 0 ? " — " : null}
                <bdi>{run}</bdi>
              </span>
            ))}
          </p>
        </div>
        {/* the top bracket — the live clock: "{clockCity} · {time} ·
            {clockLabel}"; no-JS keeps the complete static SSR label */}
        <div className="hero-bracket hero-bracket-t">
          <span aria-hidden="true" className="hero-bracket-arm" />
          <p className="hud-label flex items-center gap-2 whitespace-nowrap">
            <span>{clockCity}</span>
            <span aria-hidden="true">·</span>
            <span ref={clockSpanRef} data-clock dir="ltr" className="tabular-nums" />
            <span ref={clockSepRef} aria-hidden="true" />
            <span>{clockLabel}</span>
          </p>
        </div>
        {/* the bottom bracket — the coordinates island (LTR, latn digits) */}
        <div className="hero-bracket hero-bracket-b">
          <p className="hud-label tabular-nums whitespace-nowrap" dir="ltr">
            {coords}
          </p>
          <span aria-hidden="true" className="hero-bracket-arm" />
        </div>
      </div>

      {/* z-10 — the content: lg 12-col grid (col-span-6 inline-start, self-end,
          pb-[35vh] horizon zone); <lg bottom-anchored single column */}
      <div ref={contentRef} className="hero-content relative z-10 flex min-h-svh flex-col justify-end lg:grid lg:grid-cols-12">
        <div className="mx-auto w-full max-w-3xl px-4 pb-10 text-start sm:px-6 sm:pb-14 lg:col-span-6 lg:col-start-1 lg:mx-0 lg:max-w-none lg:self-end lg:px-8 lg:pb-[35vh]">
          {/* eyebrow — the sixth-floor address */}
          <div className="hero-rise flex items-center gap-3" style={{ animationDelay: "80ms" }}>
            <span aria-hidden="true" className="inline-block h-px w-6 bg-amber/70" />
            <p className="hud-label">{eyebrow}</p>
          </div>
          <span className="hero-rise mt-5 block" style={{ animationDelay: "120ms" }}>
            <WordmarkLockup size="md" />
          </span>
          {/* R13/E79: font-hero rides the PRELOADED hero-line subset (the LCP
              close). The H1 NEVER hides — transform-only entrance (hero-line). */}
          <h1
            className="hero-line mt-3 max-w-[24ch] font-hero text-h1 text-ink text-balance"
            style={{ animationDelay: "170ms" }}
          >
            {line}
          </h1>
          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-4">
            <span className="hero-rise" style={{ animationDelay: "230ms" }}>
              {/* cta-glint — the signature hover sweep (hero primary CTA only) */}
              <Button variant="cta" size="full" asChild>
                <Link className="cta-glint" href={`/${locale}/reserve`}>
                  {cta}
                </Link>
              </Button>
            </span>
            <span className="hero-rise" style={{ animationDelay: "270ms" }}>
              <Button variant="quiet" asChild>
                <Link href={`/${locale}/menu`}>{quiet}</Link>
              </Button>
            </span>
          </div>
          {/* the ONE hud-label row (replaces the old full-width data strip):
              hours · scroll cue — the cue link keeps the 44px touch law */}
          <div
            className="hero-hours mt-10 flex items-center justify-between gap-4 border-t border-line/60 pt-4"
            style={{ animationDelay: "320ms" }}
          >
            <span className="hud-label tabular-nums">{hoursShort}</span>
            <a href="#chapter" className="group flex min-h-11 items-center gap-3 px-2">
              <span className="hud-label">{scroll}</span>
              <span aria-hidden="true" className="cue-track">
                <span className="cue-drop" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
