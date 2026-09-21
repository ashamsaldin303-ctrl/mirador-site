# REPLAY.md — MIRADOR evidence pack (prompt-2 §5.2 · prompt-3 E30 dual-path)

Every artifact family regenerates from ONE documented command, on EITHER
surface. The judge re-runs sampled entries (≥1 from `prod-run/`); expected
output SHAPE per family is stated (raw HTML and log files carry timestamps and
build hashes by nature — the frozen gate is the recorded verdict + counts,
which are stable across replays on the same repo state).

## SURFACES

| surface | environment | status |
|---|---|---|
| **prod-run** (canonical) | GitHub Actions → Actions tab → `production-evidence` → **Run workflow** (`workflow_dispatch`; ubuntu-latest · bun 1.3.14 · `postgres:16` service · playwright 1.63.0 chromium · @lhci/cli 0.15.1). Equivalently from a terminal: `gh workflow run production-evidence.yml --ref main`. | produces `/evidence/prod-run/**` + `/evidence/F12-2/prod-run/` + `/evidence/F6-3/prod-run/`; auto-commits them to main; artifacts retained ≥90 days |
| **dev-run** (historical, round-2) | the original sandbox dev daemon (`bun run dev`, port 3000) + `DATABASE_URL` from `.env` | round-2 families at their original `/evidence/` paths — never edited; regenerate locally with the commands below and `EVIDENCE_SURFACE` UNSET |

Local prod-surface reproduction (any build-legal machine — the workflow's
steps verbatim): `bun install && bunx playwright install --with-deps chromium
&& sudo apt-get install -y ripgrep && bun run migrate && bun run seed && bun
run build 2>&1 | tee build-output.log && bun run start &` then set
`EVIDENCE_SURFACE=prod-run EVIDENCE_BASE_URL=http://localhost:3000` and run the
tools below in workflow order. The original sandbox ALSO mirrors this DB at
its `.env` URL via a user-space PostgreSQL 16.14 (`~/pg-runtime/start-pg.sh` —
LOCAL launcher, never committed; N22) so the dev daemon runs the canonical
schema — but the sandbox is NEVER a source of production evidence (N21).

Env for all tool commands: `EVIDENCE_SURFACE=prod-run` (routes outputs into
`/evidence/prod-run/<family>/`) · `EVIDENCE_BASE_URL` (the production server)
· `DATABASE_URL` (the battery database). Unset `EVIDENCE_SURFACE` = the
round-2 dev-run layout (byte-identical paths).

