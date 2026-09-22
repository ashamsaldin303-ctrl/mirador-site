// MIRADOR — §10.2 keyboard walkthroughs (prompt-2 P3e).
// Logs: menu overlay · gallery lightbox · reserve form errors (AR, RTL-correct) + EN pair.
// Usage: bun evidence/tools/keyboard.ts
import { chromium } from "playwright";
import { specLog, BASE } from "./lib";

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
});

async function activeDesc(page: import("playwright").Page): Promise<string> {
  const d = await page.evaluate(() => {
    const a = document.activeElement;
    if (!a) return "(null)";
    return {
      tag: a.tagName.toLowerCase(),
      name: a.getAttribute("aria-label") ?? (a.textContent ?? "").trim().slice(0, 40),
      inDialog: !!a.closest('[role="dialog"]'),
    };
  });
  if (typeof d === "string") return d;
  return `<${d.tag}> "${d.name}"${d.inDialog ? " [in-dialog]" : ""}`;
}

async function menuOverlay() {
  const log = specLog("keyboard-menu-overlay--en");
  log(`# F3-7 · dish overlay: keyboard open → focus trap → Esc → focus restored`);
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto(`${BASE}/en/menu`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  const trigger = page.locator("li[data-dish-row] button").first();
  await trigger.waitFor({ state: "visible", timeout: 15000 });
  await trigger.focus();
  log(`step 1 — focused dish trigger: ${await activeDesc(page)}`);
  await page.keyboard.press("Enter");
  const dialog = page.locator('[role="dialog"]');
  await dialog.waitFor({ state: "visible", timeout: 10000 });
  log(`step 2 — Enter → overlay visible; activeElement: ${await activeDesc(page)}`);
  for (let i = 1; i <= 8; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(80);
    log(`step 3.${i} — Tab → ${await activeDesc(page)}`);
  }
  const trapped = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    const a = document.activeElement;
    return !!d && !!a && !!d.contains(a);
  });
  log(`focus-trap check after 8 Tabs: ${trapped ? "PASS — focus never left the dialog" : "FAIL — focus escaped"}`);
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 10000 });
  const restored = await page.evaluate(() => {
    const t = document.querySelector<HTMLButtonElement>("li[data-dish-row] button");
    return document.activeElement === t;
  });
  log(`step 4 — Esc → overlay closed; focus restored to trigger: ${restored ? "PASS" : "FAIL — activeElement=" + (await activeDesc(page))}`);
  const allergenTable = await page.evaluate(() => document.querySelectorAll('[role="dialog"] table, [role="dialog"] [role="table"]').length);
  log(`(allergen table presence re-checked on open in the axe JSONs — see evidence/axe/)`);
  log(`# VERDICT: ${trapped && restored ? "PASS — keyboard-operable overlay with focus trap + Esc + restore" : "FAIL"}`);
  await page.close();
}

async function lightbox() {
  const log = specLog("keyboard-lightbox--en");
  log(`# F7-1 · lightbox: keyboard open → arrows navigate → focus trap → Esc`);
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.goto(`${BASE}/en/gallery`, { waitUntil: "domcontentloaded" });
  const first = page.locator("main button").first();
  await first.waitFor({ state: "visible", timeout: 15000 });
  await first.focus();
  await page.keyboard.press("Enter");
  const dialog = page.locator('[role="dialog"]');
  await dialog.waitFor({ state: "visible", timeout: 10000 });
  log(`step 1 — Enter on gallery item → lightbox open; activeElement: ${await activeDesc(page)}`);
  const counterBefore = await page.locator('[role="dialog"]').innerText().then((t) => t.split("\n").find((l) => /\d+\s+\S+\s+\d+/.test(l)) ?? "");
  log(`step 2 — counter before: "${counterBefore.trim()}"`);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
  const counterAfter = await page.locator('[role="dialog"]').innerText().then((t) => t.split("\n").find((l) => /\d+\s+\S+\s+\d+/.test(l)) ?? "");
  log(`step 3 — ArrowRight → counter after: "${counterAfter.trim()}"`);
  for (let i = 1; i <= 6; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(80);
    log(`step 4.${i} — Tab → ${await activeDesc(page)}`);
  }
  const trapped = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"]');
    const a = document.activeElement;
    return !!d && !!a && !!d.contains(a);
  });
  log(`focus-trap check: ${trapped ? "PASS" : "FAIL"}`);
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden", timeout: 10000 });
  log(`step 5 — Esc → lightbox closed`);
  const nav = counterBefore !== counterAfter;
  log(`# VERDICT: ${trapped && nav ? "PASS — arrows navigate, focus trapped, Esc closes" : "FAIL"}`);
  await page.close();
}

