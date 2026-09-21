// MIRADOR — §10.2 browser E2E specs (prompt-2 P3, runs against :3000 dev daemon)
// Usage: bun evidence/tools/browser-specs.ts <locale-atomic|webgl-kill|booking|inquiry|all>
import { chromium } from "playwright";
import { PrismaClient } from "@prisma/client";
import { db, specLog, cleanupTestRows, EVIDENCE_OUT, TEST_PHONE_PREFIX, BASE } from "./lib";

const prisma: PrismaClient = db();

async function freshPage() {
  // --enable-unsafe-swiftshader: headless Chromium needs software WebGL for
  // the control run (canvas mounts when NOT killed); the kill spec itself is
  // flag-driven and independent of GPU presence.
  const browser = await chromium.launch({
    headless: true,
    args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  return { browser, context, page };
}

async function localeAtomic() {
  const log = specLog("locale-atomic");
  log(`# F1-3 · locale switch = atomic dir+lang flip in ONE frame, no full navigation`);
  const { browser, page } = await freshPage();
  try {
    await page.goto(`${BASE}/en`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("a[aria-label=\"العربية\"]");
    // install the observer + soft-nav marker BEFORE the click
    await page.evaluate(() => {
      const w = window as unknown as { __softnav: number; __batches: number; __mutations: unknown[] };
      w.__softnav = 1;
      w.__batches = 0;
      w.__mutations = [];
      const obs = new MutationObserver((records) => {
        const w2 = window as unknown as { __batches: number; __mutations: unknown[] };
        w2.__batches += 1;
        for (const r of records) {
          w2.__mutations.push({
            attribute: r.attributeName,
            oldValue: r.oldValue,
            batch: w2.__batches,
            t: Math.round(performance.now() * 100) / 100,
          });
        }
      });
      obs.observe(document.documentElement, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["lang", "dir"],
      });
    });
    await page.click('a[aria-label="العربية"]');
    await page.waitForFunction(
      () => document.documentElement.dir === "rtl" && document.documentElement.lang === "ar",
      { timeout: 20000 },
    );
    const data = await page.evaluate(() => {
      const w = window as unknown as { __softnav: number; __mutations: unknown[] };
      return {
        mutations: w.__mutations,
        softnavMarker: w.__softnav,
        url: location.href,
        navigationEntries: performance.getEntriesByType("navigation").length,
        htmlLang: document.documentElement.lang,
        htmlDir: document.documentElement.dir,
      };
    });
    log(`# mutation records (verbatim): ${JSON.stringify(data.mutations)}`);
    log(`# html after: lang=${data.htmlLang} dir=${data.htmlDir} url=${data.url}`);
    log(`# soft-nav marker survived full-navigation wipe: ${data.softnavMarker === 1 ? "YES (no full navigation)" : "NO"}`);
    log(`# performance navigation entries: ${data.navigationEntries} (1 = soft nav only)`);
    const muts = data.mutations as { attribute: string; batch: number }[];
    const langRec = muts.find((m) => m.attribute === "lang");
    const dirRec = muts.find((m) => m.attribute === "dir");
    const sameBatch = !!langRec && !!dirRec && langRec.batch === dirRec.batch;
    const verdict =
      sameBatch && data.softnavMarker === 1 && data.navigationEntries === 1 && data.htmlLang === "ar" && data.htmlDir === "rtl"
        ? "PASS — lang+dir flipped in one MutationObserver batch (same frame), marker survived, zero full navigations"
        : `FAIL — sameBatch=${sameBatch} marker=${data.softnavMarker} navEntries=${data.navigationEntries}`;
    log(`# VERDICT: ${verdict}`);
  } finally {
    await browser.close();
  }
}

async function webglKill() {
  const log = specLog("webgl-kill");
  log(`# F6-4 · ?webgl=off → 0 <canvas>, poster treatment`);
  const { browser, page } = await freshPage();
  try {
    await page.goto(`${BASE}/en?webgl=off`, { waitUntil: "domcontentloaded" });
    // journey sits below the fold — scroll into it so the lazy mount would fire if not killed
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll("section, div")).find((n) =>
        /dusk|fire|the table/i.test(n.textContent ?? ""),
      );
      (el as HTMLElement | undefined)?.scrollIntoView({ block: "center" });
    });
    await page.waitForTimeout(2500); // lazy mount window
    const res = await page.evaluate(() => ({
      canvases: document.querySelectorAll("canvas").length,
      // next/image optimizer URL-encodes the path — match both forms
      journeyPosters: document.querySelectorAll(
        'img[src*="/img/journey/act-"], img[src*="journey%2Fact-"]',
      ).length,
      heroPoster: document.querySelectorAll(
        'img[src*="/img/hero/poster"], img[src*="hero%2Fposter"]',
      ).length,
      killFlag: localStorage.getItem("mirador-webgl"),
    }));
    log(`# canvases=${res.canvases} journeyPosterImgs=${res.journeyPosters} heroPosterImgs=${res.heroPoster} localStorage.mirador-webgl=${res.killFlag}`);
    const verdict =
      res.canvases === 0 && res.journeyPosters >= 1
        ? "PASS — canvas unmounted, poster treatment present"
        : `FAIL — canvases=${res.canvases}, journeyPosters=${res.journeyPosters}`;
    log(`# VERDICT: ${verdict}`);

    // control run WITHOUT the flag (fresh context) — WebGL2 via SwiftShader, canvas should MOUNT
    const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page2 = await ctx2.newPage();
    await page2.goto(`${BASE}/en`, { waitUntil: "domcontentloaded" });
    await page2.evaluate(() => {
      const el = Array.from(document.querySelectorAll("section, div")).find((n) => /dusk|fire|the table/i.test(n.textContent ?? ""));
      (el as HTMLElement | undefined)?.scrollIntoView({ block: "center" });
    });
    await page2.waitForTimeout(6000); // three pack is a lazy chunk — give it the mount window
    const control = await page2.evaluate(() => ({
      webgl2: (() => { try { const c = document.createElement("canvas"); return !!c.getContext("webgl2"); } catch { return false; } })(),
      canvases: document.querySelectorAll("canvas").length,
    }));
    log(`# CONTROL (no flag): webgl2=${control.webgl2} canvases=${control.canvases} — kill-switch contrast: flag=0 canvas, no-flag=${control.canvases} canvas`);
    log(`# note: auto-path (fps<30 for 3s) emulation is parent-scope F6-4; manual + control paths recorded here per prompt-2 P3 definition`);
    await ctx2.close();
  } finally {
    await browser.close();
  }
}

