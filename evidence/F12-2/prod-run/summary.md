# F12-2/prod-run — production build budgets summary (E19) — machine-generated 2026-09-21T14:16:35.170Z

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
/en/ — files=14 raw=698031B gz=221917B (216.7KB) → FAIL (hard cap exceeded)
/en/menu — files=16 raw=740083B gz=237723B (232.2KB) → FAIL (hard cap exceeded)
/en/reserve — files=16 raw=975963B gz=287575B (280.8KB) → FAIL (hard cap exceeded)
/en/story — files=14 raw=689866B gz=219363B (214.2KB) → FAIL (hard cap exceeded)
/en/gallery — files=15 raw=710789B gz=226678B (221.4KB) → FAIL (hard cap exceeded)
/en/private-dining — files=16 raw=969998B gz=285460B (278.8KB) → FAIL (hard cap exceeded)
/en/contact — files=14 raw=689866B gz=219363B (214.2KB) → FAIL (hard cap exceeded)
/en/confirmation/cmubbuvvy001y42vayj5rrenl — files=14 raw=689866B gz=219363B (214.2KB) → FAIL (hard cap exceeded)
/ar/ — files=14 raw=698031B gz=221917B (216.7KB) → FAIL (hard cap exceeded)
/ar/menu — files=16 raw=740083B gz=237723B (232.2KB) → FAIL (hard cap exceeded)
/ar/reserve — files=16 raw=975963B gz=287575B (280.8KB) → FAIL (hard cap exceeded)
/ar/story — files=14 raw=689866B gz=219363B (214.2KB) → FAIL (hard cap exceeded)
/ar/gallery — files=15 raw=710789B gz=226678B (221.4KB) → FAIL (hard cap exceeded)
/ar/private-dining — files=16 raw=969998B gz=285460B (278.8KB) → FAIL (hard cap exceeded)
/ar/contact — files=14 raw=689866B gz=219363B (214.2KB) → FAIL (hard cap exceeded)
/ar/confirmation/cmubbuvvy001y42vayj5rrenl — files=14 raw=689866B gz=219363B (214.2KB) → FAIL (hard cap exceeded)
GATE F12-2: FAIL — 16 routes over budget

## three/fiber/drei lazy pack (raw file: ../F6-3/prod-run/three-lazy-chunk.txt)
lazy chunk: static/chunks/e6e5a7e72d1d5089.js raw=901500B gz=235263B
pack total: raw=901500B gz=235263B (229.7KB)
absent from every route first-load: YES (0 route references — see chunk-manifest.txt)
GATE F6-3: PASS — lazy pack 229.7KB gz ≤400KB, zero route references

## Motion stack in base (raw file: motion-stack.txt)
base motion chunk: static/chunks/9c14c405ec29f079.js gz=14578B
base motion chunk: static/chunks/50cfbacdd67775b1.js gz=26891B
base motion chunk: static/chunks/ffd686e53e23e53e.js gz=17372B
motion stack total: gz=58841B (57.5KB)
GATE motion: PASS — 57.5KB gz ≤90KB

## Network corroboration (raw file: network-firstload.txt)
/en/ — scripts=15 wireJS=238952B (233.4KB)
/en/menu — scripts=17 wireJS=255444B (249.5KB)
/en/reserve — scripts=17 wireJS=306533B (299.3KB)
/en/story — scripts=15 wireJS=236391B (230.9KB)
/en/gallery — scripts=16 wireJS=244032B (238.3KB)
/en/private-dining — scripts=17 wireJS=304423B (297.3KB)
/en/contact — scripts=15 wireJS=236391B (230.9KB)
/ar/ — scripts=15 wireJS=238952B (233.4KB)
/ar/menu — scripts=17 wireJS=255444B (249.5KB)
/ar/reserve — scripts=17 wireJS=306533B (299.3KB)
/ar/story — scripts=15 wireJS=236391B (230.9KB)
/ar/gallery — scripts=16 wireJS=244032B (238.3KB)
/ar/private-dining — scripts=17 wireJS=304423B (297.3KB)
/ar/contact — scripts=15 wireJS=236391B (230.9KB)
lazy JS loaded after journey scroll: e6e5a7e72d1d5089.js wire=238278B
lazy wire total: 238278B

## VERDICTS (E19 · budgets FROZEN — never bent)
- per-route first-load JS ≤150KB gz (hard 200KB): FAIL (16 routes)
- three pack ≤400KB gz + absent from every route first-load: PASS
- motion stack ≤90KB gz base: PASS
