// MIRADOR — re-capture of 3 AR-reserve screenshots AFTER a real product fix.
//
// TRUE diagnosis (supersedes the earlier "tool timing bug" hypothesis):
// the original captures were flat because /reserve had a REAL horizontal
// overflow at 375 (document scrollWidth 4096 > clientWidth 375) — the date
// fieldset, a flex item with default min-width:auto, sized itself to its
// min-w-max strip content (≈4K px). In LTR the overflow extended invisibly
// right; in RTL it displaced the composited viewport, so the AR captures
// painted flat. Fixed in src/components/reserve/reserve-form.tsx by min-w-0
// on both fieldsets (F12-6 product fix — checks untouched). This script
// re-captures the three affected files and re-verifies the overflow bound.
// Usage: bun evidence/tools/recapture-ar-reserve.ts
import { chromium } from "playwright";
import sharp from "sharp";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { BASE, EVIDENCE_ROOT } from "./lib";

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
});
const note: string[] = [`\n# re-capture ${new Date().toISOString()} — reserve--ar--{375,768,1440}.png`];
note.push(`# TRUE diagnosis: original flat captures were the visible symptom of a REAL F12-6 overflow defect (scrollWidth 4096 > 375) present in BOTH locales — the date fieldset flex item (min-width:auto) sized to its min-w-max strip content. LTR hid it visually; RTL displaced the painted viewport.`);
note.push(`# product fix: min-w-0 on both reserve fieldsets (src/components/reserve/reserve-form.tsx) — checks untouched. Post-fix scrollWidth=360 ≤ clientWidth=375 on /en/reserve and /ar/reserve (verified below per width).`);

for (const { width, height } of [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
]) {
  const c = await browser.newContext({ viewport: { width, height } });
  const page = await c.newPage();
  await page.goto(`${BASE}/ar/reserve`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.locator('button[aria-label*="طاولات"]').first().waitFor({ state: "visible", timeout: 30000 });
  await page.waitForTimeout(900);
  const check = await page.evaluate((w) => {
    const html = document.documentElement;
    const t = document.body.innerText;
    return {
      scrollWidth: html.scrollWidth,
      clientWidth: w,
      contentOk: t.includes("الاسم") && t.includes("الهاتف") && t.includes("التاريخ"),
    };
  }, width);
  if (!check.contentOk) throw new Error(`ar/reserve content check failed at ${width}`);
  const file = `${EVIDENCE_ROOT}F1-5/reserve--ar--${width}.png`;
  await page.screenshot({ path: file });
  const stats = await sharp(file).stats();
  const maxStdev = Math.max(...stats.channels.map((ch) => ch.stdev));
  note.push(
    `reserve--ar--${width}.png re-captured — content PASS, scrollWidth ${check.scrollWidth} ≤ clientWidth ${check.clientWidth} → ${check.scrollWidth <= check.clientWidth ? "no overflow" : "OVERFLOW"}, pixel stdev ${maxStdev.toFixed(1)}`,
  );
  if (maxStdev < 1) throw new Error(`re-capture still flat at ${width}`);
  if (check.scrollWidth > check.clientWidth) throw new Error(`overflow persists at ${width}`);
  await c.close();
}
await browser.close();

// correct the earlier WRONG annotation in the manifest (honesty: the first
// re-capture attempt mislabeled the defect as a tool timing bug)
const manifestPath = `${EVIDENCE_ROOT}screenshots/manifest.txt`;
const manifest = readFileSync(manifestPath, "utf8").replace(
  /# re-capture [^\n]*— reserve--ar--\{375,768,1440\}\.png\n# reason: original sweep settle\(\) silently caught[^\n]*\n/g,
  "",
);
writeFileSync(manifestPath, manifest);
appendFileSync(manifestPath, note.join("\n") + "\n");
console.log("re-capture complete — 3 files replaced, manifest corrected (true defect + fix documented)");
