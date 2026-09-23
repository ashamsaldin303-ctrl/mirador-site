# MIRADOR — THE GATEBOOK (P-044, prompt-4 R7 · E59)

The frozen ceilings file + the R10 checklist. CI (`ci.yml` → `verify-gatebook`)
asserts this file carries the contract §5 numbers verbatim and the checklist
entries exist — **a breach (edited ceiling, dropped check) fails the job.**

## §5 · CEILINGS (frozen — prompt-4 contract v1.1, copy verbatim)

| Budget | Ceiling | Note |
|---|---|---|
| First-load JS hard | ≤200KB gz, 16/16 | this release's gate |
| First-load JS soft | 150 → **165KB** standing default (a) | P-092; gates Release 2 |
| Motion family (lazy) | ≤62KB gz | 58.85KB pinned |
| Three-pack (lazy) | ≤235KB gz | 231.9KB, headroom 3.1KB |
| Combined rental | ≤297KB | 291.15KB |
| CSS additions | +3KB → **+5.5KB total** (human-signed amendment 2026-09-23, Option B — N29's one lawful path; record: `docs/css-ceiling-decision.md`) | ≈2.97KB subscribed at amendment; prompt-6 R9's CSS-cell instrument measures the round's Δ (round headroom ≈2.53KB) |
| Fonts | AR faces ≤60KB each · disk 334,880B | subsets: −31KB EN / −100KB AR |
| Net bytes | **ΣΔ≤0 per release** | the 7-cell Exchange Ledger |
| Visitor measurement | zero RUM/beacons/SDK | grep-verified |

## The six organs (armed in CI as they land)

1. **audit:fonts** — AR face payloads ≤60KB (armed, prompt-3).
2. **verify-docs** — doc claims must match their raw artifacts (armed, R1/E38).
3. **ledger** (P-041) — font-disk + wire budget cells (armed, R7/E57).
4. **gatebook** (P-044) — THIS file + drift guard (armed, R7/E59).
5. **audit:motion** (P-087) — M-2/M-3/M-4/M-6 (armed with R12/E76).
6. **audit:twins** (P-091) — every interactive diff names its a11y twin (armed with R12/E78).

## R10 checklist (the pre-exit-gate list — every box MUST be re-checkable)

- [ ] P-035: ONE Button API (`cta | quiet | quietOutline` × `full | compact | flow`) — zero ad-hoc variants (grep).
- [ ] P-035: `audit:idioms` A1–A12 committed and green.
- [ ] P-035: the ledger-family three laws documented as idiom contracts (1px = state / 2px = fact · error = color, never weight · inputs: no hover, caret amber, LTR island).
- [ ] P-037: settle / draw / breathe primitives exist, shared, named, documented; vertical arrival ≤600ms expo-out.
- [ ] P-037: hairline draw 200ms; light breathe; conductor rule documented (CSS paint/pointer-time · GSAP scroll/diff-time · Lenis scroll-feel).
- [ ] P-078: `EASE_OUT_SOFT` grep = 0; the one curve `--ease-out-expo`.
- [ ] E66/E67/E68 raw artifacts under /evidence/r1/ citing their specs.
