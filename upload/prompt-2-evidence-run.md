# MIRADOR — PROMPT 2: ACCEPTANCE EVIDENCE RUN & PRODUCTION-READINESS CONTRACT v1.0

> **⚠️ الوضع بالعربية (اقرأ أولاً):** هذا العقد الثاني، وهو **عقد أدلة لا عقد بناء**: شغِّل البناء الإنتاجي، نفِّذ بطارية §10.2 كاملة (Playwright/Lighthouse/axe/لقطات)، سلِّم حزمة أدلة من **المخرجات الخام لا التصريحات**، وأغلق أوراق الانحرافات. لا ميزات جديدة، لا تغييرات بصرية، لا «تحسينات». الفشل يُسجَّل كما هو — التجميل وحده هو الجريمة. البرومبت الأول (`build-brief.md` v1.1) ما زال العقد الأم: كل الـ65 معياراً و15 قاعدة NEVER وثوابت الملحق أ سارية كما هي؛ هذا الملف يضيف مهام الأدلة ويحكم في الانحرافات السبعة المسجلة — عند أي تعارض، هذا الملف هو المرجع ويُدوَّن التعارض في ASSUMPTIONS.md.

**To the builder agent:** this is your ONLY new input together with `build-brief.md` v1.1 (the parent contract — keep both loaded). First output = the ACK (§10). Never code before the ACK.

---

## 0. READ ME FIRST — execution protocol

1. **Your mission is evidence, not construction.** The site is built; the acceptance judge could not verify it because (a) no production build ever ran, (b) the §10.2 battery never ran, (c) the raw-artifact evidence pack never shipped. You are closing those three gaps — nothing else.
2. **Raw outputs are the deliverable.** A "✅" in a report is worth nothing here. Every claim ships as: the exact command + exit code + raw output file, re-runnable by one documented command (REPLAY.md, §5).
3. **FAIL is data.** If a gate fails, record the failure verbatim, then use your ≤3 self-retries (§9). Hiding or editing a failing output is the one unforgivable act (N16 → automatic REJECT).
4. **Frozen means frozen.** Tests, thresholds, baselines, gate configs stay untouched (NEVER-14). This round's screenshots become **baseline-v0 candidates** for later human approval — you do not approve them yourself.
5. Work task-by-task in ID order (§4); one bounded diff per task; ACK → STATUS per task → DONE.

## 1. Context & authority (why this contract exists)

The acceptance round of 2026-09-21 returned **REVISE** (report: `acceptance-report-2026-09-21.md`). No product defect was evidenced; the deterministic gates you self-reported green are plausible. What is missing is the contracted evidence chain:

- **F-G1 (Critical):** production build never executed → F12-1, F12-2, F6-3, F11-1 have no valid evidence form.
- **F-G2 (Critical):** the §10.2 battery (Playwright E2E + screenshots + Lighthouse + axe + keyboard + console/probe checks) never ran → ~22 of 65 ACs lack their named checks.
- **F-G5 (Major):** the R4-critical race test (F4-4: 20 parallel POSTs → exactly 12 rows + 8 × 409) has no stated run and no raw output.
- **F-G3 (Major, human side):** the judge cannot reach the repo — you commit everything and the human chooses an access channel.

This contract is the narrow path from REVISE to a real ACCEPTANCE verdict.

## 2. Scope IN / OUT

### 2.1 IN — MUST (gate-blocking)

- Run the production build and capture its outputs (size table, chunk manifests).
- Boot the production server; capture 404 round-trips and rendered-HTML snapshots.
- Execute the FULL §10.2 battery exactly as specified in the parent contract §10.2 and below in §4/P3.
- Assemble the raw-artifact evidence pack with REPLAY.md + environment manifest.
- Close the deviation paperwork (§3 rulings: deploy-pre doc, ASSUMPTIONS rows, gate-path adaptation record, font-display verification).
- Produce the 65-row verification matrix FROM RUNS.

