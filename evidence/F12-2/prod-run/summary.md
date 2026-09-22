# F12-2/prod-run — production build budgets summary (E19) — machine-generated 2026-09-22T18:12:58.666Z

## Route size table (verbatim from build-output.log — raw file: route-size-table.txt)
```
Route (app)
┌ ○ /_not-found
├ ƒ /[locale]
├ ƒ /[locale]/[...rest]
├ ƒ /[locale]/confirmation/[id]
├ ƒ /[locale]/contact
├ ƒ /[locale]/gallery
├ ƒ /[locale]/menu
├ ƒ /[locale]/private-dining
├ ƒ /[locale]/reserve
├ ƒ /[locale]/story
├ ƒ /api/availability
├ ƒ /api/inquiries
└ ƒ /api/reservations

(Turbopack's Route (app) table carries no size columns — sizes are derived from the
served HTML's initial script set + gzip -9 of the emitted chunks; wire sizes corroborate.)
```

## Per-route first-load JS gz (from the served HTML script set — raw file: first-load-js-gz.txt)
/en/ — files=12 raw=572197B gz=174345B (170.3KB) → FAIL (soft budget exceeded — under hard cap)
/en/menu — files=13 raw=590472B gz=180900B (176.7KB) → FAIL (soft budget exceeded — under hard cap)
/en/reserve — files=13 raw=566511B gz=172741B (168.7KB) → FAIL (soft budget exceeded — under hard cap)
/en/story — files=12 raw=564212B gz=171843B (167.8KB) → FAIL (soft budget exceeded — under hard cap)
/en/gallery — files=13 raw=585195B gz=179166B (175.0KB) → FAIL (soft budget exceeded — under hard cap)
/en/private-dining — files=14 raw=844344B gz=237940B (232.4KB) → FAIL (hard cap exceeded)
/en/contact — files=12 raw=564212B gz=171843B (167.8KB) → FAIL (soft budget exceeded — under hard cap)
/en/confirmation/cmuczqzms001y2g64va6gu2yb — files=12 raw=564212B gz=171843B (167.8KB) → FAIL (soft budget exceeded — under hard cap)
/ar/ — files=12 raw=572197B gz=174345B (170.3KB) → FAIL (soft budget exceeded — under hard cap)
/ar/menu — files=13 raw=590472B gz=180900B (176.7KB) → FAIL (soft budget exceeded — under hard cap)
/ar/reserve — files=13 raw=566511B gz=172741B (168.7KB) → FAIL (soft budget exceeded — under hard cap)
/ar/story — files=12 raw=564212B gz=171843B (167.8KB) → FAIL (soft budget exceeded — under hard cap)
/ar/gallery — files=13 raw=585195B gz=179166B (175.0KB) → FAIL (soft budget exceeded — under hard cap)
/ar/private-dining — files=14 raw=844344B gz=237940B (232.4KB) → FAIL (hard cap exceeded)
/ar/contact — files=12 raw=564212B gz=171843B (167.8KB) → FAIL (soft budget exceeded — under hard cap)
/ar/confirmation/cmuczqzms001y2g64va6gu2yb — files=12 raw=564212B gz=171843B (167.8KB) → FAIL (soft budget exceeded — under hard cap)
GATE F12-2: FAIL — 16 routes over budget

## three/fiber/drei lazy pack (raw file: ../F6-3/prod-run/three-lazy-chunk.txt)
lazy chunk: static/chunks/e6e5a7e72d1d5089.js raw=901500B gz=235263B
pack total: raw=901500B gz=235263B (229.7KB)
absent from every route first-load: YES (0 route references — see chunk-manifest.txt)
GATE F6-3: PASS — lazy pack 229.7KB gz ≤400KB, zero route references

## Motion stack in base (raw file: motion-stack.txt)
base motion chunk: static/chunks/586c9637b410adda.js gz=11321B
motion stack total: gz=11321B (11.1KB)
GATE motion: PASS — 11.1KB gz ≤90KB

## Network corroboration (raw file: network-firstload.txt)
/en/ — scripts=17 wireJS=249579B (243.7KB)
/en/menu — scripts=18 wireJS=256444B (250.4KB)
/en/reserve — scripts=18 wireJS=248267B (242.4KB)
/en/story — scripts=17 wireJS=247069B (241.3KB)
/en/gallery — scripts=18 wireJS=254716B (248.7KB)
/en/private-dining — scripts=19 wireJS=315101B (307.7KB)
/en/contact — scripts=17 wireJS=247069B (241.3KB)
/ar/ — scripts=17 wireJS=249579B (243.7KB)
/ar/menu — scripts=18 wireJS=256444B (250.4KB)
/ar/reserve — scripts=18 wireJS=248267B (242.4KB)
/ar/story — scripts=17 wireJS=247069B (241.3KB)
/ar/gallery — scripts=18 wireJS=254716B (248.7KB)
/ar/private-dining — scripts=19 wireJS=315101B (307.7KB)
/ar/contact — scripts=17 wireJS=247069B (241.3KB)
lazy JS loaded after journey scroll: e6e5a7e72d1d5089.js wire=238278B
lazy wire total: 238278B

## VERDICTS (E19 · budgets FROZEN — never bent)
- per-route first-load JS ≤150KB gz (hard 200KB): FAIL (16 routes)
- three pack ≤400KB gz + absent from every route first-load: PASS
- motion stack ≤90KB gz base: PASS
