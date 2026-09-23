# MIRADOR — The Twins Registry (P-091, prompt-4 R12 · E78)

Every interactive diff of this release names its a11y twin — the accessibility
guarantee that rides WITH the change (D-3's doctrine: a diff without its twin
is a defect). `scripts/audit-twins.ts` validates the registry's shape and
coverage in CI.

| Train | Interactive diff | a11y twin |
|---|---|---|
| R2 (C-3) | mobile sheet z-order fix (scrim above content, panel above scrim) | pointer-hittable sheet links + scrim-click close + focus trap (keyboard walkthroughs ×2 locales) |
| R2 | logical `end-4` corners + one scrim token | RTL mirror parity — the same hit-tests pass under `dir=rtl` |
| R3 (B-1) | honest 404 (loading boundary removed; localized floors restructured) | 404 status + designed floor copy + noindex in both locales; bad confirmation ids render the localized floor |
| R4 (P-022) | intent-hydrated reserve split (shell SSRs, motor on first intent) | labelled busy group + aria-hidden skeleton pre-hydration; full keyboard operability post-intent |
| R6 (FRM-1) | empty MenuSection hides (nav filtered) | no dead sticky links; aria-live count announces the real visible-dish number |
| R8 (P-075) | THE BEZEL site-wide (2px amber + 2px offset) | invariant 8.42:1 focus visibility on EVERY focusable element — the 11 invisible-ring sites killed |
| R8 (P-084) | autofill night + tap-flash death + tabular digits | no white flash under touch; mutating digits don't reflow (tabular-nums); autofill stays night/amber |
| R9 (P-082) | gallery `sizes` + ladder loader + wordmark subsets | alt text unchanged per tile; intrinsic width/height reserved (no CLS from image swap); failure degrades to the caption card (F7-4) |
| R10 (P-035) | ONE Button API (cta/quiet/quietOutline × full/compact/flow) | min-h-11 touch law on every button; quiet = real underline affordance; bezel focus inherited — zero per-button focus classes |
| R10 (P-037) | settle/draw/breathe primitives | motion-safe: twins — RM users get static content, fully present; breathe replaces the spinner with aria-busy text |
| R11 (filter URL-sync) | ?diet= query rides replaceState | post-mount hydration keeps SSR canonical; aria-live announces the filtered count |
| R11 (past slots «انتهى») | ended slots labeled + disabled | aria-label carries the state («انتهى»); disabled = not focusable, state explained |
| R11 (AR plurals) | Intl.PluralRules count forms | aria-live announcement grammatical in AR (one/two/few/many/other) — screen-reader correct |
| R11 (WhatsApp egress) | disclosure micro-note at every external handoff | the disclosure is a real visible label (text-micro, not sr-only) — every guest, screen-reader users included, knows the tap leaves the house before it happens |
| R12 (P-086) | kitchen counters (bookings/inquiries/409/429) | ZERO RUM — no visitor measurement, no client beacon; the battery stays the analytics |
| R2 (P-094) | THE WINDOW — one overlay geometry (dish overlay + lightbox migrate; zoom + bespoke fades die; dead ui/dialog.tsx deleted) | Radix a11y contract byte-identical per surface: focus trap · Esc · aria-modal · Title+Description — the keyboard walkthrough log (open → tab trail → arrows → Esc ×3 surfaces); one close affordance at end-4 (size-11, localized sr-only) |
| R2 (P-094) | the sheet inherits the graded scrim + the close law (slide KEPT — the registered exception) | the sheet's close gains the size-11 touch law + the localized sr-only label (was hardcoded EN "Close"); the slide exception registered in idiom-contracts.md |
| R4 (P-095) | the floor-plate menu headers + section-nav re-keyed to floor numerals | the numeral is aria-hidden decoration — the H2 stays the section's accessible title; heading hierarchy unchanged (axe clean); Western digits per the locked numeral policy |
| R5 (P-099) | the gallery's staggered altitudes (CSS offsets from the collection index) | DOM order = visual order — CSS margins only, zero `order` tricks (the tab walk is the DOM walk); the sighting copy is real visible text (never sr-only) registered in copy-parity.md |
| R6 (P-097) | THE CITY'S CLOCK — html[data-night] buckets at hydration (color-only: surface lift · grain opacity · scrim view depth) + the skyline's resting-density constant per bucket | SSR renders full night; the hydration shift is color-only with a ≤200ms crossfade (disclosed here); the hour NEVER leaves the device (zero cookie/storage/network — the zero-RUM law); ?night=dusk/full/late override = the HOUR axis, DISTINCT from P-067's ?d= kept-night DATE axis (both registered here so Release 2's landing composes, never collides) |
| R7 (P-098) | THE ROOM'S LIGHT — the TimeGrid's static scarcity channel (4+ steady · 2–3 hairline 70% · 1 full amber + the count numeral amber) | the aria-label format UNCHANGED verbatim (time — N tables); the text count STAYS (redundant encoding); ZERO new at-rest motion on /reserve (grep receipt in the loop census); the classes are direction-agnostic |
| R8 (P-101) | the 404's stuck floor dial (two stacked numerals, static half-offset, overflow clip) | the dial is aria-hidden (the H1 copy unchanged — the punchline is visual, never announced); zero motion (grep receipt); the deferred display face rides the existing font-deferral architecture |
