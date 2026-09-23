// MIRADOR — P-024 route census (prompt-4 R9 · E65): mark every route
// ○ (static prerendered) / ● (on-demand fallback) / ƒ (dynamic per-request)
// and assert every non-prerendered PAGE route carries a recorded justification.
//
// SOURCES (run-15 lesson — the console "Route (app)" tree is HUMAN-oriented):
//   1. .next/prerender-manifest.json — the machine truth: `routes` = the
//      prerendered set (○); `dynamicRoutes` = the generateStaticParams
//      FALLBACK config (●) — Next 16 renders these parent segments on demand
//      for params OUTSIDE generateStaticParams (unknown locales → the STATIC
//      EN-default floor + honest 404), while the en/ar instances themselves
//      are prerendered. The console tree marks the parent ● with symbol-less
//      children (/en, /ar) — parsing THAT was run-15's FAIL on a green build.
//   2. build-output.log — the ƒ tree rows (force-dynamic routes never appear
//      in the prerender manifest).
//
// The P-024 conversion (this release): the round-1 build showed ƒ on ALL 16
// routes — traced to headers() in the [locale]-level not-found.tsx (a dynamic
// API in a layout-segment file poisons every sibling). The fix: the layout
// boundary is STATIC (EN-default floor — invalid-locale paths), the LOCALIZED
// floors moved into the segments whose dynamism is already justified
// ([...rest] catch-all + confirmation/[id]); menu/gallery pinned force-dynamic
// (SSR-fresh is contract-sanctioned); home/story/contact/private-dining
// prerender static — PROVEN by the manifest's routes set.
// Usage: bun scripts/route-census.ts <build-output.log>
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const logPath = process.argv[2] ?? "build-output.log";
const raw = readFileSync(logPath, "utf8");

// — the justified dynamic set (P-024's own documentation duty) —
const JUSTIFIED_DYNAMIC: Record<string, string> = {
  "/[locale]/[...rest]": "the honest-404 catch-all (R3/B-1): every unmatched URL, localized floor + HTTP 404",
  "/[locale]/menu": "menu SSR — 28 dishes + JSON-LD rendered fresh from PostgreSQL (F3-2, pinned)",
  "/[locale]/gallery": "gallery SSR — 8 tiles + intrinsics from PostgreSQL (pinned)",
  "/[locale]/reserve": "reserve SSR — 60-day Damascus date strip computed per request (server clock)",
  "/[locale]/confirmation/[id]": "per-id dynamic lookup — force-dynamic (COP-2 noindex)",
};

// generateStaticParams fallback segments (●): the en/ar instances prerender;
// unknown-locale params render on demand and resolve the locale guard →
// notFound() → the STATIC EN-default floor + HTTP 404 (R3/B-1's design).
const JUSTIFIED_FALLBACK: Record<string, string> = {
  "/[locale]": "generateStaticParams fallback (en/ar prerendered): unknown locale → STATIC EN-default floor + 404",
  "/[locale]/contact": "generateStaticParams fallback (en/ar prerendered): unknown locale → STATIC EN-default floor + 404",
  "/[locale]/private-dining": "generateStaticParams fallback (en/ar prerendered): unknown locale → STATIC EN-default floor + 404",
  "/[locale]/story": "generateStaticParams fallback (en/ar prerendered): unknown locale → STATIC EN-default floor + 404",
};

// routes that MUST be prerendered after the conversion (P-024)
const MUST_BE_STATIC = [
  "/en",
  "/ar",
  "/en/story",
  "/ar/story",
  "/en/contact",
  "/ar/contact",
  "/en/private-dining",
  "/ar/private-dining",
];

// — source 1: the prerender manifest (machine truth) —
const manifestPath = ".next/prerender-manifest.json";
if (!existsSync(manifestPath)) {
  console.error(`FATAL: ${manifestPath} not found — the census runs beside a fresh build`);
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
  routes: Record<string, unknown>;
  dynamicRoutes: Record<string, unknown>;
};
const prerendered = Object.keys(manifest.routes ?? {});
const fallbacks = Object.keys(manifest.dynamicRoutes ?? {});

