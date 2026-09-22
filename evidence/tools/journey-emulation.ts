// MIRADOR — JRN-1 journey auto-kill emulation (prompt-4 R6 · E55).
// The journey's WebGL canvas self-monitors: rAF-measured frame deltas
// > 33.3ms sustained for > 3 consecutive seconds → onLowFps → poster
// treatment (stacked static acts).
//
// ENVIRONMENT DISCLOSURE (why the shim): headless Chromium schedules rAF
// WITHOUT vsync pacing — callbacks burst with 0ms deltas (impossible on real
// displays, where frame opportunities are vsync-gated ~16.7ms apart). The
// burst zeros constantly reset the monitor's slow-window, so no amount of CPU
// throttling alone can trip it headlessly. The spec therefore installs a
// vsync-pacing rAF shim (addInitScript — frames flushed on a ~16.7ms cadence
// with real timestamps, cancel-safe) BEFORE app code, then STARVES the main
// thread (50ms busy-blocks on a 55ms interval) — sustained > 33ms frame
// spacing = a device rendering under 30fps. Control arm: same shim, NO
// starvation → canvas survives. The kill is the monitor, not the harness.
// Usage: bun evidence/tools/journey-emulation.ts
import { chromium } from "playwright";
import { BASE, EVIDENCE_OUT, outDir, specLog, ts } from "./lib";

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
});

/** vsync-paced rAF shim — real-display frame discipline in headless (0ms-burst) land.
 *  Self-scheduling pump: each flush targets lastFlush+16.7ms, so the cadence
 *  self-corrects after busy blocks — free-running ≈60fps, starved ≈ block cycle. */
const VSYNC_SHIM = `
  (() => {
    const VSYNC = 16.7;
    let seq = 1;
    const pending = new Map();
    let lastFlush = 0;
    const pump = () => {
      const wait = Math.max(0, VSYNC - (performance.now() - lastFlush));
      setTimeout(() => {
        lastFlush = performance.now();
        const t = lastFlush;
        const cbs = [...pending.values()];
        pending.clear();
        for (const cb of cbs) { try { cb(t); } catch {} }
        pump();
      }, wait);
    };
    pump();
    window.requestAnimationFrame = (cb) => {
      const id = seq++;
      pending.set(id, cb);
      return id;
    };
    window.cancelAnimationFrame = (id) => { pending.delete(id); };
  })();
`;

/** in-page per-second fps sampler (rides the shim → measures flush cadence) */
const FPS_SAMPLER = `
  window.__fps = [];
  new Promise((resolve) => {
    let frames = 0;
    let secStart = performance.now();
    const tick = () => {
      frames += 1;
      const now = performance.now();
      if (now - secStart >= 1000) {
        window.__fps.push(Math.round((frames * 1000) / (now - secStart)));
        frames = 0; secStart = now;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    setTimeout(resolve, 100);
  });
`;

/** main-thread starvation: 50ms busy-blocks every 55ms → every frame ≥ ~50ms apart */
const STARVER_ON = `
  window.__starve = setInterval(() => {
    const s = performance.now();
    while (performance.now() - s < 50) {}
  }, 55);
`;
const STARVER_OFF = `clearInterval(window.__starve);`;

async function runArm(starve: boolean) {
  const arm = starve ? "starved-under-30fps" : "control-60fps";
  const log = specLog(`journey-emulation--${arm}`);
  log(`# JRN-1/E55 · journey auto-kill · ${arm} · ${ts()}`);
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.addInitScript(VSYNC_SHIM);
  let pass = false;
  try {
    await page.goto(`${BASE}/en`, { waitUntil: "domcontentloaded" });
    await page
      .waitForFunction(() => typeof (window as unknown as { next?: unknown }).next !== "undefined", { timeout: 20000 })
      .catch(() => {});
    await page.evaluate(FPS_SAMPLER);

    // scroll the journey into the intersection zone → mode resolves → canvas mounts
    await page.evaluate(() => {
      const sections = document.querySelectorAll("section");
      sections[sections.length - 2]?.scrollIntoView({ block: "center" });
    });

    const read = () =>
      page.evaluate(() => ({
        canvas: document.querySelectorAll("canvas").length,
        acts: document.querySelectorAll("article").length,
      }));

    if (!starve) {
      // — control: canvas mounts and SURVIVES ≥6s under the same shim —
      let mounted = false;
      for (let i = 0; i < 15; i++) {
        await page.waitForTimeout(1000);
        const s = await read();
        if (s.canvas > 0) { mounted = true; break; }
      }
      if (mounted) {
        await page.waitForTimeout(6000); // 2× the monitor's 3s window
        const s = await read();
        pass = s.canvas > 0;
        log(`canvas mounted under shim, survives 6s: canvas=${s.canvas}`);
      } else {
        log(`canvas never mounted in the control arm (capability kill — environment, not monitor)`);
      }
      const fps = await page.evaluate(() => (window as unknown as { __fps: number[] }).__fps);
      log(`fps trace (per-second): [${fps.join(", ")}]`);
      log(`VERDICT: ${pass ? "PASS — control: canvas survives at emulated 60fps" : "FAIL"}`);
    } else {
      // — starved: frame spacing held > 33.3ms → the monitor's 3s window trips —
      let killed = false;
      let mounted = false;
      let starved = false;
      for (let i = 0; i < 20; i++) {
        if (i === 0) await page.evaluate(STARVER_ON);
        await page.waitForTimeout(1000);
        const s = await read();
        if (s.canvas > 0) { mounted = true; starved = true; }
        if (mounted && s.canvas === 0 && s.acts >= 3) { killed = true; break; }
      }
      await page.evaluate(STARVER_OFF).catch(() => {});
      const fps = await page.evaluate(() => (window as unknown as { __fps: number[] }).__fps);
      const finalState = await read();
      log(`fps trace (per-second): [${fps.join(", ")}]`);
      log(`final state: canvas=${finalState.canvas} · act articles=${finalState.acts} · mounted=${mounted} · killed=${killed}`);
      const lowStreak = (() => {
        let best = 0, cur = 0;
        for (const f of fps) { if (f < 30) { cur += 1; best = Math.max(best, cur); } else cur = 0; }
        return best;
      })();
      log(`longest <30fps streak: ${lowStreak}s (trigger needs 3 consecutive)`);
      if (killed) {
        const shot = `${outDir("JRN-1")}/journey--en--autokill-poster--1440.png`;
        await page.screenshot({ path: shot });
        log(`poster-swap frame: ${shot}`);
      }
      pass = killed && finalState.canvas === 0 && lowStreak >= 3;
      log(`VERDICT: ${pass ? "PASS — sustained <30fps → monitor trips → canvas unmounted → poster acts render" : "FAIL"}`);
    }
  } finally {
    await context.close();
  }
  return pass;
}

let allPass = true;
try {
  allPass = (await runArm(false)) && (await runArm(true));
} finally {
  await browser.close();
}
console.log(`journey-emulation done → ${EVIDENCE_OUT}JRN-1/ + specs/journey-emulation logs (${allPass ? "PASS" : "FAIL"})`);
if (!allPass) process.exit(1);
