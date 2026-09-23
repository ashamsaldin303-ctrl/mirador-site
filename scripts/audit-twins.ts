// MIRADOR — audit:twins (P-091, prompt-4 R12 · E78): every R1 interactive
// diff names its a11y twin. Validates docs/twins.md — the registry exists,
// carries a twin column, and covers every interactive train of this release.
// Run: bun scripts/audit-twins.ts
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";

const path = "docs/twins.md";
if (!existsSync(path)) {
  console.error("FATAL: docs/twins.md missing — every interactive diff MUST name its twin");
  process.exit(1);
}
const text = readFileSync(path, "utf8");

let pass = true;
const check = (cond: boolean, msg: string) => {
  console.log(`[${cond ? "PASS" : "FAIL"}] ${msg}`);
  if (!cond) pass = false;
};

// — registry shape: a table whose rows are `| train | diff | twin |` —
const rows = text
  .split("\n")
  .filter((l) => /^\|\s*R\d+/.test(l));
check(rows.length >= 14, `the registry carries ≥14 interactive diffs (found ${rows.length})`);
check(/a11y twin/.test(text), `the table names its a11y twin column`);

// — every row's twin cell is non-empty and names a real mechanism —
const TWIN_TERMS = /focus|keyboard|aria|RM|reduced|RTL|parity|screen-reader|trap|noindex|touch|alt|CLS|beacon|RUM|disclosure|label|announce|hittable/i;
const twinless = rows.filter((r) => {
  const cells = r.split("|").map((c) => c.trim());
  const twin = cells[3] ?? "";
  return twin.length < 12 || !TWIN_TERMS.test(twin);
});
check(twinless.length === 0, `every diff's twin cell names a real a11y mechanism (${twinless.length} twinless)`);

// — coverage: the interactive trains of this release each appear —
for (const train of ["R2", "R3", "R4", "R6", "R8", "R9", "R10", "R11", "R12"]) {
  check(rows.some((r) => r.includes(`| ${train}`) || r.includes(`${train} (`)), `train ${train} covered`);
}

mkdirSync("evidence/r1/E78", { recursive: true });
writeFileSync(
  "evidence/r1/E78/audit-twins.log",
  `# audit:twins — run ${new Date().toISOString()}\n# rows=${rows.length}\n# verdict: ${pass ? "PASS" : "FAIL"}\n`,
);
console.log(`\nVERDICT: ${pass ? "PASS" : "FAIL"}`);
if (!pass) process.exit(1);
