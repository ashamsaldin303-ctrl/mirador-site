# ACK — PROMPT 6 · UI EXCELLENCE · THE SIGNATURE FLOORS (v1.2)

Posted before the first commit of this round (E89, §2 / Appendix A). All NEVERs N1–N27
binding verbatim; **N28 and N29 new, accepted.** Eight items, verbatim where the
contract demands verbatim.

## 1. Map + my stop

The seated register now: **7 buildable this round** — P-094 the window system ·
P-095 the floor-plate menu · P-097 the city's clock · P-098 the room's light ·
P-099 the observation deck · P-100 the plate at the window · P-101 the unbuilt
floor — **P-096 THE TABLE CHOIR DEFERRED to the Release-2 contract** (its landing
surface — the funnel's summary card — ships there; landing it on the confirmation
page would implement P-039's core image, which §3 fences OUT, and collide with the
canon's ONE lighting moment) — **P-102 REFUSED** (the analysis's argument stands).
Release-2/3/4 resume after this DONE; they re-cite what has landed instead of
re-speccing it.

STOP rule accepted (§8, quoted): **"When the seated roster is landed (or lawfully
deferred) and the gates are green — STOP."**

## 2. Ceilings (§5 copied whole — frozen; this round touches not one cell)

| Budget | Ceiling | Note |
|---|---|---|
| First-load JS hard | ≤200KB gz, 16/16 | unchanged |
| First-load JS soft | 165KB standing default (a) | P-092; gates Release 2 |
| Motion family (lazy) | ≤62KB gz | 58.85KB pinned |
| Three-pack (lazy) | ≤235KB gz | 231.9KB, headroom 3.1KB |
| Combined rental | ≤297KB | 291.15KB |
| CSS additions | **+5.5KB total — human-signed amendment 2026-09-23 (Option B; was +3KB)** | standing subscription ≈2.97KB + register gross ≈+2.55KB ≈ 5.52KB modeled — the kill order is the backstop on measured overshoot; **N29 unchanged in force: the human signature was and remains the only amendment path, logged in `docs/css-ceiling-decision.md`; agents never touch this cell** |
| Keyframes | authored census **3 today · cap 7 — zero new this round** | MANUAL grep receipt (M-5 does not exist yet) |
| Loop families | **2 — zero new this round** | MANUAL census receipt (M-1 does not exist yet); P-098 is static by amendment |
| Fonts | AR faces ≤60KB each · disk 334,880B baseline | zero new faces (numerals/dial ride fonts-deferred) |
| Pointer listeners | **0** | D-25 — the register adds none |
| Net bytes | **ΣΔ≤0 per release** | the 7-cell Exchange Ledger + the new CSS-cell instrument (R9) |
| Lighthouse gates | ≥90 / LCP ≤2.5s / CLS ≤0.1 / TBT ≤300ms (mobile, 3 runs, median) | **FROZEN — N27; E79's disposition carried per the raw medians record** |
| Visitor measurement | zero RUM/beacons/SDK | the clock's hour never leaves the device |

## 3. ΣΔ≤0 law + Appendix B's measured-physics table (copied whole)

The law: **net bytes ΣΔ≤0 per release** — bytes removed vs added must net ≤0 on
the wire cells (①+②+③+⑥); cell ⑤ (CSS) carries its own ceiling; a round that
cannot pay within the standing ceiling thins its roster and says so — it never
borrows from a frozen cell (N29).

**The deletion inventory (measured against the repo by the judge's audit — the
builder re-measures at R9's baseline):** the zoom utilities everywhere (≈143B
compiled) · the lightbox's bespoke fades (≈145B plausible — the window's scrim
re-adds an equivalent fade, so ≈0 net there) · **the dead `DialogContent` + its
centering utilities (≈250–400B — the only directed dead-code harvest)** · the TSX
class-string deletions land in the JS cells (~0.25KB gz across dish/lightbox/dialog),
NOT the CSS cell. **Total certain-to-plausible CSS deletion: ≈0.15–0.7KB. The
sheet's slide is a REGISTERED EXCEPTION — it is not a payment and may not be
counted as one.**

| Line | Gross CSS (analysis's projection) | Payment | Truth |
|---|---|---|---|
| P-094 the window (primitive ≈+0.3KB) | +0.3KB | the deletion inventory above | net ≈0 ± the measured surplus |
| P-095 the plates | +0.4KB | **none exists** (shared utilities today — nothing bespoke to delete) | paid by the signed amendment (Option B, 2026-09-23) |
| P-097 the clock | +0.8KB | none | paid by the signed amendment (Option B, 2026-09-23) |
| P-098 the room's light | +0.15KB (static — cheaper than the analysis's rider) | the measured surplus, if any | paid by the signed amendment (Option B, 2026-09-23) |
| P-099 the deck | +0.5KB | none | paid by the signed amendment (Option B, 2026-09-23) |
| P-100 the plate | +0.3KB | none | paid by the signed amendment (Option B, 2026-09-23) |
| P-101 the dial | +0.1KB | the measured surplus, if any | paid by the signed amendment (Option B, 2026-09-23) |
| **Round** | **≈+2.55KB gross vs ≈0.15–0.7KB deletable** | **the standing ceiling afforded ≈0.03KB slack** | **the full register was impossible under Option A — this is the physics; the ceiling decision existed because of it, and the human signed B (2026-09-23): ceiling +5.5KB, all seven land, kill order backstop-only** |