### 2.2 OUT — do NOT (violation = gold-plating defect, returned for revert)

- Any new feature, section, page, component, or visual change.
- Any refactor, dependency swap (beyond installing tooling), or "quick polish".
- The PostgreSQL switch itself (if no PostgreSQL service is available) — it is registered as DEPLOY-PRE paperwork, never faked (N19).
- Editing any FROZEN artifact: tests, thresholds, baselines, gate configs, the parent brief.

## 3. Deviation rulings (binding — carried from the acceptance report; do not re-litigate)

| ID | Ruling (what you must do this round) |
|---|---|
| D-1 bun | ACCEPTED. README states all run commands in bun terms; lockfile committed. Nothing further. |
| D-2 SQLite | ACCEPTED FOR THIS RUN. Conditions: (a) §6.3 transaction pattern + both `@@unique` constraints re-verified (grep the schema into evidence); (b) the capacity-race raw output ships (E6); (c) create `docs/deploy-pre.md` — see P5. The PostgreSQL switch itself is a pre-deployment step, NOT this round, unless a PostgreSQL service is actually available (then it is optional bonus — labeled, never required). |
| D-3 `src/app/` | ACCEPTED. Record the adapted grep-gate commands (paths `src/app/ src/`, coverage-equivalent) verbatim in `/evidence/gates/commands.md` (P5). |
| D-4 `@font-face` | ACCEPTED. Verify every `@font-face` declares `font-display: swap` (or `optional` for AR display faces) + critical weights preloaded; put the grep output + one network waterfall screenshot (AR first load) into `/evidence/F1-4/`. |
| D-5 Prisma 6.11.1 | ACCEPTED. Append one ASSUMPTIONS.md row: reversal path to 7.x with migration notes. |
| D-6 no prod build | ELIMINATED BY THIS CONTRACT (P1). |
| D-7 battery not run | ELIMINATED BY THIS CONTRACT (P3). |

## 4. Task DAG (P0–P7 · ID order · one bounded diff each)

- **P0 — ACK.** Send the §10 ACK (≤15 lines) with the environment declaration. No work before it.
- **P1 — Production build.** `bun run build` (exit 0). Capture to `/evidence/F12-2/`: the full route size table; to `/evidence/F6-3/`: the lazy three-chunk size (≤400KB gz) + proof it is absent from every route's first-load JS; to `/evidence/F2/` (bonus): motion-stack total (gsap + ScrollTrigger + Flip + lenis ≤90KB gz in base bundle). Assert per-route first-load JS ≤150KB gz (hard 200KB) — from the table, not eyeballed.
- **P2 — Production server + HTTP semantics + snapshots.** `bun run start`. Raw `curl -i` round-trips saved: `GET /en` → 200; `GET /en/nonexistent-page` → **HTTP 404** with the §7.9 designed copy strings in body; same two for `/ar`. Then save rendered-HTML snapshots of ALL 8 routable paths × 2 locales (16 files) from this production server into `/evidence/snapshots/` (`route--locale.html`). Each snapshot must show: ≥3 `rel="alternate"` hreflang links and ≥1 `wa.me/963955000111` CTA — recorded by a grep summary file, not by assertion alone.
- **P3 — Full §10.2 battery (the core).** On the production build:
  - **E2E specs (9, run in this order):** `capacity-sequential` (13th POST on a 12-capacity slot → 409 SLOT_FULL) · `capacity-race` (20 parallel POSTs to ONE fresh empty slot → exactly 12 rows + 8 × 409 + 0 orphan rows in any other slot; raw parallel log + post-run DB count query output committed) · `ratelimit` (6th POST in 60s → 429 + `Retry-After`) · `dupguard` (same phone+slot → 409 DUPLICATE, no second row) · `honeypot` (filled honeypot → 201, no row) · `locale-atomic` (`dir`+`lang` flip in one frame, no full navigation) · `webgl-kill` (`?webgl=off` → 0 `<canvas>`, poster treatment) · booking happy path **<90s measured** · inquiry happy path. Rate-limit isolation per parent §8.4: `E2E_RATE_LIMIT=off` for capacity cases (never in production boot — boot-guard honored).
  - **Screenshots:** 8 routes × 2 locales × 3 viewports (375/768/1440) named `route--state--width.png` under `/evidence/<AC-ID>/` + one forced-colors pass per route + `prefers-reduced-motion` emulation on home (F5-3: static 3-act layout, all copy present).
  - **Lighthouse CI:** mobile, production server, 3 runs, median on `/en` and `/ar`: **≥90 · LCP ≤2.5s · CLS ≤0.1 · TBT ≤300ms**. Commit the LHCI reports AND the raw trace JSONs.
  - **axe:** every route × viewport: **0 critical + 0 serious**; axe JSON outputs committed.
  - **Keyboard walkthroughs:** logs for menu overlay, gallery lightbox, reserve form errors (per-field bilingual, RTL-correct).
  - **Console + probes:** Playwright console capture (0 errors on 8 paths × 2 locales); `scrollWidth ≤ clientWidth` at 375 per route; interactive targets ≥44px (nav, filters, forms, lightbox).
