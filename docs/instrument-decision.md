# THE INSTRUMENT DECISION — the human's amendment form (prompt-5 R5 · E87)

**Status: UNSIGNED — no instrument change has occurred.** The standing default is **Option A**
(the lantern `throttlingMethod: simulate` is the sanctioned LCP instrument; the E79 FAIL carries
honestly to v2.0-I) until a human signs this record. **N27 binds every agent: no threshold
change, no instrument substitution, no recorded-parallel-metric-as-gate without this
signature.** The 2.5s LCP threshold is **UNCHANGED under either option.**

This form was authored by the builder agent per prompt-5 §4 R5 — authoring the form is the
rostered task; signing it is not the agent's to do.

## The two options

### Option A — lantern-simulate stays the sanctioned LCP instrument (standing default)

- The E79 LCP FAIL (three failing cells: EN LCP · AR LCP · AR performance-score) carries to the
  v2.0-I backlog **with the floor proof and the quantified product trade**: closing ≤2500ms under
  the lantern requires deferring the conversion surface's typography to post-load (the logo, the
  nav, the locale switcher, the body, the CTA in substitute type on first paint) — the only
  closing candidate (C2, projected 2216ms both locales) is refused by the conversion-typography
  fence; every damage-free candidate fails the ≤3-slot closing requirement by construction
  (`evidence/r1/E85/close-evaluation.md`).
- Nothing changes in the gate, the workflow, or the docs' verdicts. The round closes with the
  honest FAIL on record.

### Option B — the sanctioned LCP instrument is re-specified to the devtools-method

- The same runner, the same build, the same 3-runs-per-locale medians convention — the only
  change is `throttlingMethod: devtools` (the battery already runs beside every dispatch as the
  E86 record; re-specifying it the gate is a workflow-config change plus a re-run).
- **The 2.5s threshold is unchanged.** Under the recorded devtools battery (Actions run 27):
  `/en` LCP median 1639ms · `/ar` 1640ms — both under 2500ms; performance 98/98 — both over 90.
- What Option B means in evidence terms: the measured page (real throttling applied via CDP,
  no simulated serialization) is the gate's subject, and the committed floor derivation
  explains WHY the two instruments disagree (the simulated font queue's 562.5ms serialized
  slots — `docs/lcp-floor-derivation.md`): the devtools-measured LCP (1639/1640ms) sits within
  ~1.5% of the lantern floor model's own floors (1653/1598ms).

## The amendment log — both instruments' medians, side by side

| instrument | dispatch | /en | /ar | verdict at the frozen gates (≥90 · ≤2500ms · ≤0.1 · ≤300ms) |
|---|---|---|---|---|
| lantern (simulate) — **the sanctioned gate** | Actions run 25 (the exit-gate) | 92 · LCP 3340ms · CLS 0.0195 · TBT 72ms | 87 · LCP 3904ms · CLS 0.0000 · TBT 90ms | FAIL — three cells (EN LCP · AR LCP · AR score) |
| lantern (simulate) | Actions run 26 | 92 · LCP 3349ms · CLS 0.0195 · TBT 80ms | 87 · LCP 3888ms · CLS 0.0000 · TBT 87ms | FAIL — the same three cells |
| lantern (simulate) — **the current raw** | Actions run 27 (the E86 battery) | 90 · LCP 3522ms · CLS 0.0195 · TBT 75ms | 85 · LCP 4056ms · CLS 0.0000 · TBT 81ms | FAIL — the same three cells |
| devtools-method — RECORDED, NOT THE GATE (N27) | Actions run 27 | 98 · LCP 1639ms · CLS 0.0196 · TBT 120ms | 98 · LCP 1640ms · CLS 0.0000 · TBT 125ms | (no verdict — recorded beside, never instead) |

REPLAY — the exact commands that produced each cited number:
- lantern medians: the `production-evidence` dispatch's Q4i step (`bunx @lhci/cli@0.15.1 autorun --config=.lighthouserc.json`) + `bun evidence/tools/lighthouse-summary.ts` → `evidence/prod-run/lighthouse/medians.md` (per-run rows + raw `lhr-*.json` beside).
- devtools medians: the same dispatch's parallel step (`bunx @lhci/cli@0.15.1 collect --config=.lighthouserc-devtools.json`) → the RECORDED-NOT-GATE block in the same `medians.md` (raw `devtools-lhr-*.json` beside; `throttlingMethod: devtools` asserted in each raw's `configSettings`).
- the floor model: `bun evidence/tools/lcp-floor.ts` → `docs/lcp-floor-derivation.md`.
- the closing arithmetic + the product trade: `evidence/r1/E85/close-evaluation.md`.

## The judge's recommendation (the record as it reached the builder)

**Provenance note (honest):** `judgment-r1.md` was not delivered as a file into this
environment (registered as ACK contradiction 6.1) — its §4 could not be attached verbatim.
What follows are the **contract-side records** of the judgment's verdict and recommendation,
quoted from prompt-5 itself, clearly labeled — never presented as the judge's verbatim words:

> From prompt-5's Arabic summary (the judgment's verdict, as the contract records it):
> "حكمُ التحرّي على الإصدار الأول: **REVISE بنطاق ضيّق** — الجوهر حقيقيّ ومُتحقَّق منه (أُعيد
> تشغيل الأدلة الستّ كلّها بنجاح)، لكن بوابة الخروج E79 **فاشلة بأمانة** بثلاث خلايا خام (LCP
> بالإنجليزية 3340 وبالعربية 3904 + درجة الأداء العربية 87<90)…"

> From prompt-5 §9 (the recommendation as the contract records it):
> "The judge's recommendation (**Option B, conditional on the floor proof**) is attached for
> the human, not binding on anyone."

The floor proof now exists (E84): the lantern floor for this chain is ~1653/1598ms and the
devtools-measured page sits on it (1639/1640ms). The condition the contract names is met by
the committed artifact — the choice itself remains the human's.

## The signature

> I have read both options, the amendment log, the floor derivation
> (`docs/lcp-floor-derivation.md`), and the close evaluation
> (`evidence/r1/E85/close-evaluation.md`). I understand the 2.5s threshold is unchanged under
> either option, and that this signature alone may amend the sanctioned instrument (N27).

**Option selected (A / B):** ______________________________

**Signed:** ______________________________  **Date:** ______________

**Title/role (amendment authority):** ______________________________

Amendment effect (agent-executed only after this signature is on record, per prompt-5 §4 R5):
- **A** → no change; the E79 FAIL carries to v2.0-I with the floor proof + the quantified trade.
- **B** → the workflow's sanctioned Lighthouse config is re-specified to the devtools-method
  (one config field), a fresh dispatch regenerates the gate from the measured page, and the
  amendment log above gains the new sanctioned row — with the lantern block then recorded
  beside as the parallel instrument (the symmetry inverts; nothing is deleted).

*(Until signed: Option A stands. No agent may act on either option beyond what §4 already
permits — this form's own existence is the permitted act.)*
