# PROMPT 4 · RELEASE-1 CONTRACT — "THE HOUSE EDGES" (v1.1)

**Chain:** build-brief.md v1.1 → prompt-2-evidence-run.md → prompt-3-production-readiness.md → **this contract**.
**Sole basis:** enhancement-plan.md v1.0 (SEALED) — §1 fix register, §3 Release-1 roster, §5 ceilings, §6 evidence law, §9 authoring brief; audit source: phase1-final-report.md (REVISE, 2026-09-22).
**Repo:** github.com/ashamsaldin303-ctrl/mirador-site @ `1441ed9` (main). **ACs of this contract:** E34–E81 (chain-continuous). All prior NEVERs N1–N23 remain binding VERBATIM; N24–N26 are new below.

> **الملخص العربي:** عقدّ الإصدار الأول من «خطة الصعود»: **نفس الموقع لكن مُكتملًا** — إصلاح كامل لسجلّ الجولة الأولى (Lighthouse حقيقي، صدق الوثائق، 404 الصادق، z-index الموبايل، ميزانية JS عبر P-022)، ثم **أسوار البايتات** في CI (ΣΔ≤0)، ثم **حوافّ البيت**: خاتم BEZEL 8.42:1، الانتقاء الواحد 28%، الأرقام الثابتة، جدول الحروف النهائي، وأيادي الليل. يبدأ بـ **ACK قبل أي كود** وينتهي ببوابة خروج واحدة على GitHub Actions بأدلة خام مُتجدّدة. **ممنوع** فتح أي بند من الإصدارات 2/3/4 قبل إغلاق البوابة (N26).

## §1 · MISSION & ROLE

You are the same builder agent, same discipline (self-verifying reports, FAIL honesty, no partial credit, ambiguity = defect → report, never guess). The Phase-1 audit proved your core genuine (authorship 10/10; race proven on PostgreSQL; 20/20 gate re-runs matching) and ruled REVISE on a narrow fix round. **This contract is that fix round plus the Release-1 fences and edges**: land R0–R13 below, and nothing else. The museum of excellent specs starts emptying here — first pool bytes land in THIS release.

Doctrine in force (plan §2, binding on every diff): THE SITE IS THE BUILDING · one typographic protagonist · everything settles (vertical arrival ≤600ms expo-out) · the one curve `--ease-out-expo` · light breathes, geometry waits · ΣΔ≤0 forever · zero RUM (the battery is the analytics) · parity = same authorship, not same pixels · every diff names its a11y twin, byte cost, swap test, reversal path (D-3).

## §2 · ACK-FIRST PROTOCOL — no code before the ACK

Before your first commit, post the ACK form (Appendix A) quoting verbatim: (1) the release map and your stop (v1.1 THE HOUSE EDGES → next: v2.0-I THE HONEST DOOR) + the STOP rule; (2) the ceilings table (§5) copied whole; (3) the ΣΔ≤0 law; (4) your SITE_URL value or the PLACEHOLDER policy; (5) soft-cap standing default (a) 165KB acknowledged (gates Release 2, not this release); (6) every contradiction you find in this contract. A false or partial ACK voids the DONE (rule-zero inheritance).

## §3 · SCOPE

