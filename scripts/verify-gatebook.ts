// MIRADOR — verify-gatebook (P-044, prompt-4 R7 · E59): the GATEBOOK drift
// guard. The ceilings in docs/gatebook.md are FROZEN (prompt-4 §5 verbatim);
// this script fails the job when a ceiling value is edited away, the six
// organs list loses an armed entry, or an R10 checklist item disappears.
// It also carries a PROBE mode (--probe) proving the guard actually fires:
// a synthetic mutated copy MUST fail every check (the vacuity guard law).
import { readFileSync, existsSync, writeFileSync, mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

const path = "docs/gatebook.md";
if (!existsSync(path)) {
  console.error("FATAL: docs/gatebook.md missing — the gatebook IS a required organ");
  process.exit(1);
}
const text = process.env.PROBE_MUTATION ? readFileSync(process.env.PROBE_MUTATION, "utf8") : readFileSync(path, "utf8");

let pass = true;
const check = (cond: boolean, msg: string) => {
  console.log(`[${cond ? "PASS" : "FAIL"}] ${msg}`);
  if (!cond) pass = false;
};

// — the frozen ceiling values (prompt-4 §5 verbatim) —
const CEILINGS: [string, RegExp, string][] = [
  ["first-load hard", /≤200KB gz, 16\/16/, "≤200KB gz, 16/16"],
  ["first-load soft 165", /150 → \*\*165KB\*\* standing default \(a\)/, "150 → **165KB** standing default (a)"],
  ["motion family 62", /≤62KB gz/, "≤62KB gz"],
  ["three-pack 235", /≤235KB gz/, "≤235KB gz"],
  ["combined rental 297", /≤297KB/, "≤297KB"],
  ["CSS +3KB", /\+3KB total/, "+3KB total"],
  ["fonts 60KB + 334,880B", /AR faces ≤60KB each · disk 334,880B/, "AR faces ≤60KB each · disk 334,880B"],
  ["ΣΔ≤0", /\*\*ΣΔ≤0 per release\*\*/, "**ΣΔ≤0 per release**"],
  ["zero RUM", /zero RUM\/beacons\/SDK/, "zero RUM/beacons/SDK"],
];
for (const [name, re, literal] of CEILINGS) {
  check(re.test(text), `ceiling ${name} present verbatim (${literal})`);
}

// — the six organs —
const ORGANS = ["audit:fonts", "verify-docs", "ledger", "gatebook", "audit:motion", "audit:twins"];
for (const organ of ORGANS) {
  check(text.includes(`**${organ}**`), `organ ${organ} listed`);
}

// — R10 checklist items —
const CHECKLIST = [
  "P-035: ONE Button API",
  "audit:idioms` A1–A12",
  "P-037: settle / draw / breathe",
  "P-078: `EASE_OUT_SOFT` grep = 0",
];
for (const item of CHECKLIST) {
  check(text.includes(item), `R10 checklist: ${item.slice(0, 46)}…`);
}

// — the probe: a mutated gatebook MUST fail (state-agnostic vacuity guard) —
if (process.argv.includes("--probe")) {
  const mutated = text
    .replace("≤200KB gz, 16/16", "≤400KB gz, 16/16")
    .replace("**ΣΔ≤0 per release**", "**ΣΔ≤+50KB per release**")
    .replace("**audit:twins** (P-091)", "audit:twins (P-091)");
  const dir = mkdtempSync(`${tmpdir()}/gatebook-probe-`);
  const probePath = `${dir}/gatebook.md`;
  writeFileSync(probePath, mutated);
  const env = { ...process.env, PROBE_MUTATION: probePath };
  let probeFailed = false;
  try {
    execFileSync("bun", ["scripts/verify-gatebook.ts"], { env, stdio: "pipe" });
  } catch {
    probeFailed = true;
  }
  console.log(`[${probeFailed ? "PASS" : "FAIL"}] PROBE: a mutated gatebook fails the guard (exit non-zero)`);
  if (!probeFailed) pass = false;
}

// — raw artifact record (N24) —
mkdirSync("evidence/r1/E59", { recursive: true });
writeFileSync(
  "evidence/r1/E59/gatebook-check.log",
  `# P-044 GATEBOOK drift guard — run ${new Date().toISOString()}\n` +
    `# surface: ${process.env.PROBE_MUTATION ? "PROBE (mutated copy)" : "committed docs/gatebook.md"}\n` +
    `# verdict: ${pass ? "PASS" : "FAIL"}\n`,
);
if (!pass) process.exit(1);