## build + budgets (E18/E19 — prod surface only)
```
bun run build 2>&1 | tee build-output.log
bun evidence/tools/build-budgets.ts
```
Shape: `F12-2/prod-run/{route-size-table.txt, first-load-js-gz.txt,
chunk-manifest.txt, motion-stack.txt, network-firstload.txt, summary.md,
build-manifest.json}` + `F6-3/prod-run/three-lazy-chunk.txt`. Budgets are
FROZEN (≤150KB gz per route first-load · three pack ≤400KB gz · motion ≤90KB
gz); FAIL verdicts ship verbatim (see `docs/deploy-pre.md` §2 for the
first-load blocker's root cause) — thresholds never bend.

## http — raw round-trips (E22)
```
mkdir -p evidence/prod-run/http && cd evidence/prod-run/http
curl -is -m 20 http://localhost:3000/en > en--200.txt
curl -is -m 20 http://localhost:3000/ar > ar--200.txt
curl -is -m 20 http://localhost:3000/en/nonexistent-page > en-nonexistent.txt
curl -is -m 20 http://localhost:3000/ar/nonexistent-page > ar-nonexistent.txt
cd ../../.. && bun evidence/tools/http-404-grep.ts
```
Shape: `http/summary.txt` — /en /ar → 200; nonexistent → designed §7.9 copy
×6 + noindex. **Known FAIL (shipped verbatim, root-caused):** the HTTP status
stays 200 — Next 16 streams the shell (the `[locale]/loading.tsx` Suspense
boundary flushes before `notFound()` resolves, so the server's 404 assignment
loses the race). Fixing it requires removing a contracted state surface —
registered as a blocker, never silently "solved".

## specs — 9 E2E specs with raw logs + DB counts (E21/E23)
```
bun evidence/tools/api-specs.ts capacity-race        # FIRST (prompt-3 Q4 order)
bun evidence/tools/api-specs.ts capacity-sequential ratelimit dupguard honeypot
bun evidence/tools/browser-specs.ts locale-atomic webgl-kill booking inquiry
```
Shape per spec: request/response lines + `# VERDICT: PASS`.
capacity-race: exactly 12×201 + 8×409 + 0 orphans + post-run DB count query
output + CLEANUP line restoring the 12-row seed baseline.
booking: `BOOKING_DURATION_MS=…` (<90000) + DB row + decoded WhatsApp href.
Rate-limit isolation: per-request `x-forwarded-for` IPs inside the tools
(limiter ACTIVE; `E2E_RATE_LIMIT` never set; boot-guard honored).
Browser specs wait for router hydration before interacting (`gotoHydrated`).

## snapshots — 16 rendered HTML + grep summary (E13)
```
mkdir -p evidence/prod-run/snapshots && cd evidence/prod-run/snapshots
CID=$(bun -e 'const{PrismaClient}=require("@prisma/client");const db=new PrismaClient();const r=await db.reservation.findFirst({orderBy:{createdAt:"asc"}});console.log(r.id);await db.$disconnect()')
for loc in en ar; do for r in "home:" "menu:menu" "reserve:reserve" "story:story" "gallery:gallery" "private-dining:private-dining" "contact:contact" "confirmation:confirmation/$CID"; do
  name="${r%%:*}"; path="${r#*:}"; curl -s -m 25 -o "$name--$loc.html" "http://localhost:3000/$loc${path:+/$path}"; done; done
for f in *.html; do alt=$(grep -o 'rel="alternate"' "$f" | wc -l); wa=$(grep -o 'wa\.me/963955000111' "$f" | wc -l); echo "$f alternates=$alt wa.me=$wa"; done > grep-summary.txt
```
Shape: 16 files; every file `alternates=3` and `wa.me>=1` → `SUMMARY: 16/16 PASS`.

## console + probes (E24 / F12-5/F12-6/F12-7)
```
bun evidence/tools/console-probes.ts
```
Shape: `console/summary.txt` (TOTAL ERRORS: 0), `console/<route>--<locale>.log` ×16,
`probes/scroll-width--375.log` (16 OK), `probes/targets-44px.log`.

## axe — 48 JSON runs (E25)
```
bun evidence/tools/axe-run.ts
```
Shape: `axe/<route>--<locale>--<width>.json` ×48 + `axe/summary.txt` ending
`GATE: PASS — 0 critical + 0 serious`.

## screenshots — 48 + 8 forced-colors + 1 RM (E26)
```
bun evidence/tools/screenshots.ts
```
Shape: `F1-5/<route>--<locale>--<width>.png` ×48 ·
`forced-colors/<route>--forcedcolors--1440.png` ×8 · `F5-3/home--rm--1440.png`
+ `screenshots/manifest.txt`. (Round-2 dev-run set retained at the same
relative paths WITHOUT the surface prefix.)

## keyboard — walkthrough logs (F3-7/F7-1/F8-3)
```
bun evidence/tools/keyboard.ts
```
Shape: 4 logs in `specs/` — each ends `# VERDICT: PASS`.

## dom-ac-probes — parent §9 DOM battery + F6-2 + state matrix
```
bun evidence/tools/dom-ac-probes.ts
```
Shape: one `specs/dom-ac-probes.log` with a `VERDICT` line per covered AC +
`F11/state-matrix/{reserve--loading,reserve--error,gallery--image-fail}--768.png`
(fault injection via Playwright `page.route` — zero product changes).

## lighthouse (E27/E28)
```
export CHROME_PATH="$(ls ~/.cache/ms-playwright/chromium-*/chrome-linux*/chrome | head -1)"
bunx @lhci/cli@0.15.1 autorun --config=.lighthouserc.json 2>&1 | tee lhci-run.log
bun evidence/tools/lighthouse-summary.ts
```
Shape: `.lighthouseci/` LHRs + raw traces (copied into
`prod-run/lighthouse/`) + `medians.md` (3-run medians vs FROZEN thresholds
≥90 · LCP ≤2.5s · CLS ≤0.1 · TBT ≤300ms) + `lcp-element.txt` (lcpElement =
hero poster `<img>` + raw-trace poster-URL corroboration). saveAssets streams
traces to CWD as `localhost_*.trace.json` — the summary tool collects both
locations. LHCI's own assert may exit 1 on threshold failure — that verdict is
data (see medians.md); one median re-run is allowed for runner noise (both
runs committed).

## cold-start handoff (F12-3)
```
git clone <repo> /tmp/coldstart && cd /tmp/coldstart
bun install && bun run db:generate
echo 'CREATE DATABASE mirador_coldstart' | bunx prisma db execute --stdin --url postgresql://mirador:mirador@localhost:5432/postgres
DATABASE_URL=postgresql://mirador:mirador@localhost:5432/mirador_coldstart bun run migrate
DATABASE_URL=postgresql://mirador:mirador@localhost:5432/mirador_coldstart bun run seed
bun run dev &   # then GET /en → 200
```
Shape: `prod-run/cold-start/cold-start.log` (+ the clone's `dev.log`) ending
`GATE F12-3: PASS — fresh clone boots clean, /en 200`.

## deterministic suite + audits (F12-1, G1–G7, audits)
```
sudo apt-get install -y ripgrep   # gates REQUIRE rg — a missing rg fails LOUDLY, never false-passes
bash scripts/gates.sh
bunx tsc --noEmit          # whole repo; scaffold examples/skills excluded per ASSUMPTIONS #9
bunx eslint . --max-warnings 0
bun run audit:fonts && bun run audit:tokens && bun run audit:copy   # audit:copy needs the seeded DB
bash scripts/judge-audit.sh        # E32: tsc + eslint + G1–G7 + canonical-schema provider assert; fresh-clone-safe
bun evidence/tools/generate-matrix.ts   # regenerates MATRIX.md + 65 POINTER.md folders
bun evidence/tools/verify-battery.sh    # the battery's exit gate — fails on any FAIL verdict under prod-run/
```
Shape: `gates/deterministic-suite.log` (G1–G7 all PASS), `audits/audits-run.log`.

## lcp + fonts (round-2 diagnostic · D-4/F1-4 — dev surface)
```
bun evidence/tools/lcp-and-fonts.ts
```
Shape: `lighthouse/lcp-element--{en,ar}--diagnostic.json` (DIAGNOSTIC-DEV-ONLY)
+ `F1-4/` font-display greps + AR first-load waterfall. Superseded on the prod
surface by `prod-run/lighthouse/` (E27/E28).

## seed counts (F3-1)
```
bun run migrate && bun run seed   # then the count query in the workflow's Q1 step
```
Shape: `specs/seed-count.log` — 6 sections · 28 dishes (4–5 each) · 8 gallery ·
12 reservations · 0 inquiries → `GATE F3-1: PASS`.
