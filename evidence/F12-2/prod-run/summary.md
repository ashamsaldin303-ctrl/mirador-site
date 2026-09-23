# F12-2/prod-run — production build budgets summary (E19) — machine-generated 2026-09-23T02:00:31.203Z

## Route size table (verbatim from build-output.log — raw file: route-size-table.txt)
```
Route (app)
┌ ○ /_not-found
├ ● /[locale]
│ ├ /en
│ └ /ar
├ ƒ /[locale]/[...rest]
├ ƒ /[locale]/confirmation/[id]
├ ● /[locale]/contact
│ ├ /en/contact
│ └ /ar/contact
├ ƒ /[locale]/gallery
├ ƒ /[locale]/menu
├ ● /[locale]/private-dining
│ ├ /en/private-dining
│ └ /ar/private-dining
├ ƒ /[locale]/reserve
├ ● /[locale]/story
│ ├ /en/story
│ └ /ar/story
├ ƒ /api/availability
├ ƒ /api/house
├ ƒ /api/inquiries
├ ƒ /api/reservations
└ ○ /sitemap.xml

(Turbopack's Route (app) table carries no size columns — sizes are derived from the
served HTML's initial script set + gzip -9 of the emitted chunks; wire sizes corroborate.)
```

## Per-route first-load JS gz (from the served HTML script set — raw file: first-load-js-gz.txt)
/en/ — files=13 raw=588024B gz=180253B (176.0KB) → FAIL (soft budget exceeded — under hard cap)
/en/menu — files=13 raw=591833B gz=181414B (177.2KB) → FAIL (soft budget exceeded — under hard cap)
/en/reserve — files=13 raw=567590B gz=173072B (169.0KB) → FAIL (soft budget exceeded — under hard cap)
/en/story — files=13 raw=580647B gz=177891B (173.7KB) → FAIL (soft budget exceeded — under hard cap)
/en/gallery — files=13 raw=586809B gz=179760B (175.5KB) → FAIL (soft budget exceeded — under hard cap)
/en/private-dining — files=13 raw=572389B gz=174577B (170.5KB) → FAIL (soft budget exceeded — under hard cap)
/en/contact — files=12 raw=565291B gz=172174B (168.1KB) → FAIL (soft budget exceeded — under hard cap)
/en/confirmation/cmudgg8bp001y4277al5fzeyk — files=12 raw=565291B gz=172174B (168.1KB) → FAIL (soft budget exceeded — under hard cap)
/ar/ — files=13 raw=588024B gz=180253B (176.0KB) → FAIL (soft budget exceeded — under hard cap)
/ar/menu — files=13 raw=591833B gz=181414B (177.2KB) → FAIL (soft budget exceeded — under hard cap)
/ar/reserve — files=13 raw=567590B gz=173072B (169.0KB) → FAIL (soft budget exceeded — under hard cap)
/ar/story — files=13 raw=580647B gz=177891B (173.7KB) → FAIL (soft budget exceeded — under hard cap)
/ar/gallery — files=13 raw=586809B gz=179760B (175.5KB) → FAIL (soft budget exceeded — under hard cap)
/ar/private-dining — files=13 raw=572389B gz=174577B (170.5KB) → FAIL (soft budget exceeded — under hard cap)
/ar/contact — files=12 raw=565291B gz=172174B (168.1KB) → FAIL (soft budget exceeded — under hard cap)
/ar/confirmation/cmudgg8bp001y4277al5fzeyk — files=12 raw=565291B gz=172174B (168.1KB) → FAIL (soft budget exceeded — under hard cap)
GATE F12-2: FAIL — 16 routes over budget

## three/fiber/drei lazy pack (raw file: ../F6-3/prod-run/three-lazy-chunk.txt)
lazy chunk: static/chunks/e6e5a7e72d1d5089.js raw=901500B gz=235263B
pack total: raw=901500B gz=235263B (229.7KB)
absent from every route first-load: YES (0 route references — see chunk-manifest.txt)
GATE F6-3: PASS — lazy pack 229.7KB gz ≤400KB, zero route references

## Motion stack in base (raw file: motion-stack.txt)
base motion chunk: static/chunks/8c0856cd61fd0eb4.js gz=11687B
motion stack total: gz=11687B (11.4KB)
GATE motion: PASS — 11.4KB gz ≤90KB

## Network corroboration (raw file: network-firstload.txt)
/en/ — scripts=18 wireJS=256138B (250.1KB)
/en/menu — scripts=19 wireJS=265703B (259.5KB)
/en/reserve — scripts=19 wireJS=257336B (251.3KB)
/en/story — scripts=19 wireJS=262169B (256.0KB)
/en/gallery — scripts=19 wireJS=264043B (257.9KB)
/en/private-dining — scripts=19 wireJS=258843B (252.8KB)
/en/contact — scripts=18 wireJS=256138B (250.1KB)
/ar/ — scripts=18 wireJS=256138B (250.1KB)
/ar/menu — scripts=19 wireJS=265703B (259.5KB)
/ar/reserve — scripts=19 wireJS=257336B (251.3KB)
/ar/story — scripts=19 wireJS=262169B (256.0KB)
/ar/gallery — scripts=19 wireJS=264043B (257.9KB)
/ar/private-dining — scripts=19 wireJS=258843B (252.8KB)
/ar/contact — scripts=18 wireJS=256138B (250.1KB)
lazy JS loaded after journey scroll: e6e5a7e72d1d5089.js wire=238278B
lazy wire total: 238278B

## VERDICTS (E19 · budgets FROZEN — never bent)
- per-route first-load JS ≤150KB gz (hard 200KB): FAIL (16 routes)
- three pack ≤400KB gz + absent from every route first-load: PASS
- motion stack ≤90KB gz base: PASS
