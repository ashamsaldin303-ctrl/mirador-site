// E60 (prompt-4 R8): computed BEZEL proof — keyboard-tab onto real interactive
// elements, read the computed outline (the bezel: 2px rgb(203,163,92), offset 2px).
import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const page = await (await browser.newContext({ viewport: { width: 375, height: 812 } })).newPage();
await page.goto("http://localhost:3000/en", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
const rows: string[] = [];
for (let i = 0; i < 6; i++) {
  await page.keyboard.press("Tab");
  await page.waitForTimeout(450); // post-transition read (transition-colors animates outline-color in TW4)
  const r = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      name: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 30),
      outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
      offset: cs.outlineOffset,
      caret: cs.caretColor,
    };
  });
  if (r) rows.push(`${r.tag} "${r.name}" → outline: ${r.outline} · offset: ${r.offset}px · caret: ${r.caret}`);
}
// caret proof on the reserve input (intent-hydrated → trigger first)
await page.goto("http://localhost:3000/en/reserve", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => typeof (window as unknown as { next?: unknown }).next !== "undefined", { timeout: 20000 }).catch(() => {});
await page.locator('[role="group"][aria-busy="true"]').click();
await page.locator("#reserve-name").waitFor({ state: "visible", timeout: 20000 });
const caret = await page.evaluate(() => getComputedStyle(document.querySelector("#reserve-name") ?? document.body).caretColor);
const autofillCss = await page.evaluate(() => {
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        if (rule.cssText.includes("-webkit-autofill")) return rule.cssText.slice(0, 160);
      }
    } catch {}
  }
  return "(not found)";
});
console.log(rows.join("\n"));
console.log("caret (#reserve-name):", caret);
console.log("autofill rule:", autofillCss);
await browser.close();
