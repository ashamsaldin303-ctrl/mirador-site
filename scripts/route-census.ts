// MIRADOR — P-024 route census (prompt-4 R9 · E65): mark every route
// ○ (static prerendered) / ƒ·● (dynamic per-request) from the build output
// and assert every dynamic page route carries a recorded justification.
//
// The P-024 conversion (this release): the round-1 build showed ƒ on ALL 16
// routes — traced to headers() in the [locale]-level not-found.tsx (a dynamic
// API in a layout-segment file poisons every sibling). The fix: the layout
// boundary is now STATIC (EN-default floor — invalid-locale paths), the
// LOCALIZED floors moved into the segments whose dynamism is already
// justified ([...rest] catch-all + confirmation/[id]); menu/gallery pinned
// force-dynamic (SSR-fresh is contract-sanctioned); home/story/contact/
// private-dining prerender static.
// Usage: bun scripts/route-census.ts <build-output.log>
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

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

// routes that MUST be static after the conversion
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

const lines = raw.split("\n");
// Next 16 Turbopack route-table rows: "  ○ /en ..." / "  ƒ /[locale]/menu ..." / "  ● ..."
const routeRows = lines.filter((l) => /^\s*[●○ƒ]\s+\/(en|ar|api|_)/.test(l));
const staticRoutes: string[] = [];
const dynamicRoutes: string[] = [];
for (const row of routeRows) {
  const sym = row.trim()[0];
  const path = row.trim().split(/\s+/).slice(1).join(" ").trim();
  if (sym === "●" || sym === "ƒ") dynamicRoutes.push(`${sym} ${path}`);
  else staticRoutes.push(`${sym} ${path}`);
}

const out: string[] = [];
out.push(`# P-024 route census — machine-generated from ${logPath}`);
out.push(`# ○ = prerendered static · ●/ƒ = dynamic (server-rendered per request)`);
out.push(`# Turbopack emits ƒ for dynamic routes in the Route (app) table.`);
out.push("");
out.push("## ○ static (prerendered)");
out.push(...(staticRoutes.length ? staticRoutes.map((r) => `  ${r}`) : ["  (none parsed)"]));
out.push("");
out.push("## ●/ƒ dynamic — each justified (P-024)");
out.push(...(dynamicRoutes.length ? dynamicRoutes.map((r) => `  ${r}`) : ["  (none parsed)"]));
out.push("");
out.push("## justification table");
for (const [route, why] of Object.entries(JUSTIFIED_DYNAMIC)) {
  out.push(`  ${route} → ${why}`);
}
out.push("");

// — assertions —
let pass = true;
const check = (cond: boolean, msg: string) => {
  out.push(`[${cond ? "PASS" : "FAIL"}] ${msg}`);
  if (!cond) pass = false;
};

if (routeRows.length === 0) {
  check(false, "no route rows parsed from the build output — table format changed?");
}

// every dynamic PAGE route (excluding /api + internals) must be justified
const dynamicPages = dynamicRoutes
  .map((r) => r.replace(/^[^\s]+\s+/, ""))
  .filter((p) => !p.startsWith("/api") && !p.startsWith("/_"));
for (const page of dynamicPages) {
  const norm = page.replace(/^\/(en|ar)(\/.*)?$/, (_m, rest = "") => `/[locale]${rest}`) as string;
  check(norm in JUSTIFIED_DYNAMIC, `dynamic ${page} justified (${norm})`);
}
// the static content routes must be ○ after the conversion
for (const page of MUST_BE_STATIC) {
  check(staticRoutes.some((r) => r.includes(page)), `○ ${page} prerendered`);
}

mkdirSync("evidence/prod-run", { recursive: true });
writeFileSync("evidence/prod-run/route-census.txt", out.join("\n") + "\n");
console.log(out.join("\n"));
console.log(`\nVERDICT: ${pass ? "PASS" : "FAIL"} → evidence/prod-run/route-census.txt`);
if (!pass) process.exit(1);