async function booking() {
  const log = specLog("booking");
  log(`# F4-5/F4-6 · booking happy path — measured end-to-end, <90s contract`);
  const { browser, page } = await freshPage();
  try {
    const t0 = Date.now();
    await page.goto(`${BASE}/en/reserve`, { waitUntil: "domcontentloaded" });
    await page.fill("#reserve-name", "Evidence Run");
    await page.fill("#reserve-phone", "+963 999 00901");
    // live availability: first ENABLED slot button (aria-label like "18:00 — N tables")
    const slotBtn = page.locator('button[aria-label*="tables"]').first();
    await slotBtn.waitFor({ state: "visible", timeout: 20000 });
    // if today is fully booked, step to the next bookable date
    if (await slotBtn.isDisabled()) {
      log(`# today's grid full — stepping one date forward`);
      const dates = page.locator("fieldset button[aria-pressed]");
      await dates.nth(1).click();
      await page.waitForTimeout(800);
    }
    const slotLabel = await slotBtn.getAttribute("aria-label");
    await slotBtn.click();
    log(`# slot selected: aria-label="${slotLabel}"`);
    await page.click("form button[type=submit]");
    await page.waitForURL(/\/en\/confirmation\//, { timeout: 60000 });
    const heading = page.getByText("The table is yours.");
    await heading.waitFor({ state: "visible", timeout: 20000 });
    const elapsedMs = Date.now() - t0;
    const url = page.url();
    const id = url.split("/").pop() ?? "";
    const waHrefAttr = await page.locator('a[href*="wa.me/963955000111"]').first().getAttribute("href");
    log(`# confirmation URL: ${url}`);
    log(`# heading visible: "The table is yours."`);
    log(`# whatsapp href (raw): ${waHrefAttr}`);
    const decoded = decodeURIComponent(waHrefAttr ?? "");
    log(`# whatsapp href (decoded): ${decoded}`);
    const ref = id.slice(-6);
    const encodes = {
      name: decoded.includes("Evidence Run"),
      party: decoded.includes("2 guests"),
      ref: decoded.includes(`(ref ${ref})`),
      number: (waHrefAttr ?? "").startsWith("https://wa.me/963955000111?text="),
    };
    log(`# F4-6 encode check: name=${encodes.name} party=${encodes.party} ref=${encodes.ref} waNumber=${encodes.number}`);
    log(`# BOOKING_DURATION_MS=${elapsedMs} (${(elapsedMs / 1000).toFixed(1)}s) — contract <90s`);
    // DB persistence evidence (F4-5)
    const row = await prisma.reservation.findUnique({ where: { id } });
    log(`# DB row (F4-5): ${row ? JSON.stringify({ id: row.id, name: row.name, phone: row.phone, partySize: row.partySize, slot: row.slot.toISOString(), status: row.status, locale: row.locale, tableNumber: row.tableNumber }) : "NOT FOUND"}`);
    const verdict =
      elapsedMs < 90000 && !!row && row.status === "PENDING" && row.locale === "EN" && encodes.name && encodes.party && encodes.ref && encodes.number
        ? "PASS — booked, persisted PENDING/EN, WhatsApp encodes name+party+ref, under 90s"
        : `FAIL — elapsed=${elapsedMs}ms row=${!!row} encodes=${JSON.stringify(encodes)}`;
    log(`# VERDICT: ${verdict}`);
    const cleaned = await cleanupTestRows(prisma);
    log(`# CLEANUP: deleted ${cleaned.reservations} reservations (phones ${TEST_PHONE_PREFIX}*)`);
  } finally {
    await browser.close();
  }
}

async function inquiry() {
  const log = specLog("inquiry");
  log(`# F8 · inquiry happy path — private-dining form → success state + row persisted`);
  const { browser, page } = await freshPage();
  try {
    await page.goto(`${BASE}/en/private-dining`, { waitUntil: "domcontentloaded" });
    await page.fill('input[name="name"]', "Evidence Run");
    await page.fill('input[name="phone"]', "+963 999 00902");
    await page.fill('textarea[name="message"]', "Evidence-run inquiry happy path: a quiet table for a private celebration.");
    await page.getByRole("button", { name: "Send inquiry" }).click();
    const status = page.locator('[role="status"]');
    await status.waitFor({ state: "visible", timeout: 20000 });
    const statusText = await status.innerText();
    const refText = await page.locator('[role="status"] p').nth(1).innerText().catch(() => "");
    log(`# success status (role=status): "${statusText.replace(/\n/g, " | ")}"`);
    log(`# reference line: "${refText.replace(/\n/g, " ")}"`);
    const row = await prisma.inquiry.findFirst({ where: { phone: "+96399900902" }, orderBy: { createdAt: "desc" } });
    log(`# DB row: ${row ? JSON.stringify({ id: row.id, type: row.type, name: row.name, locale: row.locale }) : "NOT FOUND"}`);
    const verdict =
      statusText.includes("Inquiry received.") && !!row
        ? "PASS — success state rendered, inquiry persisted"
        : `FAIL — statusText="${statusText.slice(0, 80)}" row=${!!row}`;
    log(`# VERDICT: ${verdict}`);
    const cleaned = await cleanupTestRows(prisma);
    log(`# CLEANUP: deleted ${cleaned.inquiries} inquiries`);
  } finally {
    await browser.close();
  }
}

const specs: Record<string, () => Promise<void>> = { "locale-atomic": localeAtomic, "webgl-kill": webglKill, booking, inquiry };
const arg = process.argv[2] ?? "all";
const order = ["locale-atomic", "webgl-kill", "booking", "inquiry"];
const run = arg === "all" ? order : process.argv.slice(2);
for (const name of run) {
  if (!specs[name]) throw new Error(`unknown spec: ${name}`);
  console.log(`running spec: ${name}`);
  await specs[name]();
}
await prisma.$disconnect();
console.log(`done — logs in ${EVIDENCE_OUT}specs/ (BASE=${BASE})`);
