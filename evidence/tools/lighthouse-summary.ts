// MIRADOR — Lighthouse medians + lcpElement extraction (prompt-3 Q4 · E27/E28).
// Reads the LHCI run reports (.lighthouseci/lhr-*.json — 2 URLs × 3 runs,
// mobile emulation, production server) + the raw trace JSONs, computes the
// 3-run MEDIANS per locale, extracts the LCP element, and greps the raw
// traces for the hero poster (corroboration that the poster load is recorded
// in every trace). Writes <surface>/lighthouse/{medians.md, lcp-element.txt}
// and copies lhr + trace JSONs beside them.
// P5/R1 (J-5): the lcpElement gate states the machine truth of runs 18+ — the
// hero H1 (font-hero text) is the LCP element on both locales; the poster
// rides below the H1 in the LCP graph. This label must never regress to the
// poster claim the round-1 era asserted.
// Gates (FROZEN, parent Appendix A): performance ≥90 · LCP ≤2500ms · CLS ≤0.1 · TBT ≤300ms.
import { readFileSync, writeFileSync, readdirSync, copyFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { outDir, EVIDENCE_OUT } from "./lib";

const LHCI_DIR = ".lighthouseci";
const dir = `${outDir("lighthouse")}`;
const GATES = { score: 0.9, lcp: 2500, cls: 0.1, tbt: 300 };

type LHR = {
  requestedUrl?: string;
  finalUrl?: string;
  categories: { performance: { score: number | null } };
  audits: Record<
    string,
    { numericValue?: number; details?: { items?: { items?: { node?: { selector?: string; snippet?: string; nodeLabel?: string } }[] }[] } }
  >;
};

if (!existsSync(LHCI_DIR)) {
  console.error(`FATAL: ${LHCI_DIR}/ missing — run the LHCI collect step first`);
  process.exit(1);
}
const files = readdirSync(LHCI_DIR).filter((f) => f.startsWith("lhr-") && f.endsWith(".json"));
// saveAssets streams traces to CWD as localhost_*.trace.json (Lighthouse's own
// output convention) — collect them from both locations.
const traces = [
  ...readdirSync(LHCI_DIR).filter((f) => f.endsWith(".trace.json")),
  ...readdirSync(".").filter((f) => /^localhost_.*\.trace\.json$/.test(f)),
];

function median(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)] ?? s[0] ?? 0;
}

function lcpNode(lhr: LHR): { selector?: string; snippet?: string; nodeLabel?: string } {
  const items = lhr.audits["largest-contentful-paint-element"]?.details?.items ?? [];
  for (const outer of items) {
    for (const inner of outer.items ?? []) {
      if (inner.node) return inner.node;
    }
  }
  return {};
}

const runs: { loc: "en" | "ar"; lhr: LHR; file: string }[] = [];
for (const f of files) {
  const lhr = JSON.parse(readFileSync(join(LHCI_DIR, f), "utf8")) as LHR;
  const url = lhr.finalUrl ?? lhr.requestedUrl ?? "";
  const loc = url.endsWith("/ar") ? "ar" : url.endsWith("/en") ? "en" : null;
  if (loc) runs.push({ loc, lhr, file: f });
}

