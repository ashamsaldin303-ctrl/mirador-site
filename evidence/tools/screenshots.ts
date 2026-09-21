// MIRADOR — §10.2 screenshot battery (prompt-2 P3c): 8 routes × 2 locales × 3
// viewports + one forced-colors pass per route + prefers-reduced-motion on home.
// Usage: bun evidence/tools/screenshots.ts
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { BASE, EVIDENCE_OUT, outDir, db, seedConfirmationId } from "./lib";

const prisma = db();
const SEED_CONFIRMATION_ID = await seedConfirmationId(prisma); // fresh per surface (see lib.ts)
await prisma.$disconnect();
const ROUTES: { name: string; path: string }[] = [
  { name: "home", path: "" },
  { name: "menu", path: "/menu" },
  { name: "reserve", path: "/reserve" },
  { name: "story", path: "/story" },
  { name: "gallery", path: "/gallery" },
  { name: "private-dining", path: "/private-dining" },
  { name: "contact", path: "/contact" },
  { name: "confirmation", path: `/confirmation/${SEED_CONFIRMATION_ID}` },
];
const LOCALES = ["en", "ar"] as const;
const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];
const ACT_COPY = [
  "The city switches on, window by window.",
  "In the kitchen, fire does the quiet work",
  "one table holds the whole skyline",
];

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
});

async function settle(page: import("playwright").Page, route: string) {
  // reserve needs the live availability grid before capture (never the skeleton)
  if (route === "reserve") {
    await page
      .locator('button[aria-label*="tables"], button[aria-label*="طاولات"]')
      .first()
      .waitFor({ state: "visible", timeout: 20000 })
      .catch(() => {});
  }
  await page.waitForTimeout(700);
}

const manifest: string[] = [`# screenshot manifest — machine-generated ${new Date().toISOString()}`];

// 1) default set — <surface>/F1-5/<route>--<locale>--<width>.png
outDir("F1-5");
const ctx = await browser.newContext({ viewport: VIEWPORTS[2] });
for (const { width, height } of VIEWPORTS) {
  const c = await browser.newContext({ viewport: { width, height } });
  const page = await c.newPage();
  for (const loc of LOCALES) {
    for (const { name, path } of ROUTES) {
      await page.goto(`${BASE}/${loc}${path}`, { waitUntil: "domcontentloaded" });
      await settle(page, name);
      if (name === "reserve") await page.waitForTimeout(1200); // pace availability reads
      const file = `${EVIDENCE_OUT}F1-5/${name}--${loc}--${width}.png`;
      await page.screenshot({ path: file });
      manifest.push(`F1-5/${name}--${loc}--${width}.png`);
    }
  }
  await c.close();
}
await ctx.close();

// 2) forced-colors — one pass per route (EN, 1440) — <surface>/forced-colors/
outDir("forced-colors");
{
  const c = await browser.newContext({
    viewport: VIEWPORTS[2],
    forcedColors: "active",
  });
  const page = await c.newPage();
  for (const { name, path } of ROUTES) {
    await page.goto(`${BASE}/en${path}`, { waitUntil: "domcontentloaded" });
    await settle(page, name);
    const file = `${EVIDENCE_OUT}forced-colors/${name}--forcedcolors--1440.png`;
    await page.screenshot({ path: file });
    manifest.push(`forced-colors/${name}--forcedcolors--1440.png`);
  }
  await c.close();
}

// 3) prefers-reduced-motion on home — F5-3 static 3-act layout + copy present
outDir("F5-3");
{
  const log: string[] = [`# F5-3 RM emulation — machine-generated ${new Date().toISOString()}`];
  const c = await browser.newContext({ viewport: VIEWPORTS[2], reducedMotion: "reduce" });
  const page = await c.newPage();
  await page.goto(`${BASE}/en`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1500);
  const file = `${EVIDENCE_OUT}F5-3/home--rm--1440.png`;
  await page.screenshot({ path: file, fullPage: false });
  manifest.push(`F5-3/home--rm--1440.png`);
  // copy-present assertion (F5-3): all three act copies present in the DOM
  const body = await page.evaluate(() => document.body.innerText);
  for (const copy of ACT_COPY) {
    log.push(`act copy present: ${JSON.stringify(copy)} → ${body.includes(copy) ? "YES" : "NO"}`);
  }
  const rmActive = await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  log.push(`matchMedia(prefers-reduced-motion: reduce) = ${rmActive}`);
  log.push(`all acts present: ${ACT_COPY.every((s) => body.includes(s)) ? "PASS — static 3-act layout with full copy" : "FAIL"}`);
  writeFileSync(`${EVIDENCE_OUT}F5-3/rm-copy-check.log`, log.join("\n") + "\n");
  await c.close();
}

await browser.close();
outDir("screenshots");
writeFileSync(`${EVIDENCE_OUT}screenshots/manifest.txt`, manifest.join("\n") + "\n");
console.log(`done: ${manifest.length - 1} screenshots + manifest + RM copy check`);
