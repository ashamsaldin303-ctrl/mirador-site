# MIRADOR — PROMPT 3: PRODUCTION-READINESS & FINAL-ACCEPTANCE EVIDENCE CONTRACT v1.0

> **⚠️ الوضع بالعربية (اقرأ أولاً):** هذا العقد الثالث وهو الأخير قبل حكم القبول النهائي. الجولة الثانية أغلقت كل شيء إلا ما تحظره منصّتك: البناء الإنتاجي وبطاريته. مهمتك هنا: **نفِّذ خطوات `docs/deploy-pre.md` في بيئة لا يحظرها صندوقك — GitHub Actions أو أي جهاز يسمح بالبناء — على PostgreSQL حقيقي**، ثم أعد تشغيل البطارية على السطح الإنتاجي، وحدِّث المصفوفة إلى 65 صفاً محلولاً. صفر ميزات، صفر تغييرات بصرية، صفر «تحسينات». أدلة خام فقط. وخادم المعاينة في صندوقك يجب أن يبقى حياً طوال الوقت.

**To the builder agent:** inputs = this file + `build-brief.md` v1.1 + `prompt-2-evidence-run.md` (all three loaded together; **this file wins conflicts** — record any conflict to ASSUMPTIONS.md). First output = the ACK (§9). Never work before it.

---

## 0. READ ME FIRST — execution protocol

1. **Mission = close the last six evidence gaps by changing WHERE the battery runs, not what the site is.** The prohibition applies to your sandbox only; a GitHub Actions runner (or any build-legal machine) owes you nothing.
2. **Round-2 evidence stays.** Never delete or rewrite the dev-surface artifacts — they are the historical record (including the preserved failure→fix journey). This round ADDS a prod-surface family, clearly labeled.
3. **The race fix must be re-proven on PostgreSQL.** Your serialize+retry (0ad5587) was tuned against SQLite's whole-database write lock; PostgreSQL has row-level locking and a different contention profile. E21 — the race re-run on PostgreSQL — is the single most important check of this round: it is the engine-safety proof of the parent §6.3 transactional pattern (the contract's Critical core).
4. **The human's sandbox preview stays alive.** The committed schema becomes PostgreSQL-canonical; your sandbox dev flow (if it still needs SQLite) lives behind a documented LOCAL script — never the committed state (N22). If the preview cannot be preserved, BLOCKED with the exact error — never silently break it.
5. **FAIL is data.** Record verbatim, ≤3 self-retries, then BLOCKED. Thresholds never move (N17). One bounded exception: a failing Lighthouse median may be re-run ONCE (runner noise), both runs committed — see §8.

## 1. Context & authority

Round-2 outcome (on record): DONE-with-blockers accepted as a legal termination form; interim judgment "consistent and disciplined"; final verdict DEFERRED pending (a) production-surface evidence, (b) judge access (human action). Remaining gaps — all one root cause (sandbox prohibits `bun run build`):

- **B1/B2** production build + route size/chunk tables → evidence forms of F12-1, F12-2, F6-3
- **B3** production Lighthouse medians + raw trace JSONs → contracted form of F6-1
- **B4** real HTTP 404 semantics on a production server → full form of F11-1
- **Matrix residuals** 3 BLOCKED · 2 PASS* · 1 PARTIAL · 2 N/A awaiting resolution
- **D-2** the §6.3 pattern unproven on PostgreSQL (the only contracted-engine obligation left)

This contract closes all six. It is an evidence contract, not a building contract: the parent's 65 AC and 15 NEVERs stand; nothing new is designed here.

## 2. Scope IN / OUT

**IN (gate-blocking):** the Q0–Q8 DAG (§4) — sanctioned-environment bring-up · PostgreSQL execution of the deploy-pre sequence · production build + budget assertions · production HTTP semantics · full battery re-run on the production surface · evidence v2 + matrix regeneration · paperwork closure · judge enablement.

**OUT (violation = gold-plating, returned for revert):** real hosting/domain/deployment/certificates · real venue data (A5 stands — ASSETS-REPLACE.md governs) · any feature, page, component, or visual change · refactors · performance tuning beyond threshold failures (a failing threshold gets a minimal fix, ≤3 attempts, else BLOCKED) · monitoring/analytics/RUM (parent §3.2) · editing anything FROZEN (tests, thresholds, baselines, gate configs, the three contract files).

## 3. Environment & standing rulings

**Sanctioned execution surfaces (preference order):**

