# ASSETS-REPLACE.md — MIRADOR replaceable asset register (A2 · F10-3)

All imagery ships as **sourced placeholders, art-directed to the single
night-cinematic grading grammar** (near-black + desaturated amber-brass,
S-curve contrast, 2–4% grain — pipeline: `scripts/images.mjs`, raw sources in
`assets/img-src/raw/`, search metadata in `assets/img-src/search/`).
Replace with real MIRADOR photography by swapping the raw file and re-running
`bun scripts/images.mjs`. Ladder variants (`-750w/-1080w/-1600w`) regenerate
from masters automatically.

| path | what | why | replace-with | source · license |
|---|---|---|---|---|
| /img/hero/poster.avif (+ ladder ×3) | night-city skyline poster, LCP element | placeholder per A2 | real MIRADOR rooftop view at night | Expedia (via ZAI image-search OSS re-host) · sourced placeholder |
| /img/journey/act-1.avif (+ ladder ×3) | Act I — Dusk: rooftops as lights switch on | journey anchor | dusk over Damascus from level 6 | Unsplash · free license |
| /img/journey/act-2.avif (+ ladder ×3) | Act II — Fire: open-flame kitchen | journey anchor | the MIRADOR hearth mid-service | Epicurus's List · sourced placeholder |
| /img/journey/act-3.avif (+ ladder ×3) | Act III — The Table: set table by night window | journey anchor | the long window table at night | Eater NY · sourced placeholder |
| /img/story/night.avif (+ ladder ×3) | full-bleed night image between story ch.2–3 | editorial pacing | the room's window at night | Leonardo AI (via image-search) · AI-generated placeholder |
| /img/404/night-mini.avif | 404 / global-error mini poster | brand error surface | stairwell detail | Contemporist · sourced placeholder |
| /img/og/og-image-en.avif | OG card EN (1200×630) | social preview | brand-approved OG art | signatureroom.com · sourced placeholder |
| /img/og/og-image-ar.avif | OG card AR (1200×630) | social preview | brand-approved OG art | Future Light · sourced placeholder |
| /img/gallery/skyline-1.avif (+ ladder ×3) | "The City, Switched On" | gallery placeholder | MIRADOR dusk skyline | CalMatters · sourced placeholder |
| /img/gallery/skyline-2.avif (+ ladder ×3) | "Long Exposure" | gallery placeholder | light trails below level 6 | Unsplash · free license |
| /img/gallery/fire-3.avif | "The Pass, 21:00" | gallery placeholder | the real pass mid-service | The Denver Post · sourced placeholder |
| /img/gallery/fire-4.avif | "Embers" | gallery placeholder | the hearth between services | Jooinn · sourced placeholder |
| /img/gallery/plates-5.avif | "A Single Place Set" | gallery placeholder | MIRADOR mise en place | Smarty Had A Party! · sourced placeholder |
| /img/gallery/plates-6.avif | "First Pour" | gallery placeholder | opening course at the pass | The Infatuation · sourced placeholder |
| /img/gallery/room-7.avif | "Amber Glass" | gallery placeholder | the window at last light | Unsplash · free license |
| /img/gallery/room-8.avif | "The Final Flight" | gallery placeholder | the stairs to level 6 | Simple Lighting · sourced placeholder |
| /img/menu/sourdough-butter.avif | Signature — sourdough + cultured butter | dish placeholder | real signature dish shot | Kristen Shaw Photography · sourced placeholder |
| /img/menu/ribeye-for-two.avif | Signature — MIRADOR ribeye for two | dish placeholder | real signature dish shot | Algae Cooking Club · sourced placeholder |
| /img/menu/dark-chocolate-tart.avif | Signature — dark chocolate tart | dish placeholder | real signature dish shot | Stuck in the kitchen · sourced placeholder |

Register rows = 19 subjects (+21 auto-generated ladder variants) = 40 files —
every file under `public/img/` is registered (verified by `scripts/audit-assets.ts`).

Venue constants (fictional per A5) live in `src/lib/venue.ts` — replace real
values there only. Font binaries: official OFL releases from google/fonts
GitHub (`assets/fonts-src/`), subsets built by `scripts/build-fonts.sh`.