- **P4 — Evidence pack assembly.** REPLAY.md + environment manifest + `/evidence/INDEX.md` (§5).
- **P5 — Deviation paperwork.** `docs/deploy-pre.md` (D-2: exact PostgreSQL switch steps — provider line change, `migrate`, re-run `capacity-race` — as blocking pre-deployment checklist); ASSUMPTIONS.md D-5 reversal row; `/evidence/gates/commands.md` (D-3 adapted gate commands, verbatim); `/evidence/F1-4/` font-display verification (D-4).
- **P6 — Judge access prep (human action follows).** Commit everything (incl. `/evidence/`); ensure the repo is pushed; note in DONE which access channel the human should open (public / read-token / archive export).
- **P7 — DONE.** The 65-row matrix (§8 of parent §12.2) generated from these runs + any new deviations logged + the five-message protocol observed throughout.

> **AR (§0–§4):** مهمتك أدلة خام قابلة لإعادة التشغيل؛ نطاق ضيق (بناء إنتاجي + بطارية كاملة + حزمة أدلة + أوراق انحرافات)؛ DAG من P0 إلى P7؛ سباق 20 طلباً متوازياً ← 12 صفاً + 8×409 حرفياً؛ ولا شيء خارج النطاق.

---

## 5. Evidence-pack specification (the deliverable's shape)

Everything below lives under `/evidence/` in the repo (committed, pushed).

**5.1 Raw-artifact rule.** Every artifact is a machine-generated file (`.log`, `.json`, `.txt`, `.png`, `.html`). Human-typed summaries are allowed ONLY as separate `*.summary.md` files next to them. A summary without its raw file = the claim does not exist.

**5.2 REPLAY.md (repo root of `/evidence/`).** One section per artifact family: the exact command that regenerates it, the environment flag(s) required (e.g. `E2E_RATE_LIMIT=off`), and the expected exit/output shape. The judge will re-run 3 sampled entries.

**5.3 Environment manifest (`/evidence/MANIFEST.md`).** git SHA · OS · runtime (bun/node) + version · DB engine + version · Playwright / LHCI / axe versions · run date/time (UTC+3) · any env flags active during runs. If two different machines executed parts of the battery, list both — split environments are legal, undeclared ones are not.

**5.4 Mandatory raw artifacts (minimum set):**

