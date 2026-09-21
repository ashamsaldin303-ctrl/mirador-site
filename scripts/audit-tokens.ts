// audit:tokens — F2-1: globals.css @theme holds every §5 color, font var,
// spacing/radius with exact §5 names+values. (authored to §9's fixed outcomes)
import { readFileSync } from "node:fs";

const css = readFileSync("src/app/globals.css", "utf-8");

const EXPECTED: [string, string][] = [
  // §5.2 color roles (FROZEN)
  ["--color-night: #0A0A0B", "§5.2 page base"],
  ["--color-surface: #141417", "§5.2 raised surface"],
  ["--color-line: #26262B", "§5.2 hairline"],
  ["--color-ink: #F2EFE8", "§5.2 primary text"],
  ["--color-muted: #A6A199", "§5.2 secondary text"],
  ["--color-amber: #CBA35C", "§5.2 city amber"],
  ["--color-copper: #B87333", "§5.2 copper"],
  ["--color-error: #C96F5A", "§5.2 error"],
  ["--color-success: #7FA974", "§5.2 success"],
  // §5.4 spacing + radius
  ["--spacing: 0.25rem", "§5.4 4px base"],
  ["--radius-sm: 2px", "§5.4 radius sm"],
  ["--radius: 4px", "§5.4 radius"],
  ["--radius-lg: 8px", "§5.4 radius lg"],
  // §5.3 font variables (exact names)
  ['--font-display-en: "Fraunces", serif', "§5.3 font var"],
  ['--font-display-ar: "Amiri", serif', "§5.3 font var"],
  ['--font-body-en: "Instrument Sans", sans-serif', "§5.3 font var"],
  ['--font-body-ar: "IBM Plex Sans Arabic", sans-serif', "§5.3 font var"],
  // §5.3 type scale (fluid clamps, verbatim)
  ["--text-display-xl: clamp(3.5rem, 9vw, 10rem)", "§5.3 display XL"],
  ["--text-h1: clamp(2.75rem, 6vw, 8.75rem)", "§5.3 H1"],
  ["--text-h2: clamp(2rem, 4vw, 3.5rem)", "§5.3 H2"],
  ["--text-h3: clamp(1.5rem, 2.5vw, 2rem)", "§5.3 H3"],
  ["--text-body-lg: 1.125rem", "§5.3 body lg"],
  ["--text-body: 1rem", "§5.3 body"],
  ["--text-small: 0.875rem", "§5.3 small"],
  ["--text-micro: 0.75rem", "§5.3 micro"],
  ["--text-micro--letter-spacing: 0.08em", "§5.3 micro tracking (EN)"],
  // §5.4 motion durations
  ["--duration-fast: 100ms", "§5.4 duration"],
  ["--duration-base: 200ms", "§5.4 duration"],
  ["--duration-slow: 350ms", "§5.4 duration"],
  ["--duration-signature: 600ms", "§5.4 duration"],
  // ::selection (§5.2)
  ["background: rgba(203, 163, 92, 0.28);", "§5.2 ::selection"],
  // AR typography overrides (§5.3 / NEVER-10)
  ["--text-body--line-height: 1.7;", "§5.3 AR body lh ≥1.7"],
  ["--text-small--line-height: 1.7;", "§5.3 AR small lh ≥1.7"],
  ["--text-micro--letter-spacing: 0;", "§5.3 AR zero tracking"],
  // F2-5: tailwind.config must not exist
];

let fail = false;
for (const [needle, label] of EXPECTED) {
  const ok = css.includes(needle);
  if (!ok) fail = true;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${needle}  (${label})`);
}

const fs = await import("node:fs");
const noConfig = !fs.existsSync("tailwind.config.ts") && !fs.existsSync("tailwind.config.js");
console.log(`  ${noConfig ? "PASS" : "FAIL"}  tailwind.config.* absent (F2-5)`);
process.exit(fail || !noConfig ? 1 : 0);
