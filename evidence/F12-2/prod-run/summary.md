# F12-2/prod-run — production build budgets summary (E19) — machine-generated 2026-09-23T23:56:45.542Z

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
/en/ — files=13 raw=589210B gz=180588B (176.4KB) → FAIL (soft budget exceeded — under hard cap)
/en/menu — files=13 raw=593288B gz=181842B (177.6KB) → FAIL (soft budget exceeded — under hard cap)
/en/reserve — files=13 raw=568770B gz=173405B (169.3KB) → FAIL (soft budget exceeded — under hard cap)
/en/story — files=13 raw=581827B gz=178223B (174.0KB) → FAIL (soft budget exceeded — under hard cap)
/en/gallery — files=13 raw=588168B gz=180200B (176.0KB) → FAIL (soft budget exceeded — under hard cap)
/en/private-dining — files=13 raw=573595B gz=174918B (170.8KB) → FAIL (soft budget exceeded — under hard cap)
/en/contact — files=12 raw=566471B gz=172506B (168.5KB) → FAIL (soft budget exceeded — under hard cap)
/en/confirmation/cmuerh3vo001y2g0hqxdmhqdw — files=12 raw=566471B gz=172506B (168.5KB) → FAIL (soft budget exceeded — under hard cap)
/ar/ — files=13 raw=589210B gz=180588B (176.4KB) → FAIL (soft budget exceeded — under hard cap)
/ar/menu — files=13 raw=593288B gz=181842B (177.6KB) → FAIL (soft budget exceeded — under hard cap)
/ar/reserve — files=13 raw=568770B gz=173405B (169.3KB) → FAIL (soft budget exceeded — under hard cap)
/ar/story — files=13 raw=581827B gz=178223B (174.0KB) → FAIL (soft budget exceeded — under hard cap)
/ar/gallery — files=13 raw=588168B gz=180200B (176.0KB) → FAIL (soft budget exceeded — under hard cap)
/ar/private-dining — files=13 raw=573595B gz=174918B (170.8KB) → FAIL (soft budget exceeded — under hard cap)
/ar/contact — files=12 raw=566471B gz=172506B (168.5KB) → FAIL (soft budget exceeded — under hard cap)
/ar/confirmation/cmuerh3vo001y2g0hqxdmhqdw — files=12 raw=566471B gz=172506B (168.5KB) → FAIL (soft budget exceeded — under hard cap)
GATE F12-2: FAIL — 16 routes over budget

## three/fiber/drei lazy pack (raw file: ../F6-3/prod-run/three-lazy-chunk.txt)
lazy chunk: static/chunks/412407e7772740c9.js raw=901592B gz=235319B
pack total: raw=901592B gz=235319B (229.8KB)
absent from every route first-load: YES (0 route references — see chunk-manifest.txt)
GATE F6-3: PASS — lazy pack 229.8KB gz ≤400KB, zero route references

## Motion stack in base (raw file: motion-stack.txt)
base motion chunk: static/chunks/fadceae8b21e5292.js gz=12038B
motion stack total: gz=12038B (11.8KB)
GATE motion: PASS — 11.8KB gz ≤90KB

## Network corroboration (raw file: network-firstload.txt)
/en/ — scripts=18 wireJS=257801B (251.8KB)
/en/menu — scripts=19 wireJS=267455B (261.2KB)
/en/reserve — scripts=19 wireJS=258999B (252.9KB)
/en/story — scripts=19 wireJS=263832B (257.6KB)
/en/gallery — scripts=19 wireJS=265817B (259.6KB)
/en/private-dining — scripts=19 wireJS=260515B (254.4KB)
/en/contact — scripts=18 wireJS=257801B (251.8KB)
/ar/ — scripts=18 wireJS=257801B (251.8KB)
/ar/menu — scripts=19 wireJS=267455B (261.2KB)
/ar/reserve — scripts=19 wireJS=258999B (252.9KB)
/ar/story — scripts=19 wireJS=263832B (257.6KB)
/ar/gallery — scripts=19 wireJS=265817B (259.6KB)
/ar/private-dining — scripts=19 wireJS=260515B (254.4KB)
/ar/contact — scripts=18 wireJS=257801B (251.8KB)
lazy JS loaded after journey scroll: 412407e7772740c9.js wire=238331B
lazy wire total: 238331B

## VERDICTS (E19 · budgets FROZEN — never bent)
- per-route first-load JS ≤150KB gz (hard 200KB): FAIL (16 routes)
- three pack ≤400KB gz + absent from every route first-load: PASS
- motion stack ≤90KB gz base: PASS
