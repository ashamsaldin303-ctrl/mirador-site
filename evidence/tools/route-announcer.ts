// MIRADOR — route-announcer probe (P-028, prompt-4 R11 · E70): soft-navigate
// home → menu in both locales and assert the aria-live region speaks the
// landing title (the aural route change). Also proves the handrail: skip-link
// + landmarks on the same pages (the keyboard side rides the walkthroughs).
// Usage: bun evidence/tools/route-announcer.ts
import { chromium } from "playwright";
import { BASE, EVIDENCE_OUT, specLog, ts } from "./lib";

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
});

async function announcerArm(locale: "en" | "ar") {
  const log = specLog(`route-announcer--${locale}`);
  log(`# P-028/E70 · the route announcer fires on soft navigation · ${locale.toUpperCase()} · ${ts()}`);
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  let pass = false;
  try {
    await page.goto(`${BASE}/${locale}`, { waitUntil: "domcontentloaded" });
    await page
      .waitForFunction(() => typeof (window as unknown as { next?: unknown }).next !== "undefined", { timeout: 20000 })
      .catch(() => {});

    // — the handrail: skip-link + landmarks (the navigation chain) —
    const handrail = await page.evaluate(() => ({
      skip: !!document.querySelector('a[href="#main"]'),
      main: !!document.querySelector("main#main"),
      nav: !!document.querySelector("nav"),
      footer: !!document.querySelector("footer"),
      announcer: !!document.querySelector('[aria-live="polite"][role="status"]'),
    }));
    const handrailOk = handrail.skip && handrail.main && handrail.nav && handrail.footer && handrail.announcer;
    log(
      `handrail: skip=${handrail.skip} main=${handrail.main} nav=${handrail.nav} footer=${handrail.footer} announcer-present=${handrail.announcer} → ${handrailOk ? "PASS" : "FAIL"}`,
    );

    // — the announcer: soft-navigate to the menu via a nav link —
    const menuLink = page.locator(`nav a[href="/${locale}/menu"]`).first();
    await menuLink.click();
    await page
      .waitForFunction(() => {
        const t = document.querySelector('[aria-live="polite"][role="status"]')?.textContent?.trim() ?? "";
        return t.length > 0;
      }, { timeout: 15000 })
      .catch(() => {});
    const announcement = await page.evaluate(
      () => document.querySelector('[aria-live="polite"][role="status"]')?.textContent?.trim() ?? "",
    );
    const title = await page.title();
    const spoke = announcement.length > 0 && announcement === title;
    log(`announcer spoke: "${announcement}" (document.title "${title}") → ${spoke ? "PASS" : "FAIL"}`);
    pass = handrailOk && spoke;
    log(`VERDICT: ${pass ? "PASS" : "FAIL"}`);
  } finally {
    await context.close();
  }
  return pass;
}

let allPass = true;
try {
  allPass = (await announcerArm("en")) && (await announcerArm("ar"));
} finally {
  await browser.close();
}
console.log(`route-announcer done → ${EVIDENCE_OUT}specs/route-announcer logs (${allPass ? "PASS" : "FAIL"})`);
if (!allPass) process.exit(1);
