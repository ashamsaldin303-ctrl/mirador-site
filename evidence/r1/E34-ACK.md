# ACK — PROMPT 4 · RELEASE 1 · THE HOUSE EDGES (E34)

Posted before the first Release-1 code commit, per §2 (ACK-first protocol) and Appendix A.
Chain: build-brief v1.1 → prompt-2-evidence-run → prompt-3-production-readiness → **this contract** (upload/prompt-4-release1-house-edges.md v1.1). Sole basis: enhancement-plan.md v1.0 (SEALED) — see contradiction 6.1. All prior NEVERs N1–N23 remain binding VERBATIM; N24–N26 are new and binding.

## 1. Map + my stop

v1.1 THE HOUSE EDGES now → next: **v2.0-I THE HONEST DOOR**. STOP rule accepted, §8 quoted verbatim:

> DONE = E34–E81 all PASS with regenerated raw evidence + the E79 exit-gate run green + the ACK on record. When every gate passes — **STOP**. Gold-plating beyond this roster is a defect, returned for revert (build-brief §12.1 rides here).

I land R0–R13 (the §3 IN roster) and nothing else. N26 binding: any Release-2/3/4 roster item found in this release's diffs is a defect, returned for revert — the funnel cluster, city wave, ceremony cluster (incl. the tab-lamp IMPLEMENTATION), dark floors, and THE LIT CITY are not mine; P-075 §10 tab-lamp is SPEC-ONLY here.

## 2. Ceilings (§5 copied whole)

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

## 3. ΣΔ≤0 law accepted

Net bytes per release ≤ 0, proven in the 7-cell Exchange Ledger (P-043): ① first-load JS ② motion family ≤62KB gz ③ three-pack ≤235KB gz ④ combined rental ≤297KB ⑤ CSS ≤+3KB ⑥ fonts (faces ≤60KB each; disk baseline 334,880B) ⑦ net ΣΔ≤0 — with a ledger-diff artifact per release. Verified locally before posting: the 12 woff2 files on disk sum to exactly **334,880B** (contract's baseline confirmed against raw disk).

## 4. SITE_URL

**PLACEHOLDER — `https://mirador.example`** (§9 default, never claimed deployed). Every URL-dependent cell (COP-1 canonical/hreflang/OG/JSON-LD regeneration) carries the PLACEHOLDER-surface label. The swap = one env var (`NEXT_PUBLIC_SITE_URL`), one place, at deployment.

## 5. Soft cap

Standing default (a) **165KB** acknowledged — gates Release 2 only. THIS release gates on the hard ≤200KB gz, 16/16 routes.

## 6. Contradictions found

1. **Sealed-basis documents absent.** `enhancement-plan.md v1.0 (SEALED)` and `phase1-final-report.md` (REVISE, 2026-09-22) are present NOWHERE — not in the repo, not in upload/ (which holds build-brief, prompt-2, prompt-3, this contract, the round-1 manual). The contract embeds their operative content (§3 roster, §4 DAG, §5 ceilings, anchors), so work proceeds from the contract text itself. Unverifiable cross-references — the council's counts ("11" invisible-ring sites, "8" drift-kills, plan §2 doctrine phrasing, §6 evidence law wording) — will be re-derived by my own audits and reported with honest deltas, never guessed. Reported, not silently assumed.
2. **Repo anchor drift + destroyed local runtime (environment, disclosed).** The contract pins the repo @ `1441ed9`; the restored sandbox carried harness checkpoint `f415c5a` — content-equal to `1441ed9` except `.env` reverted to the template SQLite URL and file modes churned 644→755. Reconciled by `git reset --hard origin/main` (= `1441ed9`) before R0. Additionally, the container recreation **destroyed the user-space PostgreSQL runtime** (`~/pg-runtime`, deliberately never committed per prompt-3 N22): rebuilt from the `pgserver` wheel (PostgreSQL 16.2, README-documented pattern); GitHub Actions evidence is unaffected (its own `postgres:16` service container). One in-run environment defect found & fixed under this disclosure: the committed `.env` value was QUOTED — the Prisma CLI rejects it (P1012, "URL must start with the protocol"); Actions never saw it (job env overrides) but local `migrate`/`seed` did. R0's commit un-quotes it (Next dotenv and Prisma CLI both accept unquoted; no Actions impact).
3. **§5 CSS row reading.** "+3KB total | ≈2.97KB already subscribed; 0.03KB slack" — no Release-1 diff has landed that could have "subscribed" 2.97KB yet. Read as the plan's forward estimate of this release's CSS obligations; the Exchange Ledger carries the **measured** arithmetic and enforces ≤+3KB. If measured additions land below the estimate, the ledger reports the smaller honest number.
4. **E43's "reserve ≈161KB expected"** is an expectation, not a ceiling — the gate is ≤200KB gz 16/16; the ledger reports the measured value.
5. **§4 R6 "docs/versions.md (the tsconfig flag claim — closes with E49)"** presupposes the claim is false; confirmed against raw state before R5 lands: versions.md line 13 asserts `noUncheckedIndexedAccess: true` enabled while tsconfig.json carries `noImplicitAny: false` and no `noUncheckedIndexedAccess` — the doc-truth fix (R1) and the tsconfig fix (R5/E49) both land, and versions.md is re-synced to the true state at E80.

No other contradictions found: the §Appendix-B anchors were each verified against raw state before this ACK (`.lighthouserc.json` chromeFlags string on line 8 — confirmed; `nav.tsx:122` z-30 under `sheet.tsx:39` z-50 — confirmed; `[locale]/loading.tsx` + `[...rest]` catch-all present — confirmed; 71 deps of which ~23 unused radix (27 declared / 4 imported: dialog/label/slot/toggle) — confirmed; font stack Fraunces + Instrument Sans / Amiri + IBM Plex Sans Arabic — confirmed in globals.css; medians.md reads NO RUNS FOUND — FAIL — confirmed; http/summary.txt E22 FAIL ×2 (200 not 404) — confirmed; Actions runs 4–8 all conclude `failure` while BLOCKED.md calls B2 CLOSED — confirmed, the R1 doc-truth round's exact target).

— Z.ai Code, builder agent. Posted in-conversation and committed (this file) before the first Release-1 code commit.
