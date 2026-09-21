// MIRADOR — §10.2 axe battery (prompt-2 P3d): every route × locale × viewport.
// Gate (parent §9/F12-1, E10): 0 critical + 0 serious per run.
// Usage: bun evidence/tools/axe-run.ts
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync, readFileSync } from "node:fs";
import { BASE, EVIDENCE_OUT, outDir, db, seedConfirmationId } from "./lib";

const prisma = db();
const SEED_CONFIRMATION_ID = await seedConfirmationId(prisma); // fresh per surface (see lib.ts)
await prisma.$disconnect();
outDir("axe");
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
const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
});

const summary: string[] = [
  `# axe summary — machine-generated ${new Date().toISOString()}`,
  `# gate: 0 critical + 0 serious per route × locale × viewport (parent §9, E10)`,
  `# @axe-core/playwright ${JSON.parse(readFileSync("node_modules/@axe-core/playwright/package.json", "utf8")).version} (axe-core pinned by it — see lockfile)`,
];
let critical = 0;
let serious = 0;
let runs = 0;

for (const { width, height } of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  for (const loc of ["en", "ar"] as const) {
    for (const { name, path } of ROUTES) {
      await page.goto(`${BASE}/${loc}${path}`, { waitUntil: "domcontentloaded" });
      if (name === "reserve") {
        await page
          .locator('button[aria-label*="tables"], button[aria-label*="طاولات"]')
          .first()
          .waitFor({ state: "visible", timeout: 30000 })
          .catch(() => {});
        await page.waitForTimeout(1200); // pace availability reads
      } else {
        await page.waitForTimeout(700);
      }
      const results = await new AxeBuilder({ page }).analyze();
      const file = `${EVIDENCE_OUT}axe/${name}--${loc}--${width}.json`;
      writeFileSync(
        file,
        JSON.stringify(
          {
            url: `${BASE}/${loc}${path}`,
            viewport: { width, height },
            generatedAt: new Date().toISOString(),
            inapplicable: results.inapplicable.length,
            incomplete: results.incomplete.length,
            passes: results.passes.length,
            violations: results.violations,
          },
          null,
          2,
        ),
      );
      const c = results.violations.filter((v) => v.impact === "critical").length;
      const s = results.violations.filter((v) => v.impact === "serious").length;
      const m = results.violations.filter((v) => v.impact === "moderate").length;
      const min = results.violations.filter((v) => v.impact === "minor").length;
      critical += c;
      serious += s;
      runs += 1;
      const ruleIds = results.violations.map((v) => `${v.id}(${v.impact})`).join(", ") || "none";
      summary.push(
        `${name}--${loc}--${width}.json | critical=${c} serious=${s} moderate=${m} minor=${min} | rules: ${ruleIds}`,
      );
    }
  }
  await context.close();
}
await browser.close();
summary.push(`TOTAL: ${runs} runs · critical=${critical} · serious=${serious}`);
summary.push(
  critical === 0 && serious === 0
    ? "GATE: PASS — 0 critical + 0 serious across all route × locale × viewport runs"
    : `GATE: FAIL — critical=${critical}, serious=${serious} (see per-run rules above; raw JSONs committed)`,
);
writeFileSync(`${EVIDENCE_OUT}axe/summary.txt`, summary.join("\n") + "\n");
console.log(`done: ${runs} axe runs — critical=${critical} serious=${serious}`);
