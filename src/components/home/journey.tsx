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

export type Act = { numeral: string; title: string; copy: string; image: string };
type Mode = "pending" | "webgl" | "poster";

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
        const tween = gsap.to(trackRef.current!, {
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
            onUpdate: (self) => {
              progressRef.current = self.progress;
              invalidateRef.current?.();
            },
          },
        });
        // per-act content reveal, timed to the horizontal container animation
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
                containerAnimation: tween,
                start: "left 70%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
      }, sectionRef.current!);
      revert = () => ctx.revert();
    });
    return () => {
      disposed = true;
      revert?.();
    };
  }, [horizontal]);

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
          {/* horizon hairline grounding the skyline — P-038/P-094 (prompt-6
              R1 · E91): the datum renders from --horizon (the sole source;
              the hardcoded literal died with the migration) */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-(--horizon) z-[1] border-t border-line/60" />
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
          alt={act.title}
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
            alt={act.title}
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
