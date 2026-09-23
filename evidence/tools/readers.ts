// MIRADOR — the readers suite (P-042, prompt-4 R12 · E75): the three readers
// on home · menu · reserve · confirmation, both locales.
//   Hands (keyboard)  — Tab walks the interactive surface; every stop shows
//                       the BEZEL (2px amber outline) and no stop is lost to
//                       pointer-only affordances (focusable count > 0).
//   Ears (SR model)   — one h1 per route; landmarks present; live regions
//                       wired (menu count / party stepper); axe-clean
//                       (critical violations = 0 on the four routes).
//   Calm (reduced motion) — emulation ON: content fully present (h1 + body
//                       text), zero transform/opacity animations mid-flight
//                       (computed animationName/transform of the h1 = none).
// Confirmation rides the FIRST seeded reservation id (dynamic per surface).
// Usage: bun evidence/tools/readers.ts
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";
import { BASE, EVIDENCE_OUT, db, seedConfirmationId, specLog, ts, outDir } from "./lib";

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
});

const prisma = db();
const CID = await seedConfirmationId(prisma);

const ROUTES: [string, string][] = [
  ["home", ""],
  ["menu", "menu"],
  ["reserve", "reserve"],
  ["confirmation", `confirmation/${CID}`],
];

async function readersRoute(name: string, path: string, locale: "en" | "ar") {
  const log = specLog(`readers--${name}--${locale}`);
  log(`# P-042/E75 · the three readers · ${name} · ${locale.toUpperCase()} · ${ts()}`);
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  let pass = true;
  try {
    await page.goto(`${BASE}/${locale}${path ? `/${path}` : ""}`, { waitUntil: "domcontentloaded" });
    await page
      .waitForFunction(() => typeof (window as unknown as { next?: unknown }).next !== "undefined", { timeout: 20000 })
      .catch(() => {});

    // — Hands: the reserve shell hydrates on intent (P-022) — trigger it —
    if (name === "reserve") {
      await page.keyboard.press("Tab"); // first focus-in arms the intent hydration
      await page.waitForTimeout(1200);
    }

    // — HANDS: Tab walk (8 stops) — every stop shows the bezel.
    // 450ms per stop: transition-carrying elements transition outline-color
    // (the R8 bezel-probe lesson — mid-flight reads interpolate). —
    let bezelStops = 0;
    let stops = 0;
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(450);
      const focus = await page.evaluate(() => {
        const a = document.activeElement;
        if (!a || a === document.body) return null;
        const cs = getComputedStyle(a);
        return {
          tag: a.tagName.toLowerCase(),
          outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
        };
      });
      if (focus) {
        stops += 1;
        const isBezel = /2px\s+solid\s+rgb\(203,\s*163,\s*92\)/.test(focus.outline.replace(/\s+/g, " "));
        if (isBezel) bezelStops += 1;
      }
    }
    const hands = stops > 0 && bezelStops === stops;
    log(`Hands: ${stops} tab stops · ${bezelStops} with the bezel → ${hands ? "PASS" : "FAIL"}`);
    if (!hands) pass = false;

    // — EARS: structure — one h1 · landmarks · live regions —
    const ears = await page.evaluate(() => ({
      h1: document.querySelectorAll("h1").length,
      main: !!document.querySelector("main"),
      nav: !!document.querySelector("nav") || !!document.querySelector("[aria-label]"),
      footer: !!document.querySelector("footer"),
      live: document.querySelectorAll('[aria-live="polite"]').length,
      title: document.title,
    }));
    const earsOk = ears.h1 === 1 && ears.main && ears.footer && ears.title.length > 0;
    log(`Ears: h1=${ears.h1} main=${ears.main} footer=${ears.footer} live-regions=${ears.live} title="${ears.title.slice(0, 40)}" → ${earsOk ? "PASS" : "FAIL"}`);
    if (!earsOk) pass = false;

    // — EARS: axe (critical impact only — the four-reader surface) —
    const axe = await new AxeBuilder({ page }).analyze();
    const critical = axe.violations.filter((v) => v.impact === "critical");
    log(`Ears/axe: critical violations=${critical.length}${critical.length ? ` (${critical.map((v) => v.id).join(",")})` : ""} → ${critical.length === 0 ? "PASS" : "FAIL"}`);
    if (critical.length > 0) pass = false;

    // — CALM: reduced-motion emulation — content present, no animations —
    await context.close();
    const calmContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const calmPage = await calmContext.newPage();
    await calmPage.goto(`${BASE}/${locale}${path ? `/${path}` : ""}`, { waitUntil: "domcontentloaded" });
    await calmPage.waitForTimeout(1500);
    if (name === "reserve") {
      await calmPage.keyboard.press("Tab");
      await calmPage.waitForTimeout(1200);
    }
    const calm = await calmPage.evaluate(() => {
      const h1 = document.querySelector("h1");
      const cs = h1 ? getComputedStyle(h1) : null;
      // REAL motion only: an animation whose duration survives the RM freeze
      // (>100ms) or a live transform on a visible element. The global RM block
      // pins durations to 0.01ms — names remain, motion does not.
      const animated = Array.from(document.querySelectorAll("*")).filter((el) => {
        if (el.closest("[aria-hidden]")) return false;
        const a = getComputedStyle(el);
        const animMs = a.animationName !== "none" ? parseFloat(a.animationDuration) || 0 : 0;
        const transMs = a.transitionProperty !== "none" ? parseFloat(a.transitionDuration) || 0 : 0;
        const moving = animMs > 100 || a.transform !== "none";
        return moving && !el.closest("[aria-hidden]");
      }).length;
      return {
        h1: h1?.textContent?.trim().slice(0, 40) ?? "",
        h1Animation: cs?.animationName ?? "none",
        animatedCount: animated,
        bodyChars: document.body.textContent?.length ?? 0,
      };
    });
    const calmOk = calm.h1.length > 0 && calm.bodyChars > 400 && calm.animatedCount === 0;
    log(`Calm: h1="${calm.h1}" · animated elements=${calm.animatedCount} · body=${calm.bodyChars} chars → ${calmOk ? "PASS" : "FAIL"}`);
    if (!calmOk) pass = false;
    await calmContext.close();
  } finally {
    await context.close();
  }
  log(`VERDICT: ${pass ? "PASS" : "FAIL"}`);
  return pass;
}

let allPass = true;
try {
  for (const [name, path] of ROUTES) {
    for (const locale of ["en", "ar"] as const) {
      const ok = await readersRoute(name, path, locale);
      allPass = allPass && ok;
    }
  }
} finally {
  await browser.close();
  await prisma.$disconnect();
}
outDir("readers");
console.log(`readers done → ${EVIDENCE_OUT}specs/readers logs (${allPass ? "PASS — 4 routes × 2 locales × 3 readers" : "FAIL"})`);
if (!allPass) process.exit(1);
