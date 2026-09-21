// MIRADOR — HTTP semantics verification (prompt-3 Q3 · E22).
// Reads the four raw round-trips captured by the caller into <surface>/http/
// and asserts: /en /ar → 200; /{en,ar}/nonexistent-page → HTTP 404 + the six
// §7.9 designed copy strings (from content/{en,ar}.json — source of truth)
// + noindex. Writes <surface>/http/summary.txt.
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { outDir, EVIDENCE_OUT } from "./lib";

const dir = `${outDir("http")}`;
const en = JSON.parse(readFileSync("content/en.json", "utf8")) as Record<string, string>;
const ar = JSON.parse(readFileSync("content/ar.json", "utf8")) as Record<string, string>;
const copy = {
  en: [en["meta.404.title"], en["meta.404.sub"], en["meta.404.cta"]],
  ar: [ar["meta.404.title"], ar["meta.404.sub"], ar["meta.404.cta"]],
};

const rows: string[] = [
  `# HTTP semantics on the production server — machine-generated ${new Date().toISOString()}`,
  `# gate (E22): /en /ar → 200 · /{en,ar}/nonexistent-page → 404 + §7.9 designed copy + noindex`,
];
let fail = 0;

function roundTrip(file: string, label: string): string {
  if (!existsSync(`${dir}/${file}`)) {
    fail++;
    rows.push(`${label}: MISSING FILE ${file}`);
    return "";
  }
  return readFileSync(`${dir}/${file}`, "utf8");
}

for (const loc of ["en", "ar"] as const) {
  const ok200 = roundTrip(`${loc}--200.txt`, `GET /${loc}`).startsWith(`HTTP/1.1 200`) || roundTrip(`${loc}--200.txt`, `GET /${loc}`).includes(" 200 ");
  rows.push(`GET /${loc} → ${ok200 ? "200 PASS" : "NOT 200 FAIL"}`);
  if (!ok200) fail++;
  const body = roundTrip(`${loc}-nonexistent.txt`, `GET /${loc}/nonexistent-page`);
  const is404 = body.startsWith(`HTTP/1.1 404`) || body.split("\n")[0]?.includes(" 404 ");
  rows.push(`GET /${loc}/nonexistent-page → status ${is404 ? "404 PASS" : `${body.split("\n")[0]} — NOT 404 FAIL`}`);
  if (!is404) fail++;
  for (const s of copy[loc]) {
    const present = body.includes(s);
    rows.push(`  copy: ${JSON.stringify(s)} → ${present ? "present PASS" : "MISSING FAIL"}`);
    if (!present) fail++;
  }
  const noindex = body.includes("noindex");
  rows.push(`  noindex meta → ${noindex ? "present PASS" : "MISSING FAIL"}`);
  if (!noindex) fail++;
}
rows.push(fail === 0 ? `GATE E22: PASS — real 404 semantics + designed §7.9 copy on the production server` : `GATE E22: FAIL — ${fail} failed checks (raw above)`);
writeFileSync(`${dir}/summary.txt`, rows.join("\n") + "\n");
console.log(`http-404-grep done → ${EVIDENCE_OUT}http/summary.txt (fails=${fail})`);
// gate FAILs ship verbatim in summary.txt; verify-battery.sh is the exit gate.
