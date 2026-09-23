# ACK — PROMPT 5 · RELEASE-1 CLOSE-OUT · THE LANTERN AND THE LEDGER (E82)

Posted before the first close-out commit, per §2 (ACK-first protocol) and Appendix A.
Chain: build-brief v1.1 → prompt-2-evidence-run → prompt-3-production-readiness → prompt-4-release1-house-edges → judgment-r1.md → **this contract** (upload/… delivered in-session; see contradiction 6.1). All NEVERs N1–N26 remain binding VERBATIM; **N27 is new and binding**.

## 1. Map + my stop

v1.1 close-out **THE LANTERN AND THE LEDGER** now; next: **v2.0-I THE HONEST DOOR** — *only after this round's DONE and the human's instrument decision are on record*. STOP rule accepted, §8 quoted verbatim:

> DONE = E82–E88 all PASS with regenerated raw evidence + the exit re-dispatch green on every component the raw files can honestly green (a FROZEN-threshold FAIL is reported as FAIL with diagnosis, never polished — N16/N21/N23/N24) + **E79's disposition on record exactly one way** + the ACK on record. When every gate that can honestly pass has passed and the disposition stands — **STOP**. Gold-plating beyond this roster is a defect, returned for revert. Release 2's contract is authored only on this round's APPROVE.

I land R0–R6 (the §3 close-out roster) and nothing else. No product surface, no copy, no typography beyond R3's fenced evaluation; no threshold moves; no instrument substitution; the tab-lamp stays SPEC-ONLY (N26).

## 2. Ceilings (§5 copied whole — frozen; this round may not touch one cell)

| Budget | Ceiling | Note |
|---|---|---|
| First-load JS hard | ≤200KB gz, 16/16 | unchanged |
| First-load JS soft | 150 → **165KB** standing default (a) | P-092; gates Release 2 |
| Motion family (lazy) | ≤62KB gz | 58.85KB pinned |
| Three-pack (lazy) | ≤235KB gz | 231.9KB, headroom 3.1KB |
| Combined rental | ≤297KB | 291.15KB |
| CSS additions | +3KB total | ≈2.97KB subscribed, 0.03KB slack |
| Fonts | AR faces ≤60KB each · disk 334,880B | current 334,200B |
| Net bytes | **ΣΔ≤0 per release** | the 7-cell Exchange Ledger |
| Lighthouse gates | ≥90 / LCP ≤2.5s / CLS ≤0.1 / TBT ≤300ms (mobile, 3 runs, median) | **FROZEN — no agent may change threshold or instrument (N27)** |
| Visitor measurement | zero RUM/beacons/SDK | grep-verified |

Note vintages: the 62/235/297 cells cite the plan's pinned numbers; live-measured values track the Exchange Ledger (three-pack 229.7KB · fonts 334,200B) — **the ceilings govern, not the vintages**.

## 3. ΣΔ≤0 law accepted

Net bytes per release ≤ 0, proven in the 7-cell Exchange Ledger (P-043): ① first-load JS ② motion family ③ three-pack ④ combined rental ⑤ CSS ≤+3KB ⑥ fonts ⑦ net ΣΔ≤0. This round adds no product bytes by design — R3's fenced evaluation prices every candidate against this law before any landing; a candidate that breaches ΣΔ≤0 or the +3KB CSS cell is a defect returned for revert.

## 4. SITE_URL

`https://mirador.example` — PLACEHOLDER policy accepted (canonical/hreflang/OG/JSON-LD render against it; never claimed deployed; swap = one env var at deployment).

## 5. Instrument fork — the standing default

**Option A stands**: the lantern (`throttlingMethod: simulate`) is the sanctioned LCP instrument; **the E79 FAIL carries honestly** (three failing cells per the raw: EN LCP 3340ms · AR LCP 3904ms · AR performance-score 87 < 90 `score:false`). **N27 accepted — no threshold change, no instrument re-specification, no recorded-parallel-metric-as-gate, under any interpretation, without the human signature logged in the decision record.** The devtools-method battery (R4) is recorded BESIDE, never INSTEAD; its medians block is labeled `RECORDED, NOT THE SANCTIONED GATE (N27)` and can never gate this release.

## 6. Contradictions found (registered per §2 item 6 — ambiguity = defect → report)

**6.1 — judgment-r1.md and enhancement-plan.md are not delivered as files.** The chain header says judgment-r1.md is "delivered WITH this contract", and §4 R5 requires attaching "the judge's recommendation verbatim (judgment-r1.md §4)" — no such file exists in `upload/`, the repo, or the session payload (prompt-4's ACK recorded enhancement-plan.md identically: SEALED). Resolution (honest, no guessing): `docs/instrument-decision.md` will attach the contract's own §9 record of the recommendation — "The judge's recommendation (Option B, conditional on the floor proof) is attached for the human, not binding on anyone" — plus the Arabic summary's verdict line, each **explicitly labeled as the contract-side record, never presented as the judge's verbatim words**. If the judgment file is later delivered, the form gains the true §4 quote as an amendment.

**6.2 — §3's code-change whitelist omits R4's structural needs.** §3 permits code changes only in R1's tools / R3's evaluation / R6's plumbing, yet §4 R4 structurally requires the workflow's Lighthouse step to run the devtools battery on the sanctioned runner, a second LHCI config, and `lighthouse-summary.ts`'s durable second medians block. Resolution: R4's wiring is evidence plumbing on the sanctioned surface only (`.github/workflows/production-evidence.yml`, `.lighthouserc-devtools.json`, the summary tool's block emission) — **zero product code** — governed by §4 R4's own text and E86's durability clause.

**6.3 — the DONE is hand-authored while §3's headline says "fixed in the generators, never by hand (N25)".** §4 R1 explicitly rosters "Correct the DONE's E79 row…" — a direct doc edit. Resolution: N25's never-by-hand law governs the generated docs (MATRIX/POINTERS); the DONE correction is the rostered mechanism, and the new verify-docs probe (the J-1 antibody) makes the corrected text **machine-enforced going forward** — drift from the raw failing cells fails CI.

**6.4 — LHR coverage vs the contract's "(runs 9–25)".** The committed set is 48 simulate-method LHRs in 8 timestamped batches (medians anchor them to runs 11, 18, 19, 20, 21/22, 23, 24, 25; runs 9/10/12–17 died before the Lighthouse step or were superseded — J-2 itself counts "all 48 committed"). The floor derivation (R2) covers **all committed LHRs** and states the coverage truth in its header; no number is attributed to an uncommitted run.

**6.5 — E74's "sitemap.xml 200" claim has no committed raw** under `prod-run/` (the http family captures the six route pairs only). Resolution: the row's path is corrected to the source truth (`src/app/sitemap.ts`) in R1; R6's dispatch adds the honest capture (`prod-run/http/sitemap--200.txt`) so the final regeneration cites raw. Additive evidence plumbing, zero behavior change.

**6.6 — J-7 registered, no action** (per the register itself): the committed `.lighthouserc.json` carries `chromeFlags` as the tool-truth string for LHCI 0.15.1.

**6.7 — §5 vintage cells vs the live ledger** (three-pack 231.9 pinned vs 229.7 live; combined 297 vs 285.9): covered by the table's own vintages note — **the ceilings govern**; registered, no action.

— no other contradictions found; the raw anchors quoted in Appendix B were verified against the committed raws before this ACK (medians.md EN 3340/AR 3904/AR score 87 `score:false` · 48 simulate LHRs · `requestLatencyMs: 562.5` in every LHR's `configSettings.throttling` · font disk 334,200B · run-20 control EN 3647 located in batch 4).
