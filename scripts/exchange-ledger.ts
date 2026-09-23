// MIRADOR — P-043 THE EXCHANGE LEDGER (prompt-4 R7 · E58): frozen byte
// baselines + the 7 mandatory cells + the ΣΔ≤0 arithmetic. Generates
// docs/exchange-ledger.md from LIVE measurements (fonts) + the frozen
// baselines + the prod-run raw files when present; build-dependent cells
// carry their run-11 baseline and re-assert at the exit gate (E79).
// Re-run: bun scripts/exchange-ledger.ts  (docs regenerate, never hand-edit)
//
// P6/R9 (E99 · the CSS-cell instrument): cell ⑤ is now MEASURED, not "—".
// On the Actions build (Q2b, after `bun run build`), the emitted route CSS
// (.next/static/css/**) is gzip-measured per file + total, the raw receipt
// lands at evidence/prod-run/css-cells.txt, and the Δ is filed against the
// pre-round baseline receipt (evidence/ui/css-baseline.txt — recorded BEFORE
// the first product commit per the contract). Locally (no production build
// in this sandbox), the cell carries the last measured receipt's value.
// Ceiling: +5.5KB total additions — the human-signed Option-B amendment
// 2026-09-23 (was +3KB; N29 — agents never touch this cell).
import { statSync, readdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const FONTS = "public/fonts";
// Next 16 emits the compiled route CSS under .next/static/chunks (Turbopack)
// and/or .next/static/css (the webpack layout) — the instrument walks both.
const NEXT_CSS_DIRS = [".next/static/css", ".next/static/chunks"];
const CSS_RECEIPT = "evidence/prod-run/css-cells.txt";
const CSS_BASELINE = "evidence/ui/css-baseline.txt";
// Option B (signed 2026-09-23): +5.5KB TOTAL additions — cumulative = the
// standing ≈2.97KB pre-amendment subscription + this round's Δ. The round's
// headroom ≈ 2662B (the contract's own model: "standing subscription ≈2.97KB
// + register gross ≈+2.55KB ≈ 5.52KB"). N29 — agents never touch this cell.
const CSS_CEILING_B = 5.5 * 1024;
const CSS_SUBSCRIBED_B = 2_970;
const CSS_ROUND_HEADROOM_B = CSS_CEILING_B - CSS_SUBSCRIBED_B;

// — FROZEN baselines (prompt-4 §5 notes + run-11 raw = the release's basis) —
const BASE = {
  fontDisk: 334_880, // §5 cell ⑥ baseline (pre-R9)
  firstLoadMax: 180_900, // run-11 raw max route (/menu 176.7KB… private-dining 232.4KB was the breach)
  firstLoadBreach: 237_940, // run-11 /private-dining (pre-zod-fix)
  motionFamily: 57_540, // run-11 marker chunks (56.2KB)
  threePack: 235_263, // run-11 (229.7KB)
  combinedRental: 291_150, // §5 note (291.15KB)
  cssSubscribed: 2_970, // ≈2.97KB of the pre-amendment +3KB ceiling subscribed at contract open
};

// — live measurements —
let fontDisk = 0;
for (const f of readdirSync(FONTS)) fontDisk += statSync(join(FONTS, f)).size;

// — P6/R9: the CSS-cell measurement (the compiled route CSS, gz) —
// On the Actions runner the production build precedes this script; locally
// the build is forbidden (the sandbox law) and the cell carries the last
// measured receipt. gz via node:zlib gzipSync (deterministic default level).
type CssFile = { file: string; raw: number; gz: number };
function measureCss(): CssFile[] | null {
  const out: CssFile[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".css")) {
        const buf = readFileSync(p);
        out.push({ file: p.replace(/^\.next\/static\//, ""), raw: buf.length, gz: gzipSync(buf).length });
      }
    }
  };
  for (const dir of NEXT_CSS_DIRS) {
    if (existsSync(dir)) walk(dir);
  }
  return out.length > 0 ? out.sort((a, b) => a.file.localeCompare(b.file)) : null;
}

function receiptTotal(text: string): number | null {
  const m = text.match(/^total-gz=(\d+)B$/m);
  return m ? Number(m[1]) : null;
}

const measuredCss = measureCss();
const baselineCss = existsSync(CSS_BASELINE) ? receiptTotal(readFileSync(CSS_BASELINE, "utf8")) : null;
let lastMeasuredCss: number | null = null;
if (existsSync(CSS_RECEIPT)) lastMeasuredCss = receiptTotal(readFileSync(CSS_RECEIPT, "utf8"));

if (measuredCss !== null) {
  // — the fresh measurement: write the raw receipt (the E33 bot commit stages
  // evidence/prod-run wholesale, so the receipt rides the dispatch's commit) —
  const total = measuredCss.reduce((s, f) => s + f.gz, 0);
  const runId = process.env.GITHUB_RUN_NUMBER ? `actions run ${process.env.GITHUB_RUN_NUMBER}` : "local";
  const delta = baselineCss !== null ? total - baselineCss : null;
  const verdict =
    delta === null
      ? `GATE CSS-CELL: BASELINE — total ${total}B recorded (the baseline receipt lands before the first product commit)`
      : delta <= CSS_ROUND_HEADROOM_B
        ? `GATE CSS-CELL: PASS — round Δ +${delta}B (cumulative ≈ ${CSS_SUBSCRIBED_B}B subscribed + Δ ≤ +5.5KB — Option B, human-signed 2026-09-23; N29 — agents never touch this cell)`
        : `GATE CSS-CELL: FAIL — round Δ +${delta}B exceeds the ≈${CSS_ROUND_HEADROOM_B}B headroom (cumulative > +5.5KB, Option B) — the kill order's backstop condition is live; the Appendix-B order decides the casualties, documented as killed`;
  const lines = [
    "# CSS-CELL receipt (P6/R9 · E99) — machine-generated " + new Date().toISOString(),
    "# scope: the compiled route CSS emitted by the production build (.next/static/css/**), gz per file + total.",
    "# ceiling: +5.5KB TOTAL additions (cumulative ≈2.97KB standing subscription + this round's Δ; round headroom ≈2662B) — human-signed Option B, 2026-09-23 (was +3KB; N29).",
    `# surface: ${runId} · repo HEAD recorded by the dispatch's MANIFEST`,
    ...measuredCss.map((f) => `${f.file} raw=${f.raw}B gz=${f.gz}B`),
    `total-gz=${total}B`,
    baselineCss !== null ? `baseline-gz=${baselineCss}B (evidence/ui/css-baseline.txt)` : `baseline-gz=(pending — the baseline receipt lands before the first product commit)`,
    delta !== null ? `delta=${delta >= 0 ? "+" : ""}${delta}B` : `delta=(pending baseline)`,
    verdict,
  ];
  writeFileSync(CSS_RECEIPT, lines.join("\n") + "\n");
}

const cssNow = measuredCss !== null ? measuredCss.reduce((s, f) => s + f.gz, 0) : lastMeasuredCss;
const cssDelta = cssNow !== null && baselineCss !== null ? cssNow - baselineCss : null;

const table = "evidence/F12-2/prod-run/first-load-js-gz.txt";
let firstLoadMax: number | null = null;
let breaches: string[] = [];
if (existsSync(table)) {
  for (const line of readFileSync(table, "utf8").split("\n")) {
    const m = line.match(/^(\/\S+) — files=\d+ raw=\d+B gz=(\d+)B/);
    if (!m) continue;
    const gz = Number(m[2]);
    if (gz > 200_000) breaches.push(`${m[1]} ${(gz / 1024).toFixed(1)}KB`);
    firstLoadMax = Math.max(firstLoadMax ?? 0, gz);
  }
}

const manifest = "evidence/F12-2/prod-run/chunk-manifest.txt";
let motionFamily: number | null = null;
if (existsSync(manifest)) {
  motionFamily = 0;
  for (const line of readFileSync(manifest, "utf8").split("\n")) {
    if (!/refs=0 \(lazy/.test(line)) continue;
    if (/markers=\[(ScrollTrigger|Flip|lenis)/.test(line)) {
      const m = line.match(/gz=(\d+)B/);
      if (m) motionFamily! += Number(m[1]);
    }
  }
}

const threeFile = "evidence/F6-3/prod-run/three-lazy-chunk.txt";
let threePack: number | null = null;
if (existsSync(threeFile)) {
  const m = readFileSync(threeFile, "utf8").match(/pack total: raw=\d+B gz=(\d+)B/);
  if (m) threePack = Number(m[1]);
}

// — the 7 cells + ΣΔ≤0 arithmetic —
const Δfonts = fontDisk - BASE.fontDisk; // negative = bytes removed from disk
const ΔfirstLoad = firstLoadMax !== null ? firstLoadMax - BASE.firstLoadBreach : null; // vs the run-11 breach route
const Δmotion = motionFamily !== null ? motionFamily - BASE.motionFamily : null;
const Δthree = threePack !== null ? threePack - BASE.threePack : null;

const fmt = (n: number | null) => (n === null ? "exit-gate" : `${(n / 1024).toFixed(1)}KB`);
const fmtB = (n: number | null) => (n === null ? "exit-gate" : `${n >= 0 ? "+" : ""}${n}B`);

const cssCellCurrent =
  cssNow !== null
    ? `${(cssNow / 1024).toFixed(1)}KB (measured${measuredCss !== null ? " fresh on this build" : " — last receipt"})`
    : "exit-gate (the CSS-cell instrument measures on the Actions build)";

const lines: string[] = [];
lines.push("# THE EXCHANGE LEDGER (P-043, prompt-4 R7 · E58 · P6/R9 CSS-cell instrument) — machine-generated " + new Date().toISOString());
lines.push("");
lines.push("The 7 mandatory cells + the ΣΔ≤0 arithmetic. Generated by `scripts/exchange-ledger.ts` —");
lines.push("regenerates from live disk + the prod-run raw files; build-dependent cells re-assert at the");
lines.push("exit gate (E79) after R8–R11 land. Basis: prompt-4 §5 frozen baselines + run-11 raw.");
lines.push("Cell ⑤ is MEASURED since prompt-6 R9: the compiled route CSS (gz) on the Actions build,");
lines.push("raw receipt at evidence/prod-run/css-cells.txt · pre-round baseline at evidence/ui/css-baseline.txt.");
lines.push("");
lines.push("| # | Cell | Ceiling | Baseline (run-11 / §5) | Current | Δ |");
lines.push("|---|---|---|---|---|---|");
lines.push(`| ① | first-load JS (max route, gz) | ≤200KB hard · 165KB soft (gates R2) | 232.4KB (private-dining, PRE-zod-fix breach) | ${fmt(firstLoadMax)}${breaches.length ? ` ⚠ ${breaches.join(", ")} over hard cap` : " (0 breaches)"} | ${fmtB(ΔfirstLoad)} |`);
lines.push(`| ② | motion family (lazy, gz) | ≤62KB | 56.2KB | ${fmt(motionFamily)} | ${fmtB(Δmotion)} |`);
lines.push(`| ③ | three-pack (lazy, gz) | ≤235KB | 229.7KB | ${fmt(threePack)} | ${fmtB(Δthree)} |`);
lines.push(`| ④ | combined rental (motion+three, gz) | ≤297KB | 291.15KB (§5 note) | ${motionFamily !== null && threePack !== null ? fmt(motionFamily + threePack) : "exit-gate"} | — |`);
lines.push(`| ⑤ | CSS additions | +5.5KB total — human-signed amendment 2026-09-23 (Option B; was +3KB; N29) — cumulative ≈2.97KB subscribed + round Δ | ≈2.97KB subscribed (pre-amendment) → pre-round compiled baseline in css-baseline.txt | ${cssCellCurrent} | ${cssDelta !== null ? `${cssDelta >= 0 ? "+" : ""}${cssDelta}B ${cssDelta <= CSS_ROUND_HEADROOM_B ? "(cumulative ≤ +5.5KB ✓)" : "(⚠ cumulative OVER the signed ceiling — kill order territory)"}` : "baseline pending → measured at each dispatch"} |`);
lines.push(`| ⑥ | fonts (AR faces ≤60KB each; disk) | disk 334,880B baseline | 334,880B | ${fontDisk}B | ${fmtB(Δfonts)} |`);
lines.push("");
lines.push("## ΣΔ≤0 arithmetic (bytes removed vs added, this release)");
lines.push("");
lines.push("```");
lines.push(`fonts (disk):        ${Δfonts}B   (R9 wordmark/corpus subsets + R9a — REMOVED)`);
if (ΔfirstLoad !== null) lines.push(`first-load (wire):   ${ΔfirstLoad}B   (run-11 breach route − zod-off-the-wire fix [this release] — measured at the exit gate)`);
else lines.push(`first-load (wire):   exit-gate (run-11 recorded the private-dining 232.4KB breach; the zod fix removes the 63,952B chunk — re-measured at E79)`);
if (Δmotion !== null) lines.push(`motion family (lazy): ${Δmotion}B`);
if (Δthree !== null) lines.push(`three-pack (lazy):   ${Δthree}B`);
if (cssDelta !== null) {
  lines.push(`CSS (cell ⑤):        ${cssDelta >= 0 ? "+" : ""}${cssDelta}B compiled (measured vs the pre-round baseline receipt — the prompt-6 register rides the signed Option-B ceiling)`);
} else {
  lines.push(`CSS (cell ⑤):        measured at each dispatch (the instrument: compiled route CSS gz vs css-baseline.txt; ceiling +5.5KB — Option B signed 2026-09-23)`);
}
lines.push("```");
lines.push("");
lines.push("The wire Σ (①+②+③+⑥ deltas) must land ≤ 0 at the exit gate; fonts alone are −35,560B.");
lines.push("Cell ⑤ carries the human-signed Option-B ceiling (+5.5KB total additions, 2026-09-23 — N29:");
lines.push("the signature is the only amendment path, recorded in docs/css-ceiling-decision.md). A failing");
lines.push("threshold ships as FAIL (N16/N24) — never polished.");
lines.push("");

writeFileSync("docs/exchange-ledger.md", lines.join("\n") + "\n");
console.log(lines.join("\n"));
console.log("\n→ docs/exchange-ledger.md");
if (measuredCss !== null) console.log(`→ ${CSS_RECEIPT} (fresh measurement: ${measuredCss.reduce((s, f) => s + f.gz, 0)}B gz total)`);
