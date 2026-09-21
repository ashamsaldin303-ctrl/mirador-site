# MIRADOR — design system & build contract (shared reference for all build agents)

Read this BEFORE writing any component. The authoritative contract is
`upload/build-brief.md` (§4 page specs · §5 tokens · §7 copy). This file is the
OPERATIONAL summary of what already exists in the repo — use these idioms, do
not reinvent them. EN directives are authoritative; AR copy is verbatim in
`content/ar.json`.

## Project state (what exists, what you inherit)

- **Routes**: `src/app/[locale]/...` — locale segment `en|ar` (validated in the
  root layout). `src/app/[locale]/layout.tsx` renders `<html lang dir>`, Nav,
  Footer, Lenis+GSAP. Proxy (`src/proxy.ts`) redirects bare paths → `/en`.
- **Tokens**: `src/app/globals.css` — Tailwind 4 `@theme` (FROZEN §5). Utilities
  available: `bg-night bg-surface text-ink text-muted text-amber text-copper
  text-error text-success border-line` · `text-display-xl text-h1 text-h2
  text-h3 text-body-lg text-body text-small text-micro` (AR line-heights
  auto-override via `[dir=rtl]`) · `font-display-en font-display-ar
  font-body-en font-body-ar` · **`font-display` / `font-sans` resolve per
  locale automatically** — use `font-display` for headings, `font-sans` for body
  · `duration-fast/base/slow/signature` · `ease-out-expo` · radii
  `rounded-sm(2px) rounded(4px) rounded-lg(8px) rounded-full`.
- **Component classes**: `.elev-1..4` (elevation ladder) · `.hud-label`
  (micro HUD label — auto de-caps + zero tracking in RTL) · `.media-grain`
  (film grain overlay for full-bleed media — put on the image wrapper) ·
  `.scroll-thin` (custom scrollbar) · `.hud-rule` (hairline).
- **shadcn/ui**: `src/components/ui/*` — primitives ONLY (Button, Input, Label,
  Dialog, Sheet, Textarea…), already restyled via the token vars in
  `globals.css`. `bg-primary` = amber, `text-primary-foreground` = night.
- **Icons**: lucide-react only — `size-4/5/6` (16/20/24px), `strokeWidth={1.5}`.

## Hard rules (grep-gated — violations are defects)

1. **No raw hex/oklch colors** outside `globals.css` (G2). Use token utilities.
   For runtime canvas colors, read CSS vars via `getComputedStyle`.
2. **No arbitrary spacing** (`mt-[13px]`, `p-[7px]`…) (G3). Only the 4px scale:
   1,2,3,4,6,8,12,16,24,32 → p-1..p-32 (4..128px).
3. **No `rounded-[...]`** (G4). No `transition-all` (G7). No framer-motion (G6) —
   GSAP + Lenis own ALL motion.
4. **Logical properties only** for directional CSS (NEVER-11): Tailwind logical
   utilities `ps-/pe-/ms-/me-/start-/end-/text-start/text-end`. Test in RTL.
5. **`next/image` everywhere** — NEVER `<img>`; NEVER `<video>` (NEVER-6/7).
6. **AR typography** (NEVER-10): no letter-spacing, no ALL-CAPS, no justified
   text, body/small line-height ≥1.7 — the type tokens already enforce leading;
   do not override with `leading-*` in RTL contexts. Western digits in both
   locales (numerals policy) — never convert to Arabic-Indic digits.
7. **Banned copy words** (G1): seamlessly, supercharge, unlock, elevate,
   effortlessly, game-changing, cutting-edge, best-in-class, world-class.
   No lorem/Acme/test@example (G5). No testimonials/reviews/press/awards (NEVER-9).
8. **Section rhythm on brand routes**: 96–128px (`py-24`/`py-32`). Cognitive
   caps: ≤7 items per visible category, ≤2 simultaneous emphasis devices.
9. **Touch targets ≥44px** (`min-h-11` / `size-11` on interactive elements).
10. **Z-ladder** (§5.4): content z-0 · sticky section nav z-10 · header z-20 ·
    sheets/menus z-30 · overlays/dialogs/lightbox z-40 · toasts z-50. When using
    shadcn Dialog/Sheet, override `z-50` in className to the correct rung.
11. `"use client"` ONLY in files that need interactivity, at the top. Server
    Components by default. `params`/`searchParams` are Promises — ALWAYS `await`.
12. **Motion**: entrances ≤400ms, signature ≤600ms, stagger 60–120ms — import
    constants from `src/lib/motion.ts` (`DURATIONS`, `EASE_EXPO_OUT`,
    `STAGGER`). `prefers-reduced-motion` must leave ALL content visible
    (static fallbacks ≤0.3s fades / ≤8px lifts). No CSS transitions on
    scrub-owned properties.
