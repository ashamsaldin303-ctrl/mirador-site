// MIRADOR — P6/R2 (E92 · E93): the axe probe for the OPEN window surfaces —
// the migrated overlays (the dish window · the lightbox · the mobile sheet)
// scanned with the same axe stack the battery uses, in their OPEN states.
// Output: evidence/ui/E92/axe-windows.log (the raw per-surface verdicts).
// Usage: bun evidence/tools/axe-windows.ts
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = process.env.EVIDENCE_BASE_URL ?? "http://localhost:3000";
const OUT = "evidence/ui/E92/axe-windows.log";

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
});

type Surface = { name: string; open: (page: import("playwright").Page) => Promise<void> };

const SURFACES: Surface[] = [
  {
    name: "dish-window",
    open: async (page) => {
      await page.goto(`${BASE}/en/menu`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("[data-dish-row]", { timeout: 20000 });
      // the ribeye row carries an image — the plate composes at the window
      await page.evaluate(() => {
        const rib = Array.from(document.querySelectorAll("[data-dish-row]")).find((r) =>
          /ribeye/i.test(r.textContent ?? ""),
        );
        rib?.scrollIntoView({ block: "center" });
      });
      await page
        .locator("[data-dish-row]", { hasText: /ribeye/i })
        .locator("button", { hasText: /details/i })
        .first()
        .click();
      await page.waitForSelector('[data-slot="at-the-window"]', { timeout: 25000 });
    },
  },
  {
    name: "lightbox-window",
    open: async (page) => {
      await page.goto(`${BASE}/en/gallery`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("figure button", { timeout: 20000 });
      await page.locator("figure button").first().click();
      await page.waitForSelector('[data-slot="at-the-window"]', { timeout: 25000 });
    },
  },
  {
    name: "mobile-sheet",
    open: async (page) => {
      await page.goto(`${BASE}/en`, { waitUntil: "domcontentloaded" });
      await page.locator('button[aria-label="Open menu"]').click();
      await page.waitForSelector('[data-slot="sheet-content"]', { timeout: 25000 });
    },
  },
];

const lines: string[] = [
  `# axe on the OPEN window surfaces (P6/R2 · E92/E93) — machine-generated ${new Date().toISOString()}`,
  `# gate: 0 critical + 0 serious per open surface (the same axe stack as the battery's Q4e)`,
  `# base: ${BASE} · viewport 375×812 (the mobile door — the overlays' primary surface)`,
  "",
];

let failures = 0;
for (const surface of SURFACES) {
  // a FRESH context per surface — the dev-server's Turbopack memory under a
  // shared context caused third-navigation flakes (the OOM-prone sandbox:
  // next-server anon-rss ~2.4GB; isolation keeps each probe lean)
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  try {
    await surface.open(page);
    await page.waitForTimeout(900); // the settle descent settles before the scan
    const results = await new AxeBuilder({ page }).analyze();
    const bad = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    lines.push(
      `## ${surface.name}: ${bad.length === 0 ? "PASS — 0 critical · 0 serious" : `FAIL — ${bad.length} blocking violations`}`,
    );
    for (const v of bad) {
      failures++;
      lines.push(`  - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
    }
    if (bad.length === 0 && results.violations.length > 0) {
      lines.push(`  (non-blocking: ${results.violations.map((v) => v.id).join(", ")})`);
    }
  } catch (err) {
    failures++;
    lines.push(`## ${surface.name}: PROBE ERROR — ${String(err).slice(0, 200)}`);
  }
  await context.close();
}
await browser.close();

lines.push("");
lines.push(
  failures === 0
    ? "VERDICT: PASS — the three open surfaces scan clean (0 critical · 0 serious each)"
    : `VERDICT: FAIL — ${failures} blocking findings`,
);
mkdirSync("evidence/ui/E92", { recursive: true });
writeFileSync(OUT, lines.join("\n") + "\n");
console.log(lines.join("\n"));
console.log(`\n→ ${OUT}`);
process.exit(failures === 0 ? 0 : 1);