**IN (the full Release-1 roster):** the Phase-1 fix register — ALL of it: C-1, C-2, C-3 · B-1, B-2(=P-022) · Majors 1–19 · the Minors triaged into the same diff trains where they touch the same files — plus: P-022 (budget unlock) · P-041/P-043/P-044 (the fences) · P-075/P-084/P-079 (the edges; P-075 §10 tab-lamp SPEC-ONLY) · P-082 (asset ledger) · P-023/P-024/P-025 (wire discipline) · P-035/P-037/P-078 (idiom + motion foundations) · P-027/P-028/P-081 + dead-CSS −0.35KB + elev-2 delete + dead-deps (hygiene) · P-042 core routes + P-087 M-2/M-3/M-4/M-6 + P-086 kitchen-side + P-091 audit:twins (the gates arm).
**OUT (N26 — landing any of these = defect, returned for revert):** every Release-2/3/4 roster item of plan §3 — the whole funnel cluster (P-046…P-090, P-062-gate) · P-034 / P-011 / P-038 / P-013 / P-040 / P-014 / P-045 / P-006 / P-048 / P-066 · the city wave (P-016, P-017, P-060, P-050, P-080, P-002, P-089, P-039, P-068) · the ceremony cluster (P-010, P-058, P-057, P-071, P-061, P-064, P-072) incl. the tab-lamp IMPLEMENTATION (P-075 §10) · the dark floors (P-076, P-083, P-059 full sweep, P-063) · THE LIT CITY (P-018/P-026/P-070 lift). **Blanket rule: if it is not in §4 below, it is not yours.**

## §4 · TASK DAG (R0 → R13; spine order normative: P-022 → fences → edges → idioms; fix-register items before the fences that guard them)

