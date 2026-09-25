// RM + no-JS contract verification (spec 1-e §4.4/§5.4) — run with bun.
import { chromium } from "playwright";

const BASE = "http://localhost:3000";

async function rmTest() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  for (const loc of ["en", "ar"]) {
    await page.goto(`${BASE}/${loc}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const res = await page.evaluate(() => {
      const hidden = Array.from(
        document.querySelectorAll("[data-reveal],[data-reveal-group]"),
      ).filter((e) => getComputedStyle(e).opacity === "0");
      const hero = document.querySelector(".hero");
      return {
        rmMatch: matchMedia("(prefers-reduced-motion: reduce)").matches,
        revealHidden: hidden.length,
        heroArmed: hero?.getAttribute("data-armed") ?? null,
        h1op: getComputedStyle(document.querySelector(".hero h1") as Element).opacity,
        pinSpacer: !!document.querySelector(".pin-spacer"),
        lenisRunning: !!document.querySelector("html.lenis"),
      };
    });
    console.log(`[RM /${loc}]`, JSON.stringify(res));
  }
  // menu page under RM
  await page.goto(`${BASE}/en/menu`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const menuRes = await page.evaluate(() => {
    const hidden = Array.from(
      document.querySelectorAll("[data-reveal],[data-reveal-group]"),
    ).filter((e) => getComputedStyle(e).opacity === "0");
    return { revealHidden: hidden.length };
  });
  console.log("[RM /en/menu]", JSON.stringify(menuRes));
  console.log("[RM pageErrors]", errors.length);
  await browser.close();
}

async function noJsTest() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  const page = await ctx.newPage();
  for (const loc of ["en", "ar"]) {
    await page.goto(`${BASE}/${loc}`, { waitUntil: "load" });
    await page.waitForTimeout(800);
    const res = await page.evaluate(() => {
      const hidden = Array.from(
        document.querySelectorAll("[data-reveal],[data-reveal-group]"),
      ).filter((e) => getComputedStyle(e).opacity === "0");
      return {
        jsGate: document.documentElement.getAttribute("data-js"),
        revealHidden: hidden.length,
        h1op: getComputedStyle(document.querySelector(".hero h1") as Element).opacity,
        h1Text: document.querySelector(".hero h1")?.textContent?.slice(0, 30),
        ctaText: document.querySelector(".hero a[href*='reserve']")?.textContent?.trim(),
        paragraphCount: document.querySelectorAll("p").length,
      };
    });
    console.log(`[noJS /${loc}]`, JSON.stringify(res));
  }
  await browser.close();
}

await rmTest();
await noJsTest();
process.exit(0);
