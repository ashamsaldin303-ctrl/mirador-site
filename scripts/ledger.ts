// MIRADOR — P-041 THE LEDGER (prompt-4 R7 · E57): a CI job asserting the
// arrival/wire/font budgets. Disk-assertable cells run everywhere (push CI,
// no build needed): AR font faces ≤60KB each · font-disk ≤ the frozen
// 334,880B baseline. Build-dependent cells (16/16 first-load ≤200KB gz hard
// gate · motion family ≤62KB · three-pack ≤235KB) are asserted from the
// prod-run route table when one is present (production-evidence workflow).
// Usage: bun scripts/ledger.ts [--disk-only | <first-load-js-gz.txt>]
// --disk-only: the CI-push arm (no build available — font cells only);
// default: full assert from the committed prod-run raw files (honest FAIL
// when a committed table records a breach — the exit gate re-measures).
import { statSync, existsSync, readFileSync, mkdirSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const FONTS = "public/fonts";
const AR_WEIGHTS: Record<string, string[]> = {
  "amiri 400": ["amiri-400-arabic.woff2", "amiri-400-latin.woff2"],
  "amiri 700": ["amiri-700-arabic.woff2", "amiri-700-latin.woff2"],
  "plex-arabic 400": ["plex-arabic-400-arabic.woff2", "plex-arabic-400-latin.woff2"],
  "plex-arabic 500": ["plex-arabic-500-arabic.woff2", "plex-arabic-500-latin.woff2"],
  "plex-arabic 600": ["plex-arabic-600-arabic.woff2", "plex-arabic-600-latin.woff2"],
};

// FROZEN ceilings (prompt-4 §5 — the GATEBOOK is the authoritative copy;
// this script asserts the same numbers, verify-gatebook guards the doc)
const FONT_DISK_BASELINE = 334_880; // bytes (pre-R9 baseline; R9 went BELOW it)
const AR_FACE_BUDGET = 60 * 1024;
const FIRST_LOAD_HARD = 200_000; // gz bytes, 16/16
const MOTION_FAMILY_CEIL = 62 * 1024; // gz (58.85KB pinned, ceiling 62)
const THREE_PACK_CEIL = 235 * 1024; // gz

const out: string[] = [];
let pass = true;
const check = (cond: boolean, msg: string) => {
  out.push(`[${cond ? "PASS" : "FAIL"}] ${msg}`);
  if (!cond) pass = false;
};

// — cell ⑥a: AR faces ≤60KB each —
out.push("# P-041 LEDGER — machine-generated " + new Date().toISOString());
out.push("## Font cells (disk-assertable — run on every push)");
for (const [weight, files] of Object.entries(AR_WEIGHTS)) {
  let total = 0;
  for (const f of files) total += statSync(join(FONTS, f)).size;
  check(total <= AR_FACE_BUDGET, `${weight} payload ${total}B ≤ 60KB (${(total / 1024).toFixed(1)}KB)`);
}

// — cell ⑥b: font disk vs the frozen baseline —
let disk = 0;
for (const f of readdirSync(FONTS)) disk += statSync(join(FONTS, f)).size;
check(disk <= FONT_DISK_BASELINE, `font disk ${disk}B ≤ frozen baseline 334,880B (Δ ${disk - FONT_DISK_BASELINE}B)`);

// — build-dependent cells (asserted when prod-run raw files exist) —
const DISK_ONLY = process.argv.includes("--disk-only");
const table = DISK_ONLY ? "" : (process.argv.slice(2).find((a) => !a.startsWith("--")) ?? "evidence/F12-2/prod-run/first-load-js-gz.txt");
const manifest = DISK_ONLY ? "" : "evidence/F12-2/prod-run/chunk-manifest.txt";
const threeFile = DISK_ONLY ? "" : "evidence/F6-3/prod-run/three-lazy-chunk.txt";
out.push("");
out.push("## Wire cells (from the prod-run raw files — asserted on the Actions surface)");
if (existsSync(table)) {
  const rows = readFileSync(table, "utf8").split("\n").filter((l) => /^\/(en|ar)/.test(l));
  let hardBreaches = 0;
  let maxGz = 0;
  for (const row of rows) {
    const m = row.match(/gz=(\d+)B/);
    if (!m) continue;
    const gz = Number(m[1]);
    maxGz = Math.max(maxGz, gz);
    if (gz > FIRST_LOAD_HARD) hardBreaches += 1;
    out.push(`  ${row}`);
  }
  check(rows.length === 16, `route table covers 16/16 (found ${rows.length})`);
  check(hardBreaches === 0, `first-load ≤200KB gz hard gate: ${hardBreaches === 0 ? `0 breaches (max ${(maxGz / 1024).toFixed(1)}KB)` : `${hardBreaches} routes over`}`);
} else {
  out.push(`  (no route table at ${table} — disk cells only; the wire cells assert on the production-evidence run)`);
}

// — cell ②: the lazy motion family (marker-carrying refs=0 chunks) ≤ 62KB gz —
if (existsSync(manifest)) {
  let family = 0;
  const members: string[] = [];
  for (const line of readFileSync(manifest, "utf8").split("\n")) {
    if (!/refs=0 \(lazy/.test(line)) continue;
    if (/markers=\[(ScrollTrigger|Flip|lenis)/.test(line)) {
      const m = line.match(/gz=(\d+)B/);
      if (m) {
        family += Number(m[1]);
        members.push(line.trim());
      }
    }
  }
  out.push(...members.map((m) => `  ${m}`));
  check(family <= MOTION_FAMILY_CEIL, `motion family (lazy, marker chunks) ${family}B gz ≤ 62KB (${(family / 1024).toFixed(1)}KB)`);
} else {
  out.push("  (chunk-manifest.txt not present — asserted on the production-evidence run)");
}

// — cell ③: three-pack lazy ≤ 235KB gz —
if (existsSync(threeFile)) {
  const m = readFileSync(threeFile, "utf8").match(/pack total: raw=\d+B gz=(\d+)B/);
  if (m) check(Number(m[1]) <= THREE_PACK_CEIL, `three-pack (lazy) ${m[1]}B gz ≤ 235KB (${(Number(m[1]) / 1024).toFixed(1)}KB)`);
} else {
  out.push("  (three-lazy-chunk.txt not present — asserted on the production-evidence run)");
}

mkdirSync("evidence/r1/E57", { recursive: true });
const report = out.join("\n") + `\n\nVERDICT: ${pass ? "PASS" : "FAIL"}\n`;
writeFileSync("evidence/r1/E57/ledger.log", report);
console.log(report);
if (!pass) process.exit(1);