| Family | Files | Feeds |
|---|---|---|
| Build outputs | route size table; chunk manifest; lazy-chunk size line | E2, E3 |
| HTTP round-trips | `curl -i` raw: /en, /ar, /en/nonexistent, /ar/nonexistent | E4, E5 |
| Rendered snapshots | 16 × `route--locale.html` + hreflang/wa.me grep summary | E13 |
| E2E logs | 9 spec run logs (runner output, unedited) + booking timing line + race post-run DB count query output | E6 |
| Screenshots | 8×2×3 + forced-colors(8) + RM(1) PNGs, contract naming | E7 |
| Lighthouse | 2 × 3 run reports + raw trace JSONs | E8, E9 |
| axe | JSON per route×viewport | E10 |
| Console/probes | console capture logs; scroll-width probe log; 44px target probe log | E11, E12 |
| Paperwork | `docs/deploy-pre.md`; ASSUMPTIONS.md rows; `gates/commands.md`; font-display proof | E14 |

## 6. Acceptance criteria (binary · E1–E16 · each names its check)

- **E1** ACK received before any work: ≤15 lines, environment declared — check: message log.
- **E2** Production build exit 0; size table + chunk manifests captured — check: `/evidence/F12-2/`, `/evidence/F6-3/`.
- **E3** Budget assertions hold from the build table: first-load JS ≤150KB gz per route (hard 200KB); three/fiber/drei NOT in any route's first-load; lazy chunk ≤400KB gz — check: table rows quoted in `F12-2/summary.md` with the raw table beside them.
- **E4** Production server serves `/en` and `/ar` with HTTP 200 — check: raw round-trips.
- **E5** `/en/nonexistent-page` and `/ar/nonexistent-page` → HTTP 404 + §7.9 designed copy strings in body — check: raw round-trip + grep.
- **E6** All 9 E2E scenarios pass with raw logs; race = exactly 12 rows + 8 × 409 + 0 orphans — check: spec logs + DB query output.
- **E7** Screenshot set complete (8×2×3 + forced-colors + RM), contract naming — check: file count + names.
- **E8** Lighthouse medians meet ≥90 · LCP ≤2.5s · CLS ≤0.1 · TBT ≤300ms on /en and /ar — check: LHCI reports.
- **E9** LCP element on /en and /ar home is the hero poster `<img>` — check: `lcpElement` read from the committed trace JSON.
- **E10** axe: 0 critical + 0 serious per route × viewport — check: axe JSONs.
- **E11** 0 console errors on 8 paths × 2 locales — check: console capture logs.
- **E12** No horizontal scroll at 375 on any route; interactive targets ≥44px — check: probe logs.
- **E13** 16 rendered snapshots committed; ≥3 hreflang + ≥1 `wa.me/963955000111` per snapshot — check: grep summary over the set.
- **E14** Deviation paperwork complete (D-2..D-5 items of §3/P5) — check: file contents.
- **E15** REPLAY.md + MANIFEST.md present; 3 sampled replays regenerate byte-equivalent artifacts — check: judge re-run.
- **E16** 65-row matrix generated from runs; any FAIL row included verbatim with its evidence path — check: matrix + `/evidence/INDEX.md`.

## 7. Environment options & prerequisites

This contract is environment-agnostic. Legal executors, in preference order:
1. The original build container, IF Playwright browsers + LHCI + axe can be installed there (`bunx playwright install chromium` etc.). The dev-daemon stays untouched; the battery runs against `next start` on a separate port.
2. Any fresh machine with the repo cloned + toolchain installed — REPLAY.md is written so this path produces the same artifacts (this is exactly why raw outputs + manifest matter).

Unavailable-in-environment items are **BLOCKED-reportable, never silently skipped**: e.g. no PostgreSQL → register DEPLOY-PRE (N19); no browser install possible → BLOCKED with the exact error, and the human relocates execution.

## 8. NEVER rules (parent 15 all inherited — plus these 5, this round)