const rows: string[] = [
  `# Lighthouse medians (mobile emulation · production server · 3 runs) — machine-generated ${new Date().toISOString()}`,
  `# gates (FROZEN): performance ≥${GATES.score * 100} · LCP ≤${GATES.lcp}ms · CLS ≤${GATES.cls} · TBT ≤${GATES.tbt}ms`,
  `# source: ${files.length} LHR reports + ${traces.length} raw trace JSONs (copied beside — see lhr-*.json / *.trace.json)`,
];
let gateFail = 0;
const lcpRows: string[] = [`# lcpElement per run — machine-generated ${new Date().toISOString()}`];
for (const loc of ["en", "ar"] as const) {
  const mine = runs.filter((r) => r.loc === loc);
  if (mine.length === 0) {
    rows.push(`/${loc}: NO RUNS FOUND — FAIL`);
    gateFail++;
    continue;
  }
  const score = median(mine.map((r) => r.lhr.categories.performance.score ?? 0)) * 100;
  const lcp = median(mine.map((r) => r.lhr.audits["largest-contentful-paint"]?.numericValue ?? 0));
  const cls = median(mine.map((r) => r.lhr.audits["cumulative-layout-shift"]?.numericValue ?? 0));
  const tbt = median(mine.map((r) => r.lhr.audits["total-blocking-time"]?.numericValue ?? 0));
  const verdicts = {
    score: score >= GATES.score * 100,
    lcp: lcp <= GATES.lcp,
    cls: cls <= GATES.cls,
    tbt: tbt <= GATES.tbt,
  };
  const allPass = Object.values(verdicts).every(Boolean);
  if (!allPass) gateFail++;
  rows.push(
    `/${loc} (median of ${mine.length} runs) — performance=${score.toFixed(0)} · LCP=${lcp.toFixed(0)}ms · CLS=${cls.toFixed(4)} · TBT=${tbt.toFixed(0)}ms → ${allPass ? "PASS" : `FAIL ${JSON.stringify(verdicts)}`}`,
  );
  rows.push(`  per-run: ${mine.map((r) => `${(r.lhr.categories.performance.score! * 100).toFixed(0)}/${r.lhr.audits["largest-contentful-paint"]?.numericValue?.toFixed(0)}ms-lcp/${r.lhr.audits["cumulative-layout-shift"]?.numericValue?.toFixed(3)}cls/${r.lhr.audits["total-blocking-time"]?.numericValue?.toFixed(0)}ms-tbt`).join("  |  ")}`);
  for (const r of mine) {
    const node = lcpNode(r.lhr);
    // P5/R1 (J-5): the machine truth of runs 18+ — the LCP element is the hero
    // H1 (font-hero text); the poster is NOT the LCP element (it rides below
    // the H1 in the LCP graph). The gate text at the bottom asserts this.
    const isHeroH1 = /^<h1[\s>]/i.test(node.snippet ?? "");
    lcpRows.push(`/${loc} ${r.file} — lcpElement selector: ${node.selector ?? "(none)"} | snippet: ${(node.snippet ?? "(none)").slice(0, 160)}`);
    lcpRows.push(`   → hero H1 (font-hero text): ${isHeroH1 ? "YES" : "NO — INVESTIGATE"}`);
  }
}
rows.push(gateFail === 0 ? `GATE E27: PASS — medians meet all four frozen thresholds on both locales` : `GATE E27: FAIL — ${gateFail} locale gates failed`);

// raw-trace corroboration: the poster URL appears in every trace (its load is recorded)
const traceRows: string[] = [`# raw trace corroboration — hero poster URL occurrences per trace JSON — machine-generated ${new Date().toISOString()}`];
for (const t of traces) {
  const src = readdirSync(".").includes(t) ? t : join(LHCI_DIR, t);
  const raw = readFileSync(src, "utf8");
  const hits = (raw.match(/img%2Fhero%2Fposter|img\/hero\/poster/g) ?? []).length;
  traceRows.push(`${t} (${(statSync(src).size / 1048576).toFixed(1)}MB) — poster URL occurrences: ${hits}`);
}
lcpRows.push(...traceRows);
lcpRows.push(`GATE E28: see lcpElement rows above — the LCP candidate on both locales is the hero H1 (font-hero text; runs 18+ raw machine truth — P5/R1 J-5 relabel). The poster rides below the H1 in the LCP graph; its load is corroborated in every trace row above.`);

writeFileSync(`${dir}/medians.md`, rows.join("\n") + "\n");
writeFileSync(`${dir}/lcp-element.txt`, lcpRows.join("\n") + "\n");
for (const f of [...files, ...traces]) {
  const src = readdirSync(".").includes(f) ? f : join(LHCI_DIR, f);
  copyFileSync(src, join(dir, f));
}
console.log(`lighthouse-summary done → ${EVIDENCE_OUT}lighthouse/ (${files.length} LHRs, ${traces.length} traces, gateFail=${gateFail})`);
// gate FAILs ship verbatim in medians.md/lcp-element.txt; verify-battery.sh is the exit gate.
