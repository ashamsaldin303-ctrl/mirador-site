// MIRADOR — production build budgets (prompt-3 Q2 · E18/E19).
// Run AFTER `bun run build` on the build-capable machine (build stdout teed to
// build-output.log by the caller). Produces (E18's contract-explicit paths —
// NOT surface-routed):
//   evidence/F12-2/prod-run/{route-size-table.txt, first-load-js-gz.txt, chunk-manifest.txt, motion-stack.txt, network-firstload.txt, summary.md}
//   evidence/F6-3/prod-run/three-lazy-chunk.txt
// NOTE: Next 16 Turbopack's Route (app) table carries no size columns — the
// budget numbers are derived from the SERVED HTML's initial script set (the
// exact first-load JS the browser downloads) + gzip -9 of the emitted chunks,
// corroborated by wire sizes (Playwright). .next/build-manifest.json is copied
// verbatim as a raw build artifact.
// FROZEN budgets (parent Appendix A): first-load ≤150KB gz (hard 200KB) ·
// three/fiber/drei lazy pack ≤400KB gz · motion stack ≤90KB gz base.
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync, copyFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join, relative } from "node:path";
import { chromium } from "playwright";
import { outDir, EVIDENCE_OUT, EVIDENCE_ROOT, BASE, db, seedConfirmationId } from "./lib";

const F12_2 = `${EVIDENCE_ROOT}F12-2/prod-run`; // E18 contract-explicit path
const F6_3 = `${EVIDENCE_ROOT}F6-3/prod-run`; // sibling build family
mkdirSync(F12_2, { recursive: true });
mkdirSync(F6_3, { recursive: true });
const FIRST_LOAD_BUDGET = 150_000;
const FIRST_LOAD_HARD = 200_000;
const THREE_PACK_BUDGET = 400_000;
const MOTION_BUDGET = 90_000;
// String literals that verifiably survive minification (checked against the
// pinned library sources — see REPLAY.md §build-budgets):
const MARKERS: Record<string, RegExp> = {
  three: /WebGLRenderer/,
  fiber: /react-three|R3F/,
  ScrollTrigger: /ScrollTrigger/,
  lenis: /lenis/,
  Flip: /data-flip/,
};

function gz(path: string): number {
  return gzipSync(readFileSync(path), { level: 9 }).length;
}

// ---------- 1) verbatim route table from the build log ----------
const buildLog = existsSync("build-output.log") ? readFileSync("build-output.log", "utf8") : "";
const lines = buildLog.split("\n");
const tableStart = lines.findIndex((l) => l.includes("Route (app)"));
let routeTable = "(route table not found in build-output.log)";
if (tableStart >= 0) {
  const end = lines.findIndex((l, i) => i > tableStart + 1 && l.trim() === "");
  routeTable = lines.slice(tableStart, end > 0 ? end : tableStart + 30).join("\n");
}
routeTable += "\n\n(Turbopack's Route (app) table carries no size columns — sizes are derived from the\nserved HTML's initial script set + gzip -9 of the emitted chunks; wire sizes corroborate.)";
writeFileSync(`${F12_2}/route-size-table.txt`, `${routeTable}\n`);

// ---------- 2) per-route first-load JS gz — from the SERVED HTML (EVIDENCE_BASE_URL must be up) ----------
// Each page's initial HTML carries exactly the <script src> / <link rel=preload|modulepreload href>
// the browser downloads on first load — bundler-agnostic ground truth (no manifest
// shape guessing). noModule polyfills are excluded (modern browsers skip them).
// .next/build-manifest.json is copied verbatim beside as a raw build artifact.
if (existsSync(".next/build-manifest.json")) {
  copyFileSync(".next/build-manifest.json", `${F12_2}/build-manifest.json`);
}
const prisma = db();
const SEED_CONFIRMATION_ID = await seedConfirmationId(prisma);
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
async function firstLoadSet(url: string): Promise<string[]> {
  const html = await (await fetch(`${BASE}${url}`)).text();
  const srcs = new Set<string>();
  for (const m of html.matchAll(/<script\b[^>]*\bsrc="(\/[^"]+\.js)"[^>]*>/g)) {
    if (!/nomodule/i.test(m[0])) srcs.add(m[1]);
  }
  for (const m of html.matchAll(/<link\b[^>]*\b(?:preload|modulepreload)\b[^>]*\bhref="(\/[^"]+\.js)"[^>]*>/g)) {
    srcs.add(m[1]);
  }
  return [...srcs];
}
const resolveChunk = (file: string): string | null => {
  const probes = [`.next${file.replace(/^\/_next/, "")}`, `.next/static${file.replace(/^\/_next\/static/, "")}`];
  for (const p of probes) if (existsSync(p)) return p;
  return null;
};
const routeSets = new Map<string, string[]>(); // route label → resolved disk paths
const htmlFetchErrors: string[] = [];