**R0 · STEP 0 — instruments before anything**
- `.lighthouserc.json` — line 8 today is one STRING with no `--no-sandbox`: replace with the ARRAY `["--no-sandbox", "--disable-dev-shm-usage"]`, DELETE `--disable-gpu` (C-1). Dispatch the workflow once — instrument proof only; medians may honestly fail this early.
- `NEXT_PUBLIC_SITE_URL` set in the workflow env + `.env.example` (COP-1's root): the ACK-declared origin, or `https://mirador.example` under the PLACEHOLDER policy (§9).
- **E34** ACK form posted before the first commit (§2, six items verbatim). **E35** the chromeFlags diff + one dispatch artifact (run id/URL) — medians.md at this stage may read NO RUNS or honest FAILs; only the instrument is proven. **E36** the workflow YAML line + `.env.example` diff quoted in the DONE.

**R1 · C-2 — the doc-truth layer (docs regenerate from runs, or they die)**
- Correct to match the raw artifacts exactly: `BLOCKED.md` (the B2 "CLOSED" row vs medians.md's NO-RUNS line — the repo carries several copies; EVERY copy matches the raw state, verify-docs enforces), `docs/deploy-pre.md` (§3 Lighthouse + §4 404 claims vs the raw http summary's FAIL row), `docs/versions.md` (the tsconfig flag claim — closes with E49).
- Add `scripts/verify-docs.ts` (doc-drift grep): any doc assertion naming a raw-artifact state must match that raw file; wire it as a CI job.
- **E37** before/after quotes of all three corrected passages. **E38** verify-docs committed, CI-wired, green on HEAD; a contradicting claim fails the job (show the check logic).

**R2 · C-3 + the mobile surface**
- Fix the z-order inversion: `src/components/layout/nav.tsx:122` (`z-30` content) under `src/components/ui/sheet.tsx:39` (`z-50` scrim/panel) — scrim above menu, pointer nav broken <1024px. Correct stack: scrim+panel above, content interactive.
- Add the mobile-sheet keyboard/pointer walkthrough to the battery (open → focus trap → navigate → Esc/scrim close). While in these files: sheet/dialog corners → logical `end-4` (RTL mirror — no physical `top-4 right-4`); sheet tempo onto the frozen 100/200ms scale (no 300/500ms strays); the three scrim treatments unified to the one token overlay.
- **E39** computed z-order proof in the open state at a <1024px viewport + the walkthrough spec + a green run. **E40** greps: zero physical corners in sheet/dialog; one scrim token; tempo values on the frozen scale only.

**R3 · B-1 — the honest 404**
- Root cause (confirmed from raw prod HTML): `src/app/[locale]/loading.tsx` Suspense boundary flushes 200 before `notFound()` fires through the catch-all `src/app/[locale]/[...rest]/page.tsx`. Fix — choose ONE and document why: (a) relocate loading.tsx into per-route segments (content routes keep skeletons; the catch-all unwraps), or (b) delete `[...rest]` (locale-echo survives via not-found).
- **E41** on an Actions prod run: `/{en,ar}/nonexistent` → **HTTP 404** both locales (raw request/response); the designed floor-copy + noindex still render; `http/summary.txt` GATE E22 regenerated = PASS.

**R4 · B-2 = P-022 — the budget unlock**
- Motion lazy-mount: `getMotion()` singleton; in-effect `await import()` (never top-level); intent-hydrated reserve-form split (shell SSRs; interaction imports the motor). Only home + menu animate — no route statically imports the motion family.
- **E42** import-graph proof: motion family statically imported in 0/16 routes (build manifest or dependency evidence) + the singleton/split code quoted. **E43** 16/16 first-load JS ≤200KB gz measured on an Actions run after R4–R9 land (per-route raw table; motion family ≤62KB gz lazy; reserve ≈161KB expected); re-proven at E79.

**R5 · Majors — SEO / security / data integrity**
- COP-1: regenerate canonical/hreflang/OG/JSON-LD from NEXT_PUBLIC_SITE_URL; a deploy-time guard makes the build FAIL when it is unset.
- COP-2: `confirmation/[id]` → `noindex` + demotion (self-canonical only; no per-id hreflang alternates) — guest PII stops being indexable.
- SEC-1: CSP / X-Frame-Options / Referrer-Policy / X-Content-Type-Options live; `X-Powered-By` removed (HSTS stays documented at the Caddy deploy side — deploy-pre.md row, honest).
- SEC-2: request body-size cap on POST routes (413 path). SEC-4: rate-limiter Map eviction (bounded; sweep or LRU).
- BKG-1: server-side SLOT_TIMES check — only 18:00–22:30 Tue–Sun UTC+3 instants persist; anything else → 400.
- ARC/K-1: tsconfig `noUncheckedIndexedAccess: true`; remove the `noImplicitAny: false` override; typecheck green (versions.md row closes with E37/E49).
- **E44** ×16 prod-run rendered snapshots: zero `localhost` URLs (canonical/hreflang/OG/JSON-LD, both locales) + the unset-var build-fails guard demonstrated. **E45** confirmation/[id] rendered header dump: noindex present, no per-id alternates. **E46** header table from the Actions-served prod run (all four headers + X-Powered-By absent). **E47** oversized POST → 413 (raw pair); limiter bound test (synthetic fills; Map size ≤ the cap you declare in the limiter — CI asserts it). **E48** crafted 05:00 and closed-day reservations → 400 (raw request/response pairs). **E49** tsconfig diff + green typecheck log.

**R6 · Majors — product residuals**
- F3-5: re-shoot the filter evidence pair FOR REAL (unfiltered vs filtered: 28→4 rows + the aria-live announcement); the byte-identical md5 pair is deleted and replaced.
- FRM-1: empty MenuSection → hidden (vegan filter leaves zero stub headings — NEVER-8).
- DES-2: AR footer line-height ≥ 1.7. PRF-3: `images.formats` → AVIF actually served + custom loader; re-measure F10-1 on SERVED bytes. PRF-4: OG images → JPEG. JRN-1: journey auto-kill path (fps<30 → poster) evidenced via an emulation run artifact. RPL-4: prod-run MANIFEST (runner OS, postgres pin, tool versions) committed per Actions run.
- **E50** new pair: md5s differ; machine log shows 28→4 + aria-live. **E51** E2E: vegan filter → 0 stub section headings. **E52** computed AR footer line-height ≥1.7. **E53** a documented request served `content-type: image/avif` + F10-1 re-measured on served bytes. **E54** OG JPEG (content-type + magic bytes, both locales). **E55** auto-kill emulation artifact (fps trace + the poster-swap frame). **E56** MANIFEST present (OS / pg pin / tool versions).

**R7 · the fences — P-041 / P-043 / P-044 (organs live in CI)**
- P-041 THE LEDGER: a CI job asserting the arrival/wire/font budgets (16/16 ≤200KB gz; AR faces ≤60KB each).
- P-043 THE EXCHANGE LEDGER: frozen byte baselines + **ΣΔ≤0** with the 7 mandatory cells — ① first-load JS ② motion family ≤62KB gz ③ three-pack ≤235KB gz ④ combined rental ≤297KB ⑤ CSS ceiling +3KB (≈2.97KB already subscribed; 0.03KB slack) ⑥ fonts (faces ≤60KB; disk baseline 334,880B) ⑦ net ΣΔ≤0. A ledger-diff artifact per release.
- P-044 THE GATEBOOK: the ceilings file + the R10 checklist wired to CI — a breach fails the job.
- **E57** LEDGER job green (raw per-route size table). **E58** EXCHANGE LEDGER committed: the 7 cells present; ΣΔ≤0 arithmetic shown (bytes added vs removed; final re-asserted at E79 after R8–R11 land). **E59** GATEBOOK file + CI wiring proof.

**R8 · the edges — P-075 / P-084 / P-079**
- P-075 THE HOUSE EDGES: **the BEZEL site-wide** — focus ring = 2px amber `#CBA35C` outline + 2px night `#0A0A0B` offset (invariant 8.42:1; CVD-safe: protan 7.83 / deutan 8.77); this kills the 11 live invisible-ring sites. With it: the 1px hairline law (1px = state, 2px = fact) · brightness-not-wash hover · the 8px underline altitude · dash triplets · the amber caret · ONE `::selection` at amber 28% · P-033's filter-pill directive executed. **P-075 §10 tab-lamp = SPEC-ONLY this release** (the pixel table committed as a doc; implementation belongs to the arrival release — N26).
- P-084 THE NIGHT'S OWN HANDS: autofill night (WebKit autofill styled to night/amber — never blue/yellow) · tap-flash death (`-webkit-tap-highlight-color: transparent`) · `end-4` logical corners · `overscroll-contain` on scroll containers · the tabular sweep (`font-variant-numeric: tabular-nums` wherever digits mutate).
- P-079 THE FIGURE REGISTER: the final type table — 375 / 768 / 1440 × EN (Fraunces + Instrument Sans) / AR (Amiri + IBM Plex Sans Arabic) — every figure role named (display / title / body / eyebrow / digits); committed as a doc AND the tokens match the table.
- **E60** BEZEL: the invisible-ring sites killed (your audit enumerates them — the council counted 11; before/after list, 0 remain); a focused button's computed ring = rgb(203,163,92), 2px, offset 2px (quoted); the 8.42:1 invariant arithmetic shown. **E61** the P-075 edge set live (hairline / hover / underline / caret / selection@28% / dash triplets / filter-pill directive) — audit + computed styles; the tab-lamp spec doc committed. **E62** P-084's five items (computed styles + greps). **E63** the FIGURE REGISTER committed; the table covers 3 widths × 2 scripts; tokens = table (audit script or diff proof).

**R9 · the asset ledger & wire — P-082 / P-023 / P-024 / P-025**
- P-082: gallery `sizes` (council estimate −378KB wire @375 — your PASS bar is ≥300KB, honest number always reported); size-adjust CLS kills (metric-matched @font-face fallbacks); the Fraunces wordmark subset (−31KB EN door); the digits subset (−100KB AR door); the font-disk ledger corrected to the 334,880B baseline and frozen.
- P-023 rides E53/E54 (AVIF served + custom loader + OG JPEG). P-024 static shells: mark every route ○ (static) / ● (dynamic) in the build report; convert what can convert without breaking i18n or the dynamic confirmation. P-025 rides P-082's wordmark subset.
- **E64** gallery wire delta @375 (raw before/after bytes; PASS ≥300KB reduction) + the subsets landed (sizes quoted) + the font-disk ledger table (baseline 334,880B, ±documented). **E65** the ○/● route census from the build output; every ● justified (menu SSR, confirmation, reserve hydration…).

**R10 · idiom + motion foundations — P-035 / P-037 / P-078**
- P-035 THE IDIOM LAYER: ONE Button API — variants `cta | quiet | quietOutline` × sizes `full | compact | flow`; every button instance migrated; `audit:idioms` A1–A12 committed and green. The ledger-family three laws documented as idiom contracts (1px = state / 2px = fact · error = color, never weight · inputs: no hover, caret amber, LTR island) — the input restyle itself is Release-2's P-046, NOT yours.
- P-037 (MUST, D-28): the settle / draw / breathe primitives — shared, named, documented; vertical arrival ≤600ms expo-out; hairline draw 200ms; light breathe. The conductor rule: CSS owns paint/pointer-time · GSAP owns scroll/diff-time · Lenis owns scroll-feel only.
- P-078: the alias death — `EASE_OUT_SOFT` deleted; the one curve `--ease-out-expo`.
- **E66** zero ad-hoc button variants outside the API (grep) + audit:idioms green — enumerate its 12 assertions (A1–A12) in the script; the Button API surface + the three ledger-family laws above are normative. **E67** the three primitives exist with a usage map; the conductor inventory documented. **E68** `EASE_OUT_SOFT` grep = 0; the keyframes census documented (≤7 total — no net additions).

**R11 · hygiene — P-027 / P-028 / P-081 / dead code / the Minors**
- P-027 RM grammar: EVERY animation site's reduced-motion twin = fade ≤0.3s / lift ≤8px (the audit covers all existing sites, not only new ones).
- P-028 THE HANDRAIL + the route announcer (none exists today): the navigation handrail (skip-link chain + landmarks) + route-change announcer (aria-live polite).
- P-081 term ledger: the «يرجى» purge (0 rendered), the drift kills (your audit names them), the translationese fixes — a bilingual before/after diff.
- Dead code: dead-CSS −0.35KB · the `elev-2` token deleted · dead-deps removed (~45 of 71 — incl. next-auth, recharts, z-ai-web-dev-sdk, and the ~23 UNUSED radix packages: 27 declared, 4 imported — dialog/label/slot/toggle stay).
- The Minors cluster: AR plurals via Intl.PluralRules («28 طبقاً», the 11+ rule) · inquiry party copy 1–60 · inquiry phone `dir="ltr"` · past-time slot label «انتهى» · aria-describedby on the party error · per-route OG · sitemap.xml · JSON-LD `\u003c` hardening · the WhatsApp egress disclosure · filter URL-sync · act-1 poster lazy · hygiene files un-committed (`.env`, `db/custom.db`, `.zscripts/`, `agent-ctx/`, `tool-results/`, `download/`) · the footer hours line @375.
- **E69** the RM audit green (all sites within fade ≤0.3s / lift ≤8px). **E70** handrail + announcer: keyboard walkthrough green; the announcer fires on route change (run artifact). **E71** «يرجى» rendered count = 0 (dev + prod snapshots); the drift kills + translationese diff quoted — your term audit names them (the council's register counted 8). **E72** dead-code receipt: CSS −0.35KB, elev-2 gone, ~45 deps removed, lockfile diff, typecheck + build green. **E73** the content-Minors table (one table, every row before/after). **E74** the plumbing-Minors: sitemap.xml reachable; per-route OG quoted; JSON-LD `\u003c`; filter URL-sync E2E; act-1 poster lazy (below-fold eager = 0); `git ls-files` proves the six hygiene paths are gone.

**R12 · the gates arm — P-042 / P-087 / P-086 / P-091**
- P-042 core routes first: the three readers — Hands (keyboard) / Ears (screen-reader) / Calm (reduced-motion) — on home · menu · reserve · confirmation.
- P-087 audit:motion armed: M-2 `animate-spin` = 0 · M-3 the one-curve law · M-4 the conductor inventory · M-6 RM at every GSAP site.
- P-086 kitchen-side counters: server-side only — they count HOUSE events (bookings, inquiries, 409s, 429s), never visitors; hot-path countersigned; ZERO RUM (grep beacons/analytics SDKs = 0 — the battery stays the analytics).
- P-091 audit:twins: every R1 interactive diff names its a11y twin.
- **E75** the reader suite green ×4 routes ×2 locales (raw runs). **E76** audit:motion M-2/M-3/M-4/M-6 green (output quoted). **E77** the counters live + the zero-RUM grep = 0. **E78** audit:twins green.

**R13 · THE EXIT GATE — one Actions run, raw artifacts under `/evidence/r1/`**
- **E79** the exit-gate run proves, in ONE dispatch: Lighthouse mobile ×3 runs ×2 locales — medians ≥90 / LCP ≤2.5s / CLS ≤0.1 / TBT ≤300ms (the one-noise-rerun rule honored; medians.md regenerated from THIS run's JSONs — C-1 fully closed) · 16/16 first-load ≤200KB gz re-proven · axe 0/0 re-run (scope: the four reader routes full + every route an R-task touched) · the 404 re-proven · **the race regression guard on PostgreSQL: 20 parallel → 12 rows + 8×409 + 0 orphans** (R5 touched the reservations API) · 0 spinner (`animate-spin` = 0) · the six organs green in CI (audit:motion armed M-2/M-3/M-4/M-6 this release; M-1/M-5 arm with Release 3's census) · the ΣΔ≤0 ledger diff.
- **E80** MATRIX.md regenerated FROM RUNS (E29's law, N25): every row cites a raw artifact path — rows this release re-proves cite `/evidence/r1/`; unchanged rows may cite their original prior-round raw paths (marked UNCHANGED — §6 forbids wholesale re-capture); the F7-2 / F9-3 / F11-1 / F11-2 rows re-labeled honestly; verify-battery no longer blind to FAILs; the R1-corrected docs re-synced to THIS run's raw state — verify-docs green on the final state.
- **E81** the DONE report: per-AC table (E34–E81, PASS/FAIL each) + reproduction commands + the LANDED registry (every P-ID and fix-register item → its commit hash — the museum's first entries) + the known-gaps section (mandatory; N24).

## §5 · CEILINGS (frozen — copy verbatim into the ACK)

| Budget | Ceiling | Note |
|---|---|---|
| First-load JS hard | ≤200KB gz, 16/16 | this release's gate |
| First-load JS soft | 150 → **165KB** standing default (a) | P-092; gates Release 2 |
| Motion family (lazy) | ≤62KB gz | 58.85KB pinned |
| Three-pack (lazy) | ≤235KB gz | 231.9KB, headroom 3.1KB |
| Combined rental | ≤297KB | 291.15KB |
| CSS additions | +3KB total | ≈2.97KB subscribed, 0.03KB slack |
| Fonts | AR faces ≤60KB each · disk 334,880B | subsets: −31KB EN / −100KB AR |
| Net bytes | **ΣΔ≤0 per release** | the 7-cell Exchange Ledger |
| Visitor measurement | zero RUM/beacons/SDK | grep-verified |

## §6 · EVIDENCE CONTRACT (inherited + this release)

Raw machine artifacts only — summaries BESIDE raw files, never instead (N16) · surface labels dev / prod-run (N21) · GitHub Actions = the only sanctioned prod surface; canonical schema stays §6.1-verbatim postgresql (N22) · Lighthouse mobile / 3 runs / median / one noise re-run · screenshots `route--state--width.png` · every E-cell cites its raw path under `/evidence/r1/<E-id>/` with MANIFEST + REPLAY (exact commands reproducing the cell) · SITE_URL-dependent cells labeled PLACEHOLDER-surface · the 57/face capture set is NOT re-run wholesale — re-capture only what R-tasks changed (z-fix walkthrough, filter pair, vegan E2E, readers' routes), named per the convention.

## §7 · NEVERs (all binding; N24–N26 new)

Prior chain verbatim: build-brief N1–N15 · prompt-2 N16–N20 · prompt-3 N21–N23. **New this contract:**
- **N24 — no doc claim without its raw artifact.** Every assertion in BLOCKED.md / deploy-pre.md / versions.md / the DONE must be regenerated from, and cite, the run artifact that proves it. A claim the raw file denies = the DONE is void.
- **N25 — the matrix regenerates from runs or the DONE is void.** MATRIX.md is machine-regenerated each round from raw evidence; hand-edited rows are discarded unread.
- **N26 — no pool proposal lands outside the map's sequence.** Any Release-2/3/4 roster item found in this release's diffs is a defect, returned for revert (the museum-emptying law).

## §8 · DONE DEFINITION (the STOP rule, scoped to this release)

DONE = E34–E81 all PASS with regenerated raw evidence + the E79 exit-gate run green + the ACK on record. When every gate passes — **STOP**. Gold-plating beyond this roster is a defect, returned for revert (build-brief §12.1 rides here). A failing threshold is reported as FAIL with diagnosis — never polished, never relabeled, never re-surfaced (N16 / N21 / N23 / N24).

## §9 · HUMAN INPUTS (defaults in force — §7 of the plan)

1. **SITE_URL** — ACK-declared; default = PLACEHOLDER policy `https://mirador.example` + PLACEHOLDER-surface labeling on every URL-dependent cell (COP-1 honestly labeled, never claimed deployed). The swap = one env var, one place, at deployment.
2. **Soft cap** — standing default (a) 165KB (P-092); gates Release 2. This release gates on the hard 200KB.
3. **WhatsApp** — `wa.me/963955000111` (fictional A5) unchanged; swaps at deployment, one constant.
4. **Baseline-v0** — not required this release (locks with Release 3's proof sheet).

## APPENDIX A · ACK TEMPLATE

```
ACK — PROMPT 4 · RELEASE 1 · THE HOUSE EDGES
1. Map + my stop: v1.1 HOUSE EDGES now; v2.0-I HONEST DOOR next; STOP rule accepted (…quote §8 one line…).
2. Ceilings: (…copy §5 table verbatim…)
3. ΣΔ≤0 law accepted: (…one line…)
4. SITE_URL: <value> | PLACEHOLDER policy accepted.
5. Soft cap default (a) 165KB acknowledged (gates Release 2 only).
6. Contradictions found: <list or NONE>.
```

## APPENDIX B · KEY ANCHORS & CONSTANTS

`.lighthouserc.json:8` (chromeFlags string → array) · `src/components/layout/nav.tsx:122` (z-30) vs `src/components/ui/sheet.tsx:39` (z-50) · `src/app/[locale]/loading.tsx` + `src/app/[locale]/[...rest]/page.tsx` (B-1) · slots 18:00–22:30 Tue–Sun UTC+3 (10/day) · race = 20 parallel → 12 rows + 8×409 + 0 orphans · palette night `#0A0A0B` / amber `#CBA35C` / ivory `#F2EFE8` · BEZEL 8.42:1 (protan 7.83 / deutan 8.77) · fonts Fraunces + Amiri (display) / Instrument Sans + IBM Plex Sans Arabic (body) · font-disk baseline 334,880B · the one curve `--ease-out-expo` · tempos 100/200ms · keyframes ≤7 · seed 9621 · Lighthouse ≥90 / LCP ≤2.5s / CLS ≤0.1 / TBT ≤300ms (mobile, 3 runs, median) · P-IDs landing here = the §3 IN list, nothing else (N26).