// — source 2: the ƒ rows from the build output tree —
const fnRows = raw
  .split("\n")
  .map((l) => l.match(/^[│┌├└\s]*ƒ\s+(\/\S+)/)?.[1])
  .filter((m): m is string => Boolean(m));

const out: string[] = [];
out.push(`# P-024 route census — machine-generated from ${manifestPath} + ${logPath}`);
out.push(`# ○ = prerendered static (manifest.routes) · ● = generateStaticParams on-demand fallback (manifest.dynamicRoutes) · ƒ = dynamic per request (build tree)`);
out.push(`# run-15 lesson: the console Route (app) tree marks fallback parents ● with symbol-less prerendered children — the manifest is the machine truth.`);
out.push("");

out.push("## ○ static (prerendered at build — from prerender-manifest.json)");
out.push(...(prerendered.length ? prerendered.map((r) => `  ○ ${r}`) : ["  (none)"]));
out.push("");

out.push("## ● on-demand fallback (generateStaticParams — unknown params only)");
out.push(...(fallbacks.length ? fallbacks.map((r) => `  ● ${r}`) : ["  (none)"]));
out.push("");

out.push("## ƒ dynamic — each justified (P-024)");
out.push(...(fnRows.length ? fnRows.map((r) => `  ƒ ${r}`) : ["  (none parsed from build output)"]));
out.push("");

out.push("## justification table");
for (const [route, why] of Object.entries(JUSTIFIED_DYNAMIC)) out.push(`  ƒ ${route} → ${why}`);
for (const [route, why] of Object.entries(JUSTIFIED_FALLBACK)) out.push(`  ● ${route} → ${why}`);
out.push("");

// — assertions —
let pass = true;
const check = (cond: boolean, msg: string) => {
  out.push(`[${cond ? "PASS" : "FAIL"}] ${msg}`);
  if (!cond) pass = false;
};

// 1. the static content routes must be prerendered (P-024 conversion proof)
for (const page of MUST_BE_STATIC) {
  check(prerendered.includes(page), `○ ${page} prerendered (manifest.routes)`);
}
// bonus proof: the prerendered HTML artifacts exist on disk
// ("/en" → .next/server/app/en.html · "/en/contact" → .next/server/app/en/contact.html)
const htmlOk = MUST_BE_STATIC.every((p) => existsSync(`.next/server/app${p}.html`));
out.push(`[${htmlOk ? "PASS" : "FAIL"}] prerendered HTML artifacts present under .next/server/app (×${MUST_BE_STATIC.length})`);
if (!htmlOk) pass = false;

// 2. every ƒ PAGE route (excluding /api) must be justified
const fnPages = fnRows.filter((p) => !p.startsWith("/api") && !p.startsWith("/_"));
if (fnPages.length === 0) {
  check(false, "no ƒ rows parsed from the build output — table format changed?");
}
for (const page of fnPages) {
  check(page in JUSTIFIED_DYNAMIC, `ƒ ${page} justified`);
}

// 3. every ● fallback segment must be one of the four locale-leaf parents
for (const seg of fallbacks) {
  check(seg in JUSTIFIED_FALLBACK, `● ${seg} is a known generateStaticParams fallback`);
}
// 4. the four fallback parents are exactly the MUST_BE_STATIC locales' parents
const expectedFallbacks = Object.keys(JUSTIFIED_FALLBACK);
check(
  fallbacks.length === expectedFallbacks.length && expectedFallbacks.every((f) => fallbacks.includes(f)),
  `fallback set = the 4 locale-leaf segments (found ${fallbacks.length})`,
);

mkdirSync("evidence/prod-run", { recursive: true });
writeFileSync("evidence/prod-run/route-census.txt", out.join("\n") + "\n");
console.log(out.join("\n"));
console.log(`\nVERDICT: ${pass ? "PASS" : "FAIL"} → evidence/prod-run/route-census.txt`);
if (!pass) process.exit(1);