const chunkInfo = new Map<string, { raw: number; gz: number }>();
function info(d: string): { raw: number; gz: number } {
  let c = chunkInfo.get(d);
  if (!c) {
    const raw = statSync(d).size;
    c = { raw, gz: gz(d) };
    chunkInfo.set(d, c);
  }
  return c;
}

const firstLoadRows: string[] = [
  `# per-route first-load JS (gzip -9) from the SERVED HTML script set — machine-generated ${new Date().toISOString()}`,
  `# derivation: <script src> + <link preload|modulepreload href> per route (noModule polyfills excluded)`,
  `# budget (FROZEN, parent Appendix A): ≤${FIRST_LOAD_BUDGET / 1000}KB gz per route (hard ${FIRST_LOAD_HARD / 1000}KB)`,
];
let budgetFail = 0;
for (const loc of ["en", "ar"] as const) {
  for (const r of ROUTES) {
    const label = `/${loc}${r.path || "/"}`;
    const srcs = await firstLoadSet(`/${loc}${r.path}`).catch((e) => {
      htmlFetchErrors.push(`${label}: ${String(e)}`);
      return [] as string[];
    });
    const jsFiles = srcs.map(resolveChunk).filter((d): d is string => !!d);
    const unresolved = srcs.filter((s) => !resolveChunk(s));
    for (const u of unresolved) htmlFetchErrors.push(`${label}: chunk not on disk: ${u}`);
    const totalGz = jsFiles.reduce((s, f) => s + info(f).gz, 0);
    const totalRaw = jsFiles.reduce((s, f) => s + info(f).raw, 0);
    const verdict =
      totalGz <= FIRST_LOAD_BUDGET ? "PASS" : totalGz <= FIRST_LOAD_HARD ? `FAIL (soft budget exceeded — under hard cap)` : "FAIL (hard cap exceeded)";
    if (verdict !== "PASS") budgetFail++;
    firstLoadRows.push(
      `${label} — files=${jsFiles.length} raw=${totalRaw}B gz=${totalGz}B (${(totalGz / 1024).toFixed(1)}KB) → ${verdict}`,
    );
    for (const f of jsFiles) firstLoadRows.push(`    ${relative(".next", f)} gz=${info(f).gz}B`);
    routeSets.set(`${r.name}--${loc}`, jsFiles);
  }
}
if (htmlFetchErrors.length > 0) {
  firstLoadRows.push(`# WARNINGS: ${htmlFetchErrors.length} fetch/resolve issues:`, ...htmlFetchErrors.map((e) => `#   ${e}`));
}
firstLoadRows.push(budgetFail === 0 ? `GATE F12-2: PASS — every route first-load JS ≤${FIRST_LOAD_BUDGET / 1000}KB gz` : `GATE F12-2: FAIL — ${budgetFail} routes over budget`);
writeFileSync(`${F12_2}/first-load-js-gz.txt`, firstLoadRows.join("\n") + "\n");

// ---------- 3) chunk manifest + lazy/motion classification ----------
const allChunks: string[] = [];
(function walk(dir: string) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".js")) allChunks.push(p);
  }
})(".next/static/chunks");
const referenced = new Set<string>();
for (const files of routeSets.values()) for (const f of files) referenced.add(f);

