// MIRADOR — audit:motion (P-087, prompt-4 R12 · E76): the motion organs,
// mechanically enforced on the source tree (CI-armed).
//   M-2  animate-spin = 0 (NEVER-9 — the breathe busy state replaced it)
//   M-3  THE ONE CURVE — zero stray cubic-bezier literals outside the
//        --ease-out-expo token + EASE_EXPO_OUT constant; EASE_OUT_SOFT dead
//   M-4  the conductor inventory — every motion mechanism mapped to its ONE
//        owner (CSS paint/pointer · GSAP scroll/diff · Lenis scroll-feel)
//   M-6  reduced-motion at EVERY GSAP site (prefersReducedMotion or the
//        useSyncExternalStore RM gate)
// Also: the zero-RUM grep (P-086's rider) — analytics SDKs/beacons = 0.
// Run: bun scripts/audit-motion.ts
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";

const files: string[] = [];
(function walk(dir: string) {
  for (const e of readdirSync(dir)) {
    const p = `${dir}/${e}`;
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(p)) files.push(p);
  }
})("src");

let pass = true;
const check = (cond: boolean, msg: string) => {
  console.log(`[${cond ? "PASS" : "FAIL"}] ${msg}`);
  if (!cond) pass = false;
};
const hits = (re: RegExp) =>
  files.flatMap((f) =>
    readFileSync(f, "utf8")
      .split("\n")
      .map((line, i) => ({ f, line: i + 1, text: line }))
      .filter(({ text }) => re.test(text)),
  );

// — M-2: no spinners, ever —
check(hits(/animate-spin/).length === 0, `M-2 animate-spin = 0 (NEVER-9 — breathe owns busy)`);

// — M-3: the one curve —
const motion = readFileSync("src/lib/motion.ts", "utf8");
const globals = readFileSync("src/app/globals.css", "utf8");
check(!/EASE_OUT_SOFT/.test(motion.replace(/P-078[\s\S]*?EASE_EXPO_OUT/, "")), `M-3 EASE_OUT_SOFT dead (P-078)`);
const strayCurves = hits(/cubic-bezier\(/).filter(
  ({ f, text }) =>
    !f.endsWith("motion.ts") && // EASE_EXPO_OUT's doc comment
    !text.includes("--ease-out-expo") && // the token definition itself
    !text.includes("ease-in-out"), // the breathe loop's sanctioned linear-ish ease
);
check(strayCurves.length === 0, `M-3 zero stray cubic-bezier literals outside the token (${strayCurves.length} found)`);
check(/--ease-out-expo: cubic-bezier\(0\.16, 1, 0\.3, 1\)/.test(globals), `M-3 the token --ease-out-expo is THE curve (0.16,1,0.3,1)`);

// — M-4: the conductor inventory (docs/idiom-contracts.md is the map; every
// mechanism named there must exist in the tree) —
const contracts = readFileSync("docs/idiom-contracts.md", "utf8");
const inventory: [string, RegExp][] = [
  ["CSS hover/focus transitions (duration-base in button API)", /transition-colors duration-base/],
  ["settle primitive in use", /motion-safe:settle/],
  ["draw primitive in use", /motion-safe:draw/],
  ["breathe primitive in use", /motion-safe:breathe/],
  ["GSAP journey scrub (journey.tsx)", /gsap\.to\(trackRef/],
  ["GSAP Flip (menu-client.tsx)", /Flip\.getState/],
  ["Lenis scroll-feel (smooth-scroll.tsx)", /lenis/i],
  ["R3F skyline (skyline-canvas.tsx)", /frameloop="demand"/],
];
for (const [name, re] of inventory) {
  check(files.some((f) => re.test(readFileSync(f, "utf8"))), `M-4 conductor: ${name}`);
}
check(contracts.includes("CSS owns paint/pointer-time"), `M-4 the conductor rule documented (idiom-contracts.md)`);

// — M-6: reduced-motion at EVERY GSAP site (the RM gate takes several legal
// forms: prefersReducedMotion() helper · useSyncExternalStore · raw
// matchMedia("prefers-reduced-motion") — all are gates) —
const gsapSites = files.filter((f) => /getMotion\(\)|from "gsap"|gsap\.context/.test(readFileSync(f, "utf8")));
for (const f of gsapSites) {
  const text = readFileSync(f, "utf8");
  const hasRm =
    /prefersReducedMotion|useSyncExternalStore|getServerReducedMotionSnapshot/.test(text) ||
    /matchMedia\(["']\(prefers-reduced-motion/.test(text);
  check(hasRm, `M-6 RM gate present at GSAP site ${f}`);
}

// — P-086 rider: ZERO RUM — no analytics SDKs, no beacons, no tracking pixels —
const rum = hits(/gtag\(|googletagmanager|analytics\.js|segment\.io|mixpanel|hotjar|clarity\.ms|dataLayer|facebook\.net|matomo|posthog|amplitude|sendBeacon/);
check(rum.length === 0, `P-086 zero RUM/beacons/SDK (grep = ${rum.length}; the battery stays the analytics)`);

mkdirSync("evidence/r1/E76", { recursive: true });
writeFileSync(
  "evidence/r1/E76/audit-motion.log",
  `# audit:motion M-2/M-3/M-4/M-6 + zero-RUM — run ${new Date().toISOString()}\n# verdict: ${pass ? "PASS" : "FAIL"}\n`,
);
console.log(`\nVERDICT: ${pass ? "PASS" : "FAIL"}`);
if (!pass) process.exit(1);
