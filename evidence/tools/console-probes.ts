// MIRADOR — §10.2 console + probe battery (prompt-2 P3e, parent F12-5/F12-6/F12-7).
// Usage: bun evidence/tools/console-probes.ts
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { BASE, EVIDENCE_ROOT } from "./lib";

const SEED_CONFIRMATION_ID = "cmuax6xbe001ypxqpcebj2fv2";
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

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
});

// ---------- 1) console capture: 8 paths × 2 locales (F12-5) ----------
const consoleLog: string[] = [
  `# console capture — machine-generated ${new Date().toISOString()}`,
  `# gate (F12-5): zero console ERRORS on all 8 paths × 2 locales`,
  `# note: dev-mode info/warning noise (HMR, React DevTools hint, THREE deprecation) is recorded raw and NOT counted as errors`,
];
let errorCount = 0;
for (const loc of ["en", "ar"] as const) {
  for (const { name, path } of ROUTES) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const messages: { type: string; text: string }[] = [];
    page.on("console", (m) => messages.push({ type: m.type(), text: m.text().slice(0, 240) }));
    page.on("pageerror", (e) => messages.push({ type: "pageerror", text: String(e).slice(0, 240) }));
    if (name === "reserve") {
      await page.goto(`${BASE}/${loc}${path}`, { waitUntil: "domcontentloaded" });
      await page.locator('button[aria-label*="tables"], button[aria-label*="طاولات"]').first().waitFor({ state: "visible", timeout: 30000 }).catch(() => {});
    } else {
      await page.goto(`${BASE}/${loc}${path}`, { waitUntil: "domcontentloaded" });
    }
    await page.waitForTimeout(2500);
    const errors = messages.filter((m) => m.type === "error" || m.type === "pageerror");
    errorCount += errors.length;
    consoleLog.push(`\n## /${loc}${path || "/"} — messages: ${messages.length} total, ERRORS: ${errors.length}`);
    for (const m of messages) {
      consoleLog.push(`  [${m.type}] ${m.text.replace(/\n/g, " ")}`);
    }
    writeFileSync(`${EVIDENCE_ROOT}console/${name}--${loc}.log`, consoleLog.slice(consoleLog.lastIndexOf("\n##")).join("\n") + "\n");
    await context.close();
  }
}
consoleLog.push(`\nTOTAL console ERRORS across 16 pages: ${errorCount}`);
consoleLog.push(errorCount === 0 ? `GATE F12-5: PASS — zero console errors on 8 paths × 2 locales` : `GATE F12-5: FAIL — ${errorCount} errors (raw above)`);
writeFileSync(`${EVIDENCE_ROOT}console/summary.txt`, consoleLog.join("\n") + "\n");

// ---------- 2) horizontal-scroll probe at 375 (F12-6) ----------
const scrollLog: string[] = [
  `# scrollWidth probe @375 — machine-generated ${new Date().toISOString()}`,
  `# gate (F12-6): scrollWidth ≤ clientWidth on every route × locale`,
];
let scrollFail = 0;
for (const loc of ["en", "ar"] as const) {
  for (const { name, path } of ROUTES) {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await context.newPage();
    await page.goto(`${BASE}/${loc}${path}`, { waitUntil: "domcontentloaded" });
    if (name === "reserve") {
      await page.locator('button[aria-label*="tables"], button[aria-label*="طاولات"]').first().waitFor({ state: "visible", timeout: 30000 }).catch(() => {});
    }
    await page.waitForTimeout(1200);
    const m = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    const ok = m.sw <= m.cw;
    if (!ok) scrollFail++;
    scrollLog.push(`/${loc}${path || "/"} — scrollWidth=${m.sw} clientWidth=${m.cw} → ${ok ? "OK" : "FAIL — horizontal overflow"}`);
    await context.close();
  }
}
scrollLog.push(scrollFail === 0 ? `GATE F12-6: PASS — no horizontal scroll at 375 on any route × locale` : `GATE F12-6: FAIL — ${scrollFail} routes overflow`);
writeFileSync(`${EVIDENCE_ROOT}probes/scroll-width--375.log`, scrollLog.join("\n") + "\n");

