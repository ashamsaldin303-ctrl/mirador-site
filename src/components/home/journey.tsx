"use client";
// MIRADOR — THE signature journey (§4.1, Direction B "Night Ribbon"): pinned
// horizontal 3-act scrub (Dusk → Fire → The Table), track = 3 × 100vw panels,
// total scroll 300vh, track x 0 → −200vw LTR / +200vw RTL. The single WebGL
// canvas (particle skyline) mounts lazily post-LCP behind the acts.
// Kill-switch (F6-4), all three paths → Direction A poster treatment
// (3 stacked full-bleed static act panels, same copy):
//   (a) auto: measured fps < 30 for 3 consecutive seconds → unmount canvas
//   (b) manual: ?webgl=off or localStorage mirador:webgl=off
//   (c) no WebGL2 context
// prefers-reduced-motion (F5-3): static 3-act layout, all copy present.
// Mode resolution happens inside the IntersectionObserver callback (async —
// no synchronous setState-in-effect; the pre-intersection fallback IS the
// poster treatment, so manual/capability kills are visually identical).
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { DURATIONS, EASE_EXPO_OUT, getMotion } from "@/lib/motion";
import { miradorImageLoader } from "@/lib/image-loader";

const SkylineCanvas = dynamic(() => import("./skyline-canvas"), {
  ssr: false,
  loading: () => null,
});

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot(): boolean {
  return false;
}

export type Act = { numeral: string; title: string; copy: string; image: string; alt?: string };
type Mode = "pending" | "webgl" | "poster";

// roman-core glyphs for the act panels' ghost numerals (I/II/III — static
// glyphs, independent of the localized "ACT I"/«الفصل الأول» numerals)
const ROMAN_CORE = ["I", "II", "III"] as const;

