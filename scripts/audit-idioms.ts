// MIRADOR — audit:idioms (P-035, prompt-4 R10 · E66): A1–A12 — the Button API
// surface + the ledger-family laws, mechanically enforced. Zero ad-hoc button
// variants outside the API. Run: bun scripts/audit-idioms.ts
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";

const SRC = "src";
const files: string[] = [];
(function walk(dir: string) {
  for (const e of readdirSync(dir)) {
    const p = `${dir}/${e}`;
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(p)) files.push(p);
  }
})(SRC);

let pass = true;
const check = (cond: boolean, msg: string) => {
  console.log(`[${cond ? "PASS" : "FAIL"}] ${msg}`);
  if (!cond) pass = false;
};
const grep = (re: RegExp) =>
  files.flatMap((f) =>
    readFileSync(f, "utf8")
      .split("\n")
      .map((line, i) => ({ f, i: i + 1, line }))
      .filter(({ line }) => re.test(line)),
  );

const button = readFileSync("src/components/ui/button.tsx", "utf8");

/** Button CALL-SITE scope: the <Button …> opening tag region (attrs may span
 *  lines); other components (Toggle pills, WordmarkLockup) own their props. */
function buttonCallSites(): string[] {
  const sites: string[] = [];
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    const re = /<Button[\s\S]{0,400}?>/g;
    for (const m of text.matchAll(re)) sites.push(`${f}: ${m[0]}`);
  }
  return sites;
}
const callSites = buttonCallSites();

// A1 — only API variants used at Button call sites (the retired stock variants = 0)
check(
  callSites.filter((s) => /variant="(default|destructive|secondary|ghost|link|outline)"/.test(s)).length === 0,
  `A1 zero retired Button variants (default|destructive|secondary|ghost|link|outline) at call sites`,
);
// A2 — only API sizes at Button call sites
check(
  callSites.filter((s) => /size="(default|sm|lg|icon)"/.test(s)).length === 0,
  `A2 zero retired Button sizes (default|sm|lg|icon) at call sites`,
);
// A3 — the amber pill lives ONLY in button.tsx (no ad-hoc bg-amber buttons elsewhere)
const amberButtons = grep(/<Button[\s\S]{0,240}bg-amber/);
check(
  amberButtons.length === 0,
  `A3 zero ad-hoc amber styling on Button call sites (bg-amber outside the API)`,
);
// A4 — the API base carries the touch law
check(/min-h-11/.test(button), `A4 the API base carries min-h-11 (44px touch law)`);
// A5 — pills are round (multiline-tolerant: whitespace-normalize before matching)
const flat = button.replace(/\s+/g, " ");
check(
  /cta: "rounded-full/.test(flat) && /quietOutline: "rounded-full/.test(flat),
  `A5 cta + quietOutline are rounded-full (the pill law)`,
);
// A6 — the cta type invariants
check(
  /cta: "rounded-full bg-amber px-8 font-semibold text-night/.test(button),
  `A6 cta invariants: bg-amber · px-8 base · font-semibold · text-night`,
);
// A7 — the quiet underline altitude (P-075's 8px law)
check(
  /underline decoration-line underline-offset-8/.test(button),
  `A7 quiet carries the 8px underline altitude + line hairline`,
);
// A8 — brightness-not-wash: on the CTA variant the ONLY hover-bg is amber/90
const ctaLine = flat.match(/cta: "([^"]*)"/)?.[1] ?? "";
const ctaHovers = ctaLine.match(/hover:bg-[a-z/\d]+/g) ?? [];
check(
  ctaHovers.every((h) => h === "hover:bg-amber/90"),
  `A8 the one cta hover = bg-amber/90 (brightness-not-wash; quietOutline's hover:bg-transparent keeps its own surface)`,
);
// A9 — transitions on the frozen scale only
check(
  grep(/duration-(?!fast|base|slow|signature)\d/).filter(({ f }) => f.endsWith("button.tsx")).length === 0 &&
    /duration-base/.test(button),
  `A9 Button transitions ride the frozen scale (duration-base)`,
);
// A10 — no focus styling on Button (the bezel owns focus site-wide, P-075)
check(
  !/(focus|ring)-/.test(button.replace(/transition-colors duration-base/, "")),
  `A10 Button carries ZERO focus/ring classes (the bezel owns focus)`,
);
// A11 — link-buttons ride asChild (Slot), never nested <button><a>
check(
  grep(/<button[^>]*>\s*<a[\s>]/).length === 0,
  `A11 zero <button> wrapping <a> (asChild/Slot owns link-buttons)`,
);
// A12 — the ledger-family three laws documented (docs/idiom-contracts.md)
const contracts = readFileSync("docs/idiom-contracts.md", "utf8");
check(
  contracts.includes("1px = state, 2px = fact") &&
    contracts.includes("Error = color, never weight") &&
    contracts.includes("Inputs: no hover, caret amber, LTR island"),
  `A12 the ledger-family three laws documented in docs/idiom-contracts.md`,
);

mkdirSync("evidence/r1/E66", { recursive: true });
writeFileSync(
  "evidence/r1/E66/audit-idioms.log",
  `# audit:idioms A1–A12 — run ${new Date().toISOString()}\n# verdict: ${pass ? "PASS" : "FAIL"}\n`,
);
console.log(`\nVERDICT: ${pass ? "PASS" : "FAIL"}`);
if (!pass) process.exit(1);