// ---------- 3) interactive target sizes ≥44px (F12-7) ----------
const targetLog: string[] = [
  `# interactive target probe — machine-generated ${new Date().toISOString()}`,
  `# gate (F12-7): effective size ≥44×44 (WCAG floor 24×24 recorded for context)`,
  `# scope per contract: nav · filters · forms · lightbox (visible targets only)`,
];
let under44 = 0;
async function probeTargets(routeLabel: string, url: string, open?: (page: import("playwright").Page) => Promise<void>) {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  if (open) await open(page);
  const targets = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("a, button, input, textarea, select, [role=button]"));
    return els
      .filter((e) => {
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
      })
      .map((e) => {
        const r = e.getBoundingClientRect();
        return {
          tag: e.tagName.toLowerCase(),
          name: (e.getAttribute("aria-label") ?? (e.textContent ?? "").trim().slice(0, 28)) || "(unnamed)",
          w: Math.round(r.width),
          h: Math.round(r.height),
        };
      });
  });
  targetLog.push(`\n## ${routeLabel} (@375, ${targets.length} visible targets)`);
  for (const t of targets) {
    const ok = t.w >= 44 && t.h >= 44;
    if (!ok) under44++;
    targetLog.push(`  <${t.tag}> "${t.name}" — ${t.w}×${t.h}px → ${ok ? "≥44" : `UNDER 44 (${t.w >= 24 && t.h >= 24 ? "within WCAG 24px floor" : "below WCAG floor"})`}`);
  }
  await context.close();
}
await probeTargets("nav (home @375 + @1440)", `${BASE}/en`);
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/en`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const targets = await page.evaluate(() => {
    return Array.from(document.querySelectorAll<HTMLElement>("header a, header button"))
      .filter((e) => e.getBoundingClientRect().width > 0)
      .map((e) => {
        const r = e.getBoundingClientRect();
        return { tag: e.tagName.toLowerCase(), name: (e.getAttribute("aria-label") ?? (e.textContent ?? "").trim().slice(0, 28)) || "(unnamed)", w: Math.round(r.width), h: Math.round(r.height) };
      });
  });
  targetLog.push(`\n## nav desktop (header @1440, ${targets.length} targets)`);
  for (const t of targets) {
    const ok = t.w >= 44 && t.h >= 44;
    if (!ok) under44++;
    targetLog.push(`  <${t.tag}> "${t.name}" — ${t.w}×${t.h}px → ${ok ? "≥44" : `UNDER 44 (${t.w >= 24 && t.h >= 24 ? "within WCAG 24px floor" : "below WCAG floor"})`}`);
  }
  await context.close();
}
await probeTargets("menu filters (@375)", `${BASE}/en/menu`);
await probeTargets("reserve form (@375)", `${BASE}/en/reserve`, async (page) => {
  await page.locator('button[aria-label*="tables"]').first().waitFor({ state: "visible", timeout: 30000 }).catch(() => {});
});
await probeTargets("gallery + lightbox (@375)", `${BASE}/en/gallery`, async (page) => {
  await page.locator("main button").first().click();
  await page.waitForTimeout(800);
});
targetLog.push(`\nUNDER-44 total: ${under44}`);
targetLog.push(under44 === 0 ? `GATE F12-7: PASS — every visible interactive target ≥44×44` : `GATE F12-7: ${under44} targets under 44px (raw list above — effective-size/spacing evaluation recorded verbatim)`);
writeFileSync(`${EVIDENCE_ROOT}probes/targets-44px.log`, targetLog.join("\n") + "\n");

await browser.close();
console.log(`done — console errors=${errorCount}, scroll fails=${scrollFail}, under44=${under44}`);
