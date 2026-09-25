"use client";
// MIRADOR — HERO SKYLINE ("Dusk over Damascus", loop2-I1r rebuild): the 2D
// canvas ambient system at hero layer z-3 (mounted via next/dynamic ssr:false
// from hero-stage). Two seeded silhouette bands (mulberry32) drift at
// parallax speeds — far α0.6 @0.4px/s, near α0.85 @0.8px/s, drift direction
// mirrored in RTL (documentElement.dir read ONCE at mount) — carrying ~140
// flickering window lights (≈70 per band — the frame-budget cap, NOT 280)
// and 60 embers rising from the bottom band.
//
// PERFORMANCE CONTRACT (loop-1 verifier findings folded in — this file owns
// the "hero-skyline per-frame closure alloc" defect fix):
//   · HOT-PATH LAW — the rAF tick allocates NOTHING: every closure/lambda is
//     hoisted to effect scope, every scene buffer is a typed array built on
//     mount/resize ONLY, and the frame body is pure numeric locals.
//   · fillRect-only drawing · DPR clamp ≤1.5 · ResizeObserver sizing ·
//     IO-gated rAF (paused off-screen) · visibilitychange pause · fps
//     kill-switch (<30fps sustained 2s → loop stops on ONE static final
//     frame, steady windows, no embers).
//   · prefers-reduced-motion → immediate static paint and the loop never
//     starts; resize repaints the static frame.
//   · progressRef (the hero GSAP scrub) is consumed INSIDE the tick: the
//     near band lifts p × 0.03 × vh and embers fade by 1 − p × 0.3 — no
//     React state anywhere.
//   · Visual intro: bands rise +40px → 0 over ~700ms from the first-paint
//     timestamp (the canvas clock, dt-accumulated so pauses never snap).
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

const WINDOW_BUDGET = 70; // per band → ~140 total (frame budget)
const EMBER_COUNT = 60;
const INTRO_S = 0.7; // band intro duration (canvas clock)
const INTRO_Y = 40; // intro offset: +40px → 0
const KILL_MS = 2000; // <30fps sustained 2s → static final frame
const FPS_MIN_DT = 1 / 30;
const DT_MAX = 0.05; // frame-delta clamp — tab returns must not teleport state
const DPR_MAX = 1.5;
const FAR_ALPHA = 0.6;
const NEAR_ALPHA = 0.85;
const FAR_SPEED = 0.4; // px/s
const NEAR_SPEED = 0.8; // px/s

// — mulberry32: seeded deterministic PRNG (stable scene per seed) —
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// — the scene, built on mount + resize ONLY (never per frame) —
type Band = {
  // silhouette buildings, layout space (layout ≥ w + one building overhang
  // so the drift wraps seamlessly)
  bx: Float32Array;
  bw: Float32Array;
  bh: Float32Array;
  nb: number;
  layout: number;
  maxH: number;
  // window lights, layout space (they drift with their band)
  wx: Float32Array;
  wy: Float32Array; // height above the band baseline
  ws: Float32Array; // 2–3px squares
  ph: Float32Array; // flicker phase (PRNG)
  fr: Float32Array; // flicker angular freq (4–8s cycles)
  col: Uint8Array; // 0 amber · 1 copper
  base: Float32Array; // steady alpha
  nw: number;
};

type Scene = {
  far: Band;
  near: Band;
  em: Float32Array; // embers, stride 9: x y vy amp phase fr age life spawnY
};

function buildBand(seed: number, w: number, h: number, far: boolean): Band {
  const rand = mulberry32(seed);
  const minW = far ? 26 : 60;
  const maxW = far ? 82 : 170;
  const minH = far ? 0.05 : 0.09; // fraction of h
  const maxH = far ? 0.2 : 0.34;
  const density = far ? 0.42 : 0.5;

  const bxs: number[] = [];
  const bws: number[] = [];
  const bhs: number[] = [];
  let x = 0;
  while (x < w + maxW + 40) {
    const bw = minW + rand() * (maxW - minW);
    let frac = minH + rand() * (maxH - minH);
    if (rand() < 0.14) frac = maxH; // skyline spikes
    bxs.push(x);
    bws.push(bw);
    bhs.push(frac * h);
    x += bw + (far ? 2 + rand() * 4 : 8 + rand() * 18);
  }

  const wxs: number[] = [];
  const wys: number[] = [];
  const wss: number[] = [];
  const phs: number[] = [];
  const frs: number[] = [];
  const cols: number[] = [];
  const bases: number[] = [];
  for (let b = 0; b < bxs.length && wxs.length < WINDOW_BUDGET; b++) {
    const colsN = Math.floor((bws[b]! - 10) / 13);
    const rowsN = Math.floor((bhs[b]! - 12) / 16);
    for (let r = rowsN - 1; r >= 0 && wxs.length < WINDOW_BUDGET; r--) {
      for (let c = 0; c < colsN && wxs.length < WINDOW_BUDGET; c++) {
        if (rand() >= density) continue;
        wxs.push(bxs[b]! + 6 + c * 13 + rand() * 4);
        wys.push(9 + r * 16 + rand() * 5);
        wss.push(rand() < 0.55 ? 2 : 3);
        phs.push(rand() * Math.PI * 2);
        frs.push((Math.PI * 2) / (4 + rand() * 4)); // 4–8s flicker cycle
        cols.push(rand() < 0.7 ? 0 : 1);
        bases.push(0.3 + rand() * 0.55);
      }
    }
  }

  return {
    bx: new Float32Array(bxs),
    bw: new Float32Array(bws),
    bh: new Float32Array(bhs),
    nb: bxs.length,
    layout: x,
    maxH: maxH * h,
    wx: new Float32Array(wxs),
    wy: new Float32Array(wys),
    ws: new Float32Array(wss),
    ph: new Float32Array(phs),
    fr: new Float32Array(frs),
    col: new Uint8Array(cols),
    base: new Float32Array(bases),
    nw: wxs.length,
  };
}

