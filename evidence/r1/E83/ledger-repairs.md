# E83 — THE LEDGER REPAIRS (prompt-5 R1 · J-1..J-6)

The judgment's register, repaired in the generators and tools — never by hand where a
generator owns the doc (N25; the DONE's rows are the rostered exception per ACK 6.3,
and the new verify-docs D-checks machine-enforce their corrected text against the raw).

## J-1 — the E79 failing surface understated (three cells, not one)

**Before** (DONE.md §8 verdict): `E79: FAIL — one honest threshold miss (the E27 Lighthouse LCP medians), diagnosed below.`
**Before** (DONE.md E79 row): `perf 92/87 · CLS 0.0195/0.0000 · TBT 72/90ms all PASS; **LCP medians EN 3340ms · AR 3904ms vs ≤2500ms — the single failing threshold.**`

**After** (DONE.md §8 verdict): `E79: FAIL — three failing cells per the raw gates (/en LCP=3340ms · /ar LCP=3904ms · /ar performance=87 score:false), diagnosed below.`
**After** (DONE.md E79 row): `CLS 0.0195/0.0000 · TBT 72/90ms all PASS; **THREE failing cells per the raw gates: /en LCP=3340ms (lcp:false) · /ar LCP=3904ms (lcp:false) · /ar performance=87 (score:false, below the ≥90 gate — the LCP weight drives the AR score down; EN performance=92 passes).**`

Raw basis (medians.md, run 25): `/en … → FAIL {"score":true,"lcp":false,…}` · `/ar … → FAIL {"score":false,"lcp":false,…}`.
The generator's E79 row carries the same three-cell text (MATRIX.md + E79/POINTER.md).
**The antibody:** `scripts/verify-docs.ts` D1/D2 checks + PROBE-2 — the DONE's (and close-out's,
once it exists) E79 row must quote every failing cell of the raw medians verbatim
(`LCP=3340ms` · `LCP=3904ms` · `performance=87`); a dropped cell fails CI. The probe
proves the comparator fires on a synthetic row that drops the first required cell.

## J-2 — devtools numbers without raw LHRs

All 48 committed LHRs are `throttlingMethod: "simulate"` (verified across the set —
`configSettings.throttlingMethod` in every file). The 1773/1854-class devtools numbers
had no committed raws. **Repaired by R4/E86** (the devtools-method battery with raw LHRs +
the durable medians block), not by this commit — the register assigns J-2 → R4.

## J-3 — citations that don't resolve

The generator's path map re-pointed to the prod-run raws (every fix verified on disk):

| Row | Before (unresolving) | After (resolves) |
|---|---|---|
| F6-1 / E79 | `lcp-element.txt` (sibling-relative) | `prod-run/lighthouse/lcp-element.txt` |
| E38 | `ci.yml` | `.github/workflows/ci.yml` |
| E45 | `http/confirmation-noindex.txt` | `prod-run/snapshots/grep-summary.txt` |
| E46 | `http/headers-table.txt` | `prod-run/http/{en,ar}--200.txt + prod-run/http/summary.txt` |
| E50 / F3-5 | `specs/filter-pair--{en,ar}.log + F3-5/` | `prod-run/specs/filter-pair--{en,ar}.log + prod-run/F3-5/` |
| E51 | `F3-5/menu--{en,ar}--filtered-vegan--1440.png` | `prod-run/F3-5/menu--{en,ar}--filtered-vegan--1440.png` |
| E53 | `… + optimizer-avif.txt` (sibling) | `… + prod-run/img-surface/optimizer-avif.txt` |
| E54 | `… + magic-{en,ar}.txt` (sibling) | `… + prod-run/img-surface/magic-{en,ar}.txt` |
| E55 | `specs/journey-emulation--{…}.log` | `prod-run/specs/journey-emulation--{…}.log` |
| E69 / E75 | `specs/readers--*.log` | `prod-run/specs/readers--*.log` |
| E70 | `specs/route-announcer--{en,ar}.log` | `prod-run/specs/route-announcer--{en,ar}.log` |
| E72 | `… + globals.css` | `… + src/app/globals.css` |
| E74 | `sitemap.xml + git ls-files` | `src/app/sitemap.ts + git ls-files` (prod `sitemap.xml` 200 re-captured at the exit re-dispatch — ACK 6.5) |
| E36 | `workflow YAML + .env.example` | `.github/workflows/production-evidence.yml + .env.example` |
| F8-3 | `specs/keyboard-reserve-errors--ar.log + --en.log` | `specs/keyboard-reserve-errors--{ar,en}.log` |
| E80 | `MATRIX.md (this file)` | `MATRIX.md` |
| F12-5 | `console/summary.txt + console/*.log` | `prod-run/console/summary.txt + prod-run/console/*.log` |