const manifestRows: string[] = [
  `# chunk manifest — every .next/static/chunks JS — machine-generated ${new Date().toISOString()}`,
  `# markers (minification-safe literals): ${Object.keys(MARKERS).join(" · ")}`,
];
const lazyThree: string[] = [];
const motionChunks: string[] = [];
for (const c of allChunks) {
  const src = readFileSync(c, "utf8");
  const markers = Object.entries(MARKERS)
    .filter(([, re]) => re.test(src))
    .map(([m]) => m);
  const isLazy = !referenced.has(c);
  const i = info(c);
  manifestRows.push(
    `${relative(".next", c)} raw=${i.raw}B gz=${i.gz}B refs=${isLazy ? "0 (lazy — not in any route first-load)" : "route-referenced"} markers=[${markers.join(",")}]`,
  );
  if (isLazy && markers.includes("three")) lazyThree.push(c);
}
// motion stack: chunks loaded by EVERY route (base bundle) carrying motion markers
const pageLists = [...routeSets.values()];
const sharedBase: string[] = pageLists.reduce<string[]>(
  (acc, list) => acc.filter((x) => list.includes(x)),
  pageLists[0] ?? [],
);
for (const c of sharedBase) {
  const src = readFileSync(c, "utf8");
  if (Object.entries(MARKERS).some(([m, re]) => m !== "three" && m !== "fiber" && re.test(src))) motionChunks.push(c);
}
writeFileSync(`${F12_2}/chunk-manifest.txt`, manifestRows.join("\n") + "\n");

// ---------- 4) three lazy chunk (F6-3) ----------
const threeRows: string[] = [
  `# three/fiber/drei lazy pack — machine-generated ${new Date().toISOString()}`,
  `# gate (F6-3, FROZEN): pack gz ≤${THREE_PACK_BUDGET / 1000}KB AND absent from every route's first-load JS`,
];
const threeGz = lazyThree.reduce((s, f) => s + info(f).gz, 0);
const threeRaw = lazyThree.reduce((s, f) => s + info(f).raw, 0);
for (const f of lazyThree) threeRows.push(`lazy chunk: ${relative(".next", f)} raw=${info(f).raw}B gz=${info(f).gz}B`);
threeRows.push(`pack total: raw=${threeRaw}B gz=${threeGz}B (${(threeGz / 1024).toFixed(1)}KB)`);
threeRows.push(`absent from every route first-load: ${lazyThree.every((f) => !referenced.has(f)) ? "YES (0 route references — see chunk-manifest.txt)" : "NO — VIOLATION"}`);
threeRows.push(
  threeGz <= THREE_PACK_BUDGET && lazyThree.length > 0 && lazyThree.every((f) => !referenced.has(f))
    ? `GATE F6-3: PASS — lazy pack ${(threeGz / 1024).toFixed(1)}KB gz ≤400KB, zero route references`
    : `GATE F6-3: FAIL — gz=${threeGz}B chunks=${lazyThree.length}`,
);
writeFileSync(`${F6_3}/three-lazy-chunk.txt`, threeRows.join("\n") + "\n");

// ---------- 5) motion stack ----------
const motionRows: string[] = [
  `# motion stack (gsap core + ScrollTrigger + Flip + lenis) in the shared base — machine-generated ${new Date().toISOString()}`,
  `# gate (F2 bonus / Appendix A, FROZEN): ≤${MOTION_BUDGET / 1000}KB gz in base`,
];
const motionGz = motionChunks.reduce((s, f) => s + info(f).gz, 0);
for (const f of motionChunks) motionRows.push(`base motion chunk: ${relative(".next", f)} gz=${info(f).gz}B`);
motionRows.push(`motion stack total: gz=${motionGz}B (${(motionGz / 1024).toFixed(1)}KB)`);
motionRows.push(motionGz <= MOTION_BUDGET ? `GATE motion: PASS — ${(motionGz / 1024).toFixed(1)}KB gz ≤90KB` : `GATE motion: FAIL — ${motionGz}B`);
writeFileSync(`${F12_2}/motion-stack.txt`, motionRows.join("\n") + "\n");

