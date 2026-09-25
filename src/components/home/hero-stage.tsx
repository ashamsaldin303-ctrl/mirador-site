"use client";
// MIRADOR — THE HERO STAGE (spec 1-a "The Sixth-Floor Window"): the full hero
// shell as ONE client component (journey.tsx precedent — the section ref and
// the scroll/pointer effects must live client-side; hero.tsx is the thin
// server wrapper passing dictionary strings). Media stack:
//   .hero-media        (outer)  — GSAP scroll dolly (y/scale, scrub)
//   .hero-media-in     (middle) — CSS entrance dolly 1.12→1.06 resting overscan
//   .hero-media-pointer(inner)  — JS pointer drift (translate3d ±10/±6px)
// Effects (transform/opacity only, P-022: gsap ONLY via getMotion() in-effect):
//   1) ARM     — [data-armed] one rAF after mount (layout head 1400ms self-heal
//                covers slow/broken hydration)
//   2) SCROLL  — parallax dolly + glass darkening + content exit (scrub 0.5,
//                gsap.context + revert cleanup — journey.tsx pattern)
//   3) POINTER — desktop-only media drift + amber glint disc (--gx/--gy); one
//                rAF loop gated by IntersectionObserver, passive listeners,
//                8px center dead-zone, lerps (0.08 media / 0.12 glint)
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LadderImage } from "@/components/ui/ladder-image";
import { WordmarkLockup } from "@/components/brand/wordmark-lockup";
import { getMotion, prefersReducedMotion } from "@/lib/motion";
import type { Locale } from "@/lib/i18n";

export function HeroStage({
  locale,
  line,
  cta,
  quiet,
  eyebrow,
  scroll,
  hoursShort,
  coords,
}: {
  locale: Locale;
  line: string;
  cta: string;
  quiet: string;
  eyebrow: string;
  scroll: string;
  hoursShort: string;
  coords: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const mediaPointerRef = useRef<HTMLDivElement>(null);
  const darkeningRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glintRef = useRef<HTMLDivElement>(null);

  // 1) ARM — the CSS entrance ([data-armed]) fires one frame after hydration.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => el.setAttribute("data-armed", "1"));
    return () => cancelAnimationFrame(raf);
  }, []);

  // 2) SCROLL FX — cinematic exit: the city drifts up slower than the page,
  //    the glass darkens, the content card lifts away and fades. Skipped
  //    entirely under prefers-reduced-motion (static composition).
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let disposed = false;
    let revert: (() => void) | null = null;
    void getMotion().then(({ gsap }) => {
      const section = sectionRef.current;
      const media = mediaRef.current;
      const darkening = darkeningRef.current;
      const content = contentRef.current;
      if (disposed || !section || !media || !darkening || !content) return;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            invalidateOnRefresh: true, // function-based y re-measures on resize
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

  // 3) POINTER FX — desktop (hover+fine pointer) only: the window answers the
  //    hand. Media drifts ±10/±6px (lerp 0.08); the amber glint disc follows
  //    at lerp 0.12 via --gx/--gy, fading in on first move, out on leave.
  //    Loop values live in local refs-of-the-effect (never state); the rAF
  //    loop runs ONLY while the hero intersects the viewport.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const section = sectionRef.current;
    const mediaPointer = mediaPointerRef.current;
    const glint = glintRef.current;
    if (!section || !mediaPointer || !glint) return;

    // glint opacity cross-fade (the one non-transform property; compositor-only)
    glint.style.transition = "opacity 400ms cubic-bezier(0.16, 1, 0.3, 1)";

    let targetX = 0; // -1..1 from viewport center (media drift target)
    let targetY = 0;
    let curX = 0;
    let curY = 0;
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
      mediaPointer.style.transform = `translate3d(${(curX * 10).toFixed(2)}px, ${(curY * 6).toFixed(2)}px, 0)`;
      glintX += (glintTargetX - glintX) * 0.12;
      glintY += (glintTargetY - glintY) * 0.12;
      glint.style.setProperty("--gx", `${glintX.toFixed(1)}px`);
      glint.style.setProperty("--gy", `${glintY.toFixed(1)}px`);
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
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      glintOn = false;
      glint.style.opacity = "0";
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

  return (
    <section ref={sectionRef} className="hero media-grain relative min-h-svh overflow-hidden">
      {/* media stack: GSAP dolly (outer) → CSS entrance (middle) → pointer drift (inner) */}
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
      {/* legibility scrim — retuned for the through-glass composition */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-night/55 via-night/5 to-night/92"
      />
      {/* through-glass vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 30%, transparent 52%, rgba(10, 10, 11, 0.55) 100%)",
        }}
      />
      {/* scroll darkening — decorative overlay; GSAP owns the opacity (0→0.55) */}
      <div ref={darkeningRef} aria-hidden="true" className="hero-darkening absolute inset-0 bg-night opacity-0" />
      {/* the pointer glint layer (desktop; JS drives --gx/--gy) */}
      <div ref={glintRef} aria-hidden="true" className="hero-glint" />

      <div ref={contentRef} className="hero-content relative z-10 flex min-h-svh flex-col justify-end">
        <div className="mx-auto w-full max-w-3xl px-4 pb-10 text-start sm:px-6 sm:pb-14 lg:px-8">
          {/* eyebrow — the sixth-floor address */}
          <div className="hero-rise flex items-center gap-3" style={{ animationDelay: "60ms" }}>
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
            style={{ animationDelay: "180ms" }}
          >
            {line}
          </h1>
          <div className="hero-rise mt-9 flex flex-wrap gap-x-8 gap-y-4" style={{ animationDelay: "240ms" }}>
            <Button variant="cta" size="full" asChild>
              {/* cta-glint — the signature hover sweep (hero primary CTA only) */}
              <Link className="cta-glint" href={`/${locale}/reserve`}>
                {cta}
              </Link>
            </Button>
            <Button variant="quiet" asChild>
              <Link href={`/${locale}/menu`}>{quiet}</Link>
            </Button>
          </div>
        </div>
        {/* bottom data strip: hours · scroll cue · coordinates */}
        <div
          className="hero-rise border-t border-line bg-night/30 backdrop-blur-[2px]"
          style={{ animationDelay: "300ms" }}
        >
          <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <span className="hud-label tabular-nums">{hoursShort}</span>
            <a href="#chapter" className="group flex items-center gap-3 py-1">
              <span className="hud-label">{scroll}</span>
              <span aria-hidden="true" className="cue-track">
                <span className="cue-drop" />
              </span>
            </a>
            {/* coordinates — the LTR island (digits/degrees never bidi-mangle) */}
            <span className="hud-label tabular-nums hidden sm:inline" dir="ltr">
              {coords}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