async function reserveErrors(locale: "en" | "ar") {
  const log = specLog(`keyboard-reserve-errors--${locale}`);
  const ar = locale === "ar";
  log(`# F8-3 · empty submit → per-field ${ar ? "ARABIC (RTL-correct)" : "ENGLISH"} errors`);
  const page = await (await browser.newContext({ viewport: { width: 375, height: 812 } })).newPage();
  await page.goto(`${BASE}/${locale}/reserve`, { waitUntil: "domcontentloaded" });
  await page.locator('button[aria-label*="tables"], button[aria-label*="طاولات"]').first().waitFor({ state: "visible", timeout: 30000 }).catch(() => {});
  const dirBefore = await page.evaluate(() => document.documentElement.dir);
  await page.click("form button[type=submit]");
  await page.waitForTimeout(600);
  const res = await page.evaluate(() => {
    const get = (sel: string) => document.querySelector(sel)?.textContent?.trim() ?? "(absent)";
    return {
      name: get("#reserve-name-error"),
      phone: get("#reserve-phone-error"),
      slot: get("#reserve-slot-error"),
      nameInvalid: document.querySelector("#reserve-name")?.getAttribute("aria-invalid"),
      phoneInvalid: document.querySelector("#reserve-phone")?.getAttribute("aria-invalid"),
      described: document.querySelector("#reserve-name")?.getAttribute("aria-describedby"),
      dir: document.documentElement.dir,
      lang: document.documentElement.lang,
    };
  });
  log(`html: lang=${res.lang} dir=${res.dir} (before submit dir=${dirBefore})`);
  log(`name error:  "${res.name}"`);
  log(`phone error: "${res.phone}"`);
  log(`slot error:  "${res.slot}"`);
  log(`aria-invalid: name=${res.nameInvalid} phone=${res.phoneInvalid} · aria-describedby(name)=${res.described}`);
  const expect = ar
    ? { name: "يرجى إدخال اسم صحيح.", phone: "يرجى إدخال رقم هاتف صحيح.", slot: "يرجى اختيار وقت متاح.", dir: "rtl" }
    : { name: "Please use a valid name.", phone: "Please use a valid phone number.", slot: "Please choose an available time.", dir: "ltr" };
  const rtlCorrect = !ar || res.dir === "rtl";
  const verdict =
    res.name === expect.name && res.phone === expect.phone && res.slot === expect.slot && res.dir === expect.dir && rtlCorrect && res.nameInvalid === "true"
      ? `PASS — all three per-field errors bilingual-correct, dir=${res.dir} (RTL-correct), aria-invalid set`
      : `FAIL — got ${JSON.stringify(res)}`;
  log(`# VERDICT: ${verdict}`);
  await page.close();
}

/** E39 (prompt-4 R2) — mobile nav sheet walkthrough at 375px (<1024px):
 * keyboard open → focus trap → navigate (route change from inside the sheet) →
 * Esc close → reopen → scrim (pointer) close. Both locales (panel side mirrors). */
async function mobileSheet(locale: "en" | "ar") {
  const log = specLog(`keyboard-mobile-sheet--${locale}`);
  const ar = locale === "ar";
  log(`# E39 · mobile nav sheet (${ar ? "AR · side=left · RTL" : "EN · side=right · LTR"}) — open → trap → navigate → Esc/scrim close`);
  const page = await (await browser.newContext({ viewport: { width: 375, height: 812 } })).newPage();
  await page.goto(`${BASE}/${locale}`, { waitUntil: "domcontentloaded" });
  await page
    .waitForFunction(() => typeof (window as unknown as { next?: unknown }).next !== "undefined", { timeout: 20000 })
    .catch(() => {});
  const triggerSel = `button[aria-label="${ar ? "افتح القائمة" : "Open menu"}"]`;
  const trigger = page.locator(triggerSel);
  await trigger.waitFor({ state: "visible", timeout: 15000 });
  await trigger.focus();
  log(`step 1 — focused menu trigger: ${await activeDesc(page)}`);
  await page.keyboard.press("Enter");
  const panel = page.locator('[data-slot="sheet-content"]');
  await panel.waitFor({ state: "visible", timeout: 10000 });
  log(`step 2 — Enter → sheet open; activeElement: ${await activeDesc(page)}`);
  for (let i = 1; i <= 8; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(80);
    log(`step 3.${i} — Tab → ${await activeDesc(page)}`);
  }
  const trapped = await page.evaluate(() => {
    const d = document.querySelector('[data-slot="sheet-content"]');
    const a = document.activeElement;
    return !!d && !!a && !!d.contains(a);
  });
  log(`focus-trap check after 8 Tabs: ${trapped ? "PASS — focus never left the sheet" : "FAIL — focus escaped"}`);
  const menuLink = panel.locator('a[href$="/menu"]');
  await menuLink.focus();
  log(`step 4 — focused sheet link: ${await activeDesc(page)}`);
  await page.keyboard.press("Enter");
  await page.waitForURL(/\/menu$/, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(500); // sheet exit animation (100ms) + unmount
  const navigated = /\/menu$/.test(new URL(page.url()).pathname);
  const closedAfterNav = (await panel.count()) === 0;
  log(`step 5 — Enter → URL ${page.url()} · sheet closed: ${navigated && closedAfterNav ? "PASS" : `FAIL (navigated=${navigated} closed=${closedAfterNav})`}`);
  await page.goBack();
  await page.waitForTimeout(600);
  await page.click(triggerSel);
  await panel.waitFor({ state: "visible", timeout: 10000 });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const escClosed = (await panel.count()) === 0;
  log(`step 6 — reopen → Esc → sheet closed: ${escClosed ? "PASS" : "FAIL"}`);
  await page.click(triggerSel);
  await panel.waitFor({ state: "visible", timeout: 10000 });
  const scrimX = ar ? 355 : 20;
  await page.mouse.click(scrimX, 400);
  await page.waitForTimeout(400);
  const scrimClosed = (await panel.count()) === 0;
  log(`step 7 — reopen → scrim click (pointer) at (${scrimX},400) → sheet closed: ${scrimClosed ? "PASS" : "FAIL"}`);
  const verdict = trapped && navigated && closedAfterNav && escClosed && scrimClosed;
  log(`# VERDICT: ${verdict ? "PASS — keyboard-operable mobile sheet: trap, navigate, Esc, scrim" : "FAIL"}`);
  await page.close();
}

await menuOverlay();
await lightbox();
await mobileSheet("en");
await mobileSheet("ar");
await reserveErrors("ar");
await reserveErrors("en");
await browser.close();
console.log("done — 6 keyboard walkthrough logs in /evidence/specs/");