| # | NEVER | ALWAYS | Defect signature |
|---|---|---|---|
| 16 | Alter, crop, retype, or "clean up" a raw output | Commit the raw file; summaries live beside, never instead | polished evidence → automatic REJECT |
| 17 | Edit tests/thresholds/baselines/gate configs to make anything pass (restate of parent 14) | Report failures via BLOCKED; fix product code, never checks | reward hacking → automatic REVISE |
| 18 | Add features / visual changes / refactors under this contract | Evidence + minimum productionization only | gold-plating → returned for revert |
| 19 | Claim the PostgreSQL switch is done without a running PostgreSQL | Register DEPLOY-PRE honestly; run the switch only where the service exists | fabricated completion |
| 20 | Hand-write any matrix row | Every row cites an executed run's output path | paper evidence |

## 9. Message protocol & loop control (unchanged from parent §10.5/§10.3)

Five messages only: **ACK · STATUS · DONE · BLOCKED · QUESTION** — numbered facts + paths, ≤15 lines. STATUS per task: task-id + state + evidence path. BLOCKED anatomy: condition → hypothesis → attempts (≤3) → options → default → the exact question. Loop: ≤3 self-retries per failing task, then BLOCKED; full deterministic suite (G1–G7, adapted paths per D-3) re-runs at P7 regardless.

## 10. DONE definition + your first output (the ACK)

**DONE = E1–E16 all PASS with committed raw evidence** (or a DONE that lists unresolved BLOCKED items honestly — that is a legal DONE-with-blockers, distinct from a silent gap). The 65-row parent matrix ships attached, generated from runs. Then STOP — no extra credit exists for polish beyond E16.

```
ACK — mirador-site — prompt 2 v1.0
1. inputs received: this contract + build-brief v1.1 — authority order acknowledged (this file wins conflicts, recorded to ASSUMPTIONS.md)
2. execution environment declared: <machine/container · OS · runtime+version · DB engine+version · repo git SHA>
3. tooling status: playwright <v|absent+install-plan> · LHCI <v|absent+plan> · axe <v|absent+plan>
4. deviation rulings D-1..D-7 loaded; new assumptions logged: <0 | ids>
5. DAG accepted: P0–P7, one bounded diff each
6. rate-limit isolation + production boot-guard re-acknowledged (parent §8.4)
7. first task started: P1 (after this ACK)
8. questions: none | <id — BLOCKER|ASSUMABLE — question>
```

---

## APPENDIX — SHARED CONSTANTS (byte-identical subset of parent Appendix A)

| Constant | Value |
|---|---|
| Viewports | 375 / 768 / 1440 |
| Screenshot naming | `route--state--width.png` |
| Responsive AC | no horizontal scroll at 375px |
| Lab perf gates (mobile, prod build, 3 runs) | Lighthouse ≥90 · LCP ≤2.5s · CLS ≤0.1 · TBT ≤300ms |
| A11y gate | axe 0 critical + 0 serious per route×viewport; keyboard walkthrough |
| Contrast | 4.5:1 body · 3:1 large text + non-text UI · both themes (dark + forced-colors) |
| Touch targets | effective ≥44px |
| Route JS budget | ≤150KB gz (hard 200KB) marketing first-load |
| Motion budget | gsap core+ScrollTrigger+Flip+lenis ≤90KB gz base; three pack ONE lazy chunk ≤400KB gz |
| Fix iterations | ≤3 self-retries · ≤3 fix rounds · then BLOCKED |
| Evidence path | `/evidence/<AC-ID>/` |
| Race test | 20 parallel POSTs → exactly 12 rows + 8 × 409 + 0 orphans |
| Rate limit | 6th POST in sliding 60s → 429 + `Retry-After` (E2E_RATE_LIMIT=off sanctioned for capacity cases only) |
| WhatsApp constant | `wa.me/963955000111` (fictional A5, registered in ASSETS-REPLACE.md) |
| Baseline status | this round's screenshots = baseline-v0 CANDIDATES — human approval freezes v1; you NEVER edit them |

**TERMINAL REMINDER (positional discipline):** first output = ACK, never code, never evidence. Raw outputs only; FAIL rows ship verbatim; frozen things stay frozen; E1–E16 → STOP.