// ---------- 6) network corroboration (first-load wire sizes, 7 routes × 2 locales) ----------
const NET_ROUTES = ["", "/menu", "/reserve", "/story", "/gallery", "/private-dining", "/contact"];
const browser = await chromium.launch({ headless: true, args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"] });
const netRows: string[] = [
  `# network first-load JS (transferSize, wire gz) — machine-generated ${new Date().toISOString()}`,
  `# corroborates first-load-js-gz.txt (manifest-derived); server compression: Next standalone gzip`,
];
let homeLazyRows: string[] = [];
for (const loc of ["en", "ar"] as const) {
  for (const r of NET_ROUTES) {
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/${loc}${r}`, { waitUntil: "load", timeout: 45000 }).catch(() => {});
    await page.waitForTimeout(1000);
    const js = await page.evaluate(() =>
      (performance.getEntriesByType("resource") as PerformanceResourceTiming[])
        .filter((e) => e.name.endsWith(".js") || e.name.includes("/chunks/"))
        .map((e) => ({ url: e.name.split("/").slice(-1)[0], transferSize: e.transferSize })),
    );
    const total = js.reduce((s, e) => s + e.transferSize, 0);
    netRows.push(`/${loc}${r || "/"} — scripts=${js.length} wireJS=${total}B (${(total / 1024).toFixed(1)}KB)`);
    if (loc === "en" && r === "") {
      // journey scroll → the lazy three pack loads (F6-3 wire corroboration)
      await page.evaluate(() => {
        const el = Array.from(document.querySelectorAll("section, div")).find((n) => /dusk|fire|the table/i.test(n.textContent ?? ""));
        (el as HTMLElement | undefined)?.scrollIntoView({ block: "center" });
      });
      await page.waitForTimeout(6000);
      const after = await page.evaluate(() =>
        (performance.getEntriesByType("resource") as PerformanceResourceTiming[])
          .filter((e) => e.name.endsWith(".js") || e.name.includes("/chunks/"))
          .map((e) => ({ url: e.name.split("/").slice(-1)[0], transferSize: e.transferSize })),
      );
      const before = new Set(js.map((e) => e.url));
      const lazy = after.filter((e) => !before.has(e.url));
      homeLazyRows = lazy.map((e) => `lazy JS loaded after journey scroll: ${e.url} wire=${e.transferSize}B`);
      homeLazyRows.push(`lazy wire total: ${lazy.reduce((s, e) => s + e.transferSize, 0)}B`);
    }
    await ctx.close();
  }
}
await browser.close();
netRows.push(...homeLazyRows);
writeFileSync(`${F12_2}/network-firstload.txt`, netRows.join("\n") + "\n");

// ---------- 7) summary.md (E19 form: quoted budget rows beside raw files) ----------
const summary: string[] = [
  `# F12-2/prod-run — production build budgets summary (E19) — machine-generated ${new Date().toISOString()}`,
  ``,
  `## Route size table (verbatim from build-output.log — raw file: route-size-table.txt)`,
  "```",
  routeTable,
  "```",
  ``,
  `## Per-route first-load JS gz (from the served HTML script set — raw file: first-load-js-gz.txt)`,
  ...firstLoadRows.filter((l) => l.includes("→") || l.startsWith("GATE")),
  ``,
  `## three/fiber/drei lazy pack (raw file: ../F6-3/prod-run/three-lazy-chunk.txt)`,
  ...threeRows.filter((l) => l.startsWith("pack total") || l.startsWith("absent") || l.startsWith("GATE") || l.startsWith("lazy chunk")),
  ``,
  `## Motion stack in base (raw file: motion-stack.txt)`,
  ...motionRows.filter((l) => l.startsWith("motion") || l.startsWith("base motion") || l.startsWith("GATE")),
  ``,
  `## Network corroboration (raw file: network-firstload.txt)`,
  ...netRows.filter((l) => l.includes("wireJS") || l.startsWith("lazy")),
  ``,
  `## VERDICTS (E19 · budgets FROZEN — never bent)`,
  `- per-route first-load JS ≤150KB gz (hard 200KB): ${budgetFail === 0 ? "PASS" : `FAIL (${budgetFail} routes)`}`,
  `- three pack ≤400KB gz + absent from every route first-load: ${threeGz <= THREE_PACK_BUDGET && lazyThree.every((f) => !referenced.has(f)) ? "PASS" : "FAIL"}`,
  `- motion stack ≤90KB gz base: ${motionGz <= MOTION_BUDGET ? "PASS" : "FAIL"}`,
];
writeFileSync(`${F12_2}/summary.md`, summary.join("\n") + "\n");
console.log(`build-budgets done → ${F12_2}/ + ${F6_3}/ (first-load fails=${budgetFail}, threeGz=${threeGz}B, motionGz=${motionGz}B)`);
// NOTE: gate FAILs are DATA — they ship verbatim in the files above and are
// enforced by evidence/tools/verify-battery.sh (the battery's single exit
// gate); this tool exits 0 so the remaining battery still collects evidence.
