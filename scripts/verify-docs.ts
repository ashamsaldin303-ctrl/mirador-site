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

// — P5/R1 (E83 · J-1 antibody): the E79 verdict text must quote the raw ——————
// medians' FAILING CELLS verbatim. Parse the lantern block's locale lines; for
// each FAIL locale and each false gate key, the DONE's (and close-out's, once
// it exists) E79 row must carry the token exactly as the raw writes it:
// "LCP=<ms>ms" for a false lcp cell · "performance=<score>" for a false score
// cell. Understating the failing surface (the J-1 defect: dropping the AR
// score cell) fails this check. State-agnostic: when the raw changes, the docs
// must re-sync or the check fires. NOTE: the devtools block (R4/E86, when
// present) is RECORDED-NOT-GATE and is written without this line shape, so it
// can never satisfy or poison this parser.
type LocLine = { loc: string; score: string; lcp: string; cells: Record<string, boolean> };
const LOCRE = /\/(en|ar) \(median of \d+ runs\) — performance=(\d+) · LCP=(\d+)ms · CLS=[\d.]+ · TBT=\d+ms → (PASS|FAIL) (\{[^}]*\})/g;
const locLines: LocLine[] = [];
for (const m of mediansRaw.matchAll(LOCRE)) {
  const cells = JSON.parse(m[5] ?? "{}") as Record<string, boolean>;
  locLines.push({ loc: m[1] ?? "", score: m[2] ?? "", lcp: m[3] ?? "", cells });
}
if (locLines.length === 0) throw new Error(`${MEDIANS} carries no lantern locale-median lines — cannot verify the E79 cells against it`);

function failingTokens(): string[] {
  const toks: string[] = [];
  for (const line of locLines.filter((entry) => Object.values(entry.cells).some((v) => !v))) {
    if (line.cells.lcp === false) toks.push(`LCP=${line.lcp}ms`);
    if (line.cells.score === false) toks.push(`performance=${line.score}`);
  }
  return toks;
}

function e79RowOf(docPath: string): string | null {
  if (!existsSync(docPath)) return null; // close-out.md binds once it exists (R6)
  const lines = read(docPath).split("\n");
  const row = lines.find((l) => /^\|\s*\*{0,2}E79\b/.test(l));
  return row ?? "(no E79 row found)";
}

const E79_DOCS = ["evidence/r1/DONE.md", "evidence/r1/close-out.md"];
const required = failingTokens();
for (const [i, doc] of E79_DOCS.entries()) {
  const row = e79RowOf(doc);
  if (row === null) continue;
  const missing = required.filter((t) => !row.includes(t));
  check(
    `D${i + 1}`,
    missing.length === 0,
    missing.length === 0
      ? `${doc}'s E79 row quotes every failing cell of the raw medians verbatim (${required.join(" · ") || "no failing cells"})`
      : `${doc}'s E79 row does NOT quote the raw failing cells: missing ${missing.join(", ")} (raw requires: ${required.join(" · ")}) — the J-1 understatement class`,
  );
}

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
  // PROBE-2 (P5/R1 · the J-1 antibody's own vacuity guard): a synthetic E79 row
  // that drops the first required failing cell MUST fire the D-check comparator.
  if (required.length > 0) {
    const dropped = required[0] ?? "";
    const syntheticRow = `| E79 | FAIL | … ${required.slice(1).join(" · ") || "(all other cells quoted)"} … |`;
    const fires = !syntheticRow.includes(dropped);
    check("PROBE-2", fires, fires
      ? `probe: a synthetic E79 row dropping "${dropped}" IS caught by the D-checks (the J-1 understatement class fires)`
      : "probe FAILED — the D-check comparator did not fire on a dropped failing cell (vacuous check!)");
  } else {
    check("PROBE-2", true, "probe: no failing cells in the current raw (E27 green state) — the D-checks are vacuously true by design; the comparator is proven by construction above");
  }
}

// — report ——————————————————————————————————————————————————————
const failed = results.filter((r) => !r.pass);
for (const r of results) {
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.id}  ${r.detail}`);
}
console.log(
  failed.length === 0
    ? `verify-docs: PASS — ${results.length} checks green (raw: E27=${e27} · E22=${e22} · noUncheckedIndexedAccess=${nia}${required.length ? ` · E79 failing cells required: ${required.join(" · ")}` : " · E79: no failing cells"})`
    : `verify-docs: FAIL — ${failed.length}/${results.length} checks drifted`,
);
process.exit(failed.length === 0 ? 0 : 1);
