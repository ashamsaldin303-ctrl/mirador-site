// audit:fonts — F1-4: AR font weight payload ≤60KB (sum of that weight's unicode-range files)
import { statSync } from "node:fs";
import { join } from "node:path";

const FONTS = "public/fonts";
const AR_WEIGHTS: Record<string, string[]> = {
  "amiri 400": ["amiri-400-arabic.woff2", "amiri-400-latin.woff2"],
  "amiri 700": ["amiri-700-arabic.woff2", "amiri-700-latin.woff2"],
  "plex-arabic 400": ["plex-arabic-400-arabic.woff2", "plex-arabic-400-latin.woff2"],
  "plex-arabic 500": ["plex-arabic-500-arabic.woff2", "plex-arabic-500-latin.woff2"],
  "plex-arabic 600": ["plex-arabic-600-arabic.woff2", "plex-arabic-600-latin.woff2"],
};

let fail = false;
console.log("AR font weight payloads (budget ≤ 60KB per weight):");
for (const [weight, files] of Object.entries(AR_WEIGHTS)) {
  let total = 0;
  for (const f of files) total += statSync(join(FONTS, f)).size;
  const kb = (total / 1024).toFixed(1);
  const ok = total <= 60 * 1024;
  if (!ok) fail = true;
  console.log(`  ${weight.padEnd(16)} ${String(total).padStart(6)} B  ${kb} KB  ${ok ? "PASS" : "FAIL"}`);
}
process.exit(fail ? 1 : 0);