DONE.md's rows for the same class (E36/E46/E50/E51/E53/E54/E55/E64/E69/E70/E74/E75) corrected identically.

**One level deeper (the self-check's own catches, beyond the judge's register):**
- E64's `prod-run/network-firstload.txt` → the committed raw lives at `F12-2/prod-run/network-firstload.txt` (re-pointed).
- E66/E68/E76/E78's `r1/E6{6,8}/… · r1/E7{6,8}/…` audit logs — the scripts write them, but the E33
  evidence-commit never staged them: the raws died with every runner and the citations pointed at
  nothing (locally AND in history — `git log --all -- evidence/r1/E66*` is empty). Repaired both
  ways: the three raws regenerated locally and committed in THIS commit (VERDICT: PASS ×3), and the
  E33 step now stages them on every future dispatch (`git add -f evidence/r1/E66/… E76/… E78/…`).

**The gate itself:** `generate-matrix.ts` now runs the path-resolution self-check over every cited
token (brace expansion, globs via directory listing, POINTER-relative `../../` at the root, a
3-entry principled prose allowlist for command/commit-reference citations) and **exits 1 on any
miss** — the judge's path-walk convention is the generator's own gate; J-3 can never re-materialize
silently. Current state: **151/151 tokens resolve** (3 on the prose allowlist, each with its
justification in-source).

## J-4 — E43 units (181.4 vs 177.2)

Raw table (run 25): `/en/menu — files=13 raw=591857B gz=181419B (177.2KB)` — the table's own display
is KiB-convention 177.2KB. **Before** (DONE E43 row): `max 181.4KB` (a decimal re-conversion of the
same bytes, inconsistent with its table). **After:** `max 177.2KB — KiB display, 181,419B, the raw
table's own units` (DONE row + the generator's E43 row).

## J-5 — F6-1's expectation (H1, not poster)

The LCP element on every committed run is the hero H1 (`main#main > section.media-grain > div.relative
> h1.max-w-4xl`, snippet `<h1 class="max-w-4xl font-hero text-h1 text-ink">` — lcp-element.txt).
**Before:** MATRIX F6-1 expected `hero poster is LCP on /en + /ar`; `lighthouse-summary.ts`'s E28
gate line asserted `must be the hero poster <img>` and its per-run line printed `→ poster <img>:
CHECK MANUALLY` (which the raw never satisfied). **After:** F6-1 expected states the H1 truth; the
summary tool's per-run line asserts `→ hero H1 (font-hero text): YES/NO — INVESTIGATE`; the E28 gate
line states the H1 truth with the poster riding below the H1 in the LCP graph. The regenerated
lcp-element.txt (next dispatch) carries the honest label.

## J-6 — the soft line 150→165

`generate-matrix.ts` gains `const SOFT_CAP_KB = 165` (the standing default (a), gates Release 2) and
F12-2's expected/actual cite the constant — the 150KB number disappears from the generator, not the
history (raw tools keep their era's headers). Zero behavior change: the 176.0–177.2KB routes exceed
both numbers; the raw table's FAIL lines are unchanged.

## J-7 / J-8 — registered, no action this round

J-7 (chromeFlags string = the LHCI 0.15.1 tool truth): registered in the ACK (6.6) and in the E35
row's actual text; no action per the register. J-8 (judge's DB-backed checks BLOCKED-by-environment):
covered by the committed run-25 raws per the register.

## Verification (this commit's own battery)

- `bun evidence/tools/generate-matrix.ts` → `E83 path self-check: PASS — 151/151 cited tokens resolve (3 on the principled prose allowlist)`
- `bun scripts/verify-docs.ts --probe` → A1/A2/A3 · B1/B2 · C1 · D1 · PROBE-1 · PROBE-2 all PASS
- `bunx tsc --noEmit` → 0 · `bunx eslint . --max-warnings 0` → 0
- `bun scripts/audit-idioms.ts` / `audit-motion.ts` / `audit-twins.ts` → VERDICT: PASS ×3 (raws committed)