export function Journey({
  hud,
  acts,
}: {
  hud: string;
  acts: [Act, Act, Act];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const invalidateRef = useRef<(() => void) | null>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
  const horizontal = mode === "webgl" && !reduced;

  // kill-switch resolution + lazy mount post-LCP (all inside the async IO callback)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const params = new URLSearchParams(window.location.search);
        const manualOff =
          params.get("webgl") === "off" || localStorage.getItem("mirador:webgl") === "off";
        let hasWebGL2 = false;
        try {
          hasWebGL2 = !!document.createElement("canvas").getContext("webgl2");
        } catch {
          hasWebGL2 = false;
        }
        setMode(manualOff || !hasWebGL2 ? "poster" : "webgl");
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!horizontal) return;
    const stage = stageRef.current;
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!stage || !track || !section) return;
    const rtl = document.documentElement.dir === "rtl";
    const dirSign = rtl ? 1 : -1;

    // P-022: the gsap family arrives through the getMotion() singleton —
    // in-effect, never top-level. Everything below builds only once it lands.
    let disposed = false;
    let revert: (() => void) | null = null;
    void getMotion().then(({ gsap }) => {
      if (disposed || !stageRef.current || !trackRef.current || !sectionRef.current) return;
      const ctx = gsap.context(() => {
        // RTL FIX (council 1-b, GSAP-source-verified): the old per-act reveals
        // rode ScrollTrigger's containerAnimation, whose contract assumes a
        // LEFTWARD-moving container (negative _caScrollDist). In RTL the track
        // tweens +x (dirSign +1) → _caScrollDist is negative → the value→time
        // mapping inverts: fire times shift from EN {-0.35, 0.15, 0.65} to AR
        // {+0.35, +0.85, +1.35} — Act 3 (1.35 > 1) NEVER revealed (an empty
        // climax panel), Acts 1–2 popped in late, and scrolling back up
        // un-revealed fully on-screen panels. Replaced with direction-agnostic
        // progress-threshold reveals keyed off the scrub's own progress: Act k
        // is 30%-visible at progress (k-0.7)/2 in BOTH locales (verified
        // geometry) → fire times {0, 0.15, 0.65}, reproducing the EN behavior
        // bit-for-bit while erasing the RTL defect. The track x math above is
        // verified correct and untouched.
        const reveals = gsap.utils.toArray<HTMLElement>("[data-act-content]").map((el, k) => {
          const enter = Math.max(0, (k - 0.7) / 2);
          const anim = gsap.fromTo(
            el,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: DURATIONS.slow, ease: EASE_EXPO_OUT, paused: true },
          );
          return { anim, enter, exit: Math.max(0, enter - 0.05) }; // 0.05 hysteresis anti-flicker
        });
        function evaluateReveals(p: number) {
          for (const { anim, enter, exit } of reveals) {
            if (p >= enter && anim.progress() === 0) anim.play();
            else if (p < exit && anim.progress() !== 0) anim.reverse();
          }
        }
        gsap.to(trackRef.current!, {
          x: () => dirSign * window.innerWidth * 2,
          ease: "none",
          scrollTrigger: {
            trigger: stageRef.current!,
            start: "top top",
            end: "+=200%", // stage (100vh) pinned for 200vh → total 300vh
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: (self) => evaluateReveals(self.progress),
            onUpdate: (self) => {
              progressRef.current = self.progress;
              invalidateRef.current?.();
              evaluateReveals(self.progress);
            },
          },
        });
        evaluateReveals(0); // Act 1 visible from pin start (parity with EN)
      }, sectionRef.current!);
      revert = () => ctx.revert();
    });
    return () => {
      disposed = true;
      revert?.();
    };
  }, [horizontal]);

  // Poster-mode arrival reveals: the kill-switch/RM fallback branch previously
  // had NO arrival animation. Regular vertical ScrollTriggers are direction-safe
  // in both locales — same [data-act-content] reveal values as the horizontal
  // branch (F5-3 RM keeps its static layout: reduced motion skips this entirely;
  // "pending" waits for kill-switch resolution so triggers attach exactly once
  // the stacked branch is the settled treatment, and revert on mode flip/unmount
  // restores inline styles).
  useEffect(() => {
    if (horizontal || reduced || mode !== "poster") return;
    const section = sectionRef.current;
    if (!section) return;
    let disposed = false;
    let revert: (() => void) | null = null;
    void getMotion().then(({ gsap }) => {
      if (disposed || !sectionRef.current) return;
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-act-content]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: DURATIONS.slow,
              ease: EASE_EXPO_OUT,
              scrollTrigger: {
                trigger: el,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
      }, section);
      revert = () => ctx.revert();
    });
    return () => {
      disposed = true;
      revert?.();
    };
  }, [horizontal, mode, reduced]);

  return (
    <section ref={sectionRef} aria-label={hud} className="relative">
      {/* section HUD label */}
      <div className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <p className="hud-label border-s border-line ps-6">{hud}</p>
      </div>

      {horizontal ? (
        /* — Direction B: pinned horizontal ribbon over the WebGL skyline — */
        <div ref={stageRef} className="relative h-svh overflow-hidden bg-night">
          <div className="absolute inset-0 z-0">
            <SkylineCanvas
              progressRef={progressRef}
              onReady={(invalidate) => {
                invalidateRef.current = invalidate;
              }}
              onLowFps={() => {
                invalidateRef.current = null;
                setMode("poster"); // (a) auto kill-switch → poster treatment
              }}
            />
          </div>
          {/* horizon hairline grounding the skyline (copper — the night's own metal) */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-[18%] z-[1] border-t border-copper/40" />
          <div ref={trackRef} className="absolute inset-0 z-10 flex w-[300vw]">
            {acts.map((act, i) => (
              <ActPanel key={act.numeral} act={act} index={i} stacked={false} />
            ))}
          </div>
        </div>
      ) : (
        /* — Direction A fallback: stacked full-bleed static act panels (same copy) — */
        <div ref={stageRef} className="relative">
          <div ref={trackRef} className="flex flex-col">
            {acts.map((act, i) => (
              <ActPanel key={act.numeral} act={act} index={i} stacked />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ActPanel({ act, index, stacked }: { act: Act; index: number; stacked: boolean }) {
  if (stacked) {
    return (
      <article className="media-grain relative flex min-h-[85svh] items-center justify-center overflow-hidden border-t border-line">
        <Image
          src={act.image}
          alt={act.alt ?? act.title}
          fill
          sizes="100vw"
          // R11 minor: act-1 is below-fold — LAZY like its siblings (no eager
          // pre-LCP fetch on the home route); the hero poster owns priority.
          loading="lazy"
          loader={miradorImageLoader}
          className="object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-night/60" />
        <div data-act-content className="relative z-10 max-w-2xl px-6 py-24 text-center">
          <p className="hud-label mb-6">{act.numeral}</p>
          <h2 className="font-display text-h2 text-ink">{act.title}</h2>
          <p className="mt-8 font-sans text-body-lg text-ink/90">{act.copy}</p>
        </div>
      </article>
    );
  }
  return (
    <article
      data-act-panel={index}
      className="relative flex h-full w-screen shrink-0 items-center justify-center"
    >
      {/* oversized ghost numeral behind the act (design audit P2) — roman-core
          glyph via index, NOT the localized numeral. .ghost-numeral is UNLAYERED
          CSS (it beats @layer utilities in the cascade), so its top/start ride
          inline style instead of Tailwind placement classes. */}
      <span
        aria-hidden="true"
        className="ghost-numeral"
        style={{ top: "-2rem", insetInlineStart: "clamp(1rem, 3vw, 2.5rem)" }}
      >
        {ROMAN_CORE[index]}
      </span>
      <div
        data-act-content
        className="relative z-10 flex max-w-3xl flex-col items-center gap-6 px-6 text-center"
      >
        <p className="hud-label">{act.numeral}</p>
        <h2 className="font-display text-h2 text-ink">{act.title}</h2>
        <p className="max-w-xl font-sans text-body-lg text-ink/90">{act.copy}</p>
        {/* the one visual anchor per act — hairline-framed plate */}
        <div className="media-grain relative mt-4 h-48 w-72 overflow-hidden border border-line elev-1 sm:h-56 sm:w-96">
          <Image
            src={act.image}
            alt={act.alt ?? act.title}
            fill
            sizes="(min-width: 640px) 384px, 288px"
            loading="lazy"
            loader={miradorImageLoader}
            className="object-cover"
          />
        </div>
      </div>
    </article>
  );
}
