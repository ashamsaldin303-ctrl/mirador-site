# E39 — mobile sheet z-order fix + walkthrough (prompt-4 R2) [surface: dev]

Raw machine artifacts beside this manifest (copies of the append-only battery logs):
- `sheet-z.log` — computed z-order proof in the OPEN state at 375px (<1024px): scrim z=50 · panel z=50 ·
  panel pointer-events=auto · hit-test at first sheet link center → elementFromPoint = <a> inPanel=true ·
  scrim background = rgba(10,10,11,0.8) (the ONE token) · scrim click closes — EN (side=right) + AR (side=left, mirrored).
- `keyboard-mobile-sheet--en.log` / `--ar.log` — keyboard walkthrough: trigger focus → Enter open → 8×Tab
  focus trap (all in-dialog) → Menu link Enter → route change + sheet closed → Esc close → scrim (pointer) close.
  VERDICT: PASS ×2.

Root cause fixed: `nav.tsx:122` carried `z-30` on SheetContent — panel demoted BELOW its own z-50 scrim
(scrim painted above the menu; pointer nav broken <1024px). Fix: drop the override — panel rides the
sheet's own z-50, above the scrim by DOM order (Radix portal renders Overlay then Content).

In-run defect found & fixed during this cell (preserved verbatim in sheet-z.log run 1):
`--color-scrim: color-mix(in oklab, var(--color-night) 80%, transparent)` — Tailwind 4 could not
statically parse the color-mix+var() token value, so the `bg-scrim` utility was NOT emitted and the
scrim rendered `rgba(0,0,0,0)` (fully transparent). Fixed to the 8-digit hex form `#0A0A0BCC`
(night @ 80% alpha) — run 2 green. AR hit-test additionally needed a 400ms settle wait (the 200ms
slide-in was still mid-flight when measured; x=-214 → x=24 after the wait).

REPLAY (exact commands):
```
bun evidence/tools/browser-specs.ts sheet-z      # → evidence/specs/sheet-z.log (dev surface, :3000 daemon)
bun evidence/tools/keyboard.ts                    # → evidence/specs/keyboard-mobile-sheet--{en,ar}.log
```
The exit gate (E79) re-proves both on the Actions prod surface (workflow Q4b runs `sheet-z`; Q4g runs keyboard.ts).
