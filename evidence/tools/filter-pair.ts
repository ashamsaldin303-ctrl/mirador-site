// MIRADOR — F3-5 filter evidence pair, RE-SHOT FOR REAL (prompt-4 R6 · E50).
// The round-1 pair (menu--en--filter-mid/after.png) was byte-identical (same
// md5 — the "filtered" shot never applied the filter). This spec captures the
// unfiltered and vegan-filtered states in ONE run: row counts 28 → 4, the
// aria-live announcement, and screenshots whose md5s MUST differ.
// Run-14 lesson: the P-028 route announcer is also [aria-live="polite"] and
// sits FIRST in the DOM (layout precedes content) — a bare [aria-live] .first()
// read the announcer's empty region and failed E50 on a green menu. The menu's
// count region is targeted by its dedicated data-dish-count hook instead
// (same convention as [data-dish-row]).
// Usage: bun evidence/tools/filter-pair.ts
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { chromium } from "playwright";
import { BASE, EVIDENCE_OUT, outDir, specLog, ts } from "./lib";

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
});

const md5 = (p: string) => createHash("md5").update(readFileSync(p)).digest("hex");

async function filterPair(locale: "en" | "ar") {
  const log = specLog(`filter-pair--${locale}`);
  log(`# F3-5/E50 · menu filter pair RE-SHOT · ${locale.toUpperCase()} · ${ts()}`);
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  let pass = true;
  try {
    await page.goto(`${BASE}/${locale}/menu`, { waitUntil: "domcontentloaded" });
    await page
      .waitForFunction(() => typeof (window as unknown as { next?: unknown }).next !== "undefined", { timeout: 20000 })
      .catch(() => {});

    // the menu's OWN live region — NOT the route announcer (run-14 lesson)
    const live = () => page.locator("[data-dish-count]");

    // — BEFORE: no filter → all 28 rows, live region announces the full count —
    await page.waitForSelector("[data-dish-row]");
    const beforeRows = await page.locator("[data-dish-row]").count();
    const beforeAnnouncement = (await live().textContent())?.trim() ?? "";
    const beforeShot = `${outDir("F3-5")}/menu--${locale}--unfiltered--1440.png`;
    await page.screenshot({ path: beforeShot, fullPage: false });

    // — APPLY the vegan filter (aria-pressed toggle) —
    const vegan = page.getByRole("button", { name: locale === "ar" ? "نباتي صرف" : "Vegan", exact: true }).first();
    await vegan.waitFor({ state: "visible", timeout: 10000 });
    await vegan.click();
    await page.waitForTimeout(700); // Flip settle (DURATIONS.slow + slack)

    const afterRows = await page.locator("[data-dish-row]").count();
    const afterAnnouncement = (await live().textContent())?.trim() ?? "";
    const pressed = await vegan.getAttribute("aria-pressed");
    const afterShot = `${outDir("F3-5")}/menu--${locale}--filtered-vegan--1440.png`;
    await page.screenshot({ path: afterShot, fullPage: false });

    // — the pair verdict: rows changed, announcement changed, md5s differ —
    const md5Before = md5(beforeShot);
    const md5After = md5(afterShot);
    log(`before: ${beforeRows} rows · aria-live "${beforeAnnouncement}" · md5 ${md5Before}`);
    log(`after : ${afterRows} rows · aria-pressed ${pressed} · aria-live "${afterAnnouncement}" · md5 ${md5After}`);
    log(`pair  : md5s differ = ${md5Before !== md5After}`);

    const rowsOk = beforeRows === 28 && afterRows === 4;
    const announceOk = beforeAnnouncement !== afterAnnouncement && /\d/.test(afterAnnouncement);
    if (!rowsOk) { pass = false; log(`FAIL: expected 28 → 4 rows, got ${beforeRows} → ${afterRows}`); }
    if (!announceOk) { pass = false; log(`FAIL: aria-live announcement did not change meaningfully`); }
    if (md5Before === md5After) { pass = false; log(`FAIL: byte-identical pair — the round-1 defect reproduced`); }
    log(`VERDICT: ${pass ? "PASS" : "FAIL"}`);
  } finally {
    await context.close();
  }
  return pass;
}

let allPass = true;
try {
  allPass = (await filterPair("en")) && (await filterPair("ar"));
} finally {
  await browser.close();
}
console.log(`filter-pair done → ${EVIDENCE_OUT}F3-5/ + specs/filter-pair logs (${allPass ? "PASS" : "FAIL"})`);
if (!allPass) process.exit(1);