13. **Never edit**: `globals.css` @theme block, frozen docs, other agents' route
    folders, `prisma/`, `content/*.json` (if you need a copy key that is
    missing, add it to BOTH files and note it in your worklog — keys must stay
    1:1 across locales).

## Data & API contracts (already built — do not modify)

- `db` client: `import { db } from "@/lib/db"` (Prisma). Models: MenuSection,
  MenuItem, Reservation, Inquiry, GalleryItem — see `prisma/schema.prisma`.
  **SQLite adaptation**: `allergens`/`dietTags` are JSON-encoded strings —
  parse with `parseAllergens`/`parseDietTags` from `src/lib/menu.ts`.
  `status`/`locale`/`type` are plain strings ("PENDING"|"CONFIRMED",
  "EN"|"AR", "PRIVATE_DINING"|"GENERAL").
- `formatPrice(usdCents, locale)` from `src/lib/menu.ts` → `$28 · 350,000 SYP`
  / `28$ · 350,000 ل.س` (dual price per row, §7.5 rule).
- `VENUE` + `TABLES` + `telHref()` from `src/lib/venue.ts`; `waHref`,
  `confirmationMessage`, `generalMessage` from `src/lib/whatsapp.ts`.
- Slot model: `src/lib/slots.ts` — `SLOT_TIMES` (18:00–22:30 ×30min),
  `slotInstant(date, time)` (Damascus UTC+3 → UTC), `dateStrip(60)`,
  `slotsForDate`, `damascusDate/Time`, `isBookableDay` (Mon closed).
- APIs (do not re-implement): `GET /api/availability?date=YYYY-MM-DD` →
  `{date, slots:[{time, remaining}]}` · `POST /api/reservations` → 201
  `{id, tableNumber, slot, whatsappUrl}` / 409 `{error: SLOT_FULL|DUPLICATE,
  messageKey}` / 400 `{error: VALIDATION, fields:{<field>:["<errorKey>"]}}` /
  429 `{error: RATE_LIMITED, retryAfter}` · `POST /api/inquiries` → 201 `{id}`
  (same error shapes). `messageKey`/error keys map to `content/<locale>.json`
  `errors.*` keys.
- Zod wire schemas: `src/lib/validation.ts` (`reservationSchema`,
  `inquirySchema` — client-side validation uses the SAME schemas via
  `@hookform/resolvers/zod` or manual safeParse).
- Dictionary: `getDictionary(locale)` from `src/lib/i18n.ts`; type `Dictionary`
  = keys of `content/en.json`. Pass strings into client components as props.

## Image path contract (files are created by the image agent at exactly these paths)

`/img/hero/poster.avif` (2560×1440 master; ladder 750/1080/1600/2560) ·
`/img/journey/act-1.avif` `act-2.avif` `act-3.avif` (2560×1440) ·
`/img/story/night.avif` (2560×1440) · `/img/404/night-mini.avif` (1080×1350) ·
`/img/og/og-image-en.avif` `og-image-ar.avif` (1200×630) ·
`/img/menu/<slug>.avif` (signature dishes only: sourdough-butter, ribeye-for-two,
dark-chocolate-tart) · `/img/gallery/<collection>-<n>.avif` (n = 1–8 global
index: skyline-1, skyline-2, fire-3, fire-4, plates-5, plates-6, room-7, room-8;
dims in the GalleryItem DB rows). Missing files must render the designed
image-fail state (caption card / poster fallback) — never an empty box.

Until images exist, `next/image` renders the alt/fail state — that is BY DESIGN
(§6.6). Reference images with `<Image src={imageUrl} alt={…} fill sizes="…" />`
inside a positioned wrapper, or with width/height when intrinsics are known.

## Route/page skeletons

Each page: `src/app/[locale]/<route>/page.tsx` (Server Component) — `await
params`, load dict, query DB, render sections; client interactive islands under
`src/components/<route>/…`. Every page exports `generateMetadata` with per-route
hreflang alternates:

```ts
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = raw === "ar" ? "ar" : "en";
  return {
    alternates: {
      canonical: `/${locale}/<route>`,
      languages: { en: `/en/<route>`, ar: `/ar/<route>`, "x-default": `/en/<route>` },
    },
  };
}
```

## Worklog protocol

Before you start: read `/home/z/my-project/worklog.md`. After you finish:
APPEND a section (never overwrite) with Task ID, agent name, work log, stage
summary.