function buildScene(w: number, h: number): Scene {
  const near = buildBand(8117, w, h, false);
  const rand = mulberry32(40503);
  const em = new Float32Array(EMBER_COUNT * 9);
  for (let i = 0; i < EMBER_COUNT; i++) {
    const o = i * 9;
    const spawnY = h - rand() * near.maxH * 0.85; // its place in the bottom band
    em[o] = rand() * w; // base x — fixed ("in-place" respawn)
    em[o + 1] = spawnY - rand() * 60; // some already aloft
    em[o + 2] = 6 + rand() * 8; // rise 6–14 px/s
    em[o + 3] = 2 + rand() * 6; // sway amplitude (within ±8px)
    em[o + 4] = rand() * Math.PI * 2;
    em[o + 5] = 0.4 + rand() * 0.8; // sway freq
    em[o + 6] = rand() * 4; // staggered ages
    em[o + 7] = 3 + rand() * 2; // 3–5s life
    em[o + 8] = spawnY;
  }
  return { far: buildBand(1226, w, h, true), near, em };
}

export default function HeroSkyline({ progressRef }: { progressRef: RefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // palette from design tokens, resolved ONCE (skyline-canvas precedent —
    // no hex literals in src; fallbacks are rgb() strings)
    const cs = getComputedStyle(document.documentElement);
    const amber = cs.getPropertyValue("--color-amber").trim() || "rgb(203,163,92)";
    const copper = cs.getPropertyValue("--color-copper").trim() || "rgb(184,115,51)";
    const night = cs.getPropertyValue("--color-night").trim() || "rgb(10,10,11)";

    // drift direction mirrors in RTL — resolved ONCE at mount
    const dirSign = document.documentElement.dir === "rtl" ? -1 : 1;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = mq.matches;

    let w = 1;
    let h = 1;
    let scene: Scene | null = null;

    // — hot-path state: pure numerics (zero allocation per frame) —
    let raf = 0;
    let running = false;
    let killed = false;
    let intersecting = false;
    let lastT = -1; // rAF timestamps (the canvas clock)
    let t0 = -1; // first-paint timestamp — the intro origin
    let flickT = 0; // pause-safe ambient clock (windows + embers)
    let driftF = 0;
    let driftN = 0;
    let introAcc = 0;
    let slowSince = -1;
    let rsp = 987654321; // respawn LCG state — allocation-free randomness

    const size = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene = buildScene(w, h);
    };

    // one band pass: silhouettes + its window lights (two color sub-passes —
    // fillStyle switches twice per band, not once per light)
    const drawBand = (b: Band, alpha: number, drift: number, yOff: number, steady: boolean) => {
      let d = drift % b.layout;
      if (d < 0) d += b.layout;
      ctx.fillStyle = night;
      ctx.globalAlpha = alpha;
      for (let i = 0; i < b.nb; i++) {
        let sx = b.bx[i]! + d;
        if (sx >= b.layout) sx -= b.layout;
        if (sx >= w) sx -= b.layout;
        if (sx + b.bw[i]! > 0 && sx < w) ctx.fillRect(sx, h - b.bh[i]! + yOff, b.bw[i]!, b.bh[i]!);
      }
      for (let pass = 0; pass < 2; pass++) {
        ctx.fillStyle = pass === 0 ? amber : copper;
        const want = pass; // 0 amber · 1 copper
        for (let i = 0; i < b.nw; i++) {
          if (b.col[i] !== want) continue;
          let sx = b.wx[i]! + d;
          if (sx >= b.layout) sx -= b.layout;
          if (sx >= w) sx -= b.layout;
          if (sx <= -4 || sx >= w) continue;
          const a = steady
            ? b.base[i]!
            : b.base[i]! * (0.72 + 0.28 * Math.sin(flickT * b.fr[i]! + b.ph[i]!));
          ctx.globalAlpha = a * alpha;
          const s = b.ws[i]!;
          ctx.fillRect(sx, h - b.wy[i]! + yOff, s, s);
        }
      }
    };

    // the static composition (RM + kill-switch final frame): steady windows,
    // no embers, intro settled, near-band lift from the current progress.
    const paintStatic = () => {
      const s = scene;
      if (!s) return;
      ctx.clearRect(0, 0, w, h);
      const lift = progressRef.current * 0.03 * h;
      drawBand(s.far, FAR_ALPHA, driftF, 0, true);
      drawBand(s.near, NEAR_ALPHA, driftN, lift, true);
      ctx.globalAlpha = 1;
    };

    // embers: update (in-place respawn via the numeric LCG) + draw, one pass
    const drawEmbers = (dt: number, p: number) => {
      const s = scene;
      if (!s) return;
      const em = s.em;
      const gOp = 1 - p * 0.3; // ember global opacity (scroll fade)
      if (gOp <= 0.02) return;
      ctx.fillStyle = amber;
      for (let i = 0; i < EMBER_COUNT; i++) {
        const o = i * 9;
        let age = em[o + 6]! + dt;
        let y = em[o + 1]! - em[o + 2]! * dt;
        let life = em[o + 7]!;
        if (age >= life) {
          // in-place respawn from the bottom band — zero allocation
          rsp = (rsp * 1664525 + 1013904223) | 0;
          age = 0;
          life = 3 + ((rsp >>> 9) & 0x7fffff) * (2 / 0x7fffff);
          y = em[o + 8]!;
          em[o + 2] = 6 + ((rsp >>> 21) & 0x7ff) * (8 / 0x7ff);
        }
        em[o + 6] = age;
        em[o + 1] = y;
        em[o + 7] = life;
        const remaining = life - age;
        let env = 1; // 0.6s in / 0.6s out envelope
        if (age < 0.6) env = age / 0.6;
        else if (remaining < 0.6) env = remaining / 0.6;
        if (env < 0) env = 0;
        const a = 0.55 * env * gOp;
        if (a <= 0.02) continue;
        ctx.globalAlpha = a;
        const ex = em[o]! + em[o + 3]! * Math.sin(flickT * em[o + 5]! + em[o + 4]!);
        ctx.fillRect(ex - 1, y - 1, 2, 2);
      }
    };

    const tick = (t: number) => {
      if (t0 < 0) t0 = t;
      let dt = lastT < 0 ? 0 : (t - lastT) / 1000;
      lastT = t;
      if (dt > DT_MAX) dt = DT_MAX;
      if (dt < 0) dt = 0;

      // fps kill-switch: <30fps sustained KILL_MS → stop on one static frame
      if (dt > FPS_MIN_DT) {
        if (slowSince < 0) slowSince = t;
        if (t - slowSince > KILL_MS) {
          killed = true;
          running = false;
          paintStatic();
          return;
        }
      } else {
        slowSince = -1;
      }

      flickT += dt;
      driftF += dt * FAR_SPEED * dirSign;
      driftN += dt * NEAR_SPEED * dirSign;
      if (introAcc < INTRO_S) introAcc += dt;

      const p = progressRef.current;
      const lift = p * 0.03 * h; // near-band lift (scroll parallax)
      // band intro: +40px → 0 over ~700ms, expo-out (canvas clock)
      const k = introAcc >= INTRO_S ? 1 : introAcc / INTRO_S;
      const inv = 1 - k;
      const introY = INTRO_Y * inv * inv * inv;

      const s = scene;
      ctx.clearRect(0, 0, w, h);
      if (s) {
        drawBand(s.far, FAR_ALPHA, driftF, introY, false);
        drawBand(s.near, NEAR_ALPHA, driftN, introY + lift, false);
        drawEmbers(dt, p);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || killed || reduced || !scene) return;
      running = true;
      lastT = -1;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    size();
    if (reduced) paintStatic(); // RM → immediate static paint; loop never starts

    // IO-gated rAF (pause off-screen) + visibilitychange pause
    const io = new IntersectionObserver((entries) => {
      intersecting = entries.some((e) => e.isIntersecting);
      if (intersecting && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);

    const onVis = () => {
      if (document.hidden) stop();
      else if (intersecting) start();
    };
    document.addEventListener("visibilitychange", onVis);

    const onRM = () => {
      reduced = mq.matches;
      if (reduced) {
        stop();
        paintStatic();
      } else if (intersecting && !document.hidden) {
        start();
      }
    };
    mq.addEventListener("change", onRM);

    const ro = new ResizeObserver(() => {
      size();
      if (!running) paintStatic(); // static mode (RM/kill/off-screen) stays true
    });
    ro.observe(canvas);

    return () => {
      ro.disconnect();
      io.disconnect();
      mq.removeEventListener("change", onRM);
      document.removeEventListener("visibilitychange", onVis);
      stop();
    };
  }, [progressRef]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />;
}
