# REPLAY.md — MIRADOR evidence pack (prompt-2 §5.2)

Every artifact family regenerates from ONE documented command. The judge
re-runs sampled entries; expected output SHAPE per family is stated (raw HTML
and log files carry timestamps/build-hashes by nature — the frozen gate is the
recorded verdict + counts, which are stable across replays on this repo state).

Environment for all commands: the repo at the evidence-run commits ·
`bun` 1.3.14 · dev daemon `bun run dev` (port 3000, the ONLY sanctioned server
surface in this sandbox) · `DATABASE_URL` from `.env` (SQLite) · Playwright
browsers at `~/.cache/ms-playwright/chromium-1243`.

## http — raw round-trips (E4/E5)
```
cd /home/z/my-project/evidence/http
for u in en ar; do curl -is -m 20 "http://localhost:3000/$u" > "$u--200.txt"; done
curl -is -m 20 http://localhost:3000/en/nonexistent-page > en-nonexistent.txt
curl -is -m 20 http://localhost:3000/ar/nonexistent-page > ar-nonexistent.txt
```
Shape: `HTTP/1.1 200` first line + full headers + body; nonexistent bodies
contain the six §7.9 copy strings + `noindex`. **Dev-mode caveat (B4):** the
nonexistent routes answer `200` in dev (Turbopack streams the shell before
`notFound()` resolves — status commits as 404 in production builds).

## snapshots — 16 rendered HTML + grep summary (E13)
```
cd /home/z/my-project/evidence/snapshots
CID=$(bun -e 'const{PrismaClient}=require("@prisma/client");const db=new PrismaClient();console.log((await db.reservation.findFirst({orderBy:{createdAt:"asc"}})).id);await db.$disconnect()')
for loc in en ar; do for r in "home:" "menu:menu" "reserve:reserve" "story:story" "gallery:gallery" "private-dining:private-dining" "contact:contact" "confirmation:confirmation/$CID"; do
  name="${r%%:*}"; path="${r#*:}"; curl -s -m 25 -o "$name--$loc.html" "http://localhost:3000/$loc${path:+/$path}"; done; done
# grep summary (verbatim command in snapshots/grep-summary.txt header):
for f in *.html; do alt=$(grep -o 'rel="alternate"' "$f" | wc -l); wa=$(grep -o 'wa\.me/963955000111' "$f" | wc -l); echo "$f alternates=$alt wa.me=$wa"; done
```
Shape: 16 files; every file `alternates=3` and `wa.me>=1` → SUMMARY: 16 PASS.

## specs — 9 E2E specs with raw logs + DB counts (E6)
```
bun evidence/tools/api-specs.ts all          # capacity-sequential · capacity-race · ratelimit · dupguard · honeypot
bun evidence/tools/browser-specs.ts all      # locale-atomic · webgl-kill · booking(<90s) · inquiry
```
Env: none required — **rate-limit isolation is achieved inside the tools** by
per-request `x-forwarded-for` IPs (limiter stays ACTIVE; `E2E_RATE_LIMIT` is
never set; the dev daemon is never restarted — boot-guard honored).
Shape per spec: request/response lines with HTTP statuses + `# VERDICT: PASS`.
capacity-race: exactly 12×201 + 8×409 + 0 orphans + post-run DB count query
output + CLEANUP line restoring the 12-row seed baseline.
booking: `BOOKING_DURATION_MS=…` (<90000) + DB row + decoded WhatsApp href.
The race log also preserves the two pre-fix FAIL sections verbatim
(1×201+19×500, then 3×201+17×500) — do not delete them; they document the
honest fix journey under the frozen check.

## screenshots — 48 + 8 forced-colors + 1 RM (E7)
```
bun evidence/tools/screenshots.ts
bun evidence/tools/recapture-ar-reserve.ts   # only if a reserve--ar shot is flat (see manifest note)
```
Shape: `F1-5/<route>--<locale>--<width>.png` ×48 ·
`forced-colors/<route>--forcedcolors--1440.png` ×8 · `F5-3/home--rm--1440.png`
+ `screenshots/manifest.txt` (files + byte sizes + honest annotations).

## axe — 48 JSON runs (E10)
```
bun evidence/tools/axe-run.ts
```
Shape: `axe/<route>--<locale>--<width>.json` ×48 + `axe/summary.txt` ending
`GATE: PASS — 0 critical + 0 serious` (raw violations arrays are empty).

## keyboard — walkthrough logs (F3-7/F7-1/F8-3)
```
bun evidence/tools/keyboard.ts
```
Shape: 4 logs in `specs/` — menu overlay, lightbox, reserve errors AR, EN;
each ends `# VERDICT: PASS`.

## console + probes (F12-5/F12-6/F12-7)
```
bun evidence/tools/console-probes.ts
```
Shape: `console/summary.txt` (TOTAL ERRORS: 0), `console/<route>--<locale>.log` ×16,
`probes/scroll-width--375.log` (16 OK), `probes/targets-44px.log` (+ appended
WCAG analysis section).

## dom-ac-probes — parent §9 DOM battery + F6-2 + state matrix (E16 feeder)
```
bun evidence/tools/dom-ac-probes.ts
```
Shape: one `specs/dom-ac-probes.log` with a `VERDICT` line per covered AC +
`F11/state-matrix/{reserve--loading,reserve--error,gallery--image-fail}--768.png`
(fault injection via Playwright `page.route` abort/delay — zero product changes).

## lcp + fonts (E9 diagnostic · D-4/F1-4)
```
bun evidence/tools/lcp-and-fonts.ts
```
Shape: `lighthouse/lcp-element--{en,ar}--diagnostic.json` (labeled
DIAGNOSTIC-DEV-ONLY; element = hero poster IMG) + `F1-4/font-display--grep.txt`
(12/12 swap) + `F1-4/ar-first-load--fonts-network.json` (CDP timings) +
`F1-4/ar-first-load--waterfall.png` (chart rendered from the raw JSON).

## deterministic suite + audits (F12-1, G1–G7, audits)
```
bash scripts/gates.sh
bunx tsc --noEmit          # src/ scope green; examples/ + skills/ carry pre-existing template noise (out of src scope per build-round convention)
bunx eslint . --max-warnings 0
bun run audit:fonts && bun run audit:tokens && bun run audit:copy
bun evidence/tools/generate-matrix.ts   # regenerates MATRIX.md + 65 POINTER.md folders
```
Shape: `gates/deterministic-suite.log` (G1–G7 all PASS), `audits/audits-run.log`.

## build (BLOCKED here — run on a build-capable machine)
```
bun install && bun run build        # expect exit 0 + route size table
# assert per-route first-load JS ≤150KB gz (hard 200KB)
# assert lazy three-chunk ≤400KB gz + absent from every route's first-load
bun run start                        # production server (port ≠ dev daemon)
```
Shape: size table rows + chunk manifest → `/evidence/F12-2/`, `/evidence/F6-3/`.

## lighthouse (BLOCKED here — needs the build above)
```
bunx @lhci/cli autorun   # lighthouserc: mobile, 3 runs, /en + /ar, medians: ≥90 · LCP ≤2.5s · CLS ≤0.1 · TBT ≤300ms
```
Shape: LHCI reports + raw trace JSONs (lcpElement = hero poster `<img>`).

## handoff (F12-3 — N/A in this sandbox: resets the live daemon DB)
```
# on any fresh machine:
git clone <repo> && cd mirador-site && bun install && bun run migrate && bun run seed && bun run dev
```
Shape: clean boot, seeded DB, `GET /en` → 200.
