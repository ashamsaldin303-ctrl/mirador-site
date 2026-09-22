// MIRADOR — verify-docs (prompt-4 R1 · C-2): the doc-drift guard.
// N24: "no doc claim without its raw artifact" — this tool enforces it
// mechanically: every doc passage that names a raw-artifact state must quote
// the verdict THAT RAW FILE currently carries. A doc that says PASS while the
// raw says FAIL (or vice versa) fails this script with exit 1.
//
// Run: bun scripts/verify-docs.ts          → checks the committed state
//      bun scripts/verify-docs.ts --probe  → additionally proves every
//        comparator FIRES on a synthetic contradicting claim (vacuity guard)
import { readFileSync, existsSync } from "node:fs";

type Verdict = { pass: boolean; id: string; detail: string };

const PROBE = process.argv.includes("--probe");
const results: Verdict[] = [];

function read(path: string): string {
  if (!existsSync(path)) throw new Error(`raw artifact missing: ${path}`);
  return readFileSync(path, "utf8");
}

function check(id: string, pass: boolean, detail: string) {
  results.push({ id, pass, detail });
}

// — raw states ————————————————————————————————————————————————
const MEDIANS = "evidence/prod-run/lighthouse/medians.md";
const HTTP = "evidence/prod-run/http/summary.txt";
const mediansRaw = read(MEDIANS);
const httpRaw = read(HTTP);
const e27 = mediansRaw.match(/GATE E27: (PASS|FAIL)/)?.[1] ?? null;
const e22 = httpRaw.match(/GATE E22: (PASS|FAIL)/)?.[1] ?? null;
const tsconfig = JSON.parse(read("tsconfig.json")) as {
  compilerOptions?: { noUncheckedIndexedAccess?: boolean };
};
const nia = tsconfig.compilerOptions?.noUncheckedIndexedAccess === true;

if (!e27) throw new Error(`${MEDIANS} carries no "GATE E27:" verdict line — cannot verify docs against it`);
if (!e22) throw new Error(`${HTTP} carries no "GATE E22:" verdict line — cannot verify docs against it`);

// — comparators (shared with --probe) —————————————————————————
function docQuotesGate(docText: string, gate: string, verdict: string): boolean {
  return docText.includes(`${gate}: ${verdict}`);
}

function checkDoc(id: string, docPath: string, scope: string, gate: string, verdict: string) {
  const text = read(docPath);
  const scoped = scope ? (text.split(scope)[1] ?? text) : text;
  const pass = docQuotesGate(scoped, gate, verdict);
  check(
    id,
    pass,
    pass
      ? `${docPath}${scope ? ` (${scope})` : ""} quotes the raw verdict — GATE ${gate}: ${verdict}`
      : `${docPath}${scope ? ` (${scope})` : ""} does NOT quote "GATE ${gate}: ${verdict}" (raw state) — doc drift`,
  );
}

// A. Lighthouse medians (E27) ↔ the docs that claim its state
checkDoc("A1", "evidence/BLOCKED.md", "", "E27", e27);
checkDoc("A2", "evidence/lighthouse/BLOCKED.md", "", "E27", e27);
checkDoc("A3", "docs/deploy-pre.md", "## §3", "E27", e27);

// B. HTTP 404 semantics (E22) ↔ the docs that claim its state
checkDoc("B1", "evidence/BLOCKED.md", "", "E22", e22);
checkDoc("B2", "docs/deploy-pre.md", "## §4", "E22", e22);

// C. tsconfig flag ↔ versions.md TypeScript row
{
  const row = read("docs/versions.md")
    .split("\n")
    .find((l) => l.startsWith("| TypeScript")) ?? "";
  const claimsEnabled = row.includes("noUncheckedIndexedAccess: true");
  const pass = claimsEnabled === nia;
  check(
    "C1",
    pass,
    pass
      ? `docs/versions.md TypeScript row claim (${claimsEnabled ? "enabled" : "not claimed"}) matches tsconfig noUncheckedIndexedAccess=${nia}`
      : `docs/versions.md TypeScript row claims ${claimsEnabled ? "ENABLED" : "absent"} but tsconfig noUncheckedIndexedAccess=${nia} — doc drift`,
  );
}

// — probe: prove the comparators are not vacuous —————————————————
if (PROBE) {
  const good = `some prose … GATE E27: ${e27} … more prose`;
  const bad = `some prose … GATE E27: ${e27 === "PASS" ? "FAIL" : "PASS"} … more prose`;
  const firesBad = !docQuotesGate(bad, "E27", e27);
  const passesGood = docQuotesGate(good, "E27", e27);
  check("PROBE-1", firesBad && passesGood, firesBad && passesGood
    ? `probe: a contradicting claim (GATE E27: ${e27 === "PASS" ? "FAIL" : "PASS"}) IS caught; the true one passes`
    : "probe FAILED — the comparator did not fire on a contradicting claim (vacuous check!)");
}

// — report ——————————————————————————————————————————————————————
const failed = results.filter((r) => !r.pass);
for (const r of results) {
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.id}  ${r.detail}`);
}
console.log(
  failed.length === 0
    ? `verify-docs: PASS — ${results.length} checks green (raw: E27=${e27} · E22=${e22} · noUncheckedIndexedAccess=${nia})`
    : `verify-docs: FAIL — ${failed.length}/${results.length} checks drifted`,
);
process.exit(failed.length === 0 ? 0 : 1);
