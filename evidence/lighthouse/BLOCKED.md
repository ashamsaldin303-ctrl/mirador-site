# BLOCKED — E8 · E9 — Lighthouse CI (prod-build form) (P1)

## Condition
E8/E9 gates are defined on "Lighthouse CI (mobile, **prod build**, 3 runs,
median)" — parent §10.2 / Appendix A. Production builds are prohibited by the
platform in this container (see /evidence/F12-2/BLOCKED.md), so the gate-form
Lighthouse run is BLOCKED-by-policy here.

- Perf score ≥90 · LCP ≤2.5s · CLS ≤0.1 · TBT ≤300ms (E8): **BLOCKED** — no
  prod build exists to measure; dev-mode numbers are categorically not the
  contracted metric and are NOT submitted as gate evidence.
- LCP element = hero poster `<img>` on /en + /ar (E9): gate-form (committed
  Lighthouse trace JSON `lcpElement`) **BLOCKED**; a clearly-labeled
  in-browser PerformanceObserver LCP-element capture is attached as
  diagnostic corroboration where produced (see /evidence/lighthouse/).

## Resolution path
On a build-capable machine: `bun run build && bun run start` (port ≠ dev
daemon), then `lhci autorun` per /evidence/REPLAY.md §lighthouse — 3 mobile
runs on /en and /ar, median committed with raw traces.

## What ships from this environment instead
- /evidence/lighthouse/ — any diagnostic captures, each file header-labeled
  `DIAGNOSTIC-DEV-ONLY — NOT E8/E9 GATE EVIDENCE`.
- No numeric claim against the E8 thresholds is made anywhere in this pack.
