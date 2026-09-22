// MIRADOR — P-024 route census (prompt-4 R9 · E65): mark every route
// ○ (static) / ● (dynamic) from the build output and assert every ● carries a
// recorded justification. Conversions: none forced — home/story/contact/
// private-dining prerender static (○) as built; the four ● routes are each
// justified below (the contract's own list); reserve is ● by design (its
// 60-day date strip is computed server-side per request — F12-3 cold-start
// boots dev against a live DB the same way).
// Usage: bun scripts/route-census.ts <build-output.log>
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const logPath = process.argv[2] ?? "build-output.log";
const raw = readFileSync(logPath, "utf8");

// — the justified ● set (P-024's own documentation duty) —
const JUSTIFIED_DYNAMIC: Record<string, string> = {
  "/[locale]/menu": "menu SSR — 28 dishes + JSON-LD rendered fresh from PostgreSQL (F3-2)",
  "/[locale]/gallery": "gallery SSR — 8 tiles + intrinsics from PostgreSQL",
  "/[locale]/reserve": "reserve SSR — 60-day Damascus date strip computed per request (server clock)",
  "/[locale]/confirmation/[id]": "per-id dynamic lookup — force-dynamic (COP-2 noindex)",
};

const lines = raw.split("\n");
// Next build route table rows look like: "  ● /en/menu ..." or "  ○ /en ..." (or ƒ)
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
out.push("");
out.push("## ○ static (prerendered)");
out.push(...staticRoutes.map((r) => `  ${r}`));
out.push("");
out.push("## ●/ƒ dynamic — each justified (P-024)");
out.push(...dynamicRoutes.map((r) => `  ${r}`));
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

// every ● page route (excluding /api and internals) must be in the justified set
const dynamicPages = dynamicRoutes
  .map((r) => r.replace(/^[^\s]+\s+/, ""))
  .filter((p) => !p.startsWith("/api") && !p.startsWith("/_"));
for (const page of dynamicPages) {
  const norm = page.replace(/^\/(en|ar)/, "/[locale]");
  check(norm in JUSTIFIED_DYNAMIC, `● ${page} justified`);
}
// the static content routes must be ○
for (const page of ["/en", "/ar", "/en/story", "/ar/story", "/en/contact", "/ar/contact"]) {
  check(staticRoutes.some((r) => r.includes(page)), `○ ${page} prerendered`);
}

mkdirSync("evidence/prod-run", { recursive: true });
writeFileSync("evidence/prod-run/route-census.txt", out.join("\n") + "\n");
console.log(out.join("\n"));
console.log(`\nVERDICT: ${pass ? "PASS" : "FAIL"} → evidence/prod-run/route-census.txt`);
if (!pass) process.exit(1);