1. **GitHub Actions on the existing private repo** — you already hold push access. Standard ubuntu runner + a PostgreSQL service container (pin the major — 16.x or 17.x `[pin-at-build]` — into MANIFEST.md and `docs/versions.md`). The workflow YAML is your artifact; REPLAY.md documents its manual re-trigger (`workflow_dispatch`). Evidence files are committed to the repo; workflow artifacts (retention ≥90 days) serve as transport/backup. Budget ≈ 20–40 min/run — within free private-repo minutes; if the account cannot run it, take path 2 and say so in the ACK.
2. **Any machine where `bun run build` is legal** (the human's computer, a VPS) — REPLAY.md's local sequence must reproduce the identical artifact set; MANIFEST.md lists that environment.

**NEVER the sandbox as a source of production evidence (N21).** The sandbox keeps exactly one job: the dev server behind the human's preview (dev-daemon untouched).

**Canonical-schema invariant (closes D-2's execution half):** the committed `prisma/schema.prisma` IS the parent §6.1 verbatim text (`provider = "postgresql"`); the migrations history is regenerated against PostgreSQL (throwaway CI databases make this safe); the sandbox dev flow — if SQLite is still required there — runs via a documented local script (provider swap + `prisma db push`) that is NEVER committed (N22; `scripts/judge-audit.sh` asserts the committed provider on every run). Implementation mechanics are yours; the invariant is the contract.

**Ruling updates on record:** D-2 → **EXECUTED** upon E20+E21 pass (deploy-pre checklist then links the evidence; the remaining pre-deploy items are human/ops — see E31). D-6/D-7 → **CLOSED** upon E18–E28.

## 4. Task DAG (Q0–Q8 · ID order · one bounded diff each)

- **Q0 — ACK** (§9 template): declares execution path, runner, PostgreSQL pin, repo SHA, token scope used.
- **Q1 — Bring-up.** Workflow (or local sequence): checkout → install → PostgreSQL service up → canonical migrate + seed (the deterministic seed recomputes the demo slot on its own) → `bun run build` → `bun run start` + readiness wait on `/en` 200.
- **Q2 — Build evidence.** Route size table + chunk manifest; budget assertions of E19 (quoted rows beside raw files).
- **Q3 — HTTP semantics.** The four raw round-trips (E22).
- **Q4 — Battery on the production surface.** Order: `capacity-race` FIRST (E21 — on PostgreSQL), then the other 8 E2E specs; console ×16; probes (scroll-width, ≥44px targets); axe ×48; screenshots 57 (E26); Lighthouse 3-run medians ×2 locales + raw trace JSONs (E27/E28); keyboard walkthroughs (menu overlay, gallery lightbox, reserve per-field errors).
- **Q5 — Evidence v2.** Merge under `/evidence/` with run-surface labels (round-2 `dev-run` retained · this round `prod-run`); REPLAY.md dual-path; MANIFEST.md + runner environment.
- **Q6 — Paperwork.** `docs/deploy-pre.md` update (E31); README documents both surfaces + run commands; ASSUMPTIONS.md rows for any new deviation; AGENTS.md gains the dual-surface note.
- **Q7 — Judge enablement.** `scripts/judge-audit.sh` (E32) — read-only, fresh-clone-safe; everything committed + pushed.
- **Q8 — DONE.** Regenerated 65-row MATRIX.md (E29) + blockers list (target: empty) + the human's access options with exact commands (E33). Then STOP.

> **AR (§0–§4):** المهمة إغلاق فجوات الأدلة الست بتغيير مكان التشغيل لا هوية الموقع؛ البيئة المعتمدة: GitHub Actions مع حاوية PostgreSQL أو أي جهاز يسمح بالبناء؛ المخطط المُلتزم canonical = postgresql حرفياً؛ والسباق على PostgreSQL (E21) هو قلب الجولة.

## 5. Evidence v2 — shape rules (PROMPT-2 §5 inherited, plus)

- Raw-artifact rule unchanged: machine files only; summaries beside, never instead; a summary without its raw file = the claim does not exist.
- **Surface label mandatory** on every family: `prod-run/` for this round; the round-2 `dev-run/` set stays, untouched. One family, one surface — mixed-surface families are forbidden.
- REPLAY.md documents BOTH regeneration paths; the judge re-runs 3 sampled entries (at least one from `prod-run/`).
- MANIFEST.md lists the runner: OS · runtime+version · PostgreSQL version · playwright/LHCI/axe versions · UTC+3 timestamp · env flags active during runs (`E2E_RATE_LIMIT=off` only inside the capacity specs, per parent §8.4).
- Retention: committed-to-repo preferred; workflow artifacts ≥90 days as backup.

## 6. Acceptance criteria (binary · E17–E33 · each names its check)

- **E17** ACK before any work, declaring the execution path — check: message log.
- **E18** `bun run build` exit 0 on the sanctioned surface; route size table + chunk manifest committed to `/evidence/F12-2/prod-run/` — check: build log + files (closes B1 / F12-1).
- **E19** Budgets hold from the build table: per-route first-load JS ≤150KB gz (hard 200KB) · three/fiber/drei absent from EVERY route's first-load + its lazy chunk ≤400KB gz · motion stack (gsap + ScrollTrigger + Flip + lenis) ≤90KB gz in base — check: quoted rows in `F12-2/prod-run/summary.md` beside raw files (closes B2 / F12-2 / F6-3).
- **E20** PostgreSQL executed: committed `schema.prisma` provider = postgresql (§6.1 verbatim; judge-audit asserts); migrate + seed green on the service; the `docs/deploy-pre.md` steps executed 1:1 — check: run log + schema grep (closes D-2's execution half).
- **E21** `capacity-race` ON PostgreSQL: 20 parallel POSTs → **exactly 12 rows + 8 × 409 + 0 orphan rows in any other slot**; raw parallel log + post-run DB count query output — check: spec log + query output (engine-safety proof of §6.3; regression check of 0ad5587).
- **E22** HTTP semantics on the production server: `GET /en`, `GET /ar` → 200; `/en/nonexistent-page`, `/ar/nonexistent-page` → **HTTP 404** + the §7.9 designed copy in body — check: raw round-trips (closes B4; upgrades F11-1 and the PASS* rows).
- **E23** The remaining 8 E2E specs re-run on the production surface (PostgreSQL): `capacity-sequential` · `ratelimit` · `dupguard` · `honeypot` · `locale-atomic` · `webgl-kill` · booking happy path <90s **re-measured** · inquiry happy path — all PASS — check: spec logs.
- **E24** Console 0 errors × 16 paths + probes (no horizontal scroll at 375 on any route; interactive targets ≥44px) on the production surface — check: capture + probe logs.
- **E25** axe 0 critical + 0 serious × 48 runs (8 routes × 2 locales × 3 viewports) on the production surface — check: axe JSONs.
- **E26** Screenshot set 57 PNGs (8×2×3 + 8 forced-colors + 1 reduced-motion), contract naming, production surface; the round-2 dev-run set retained — check: file count + labels.
- **E27** Lighthouse medians (mobile emulation · production server · 3 runs) on `/en` and `/ar`: **≥90 · LCP ≤2.5s · CLS ≤0.1 · TBT ≤300ms** — check: LHCI reports + raw trace JSONs (closes B3).
- **E28** `lcpElement` read from the committed trace JSONs = the hero poster `<img>` on both locales — check: trace JSON field (closes B5 / F6-1 contracted form).
- **E29** MATRIX.md regenerated from runs: 65 rows; round-2's 3 BLOCKED + 2 PASS* + 1 PARTIAL + 2 N/A each resolved to PASS or carried as an explicit blocker with root cause + solution path; zero hand-written rows — check: matrix + `/evidence/INDEX.md`.
- **E30** REPLAY.md dual-path (dev-surface historical + prod-surface regeneration) + MANIFEST.md with the runner environment — check: files; judge re-runs ≥1 prod-run entry.
- **E31** `docs/deploy-pre.md`: the PostgreSQL switch marked executed+evidenced (links E20/E21 artifacts); remaining pre-deploy items (real `DATABASE_URL` · domain/env · real venue constants per ASSETS-REPLACE) listed as human/ops, undone — check: file contents.
- **E32** `scripts/judge-audit.sh`: read-only; fresh-clone-safe; runs tsc + eslint (0 warnings) + G1–G7 (adapted paths per D-3) + asserts the committed schema provider = postgresql + prints tool versions; exits 0 — check: judge execution next round.
- **E33** Everything committed + pushed; the DONE message lists the human's access options with exact commands (make the repo public for the judging window · mint a fine-grained read-only token · export the evidence archive) — check: DONE + repo state.

> **AR (§6):** سبعة عشر معياراً ثنائياً تُغلق B1–B5 وبقايا المصفوفة؛ جوهرها E21 (السباق على PostgreSQL) وE22 (404 حقيقية) وE27/E28 (لighthouse بالمtrace الخام) وE29 (مصفوفة 65 محلولة).

## 7. NEVER rules (parent 1–15 + round-2 16–20 all inherited — plus these three)

| # | NEVER | ALWAYS | Defect signature |
|---|---|---|---|
| 21 | Relabel dev-surface runs (or any sandbox artifact) as production evidence | Surface-labeled families; prod evidence originates from `next start` on the production build, in a sanctioned environment | evidence forgery → automatic REJECT |
| 22 | Commit the SQLite provider (or any sandbox variant) as the canonical schema | Committed `schema.prisma` = §6.1 verbatim (postgresql); the sandbox swap stays local + documented; judge-audit asserts it | canonical-state drift → Major |
| 23 | Claim "deployed/live", or mark a pre-deploy item done without running it | Production-READINESS evidence only; remaining human/ops items listed honestly | fabricated completion → REJECT of the paperwork item |

## 8. Message protocol & loop control

Five messages only — **ACK · STATUS · DONE · BLOCKED · QUESTION** — numbered facts + paths, ≤15 lines. STATUS per task: task-id + state + evidence path. BLOCKED anatomy: condition → hypothesis → attempts (≤3) → options → default → the exact question. Loop: ≤3 self-retries per failing task, then BLOCKED; the full deterministic suite (G1–G7, adapted paths) re-runs at Q7/Q8 on the production surface. **Lighthouse noise rule:** a failing median may be re-run exactly ONCE (runner noise), both runs committed; if it still fails → minimal product fix (≤3 attempts) or BLOCKED — thresholds are FROZEN and never bend to hardware.

## 9. DONE definition + your first output (the ACK)

**DONE = E17–E33 all PASS with committed raw evidence** — or an honest DONE-with-blockers listing what the environment refused, with root cause + solution path (a silent gap is the only illegal form). The regenerated 65-row MATRIX.md ships attached. Then STOP — nothing after E33.

```
ACK — mirador-site — prompt 3 v1.0
1. inputs received: prompt-3 + prompt-2 + build-brief v1.1 — authority order acknowledged (this file wins; conflicts → ASSUMPTIONS.md)
2. execution path declared: <github-actions | local machine> · runner <OS+spec> · repo <git SHA>
3. postgresql service: <major.x pinned [pin-at-build]> · token scope used: <push-only | …>
4. canonical-schema invariant + N21–N23 acknowledged · sandbox preview preservation plan: <one line>
5. DAG accepted: Q0–Q8, one bounded diff each
6. round-2 dev-run evidence retention acknowledged
7. first task started: Q1 (after this ACK)
8. questions: none | <id — BLOCKER|ASSUMABLE — question>
```

> **AR (§7–§9):** ثلاث قواعد NEVER جديدة (لا إعادة توصيف أدلة dev كإنتاج · لا SQLite canonical · لا ادعاء نشر)؛ بروتوكول الرسائل الخمس كما هو؛ والدون = E17–E33 كلها ناجحة بأدلة خام ملتزقة، أو دون صادق بالحاجبات.

## APPENDIX — SHARED CONSTANTS (byte-identical subset of parent Appendix A + round additions)

| Constant | Value |
|---|---|
| Viewports | 375 / 768 / 1440 |
| Screenshot naming | `route--state--width.png` |
| Screenshot count | 57 per surface (48 grid + 8 forced-colors + 1 reduced-motion) |
| Responsive AC | no horizontal scroll at 375px |
| Lab perf gates (mobile, prod build, 3 runs) | Lighthouse ≥90 · LCP ≤2.5s · CLS ≤0.1 · TBT ≤300ms |
| Lighthouse noise allowance | exactly one median re-run; both runs committed |
| A11y gate | axe 0 critical + 0 serious × 48; keyboard walkthrough |
| Touch targets | effective ≥44px |
| Route JS budget | ≤150KB gz (hard 200KB) marketing first-load |
| Motion budget | gsap core+ScrollTrigger+Flip+lenis ≤90KB gz base; three pack ONE lazy chunk ≤400KB gz |
| Race test | 20 parallel POSTs → exactly 12 rows + 8 × 409 + 0 orphans — **on PostgreSQL this round** |
| Rate-limit isolation | `E2E_RATE_LIMIT=off` sanctioned inside capacity specs only; production boot-guard honored |
| PostgreSQL pin | major 16.x/17.x `[pin-at-build]` → MANIFEST.md + docs/versions.md |
| Evidence retention | committed to repo; workflow artifacts ≥90 days; round-2 dev-run set never deleted |
| Fix iterations | ≤3 self-retries · ≤3 fix rounds · then BLOCKED |
| WhatsApp constant | `wa.me/963955000111` (fictional A5, registered in ASSETS-REPLACE.md) |
| Baseline status | prod-run screenshots = baseline-v0 candidates — human approval freezes v1; you NEVER edit them |

**TERMINAL REMINDER (positional discipline):** first output = ACK. Surface-labeled raw evidence only. E21 — the race on PostgreSQL — is the heart of this round. Frozen things stay frozen; the sandbox preview stays alive; E17–E33 → STOP.