**Option A (ceiling stands — NOT TAKEN; recorded for the form's arithmetic):** the
landing set would have thinned to P-094, then P-101 and P-098 only if the measured
surplus paid them; P-095/P-097/P-099/P-100 would DEFER (named seats: the R3-A
trains — P-038/P-048/P-014's own diffs re-cite them). **Option B — GOVERNING,
SIGNED 2026-09-23 (ceiling → +5.5KB by the human's signature):** all seven land;
**the kill order (backstop only):** P-101 → P-099's stagger tail (the deck degrades
to the even grid) → P-100 (the plate re-centers) → P-097 reduced to two buckets
(dusk/full — late dies) → **STOP. P-094, P-095, P-098 never slide.** Fonts: zero
new faces. First-load JS: zero additions by construction (the R2 migration's TSX
deletions pay the JS cells' way).

## 4. SITE_URL

`https://mirador.example` — the PLACEHOLDER policy accepted (canonical/hreflang/OG/
JSON-LD render against this origin; never claimed deployed; swap = one env var at
deployment).

## 5. Close-out standing order

**PROMPT 5 DONE on record** — `evidence/r1/DONE.md` + `evidence/r1/close-out.md`
committed and pushed (the round closed per its own §8 STOP: E82–E88 PASS, E79
`carried — Option A standing`; ci #35 green on the close-out tip 2eb39f3) — BEFORE
this contract's first product commit. No human reorder exists; the J-1..J-6
full-disclosure branch does not apply.

## 6. Ceiling decision — the standing state

**Option B — SIGNED by the human, 2026-09-23** (verbatim "Option B", quoted in
this contract's header): the CSS ceiling is **+5.5KB total** from this round's
start; **all seven seated components land**; the kill order (Appendix B) is the
backstop if measured cells overshoot; N29 accepted — **I never touch, re-baseline,
or re-open a ceiling cell.** The E90 form RECORDS the signed amendment; it does
not solicit one.

## 7. Ratification roster accepted

P-094/095/097/098/099/100/101 build this round · **P-096 DEFERRED to Release 2**
(its seat is Release 2's funnel cluster; building it here anyway = a defect
returned for revert) · **P-102 REFUSED** · the ten-pattern kill list stays NEVER
(custom cursor, sound, magnetic buttons, 3D tilt, preloaders, confetti, creative
skeletons, scroll-jacking, chat widgets, marquees) · ceilings frozen to agents
(N29) · the register is closed (N28 — an improvisation is not initiative; it is a
defect, returned for revert).

## 8. Contradictions found (every one found, honestly)

1. **The repo pin is authoring-time.** The header pins `7849e4f (main) at
   authoring time`; main has since advanced through prompt-5's close-out
   (2eb39f3), this session's recovery records, and the upload commit (4efde7d).
   Verified: `git diff --stat 7849e4f HEAD -- src/` is **EMPTY** — the audited
   product surface (43 components / 8 families / 3,627 lines) is byte-identical;
   the advancement is docs/evidence/session records only. No action.
2. **Appendix C's E79 anchor is the authoring-time record.** "E79 standing: EN
   LCP 3340 · AR 3904 · AR score 87" = run-25's medians. The current on-record
   raw is **run 28: EN 3361 · AR 3911 · AR score 86**, disposition `carried —
   Option A standing` (the p5 close-out, run-ids on record). R9's own text
   resolves this ("if the close-out (PROMPT 5) has landed and closed/carried/
   re-proven it, THAT record is quoted with its run-ids") — the DONE will quote
   the raw medians verdict current at dispatch with its run-ids; the raws govern,
   never a doc row.
3. **The ratification register file is absent.** `download/mirador/
   ui-excellence-analysis.md` (v1.0 §4, THE SIGNATURE REGISTER) was not delivered
   as a file into this environment (`download/` holds only README.md) — the same
   class as prompt-5's ACK 6.1 (judgment-r1.md). The contract's own header states
   the rulings were recorded "in the contract of record so the builder needs no
   second document" — the roster rulings as stated IN THIS CONTRACT govern;
   nothing is fabricated from the absent file.
4. **The gatebook carries the pre-amendment ceiling.** `docs/gatebook.md`'s CSS
   row still reads "+3KB total" with `scripts/verify-gatebook.ts` asserting that
   exact text (prompt-4 §5 frozen copy). The SIGNED Option-B amendment requires a
   coordinated registration — the gatebook row + the guard's expectation updated
   together in the P-092 precedent's arrow form ("150 → **165KB**"), with
   `docs/css-ceiling-decision.md` (E90) as the amendment's provenance. This is
   the amendment's record-keeping, not an agent ceiling change (N29 honored —
   the signature governs; the ledger's own text is regenerated under the amended
   value).
5. **The exchange ledger's CSS cell is exactly as the contract describes** —
   hardcoded "—" Δ + the pre-amendment "+3KB total" ceiling text (the judge's
   audit finding). Not a contradiction — the contract's own finding, confirmed
   on inspection; the R9 instrument fixes both (measurement + amended ceiling).
6. **Appendix B's lightbox-fade line is a projection, honestly labeled** ("≈145B
   plausible"). Accepted as modeled; the MEASURED column at R9's baseline
   governs (the contract's own law: "the analysis's projections are history, the
   measurements are the law").

— Posted by the builder agent before the first commit of the round. A false or
partial ACK voids the DONE (rule-zero inheritance).
