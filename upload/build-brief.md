---
brief: mirador-site v1.1
changelog: "v1.1 — cold-start retest fixes: image-path contract completed (story/404/OG) · honeypot ruling (lenient schema, handler fakes 201) · @theme font var names · rate-bucket wording unified · seed demo-slot made deterministic · gallery dims matched to seed · scaffold pathing (root app/ + src libs) · tooling pins + typo-ar + rg prerequisite · poster 60KB scoped to served LCP variant · AC 63 to 65 (F12-6/F12-7) · type-scale label corrected"
type: BUILD BRIEF — 12-section contract (the first prompt, handed to the builder as its ONLY input)
plan_ref: plan.md@v1.0 (human-APPROVED 2026-09-21 · concept Direction B "Night Ribbon" locked)
stack_pin: "Next.js 16.x · React 19.x · TypeScript 5.x strict · Tailwind CSS 4.x · shadcn/ui · Prisma 7.x [verify] (PostgreSQL)"
motion_extension_pin: "gsap@3.13.x [verify] · lenis@1.1.x [verify] · three [pin-at-build] · @react-three/fiber [pin-at-build] · @react-three/drei [pin-at-build]"
author: planning / review / prompt-engineering agent
budget: "Appendix A band 8–16K · measured 17–20K by two independent estimates (disclosed deviation: bilingual mirroring D3 + full content authoring D9; below the >20K warn line) · self-contained: no external document is a required input"
language: bilingual-en-ar (EN directives authoritative on conflict — disclosed once, here)
first_output: "ACK (≤15 lines) — see §12.4 — NOT code"
---

# MIRADOR — BUILD BRIEF v1.1

> **الملخص العربي (تنفيذي):** هذا عقد البناء («البرومبت الأول») لموقع «ميرادور» — مطعم راقٍ في دمشق بهوية بصرية عالمية بالكامل. 12 قسماً بأمرٍ ثابت: المهمة، المكدس المثبّت، النطاق داخل/خارج، خريطة الصفحات، الرموز التصميمية، عقد البيانات، المحتوى الحقيقي ثنائي اللغة، الـ API، معايير القبول الثنائية، حلقة التحقق، لوح «لا تُطلقاً»، وتعريف الإنجاز. الاتجاه المقفل: «شريط الليل» — رحلة أفقية مثبتة بثلاثة فصول + لحظة WebGL واحدة بمفتاح قتل. أول مخرج لك: إشعار ACK من ≤15 سطراً، لا كود. الإنجليزية هي المرجع عند أي تعارض (معلن هنا مرة واحدة).

---

## 0. READ ME FIRST — execution protocol (read again at the end)

- You are the **full-stack build agent**. This file is your ONLY input and is self-contained (any `plan.md` mention is provenance — §1.4). It passed an adversarial cold-start test by an independent fresh-context agent (gate evidence retained by the author). A remaining gap is a defect in THIS contract → BLOCKED (§10.5), never improvise, never invent.
- Execute the DAG (§3.3) slice by slice in ID order. One task = one bounded diff: ≤5 files, 3–7 binary AC, one commit `<task-id>: <what>`; tasks owning more files run as lettered sub-diffs (§3.3 policy). Package manager **pnpm**; code under `app/` `src/` `content/` `tests/` `scripts/` `prisma/` `docs/` `public/`.
- **Frozen gates are read-only.** You author the visible battery scripts (§10) at T0.1/T4.1; once a baseline/threshold is frozen (human-approved), NEVER edit it. A reviewer-owned held-out subset lives OUTSIDE your write scope, re-run read-only at acceptance. Weakening any check = automatic REVISE.
- Evidence per AC → repo-root `/evidence/<AC-ID>/` (`route--state--width.png`). Rule zero (§1.2): never invent — unknowns → `ASSUMPTIONS.md` (≤5); blockers → BLOCKED.
- All AC are binary. No partial credit — "mostly done" = NOT-DONE. All AC pass → STOP (§12.1); gold-plating is a defect.

---

## 1. Mission & role

### 1.1 Mission — WHY this exists (one paragraph)

MIRADOR is a fine-dining restaurant in Damascus, Syria, with a **fully international visual identity** — the register of the world's best tables, never a "regional restaurant site": no Arabic-themed decoration, no ethnic styling, no calligraphy ornaments. The differentiator is **the city at night, graded like cinema** (near-black + amber chiaroscuro). The site is the brand anchor and the reservation funnel; WhatsApp is the confirmation rail; AR/EN is the quality moat. Concept locked: **Direction B "Night Ribbon"** — a pinned horizontal three-act journey (*Dusk → Fire → The Table*) resolving into the reservation zone, bonded to exactly **ONE WebGL moment** (particle skyline, kill-switched to a poster treatment); inner pages stay editorial-calm (§4). **Conversion goal:** a table reserved in under 90 seconds. **Perception goal:** within 5 seconds — cinematic, weighty, unhurried.

### 1.2 Rule zero

Never invent product facts, copy, numbers, data, or dependencies. Anything this brief does not specify is logged to `ASSUMPTIONS.md` (max 5 entries, 6 columns: id · decision · rationale · risk · blast radius · reversal). If the unknown blocks a task → BLOCKED report (§10.5) with condition → hypothesis → attempts → options → default → the exact question. Unlabeled invention = Major defect at review.

### 1.3 Standing assumptions (inherited from plan — replaceable constants, NOT blockers)

| ID | Decision (locked) | Reversal path |
|---|---|---|
| A1 | No lite tier — full experience for all; hard per-route byte budgets replace tiering | persisted auto/manual lite toggle later (isolated module) |
| A2 | Sourced placeholder images, art-directed, all registered | swap per `ASSETS-REPLACE.md` |
| A3 | WhatsApp is the SOLE confirmation rail (no email provider) | add Resend integration later |
| A4 | No auth/accounts in v1 (guest-first) | phase 2+ |
| A5 | Fictional venue details (address · hours · phone · WhatsApp · email · SYP rate) | single constants file `src/lib/venue.ts` — replace real values there only |

> **AR (§0–§1):** أنت وكيل البناء وهذا ملفك الوحيد المكتفي ذاتياً: الجدول شريحةً شريحة، الأدوات المجمدة للقراءة فقط، كل دليل في /evidence/<AC-ID>/، ولا اختراع — المهمة: مطعم دمشقي بهوية عالمية، ثنائي اللغة، المدينة ليلاً، حجز في أقل من 90 ثانية، والاتجاه «شريط الليل».

### 1.4 Reference key (labels used above, defined here — this brief is self-contained)

**Decisions D1–D12** (locked at the clarify gate; the six cited across this brief): D2 = international contemporary cuisine, menu authored as realistic sample · D3 = bilingual AR/EN full parity (hence 1:1 AR summaries + dual copy contracts) · D5 = custom lightweight booking · D9 = no ready assets — all content authored as realistic samples · D11 = full experience for all · D12 = strict delivery gates. **Risks R1–R5:** R1 WebGL jank → kill-switch · R2 RTL regressions → per-locale diffs · R3 placeholder ships → ASSETS-REPLACE + grep · R4 booking race (**Critical**) → §6.3 transaction · R5 costly mobile data → byte budgets.
**Errata vs plan.md@v1.0 (disclosed, never silent):** task count 22→21 (the DAG table is authoritative) · WCAG ratios recomputed in §5.2 (labels unchanged) · last bookable slot corrected to 22:30 (§6.2).

---

## 2. Pinned stack

### 2.1 Versions (T0.1 duty: resolve exact versions from the lockfile → write `docs/versions.md` → commit lockfile)

| Layer | Pin | Role |
|---|---|---|
| Next.js | 16.x [verify] | App Router ONLY |
| React | 19.x | Server Components by default |
| TypeScript | 5.x, `strict: true` + `noUncheckedIndexedAccess: true` | zero `any` (eslint error) |
| Tailwind CSS | 4.x | CSS-first `@theme` in `globals.css` — the config JS file does not exist |
| shadcn/ui | CLI add-on, version recorded at T0.1 [pin-at-build] | primitives only; restyled EXCLUSIVELY via token CSS vars |
| Prisma | 7.x [verify] + PostgreSQL | schema §6 verbatim; transactions for booking (R4) |
| gsap | 3.13.x [verify] (+ ScrollTrigger + Flip) | owns ALL animation |
| lenis | 1.1.x [verify] | smooth scroll, wired to ScrollTrigger.update |
| three · @react-three/fiber · @react-three/drei | [pin-at-build] | the ONE WebGL scene only (§9 F6) |

`[verify]` = version-sensitive: pin the exact resolved version at T0.1 and record it. If a pinned major version cannot be resolved at T0.1 → BLOCKED (never silently substitute a different major). NEVER "use the latest X" — latest resolves to the training median.

### 2.2 Legacy-idiom contrast rules (use X · NEVER legacy-Y)

- `app/` directory + `app/api/*/route.ts` handlers · NEVER `pages/`, `getServerSideProps`, `getStaticProps`, `next/head`.
- `params` / `searchParams` are **Promises (Next 15+) — ALWAYS `await`** (exemplar §2.4-B).
- Tailwind 4 `@theme` tokens in `globals.css` · NEVER `tailwind.config.js`, NEVER CSS-in-JS theming, NEVER default shadcn OKLCH tokens unmodified.
- Server Components by default · `"use client"` ONLY in files that need interactivity, at the top of the file.
- GSAP + Lenis own ALL motion · NEVER framer-motion / motion / any second animation runtime · NEVER CSS transitions on scrub-owned properties · NEVER `transition-all` (grep gate G7).
- Prisma + PostgreSQL · NEVER SQLite (booking race R4 needs transactional capacity).
- Self-hosted fonts via `next/font/local` · NEVER Google Fonts CDN `<link>` (bilingual perf, R5).
- `next/image` everywhere · NEVER `<img>`. No `<video>` element anywhere in v1 — hero is poster-first AVIF.

### 2.3 Motion stack byte budget

gsap core + ScrollTrigger + Flip + lenis ≤ **90KB gz** combined in the base bundle (route budget F12-2 still applies). three + fiber + drei live in ONE lazy chunk ≤ **400KB gz**, never in first-load JS (§9 F6).

### 2.4 Code exemplars (rule-compliant — copy these idioms)

**A — token seeding (the full §5 `@theme` block is the exemplar; this is its head):**

```css
/* app/globals.css — Tailwind 4 CSS-first. The file tailwind.config.js MUST NOT exist. */
@import "tailwindcss";

@theme {
  /* color roles — night over the city (FROZEN values, brief §5) */
  --color-night: #0A0A0B;
  --color-surface: #141417;
  --color-line: #26262B;
  --color-ink: #F2EFE8;
  --color-muted: #A6A199;
  --color-amber: #CBA35C;
  --color-copper: #B87333;
  --color-error: #C96F5A;
  --color-success: #7FA974;
  /* spacing: 4px base — generates the ONLY permitted spacing scale 4..128 */
  --spacing: 0.25rem;
}
```

**B — dynamic route params (Next 16):**

```tsx
// app/[locale]/confirmation/[id]/page.tsx
export default async function ConfirmationPage({
  params,
}: { params: Promise<{ locale: "en" | "ar"; id: string }> }) {
  const { locale, id } = await params; // params is a Promise — ALWAYS await
  // ...
}
```

**C — Lenis + ScrollTrigger wiring WITH reduced-motion guard:**

```tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.15, wheelMultiplier: 0.9 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(raf); lenis.destroy(); };
  }, []);
  return <>{children}</>;
}
```

### 2.5 Scaffold & script names (T0.1)

Scaffold: `pnpm create next-app@16 mirador --ts --tailwind --app --eslint --import-alias "@/*"` (bootstrap ruling: the major tag runs ONCE at scaffold; every exact version is then read from the resulting lockfile into `docs/versions.md`) — NO `--src-dir`: routes live in root `app/`, shared code in `src/` with tsconfig `paths: { "@/*": ["./src/*"] }`; the created `./mirador` directory IS the repo root (git init; `/evidence/` · `ASSUMPTIONS.md` · `ASSETS-REPLACE.md` live there). `package.json` scripts — exact names, used throughout §10: `dev` · `build` · `start` · `lint` · `typecheck` (tsc --noEmit) · `migrate` (prisma migrate deploy) · `seed` (prisma db seed) · `audit:fonts` · `audit:tokens` · `audit:copy`; plus the computed-style probe `tests/typo-ar.ts` (F8-2). **Tooling pins (recorded in `docs/versions.md` at T0.1 [pin-at-build]):** zod · playwright · @axe-core/playwright · @lhci/cli · tsx (seed runner) · lucide-react · fonttools/pyftsubset · eslint plugins. JSON-LD validation uses the schema.org validator (web tool — output saved to evidence, no npm pin). `rg` (ripgrep) is a dev prerequisite; README documents `grep -E` fallbacks for G1–G7. `ASSUMPTIONS.md` lives at repo root and is committed.

> **AR (§2):** مكدس مقفل مع توثيق الإصدارات في T0.1 (تعذّر إصدار رئيسي = BLOCKED)؛ قواعد تباين ضد الأنماط القديمة؛ أسماء السكربتات في §2.5؛ ميزانية الحركة 90KB والحزمة الكسولة 400KB.

## 3. Scope IN / OUT

### 3.1 IN — MUST (strict gates; everything below is gate-blocking)

The complete DAG (§3.3) — i18n shell + dual-script fonts · token contract · Prisma schema + seed · frozen route table + component inventory · root layout/nav/footer/motion stack · all 7 pages · 3 API endpoints · authored bilingual copy · image register · designed states · SEO · motion polish · release battery. No SHOULD/COULD tiers — strict delivery (D12).

### 3.2 OUT — do NOT build (phase-2+, explicitly labeled)

Online ordering & delivery · payments of any kind · admin/CMS panel · auth/accounts · loyalty/points/CRM · AI concierge · AR/model-viewer · 360° tour · PWA/offline mode · blog/journal · **testimonials/reviews/press/awards sections (DELETED from the plan — no real proof exists; fabricating social proof is forbidden — NEVER-9)** · multi-branch · gift cards · analytics beyond basic · email sending (WhatsApp is the sole rail, A3) · a "lite" tier (A1) · maps embeds · social feed embeds · user accounts of any kind.

**Inactive feature triggers — confirm ALL as inactive in your ACK:** payments · webhooks · uploads · auth · realtime · AR · PWA offline.

### 3.3 Task DAG (21 tasks · one task = one bounded diff · execute in ID order)

| ID | Task | Owns | Depends | AC set | Check |
|---|---|---|---|---|---|
| T0.1 | Scaffold & version pin | scaffold · package.json+scripts · configs · .env.example · docs/versions.md · verify-script stubs | — | F12-2 prelim | `pnpm build` green |
| T0.2 | i18n + dual-script fonts | middleware · `app/[locale]` · fonts | T0.1 | F1 | per-locale diff |
| T0.3 | Token contract → globals.css | `globals.css` `@theme` | T0.1 | F2 | grep gates |
| T0.4 | Prisma schema + seed | `prisma/schema.prisma` · seed | T0.1 | F3-1 | migrate + count |
| T0.5 | Freeze route table + component inventory | `docs/api-route-table.md` · `docs/component-inventory.md` | T0.3, T0.4 | — (review) | both committed |
| T0.6 | Root layout, nav, footer, Lenis+GSAP | layout · shell · `content/{en,ar}.json` | T0.2, T0.3 | F1, F2 | Lighthouse + visual |
| T1.1 | Home v0 (sections, static) | home route | T0.6 | F12-5, LCP | Lighthouse CI |
| T1.2 | Menu list (SSR from DB) | menu route | T0.4, T0.6 | F3 | build + curl |
| T1.3 | **Reservation flow** (walking skeleton) | reserve + confirmation · 2 APIs | T0.4, T0.6 | F4 (all) | E2E battery |
| T2.1 | Signature journey (pinned scrub) | home journey section | T1.1 | F5 | Playwright + RM |
| T2.2 | WebGL moment (R3F skyline) | one canvas component + lazy chunk | T2.1 | F6 | budget CI + device |
| T2.3 | Menu deep | menu + dish overlay | T1.2 | F3-3..7 | axe + keyboard |
| T2.4 | Gallery | gallery route | T0.6 | F7 | Lighthouse + axe |
| T2.5 | Story page | story route | T0.6 | F8-1 | typo-ar script |
| T2.6 | Private dining + contact | 2 routes · inquiries API | T1.3 | F8 | E2E + ratelimit |
| T3.1 | Bilingual copy audit pass | `docs/copy-parity.md` · fixes to `content/` | all T2 | F9 | grep + audit:copy |
| T3.2 | Image plan + register | `public/` · `ASSETS-REPLACE.md` | T2.x | F10 | weight audit |
| T3.3 | States & errors | app-wide | T2.x | F11 | state-matrix set |
| T3.4 | SEO layer | metadata · JSON-LD | T2.x | F11 | schema validator |
| T3.5 | Motion polish | micro-interactions | T2.1 | F5, F12-5 | RM + visual battery |
| T4.1 | Release battery + handoff | E2E+audit scripts complete · evidence pack · README · AGENTS.md · baseline freeze request | all | F12 (all) | the battery itself |

**Sub-diff policy:** a task owning >5 files executes as lettered sub-diffs (each ≤5 files, one commit `<task-id><letter>: <what>`, AC partitioned): T0.6 → (a) layout+fonts, (b) nav/footer/locale-switch + `content/{en,ar}.json` seeded with §7 verbatim strings, (c) Lenis+GSAP wiring · T1.3 → (a) API routes+transaction+availability, (b) reserve UI, (c) confirmation+WhatsApp. **Timing rule:** `content/` locale files are created at T0.6 — T3.1 is the parity AUDIT pass over them, never their creation.

> **AR (§3):** النطاق داخل: 21 مهمة ببوابات صارمة، والمهام الكبيرة أجزاء مرقّمة (≤5 ملفات لكل جزء)؛ وخارج النطاق قائمة «لا تُبنَ» والمحفزات الخاملة السبعة تُؤكَّد في ACK.

---

## 4. Pages map (route → one job → ordered sections → per-component specs)

**Route-split contract:** brand routes (`/`, `/story`, `/gallery`, `/private-dining`) carry the cinematic budget; task routes (`/menu`, `/reserve`, `/contact`) run hard budgets — no hero media beyond a small poster, no WebGL, LCP-first. All routes exist per locale: `/en/...` and `/ar/...`; middleware redirects bare `/` → `/en` (deterministic default — no Accept-Language negotiation; hreflang `x-default` covers SEO). Cognitive caps: ≤7 items per visible category · ≤2 simultaneous emphasis devices per view. 404 and global-error are designed brand surfaces.

### 4.1 `/[locale]` — Home (brand · Direction B "Night Ribbon")

Ordered sections:
1. **Hero** — full-bleed night-city poster (AVIF ≤60KB, LCP element), dual-script wordmark lockup `MIRADOR × ميرادور` (Exemplar of the ONE type trend), hero line + CTA pair (`Reserve a table` primary → `/[locale]/reserve`; `The menu` quiet text link).
2. **ChapterIntro** — editorial paragraph (copy §7.3), generous 96–128px rhythm, HUD micro-label.
3. **Journey (THE signature)** — pinned horizontal 3-act scrub: **Act I Dusk → Act II Fire → Act III The Table** (copy §7.4). Track = 3 × 100vw panels; ScrollTrigger pin; total scroll 300vh; track x: 0 → −200vw in LTR, mirrored +200vw in RTL (dir-aware values, logical implementation). One visual anchor per act. Behind it the **single WebGL canvas**: particle skyline, lazy-mounted post-LCP via IntersectionObserver, density builds act-by-act (25% → 60% → 100%, ≤6000 instanced particles, DPR clamp 1.5, render-on-demand; particle colors read from CSS vars at runtime — no hex literals in src/, G2-safe).
4. **ReserveBand** — "The table is set." + sub-line + CTA pair + hours line (from `src/lib/venue.ts`).
5. **Footer** (global, §4.8).

**Kill-switch (F6-4), all three paths → Direction A poster treatment (3 stacked full-bleed static act panels, same copy):** (a) auto: measured in-canvas fps < 30 for 3 consecutive seconds → unmount canvas, render poster acts; (b) manual: `?webgl=off` or `localStorage mirador:webgl=off`; (c) no WebGL2 context.

### 4.2 `/[locale]/menu` — Menu (task · LCP-first)

Sections: sticky section nav (6 anchors) · diet filter bar (vegetarian · vegan · gf · pescatarian — gsap Flip, count via `aria-live`) · 6 × DishList (SSR from DB) · footer notes (§7.5). **DishRow:** name, one-line desc, dual price per the §7.5 rule, allergen chips, signature marker (amber hairline, bilingual label), sold-out = disabled never hidden. **DishOverlay:** allergen table (`role="table"`), price, Esc closes, focus trap.

### 4.3 `/[locale]/reserve` + `/[locale]/confirmation/[id]` — Reserve (task · <90s)

**Reserve:** exactly **3 input fields (name, phone, party-size stepper 1–12) + 1 slot picker** (date strip next 60 days + time grid 18:00–22:30, sold-out slots disabled). Availability live from `GET /api/availability` (skeleton loading, error retry). In-flight submit disables the button. Success → confirmation.
**Confirmation:** "The table is yours." + summary rows (name, party, date, time, table number — NO phone echo) + **WhatsApp CTA** (§8.4) + "We hold your table for 15 minutes past the time."

### 4.4 `/[locale]/story` — Story (brand · editorial-calm)

3 chapters (§7.6) + 1 pull-quote; typography-led: H2 titles, body max-width 34rem, HUD micro-labels, one full-bleed night image between chapters 2–3.

### 4.5 `/[locale]/gallery` — Gallery (brand · the scenery as exhibit)

Masonry grid (8 items §7.7, 16:9 landscape + 4:5 portrait mix — dims per §7.7 verbatim), lazy below-fold, LQIP; **Lightbox:** click/Enter opens, arrows navigate, Esc closes, focus trap, bilingual captions, image-fail → caption card (never an empty box).

### 4.6 `/[locale]/private-dining` — Private dining (brand)

Offer block (§7.8) + **InquiryForm** (name · phone · preferredDate · partySize · message · hidden honeypot), per-field bilingual errors; success = reference line + WhatsApp CTA. Parties >12 link here from reserve.

### 4.7 `/[locale]/contact` — Contact (task)

Hours table (from `venue.ts`) · address block · phone (tel: link) · WhatsApp CTA · email link · closed-Monday line. Zero hero media; LCP = the H1.

### 4.8 Global shell

**Nav:** small wordmark lockup · 6 links (labels §7.1) · Reserve CTA · locale switch (EN⇄AR, atomic `dir`+`lang` flip, no reload) · mobile sheet (keyboard-operable). **Footer:** wordmark · address · hours · phone/WhatsApp/email · SYP indicative line · legal line (§7.1). **404 + global-error:** designed brand surfaces (§7.9) with night mini-poster + home CTA; HTTP status preserved.

### 4.9 Component inventory (freeze at T0.5 as `docs/component-inventory.md`)

Inventory: Hero · WordmarkLockup · ChapterIntro · Journey + ActPanel ×3 · SkylineCanvas (+kill-switch) · ReserveBand · Nav · MobileSheet · LocaleSwitch · Footer · SectionNav · DietFilterBar · DishList/DishRow · DishOverlay · PriceTag · AllergenChips · SlotPicker · DateStrip · TimeGrid · PartyStepper · FieldInput · InquiryForm · ReservationSummary · WhatsAppConfirm · Chapter · PullQuote · MasonryGrid · Lightbox · HoursTable · AddressBlock · Error404 · GlobalError · SkeletonRow — states per §6.6. NEVER recreate inventoried components.

> **AR (§4):** ثمانية مسارات (سبع صفحات + تأكيد): مسارات العلامة سينمائية ومسارات المهام صارمة (قائمة LCP أولاً)؛ الرئيسية: بطلٌ بملصق + فصل تحريري + الرحلة المثبتة بثلاثة فصول مع لوحة WebGL الوحيدة خلفها + نطاق الحجز؛ عقد الحجز: 3 حقول + منتقي فترة، وتأكيد عبر واتساب؛ 404 وخطأ عام سطحان مصممان لا صفحتا خطأ عامتين.

## 5. Design tokens (FROZEN contract — `globals.css` is generated FROM this section, byte-identically)

### 5.1 Brand spine → tokens (every adjective converted)

**Cinematic · Weighty · Unhurried · Confidential · Precise.** Personality sliders (pinned off-center): formal↔playful **85/15** · restrained↔theatrical **55/45** (the journey earns the theatre) · dense↔airy **40/60** · cool↔warm **45/55**. Conversion: cinematic → grading grammar + scrub pacing; weighty → display sizes + 96–128px rhythm; unhurried → Lenis 1.15 + stagger 60–120ms; confidential → near-black surfaces + hairlines, no gradient chrome; precise → 4px grid + sharp radii + HUD micro-labels.

### 5.2 Color roles (WCAG-computed on `--night` — FROZEN)

| Role | Token | Hex | Ratio on `#0A0A0B` |
|---|---|---|---|
| Page base (the sky) | `--color-night` | `#0A0A0B` | — |
| Raised surface | `--color-surface` | `#141417` | — |
| Hairline / divider | `--color-line` | `#26262B` | — |
| Primary text (ivory) | `--color-ink` | `#F2EFE8` | 17.2:1 AAA |
| Secondary text | `--color-muted` | `#A6A199` | 7.7:1 AAA |
| Accent — city amber | `--color-amber` | `#CBA35C` | 8.4:1 AAA |
| Secondary accent — copper | `--color-copper` | `#B87333` | 5.2:1 AA (large text/UI only) |
| Error | `--color-error` | `#C96F5A` | 5.6:1 AA |
| Success | `--color-success` | `#7FA974` | 7.4:1 AA |

Ratios recomputed with the WCAG relative-luminance formula on `#0A0A0B` (see the erratum note §1.4 — labels unchanged). One accent system (amber/copper = the color of the city's lights seen from above). Copper is large-text/UI only. `--color-error` for form errors and sold-out; `--color-success` for confirmation. **Dark-only v1** — there is no light theme; Appendix A "both themes" maps to this single dark theme + a forced-colors pass. `::selection` background `rgba(203,163,92,0.28)`.

### 5.3 Typography (two voices, four families — self-hosted WOFF2 subsets)

- Display: **Fraunces** (EN) / **Amiri** (AR) — 2 weights max each (Fraunces 400+600 · Amiri 400+700).
- UI/body: **Instrument Sans** (EN) / **IBM Plex Sans Arabic** (AR) — 400/500/600.
- Self-hosted via `next/font/local`, files under `app/fonts/`, `font-display: swap`, preload display+body weight per active locale; AR subsets ≤60KB per weight — the SUM of that weight's unicode-range split files (the F1-4 target; splitting allowed).
- **`@theme` font variables (the F2-1 diff target, exact names):** `--font-display-en: "Fraunces", serif` · `--font-display-ar: "Amiri", serif` · `--font-body-en: "Instrument Sans", sans-serif` · `--font-body-ar: "IBM Plex Sans Arabic", sans-serif`.

| Step | Size (fluid clamp() — viewport-driven display clamps, modular body track) | lh EN | lh AR | Family |
|---|---|---|---|---|
| Display XL (wordmark) | `clamp(3.5rem, 9vw, 10rem)` | 1.05 | 1.25 | Fraunces / Amiri |
| H1 (hero) | `clamp(2.75rem, 6vw, 8.75rem)` | 1.1 | 1.3 | Fraunces / Amiri |
| H2 (chapters, section titles) | `clamp(2rem, 4vw, 3.5rem)` | 1.15 | 1.35 | Fraunces / Amiri |
| H3 | `clamp(1.5rem, 2.5vw, 2rem)` | 1.2 | 1.4 | display family |
| Body lg (lede) | `1.125rem` | 1.6 | 1.8 | body family |
| Body | `1rem` | 1.6 | **≥1.7** | body family |
| Small | `0.875rem` | 1.5 | **≥1.7** | body family |
| Micro / HUD label | `0.75rem` | 1.4 | 1.6 | Instrument Sans 500 |

**AR typography rules (grep + computed-style enforced):** line-height ≥1.7 body/small · letter-spacing 0 · no ALL-CAPS · no justified text · hierarchy carries weight/size/leading only. EN micro labels may use `letter-spacing: 0.08em` — AR never. **Numeral policy:** Western digits (0–9) in UI, dates, times, and prices in BOTH locales.

### 5.4 Spacing · radius · elevation · z · icons · motion

- **Spacing (the ONLY permitted values):** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 (Tailwind scale from `--spacing: 0.25rem`). Arbitrary values (`mt-[13px]`) = grep-gated defect. Section rhythm on brand routes: 96–128px.
- **Radius:** `--radius-sm: 2px` · `--radius: 4px` · `--radius-lg: 8px` · `rounded-full: 999px`. Luxury = sharp edges; nothing rounder than 8px except pills.
- **Elevation (5 levels, dithered — banding on near-black is a defect):** E0 none · E1 surface + hairline `--color-line` · E2 E1 + 3-stop stacked shadow `0 8px 24px rgba(0,0,0,.45)` + 1px hairline-light `rgba(242,239,232,.06)` · E3 E2 + `0 16px 48px rgba(0,0,0,.55)` · E4 E3 + backdrop scrim `rgba(10,10,11,.72)`. Full-bleed media carry a 2–4% film-grain overlay (SVG noise, `mix-blend-overlay`).
- **Z-index ladder:** 0 content · 10 sticky section nav · 20 header · 30 sheets/menus · 40 overlays/dialogs/lightbox · 50 toasts — exactly Tailwind's default `z-0/10/20/30/40/50` utilities. Elevation maps to component classes `.elev-1..4` defined once in `globals.css` `@layer components`.
- **Icons:** Lucide only, 16/20/24px, `strokeWidth: 1.5`, one family.
- **Motion:** durations 100/200/350/600ms (`--duration-fast/base/slow/signature`; mirror constants in `src/lib/motion.ts` — GSAP code imports them) · entrances ≤400ms · signature ≤600ms (scrub-owned time exempt) · easings `expo.out` + `cubic-bezier(0.16,1,0.3,1)` · stagger 60–120ms · `prefers-reduced-motion` designed: ≤0.3s fades, ≤8px lifts, all content present.

### 5.5 Trend budget + parameterized references (borrow patterns, never context)

**Trend budget (max 1 structural + 1 surface + 1 type):** structural = the pinned horizontal scrollytelling journey; surface = dark chiaroscuro + film grain; type = the oversized dual-script display lockup. Nothing else trend-shaped.

| Reference (fidelity label) | Parameterized take |
|---|---|
| Atomix (layout + energy) | one idea per viewport · chapter pacing · whitespace-led 96–128px rhythm |
| noma (style-only) | near-black base · single-accent discipline · editorial calm |
| Em Sherif (ANTI-reference) | refuse conventional gold-on-black hotel-lobby look — amber is desaturated brass `#CBA35C`, never metallic gradients |
| Disfrutar (craft) | plating close-ups as act/gallery anchors |
| Lusion / Active Theory (energy + craft, WebGL) | particle ambition within the 400KB budget — NEVER their layouts |
| Apple TV+ night-city (grading grammar) | amber-on-black · halation (soft bloom on highlights) · 2–4% grain · shadows lifted to `#141417` |
| Astronomy-app UIs (wildcard detail) | hairline HUD micro-labels: Instrument Sans 500, 0.08em EN only, 0.75rem, hairline rules — used for act numerals + chapter labels |

> **AR (§5):** رموز مجمّدة: تسعة أدوار لونية محسوبة WCAG؛ أربع عائلات خطية بقواعد عربية صارمة؛ فراغات 4–128 فقط؛ حواف حادة؛ صيحات 1+1+1؛ ومراجع مُعلماتية مع مرجع مضاد.

---

## 6. Data contract (Prisma schema VERBATIM · seed · capacity model)

### 6.1 `prisma/schema.prisma` (verbatim — the builder's schema is THIS, not an interpretation)

```prisma
generator client { provider = "prisma-client-js" }
datasource db    { provider = "postgresql" url = env("DATABASE_URL") }

enum Locale             { EN AR }
enum ReservationStatus  { PENDING CONFIRMED CANCELLED }
enum InquiryType        { PRIVATE_DINING GENERAL }

model MenuSection {
  id        String     @id @default(cuid())
  slug      String     @unique
  titleEn   String
  titleAr   String
  sortOrder Int        @default(0)
  items     MenuItem[]
}

model MenuItem {
  id          String      @id @default(cuid())
  sectionId   String
  section     MenuSection @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  slug        String      @unique
  nameEn      String
  nameAr      String
  descEn      String
  descAr      String
  priceUsd    Int         // USD cents, authoritative
  allergens   String[]    // allowed: gluten dairy nuts shellfish fish egg
  dietTags    String[]    // allowed: vegetarian vegan gf pescatarian
  isSignature Boolean     @default(false)
  isSoldOut   Boolean     @default(false)
  imageUrl    String?
  sortOrder   Int         @default(0)
}

model Reservation {
  id          String            @id @default(cuid())
  name        String
  phone       String
  partySize   Int               // 1–12
  slot        DateTime          // slot start, 30-min grid, stored UTC
  tableNumber Int               // 1–12, assigned transactionally
  status      ReservationStatus @default(PENDING)
  locale      Locale
  createdAt   DateTime          @default(now())
  @@unique([slot, tableNumber]) // hard double-booking guard
  @@unique([phone, slot])       // double-submit guard
  @@index([slot])
}

model Inquiry {
  id            String      @id @default(cuid())
  type          InquiryType
  name          String
  phone         String
  preferredDate DateTime?
  partySize     Int?
  message       String
  locale        Locale
  createdAt     DateTime    @default(now())
}

model GalleryItem {
  id         String @id @default(cuid())
  titleEn    String
  titleAr    String
  captionEn  String
  captionAr  String
  imageUrl   String
  width      Int
  height     Int
  collection String
  sortOrder  Int    @default(0)
}
```

### 6.2 Capacity & slot model (constants — mirror in `src/lib/venue.ts`)

- Service: **Tue–Sun, closed Monday**; bookable dinner slots **18:00–22:30 local every 30 min (10 slots/day)** — last seating 22:30 precedes the kitchen's 22:45 last order; the room closes 23:30.
- Timezone: **Asia/Damascus, fixed UTC+3, no DST** [RECALL-verify at build]; slots stored as UTC instants of Damascus-local times.
- Capacity: **12 tables per slot**; booking horizon: today → +60 days; past slots rejected.
- Party 1–12; party >12 → the UI routes to private-dining inquiry (never a rejected dead-end).

### 6.3 Transactional booking (R4 — Critical; the ONLY accepted pattern)

```ts
await prisma.$transaction(async (tx) => {
  const taken = await tx.reservation.findMany({
    where: { slot, status: { in: ["PENDING", "CONFIRMED"] } },
    select: { tableNumber: true },
  });
  const free = TABLES.filter((t) => !taken.some((r) => r.tableNumber === t)); // TABLES = [1..12]
  if (free.length === 0) throw new SlotFullError();   // handler-defined error class
  return tx.reservation.create({ data: {
    name: input.name,
    phone: input.phone.replace(/[\s-]/g, ""),  // normalize BEFORE the unique guard
    partySize: input.partySize, slot: input.slot,
    locale: input.locale.toUpperCase(),          // wire "en|ar" → enum EN|AR
    tableNumber: free[0],
  } });
});
// P2002 on [slot,tableNumber] → 409 SLOT_FULL · on [phone,slot] → 409 DUPLICATE
```

### 6.4 Seed (T0.4 — deterministic, `prisma/seed.ts`)

Menu seed = **the §7.5 menu tables verbatim** (28 items, 6 sections, bilingual, cents, allergens/diet as listed) with edge flags: `poached-pear` `isSoldOut: true` · exactly 3 `isSignature: true` (sourdough-butter, ribeye-for-two, dark-chocolate-tart) · every allergen value and diet tag covered at least once · gallery seed = §7.7 (8 items) · 12 seeded reservations filling ONE future slot (distinct phones, tables 1–12). **Image paths are contract (COMPLETE list — nothing outside it ships):** `/img/hero/poster.avif` · `/img/journey/act-{1,2,3}.avif` · `/img/story/night.avif` (§4.4 full-bleed) · `/img/404/night-mini.avif` (404 + global-error) · `/img/og/og-image-{en,ar}.avif` (1200×630, per locale) · `/img/menu/<slug>.avif` (signature dishes only) · `/img/gallery/<collection>-<n>.avif` (n = global item index 1–8, §7.7 order) — the T0.4 seed stores these paths; T3.2 creates the files at exactly these paths; a missing file renders the designed image-fail state (§6.6). **Intrinsic dims (contract):** journey `act-{1,2,3}` and `story/night` = 2560×1440 (16:9); `404/night-mini` = 1080×1350 (4:5); OG = 1200×630; the 750/1080/1600/2560 ladder preserves each source's aspect. **Demo slot (deterministic):** the 12 seed reservations fill the first Tue–Sun date ≥7 days ahead at 19:00 local, computed + logged by the seed script; E2E scripts select their own fresh empty slots (never the demo slot); the §8.3 availability JSON is illustrative, not seed state.

### 6.5 Sample rows (3–5 realistic JSON — shape reference)

```json
{"slug":"ribeye-for-two","sectionId":"…mains","nameEn":"MIRADOR ribeye for two","descEn":"Embered bone marrow, sea salt, smoked butter","nameAr":"ريباي ميرادور لشخصين","descAr":"نخاع على الجمر، ملح البحر، زبدة مدخّنة","priceUsd":8900,"allergens":["dairy"],"dietTags":["gf"],"isSignature":true,"isSoldOut":false,"sortOrder":3}
{"name":"Layal Haddad","phone":"+9639551234567","partySize":2,"slot":"2026-10-02T15:00:00.000Z","tableNumber":7,"status":"PENDING","locale":"AR"}
{"type":"PRIVATE_DINING","name":"Rami Safi","phone":"+963 944 555 221","preferredDate":"2026-11-14T18:00:00.000Z","partySize":16,"message":"Corporate dinner, one long table, non-smoking.","locale":"EN"}
```

### 6.6 Edge states (every entity — the state matrix T3.3 must cover)

`MenuSection` empty → hidden (never a stub heading) · `MenuItem` sold-out → disabled state, never hidden · `Reservation` full slot → 409 + sold-out UI; invalid phone → 400 field error; duplicate submit → 409 DUPLICATE; past slot / >60d → 400 · `Inquiry` per-field validation errors; honeypot filled → fake 201, no row · `GalleryItem` image fail → graceful bilingual caption card.

> **AR (§6):** مخطط Prisma حرفي؛ سعة 12 طاولة/فترة (18:00–22:30)؛ حجز بمعاملة وقيدي تفرد؛ بذور = قائمة §7.5 + صفوف حدية؛ ولكل كيان حالاته الحدية.

## 7. Content (real bilingual copy — VERBATIM build inputs; placeholder = defect)

### 7.0 Voice & policy

Voice: concrete nouns, numbers, times, named dishes. **Banned copy wordlist (grep gate G1, zero hits):** seamlessly · supercharge · unlock · elevate · effortlessly · game-changing · cutting-edge · best-in-class · world-class. Menu descriptions ≤12 words EN / ≤9 words AR. No testimonials/reviews/press anywhere (NEVER-9). Every image/text is an authored realistic sample; every replaceable asset is registered in `ASSETS-REPLACE.md` (columns: path · what · why · replace-with). Banned placeholder tokens (grep gate G5): lorem · Acme · test@example.

### 7.1 Navigation & chrome (per locale)

| | EN | AR |
|---|---|---|
| Nav links | Home · Menu · Story · Gallery · Private Dining · Contact | الرئيسية · القائمة · الحكاية · المعرض · الطاولة الخاصة · اتصل بنا |
| Nav CTA | Reserve a table | احجز طاولتك |
| Locale switch | العربية / English | English / العربية |
| Footer legal | © 2026 MIRADOR — Damascus | © 2026 ميرادور — دمشق |

### 7.2 Hero (locked)

- **Wordmark lockup:** `MIRADOR` × `ميرادور`
- **EN:** "Above the city, a table worth the climb." — CTA: "Reserve a table" · quiet link: "The menu"
- **AR:** «فوق المدينة، مائدة تستحقّ الصعود.» — CTA: «احجز طاولتك» · quiet link: «القائمة»

### 7.3 Home chapter intro (editorial paragraph)

- **EN:** "MIRADOR sits six floors above Damascus — one dining room, one long window, and a kitchen that answers to fire. We serve an international table: French technique, Mediterranean produce, no shortcuts. Below you, the city; above it, you."
- **AR:** «يجلس «ميرادور» في الطابق السادس فوق دمشق: قاعة واحدة، نافذة ممتدة، ومطبخ يستجيب للنار. نقدّم مائدة عالمية: تقنية فرنسية، ومنتجات متوسطية، بلا اختصارات. تحتك المدينة، وفوقها أنت.»

### 7.4 Journey acts (≤25 words each — SSR truth, lives outside the timeline)

| Act | EN | AR |
|---|---|---|
| I — Dusk | "The city switches on, window by window. From up here, its lights read as embers." | «تُشعل المدينة أنوارها نافذةً نافذة. من هنا تبدو أنوارها جمراً.» |
| II — Fire | "In the kitchen, fire does the quiet work — a slow braise, a hissing plancha, patience." | «في المطبخ تقوم النار بالعمل الهادئ: طهيٌ بطيء، وصفيحة تزمجر، وصبر.» |
| III — The Table | "Six floors above the street, one table holds the whole skyline. Yours for the evening." | «ستة طوابق فوق الشارع، مائدة واحدة تحتضن الأفق كله. لك هذا المساء.» |

**ReserveBand:** EN "The table is set." / sub "Reserve in under ninety seconds." · AR «المائدة جاهزة.» / «احجز في أقل من تسعين ثانية.»

### 7.5 The menu (28 items — seed verbatim; ★=signature · †=sold-out seed)

**S1 To Begin / «للبدء»** — slug `to-begin`

| slug | EN name — desc | AR name — desc | ¢ | allergens | diet |
|---|---|---|---|---|---|
| oysters | Oysters — champagne mignonette, shallot, lemon | محار — صلصة شامبانيا، ثوم معمر، ليمون | 1800 | shellfish | pescatarian |
| beef-tartare | Beef tartare — smoked yolk, capers, rye | طرتار اللحم — صفار مدخّن، كبر، خبز الجاودار | 2200 | egg, gluten | — |
| yellowtail-crudo | Yellowtail crudo — blood orange, fennel | كرودو السمك الأصفر — برتقال دموي، شمر | 2100 | fish | pescatarian, gf |
| bone-marrow | Roasted bone marrow — parsley, lemon, toast | نخاع العظم المشوي — بقدونس، ليمون، خبز محمّص | 1900 | gluten | — |
| chilled-vichyssoise | Chilled vichyssoise — chive oil | فيشيسواز بارد — ثوم معمر | 1400 | dairy | vegetarian, gf |

**S2 Bread & Butter / «الخبز والزبدة»** — slug `bread-butter`

| slug | EN name — desc | AR name — desc | ¢ | allergens | diet |
|---|---|---|---|---|---|
| sourdough-butter ★ | Sourdough — cultured butter, sea salt | خبز حمّض — زبدة مخمّرة، ملح البحر | 900 | gluten, dairy | vegetarian |
| focaccia | Focaccia — rosemary, olive oil | فوكاتشا — إكليل الجبل، زيت زيتون | 800 | gluten | vegan |
| rye-praline | Rye — hazelnut praline butter | خبز جاودار — زبدة البرالينيه بالبندق | 1000 | gluten, dairy, nuts | vegetarian |
| marrow-butter-toast | Grilled country bread — bone marrow butter | خبز ريفي مشوي — زبدة نخاع العظم، ثوم | 1100 | gluten, dairy | — |

**S3 From the Hearth / «من الموقد»** — slug `from-the-hearth`

| slug | EN name — desc | AR name — desc | ¢ | allergens | diet |
|---|---|---|---|---|---|
| charred-leeks | Charred leeks — romesco, toasted almond | كرّاث محمّر — رومسكو، لوز محمّص | 1600 | nuts | vegan, gf |
| roasted-beetroot | Roasted beetroot — whipped goat cheese | شمندر مشوي — جبن ماعز مخفوق، عسل | 1500 | dairy | vegetarian, gf |
| grilled-octopus | Grilled octopus — smoked paprika, potato | أخطبوط مشوي — بابريكا مدخّنة، بطاطا، ليمون | 2400 | shellfish | gf |
| whole-sea-bream | Whole sea bream — charred lemon, herbs | قاروص كامل — ليمون محمّر، زيت زيتون | 3200 | fish | pescatarian, gf |
| dry-aged-duck | Dry-aged duck breast — cherry jus | صدر بطة معتّق — مرق كرز، شمندر | 2900 | — | gf |

**S4 Mains / «الأطباق الرئيسية»** — slug `mains`

| slug | EN name — desc | AR name — desc | ¢ | allergens | diet |
|---|---|---|---|---|---|
| braised-short-rib | Slow-braised short rib — celeriac, juniper | ضلع بقري مطهو ببطء — كرفس، جونيبر | 3400 | dairy | gf |
| dover-sole | Dover sole — brown butter, capers | سول دوفر — زبدة بنية، كبر، ليمون | 3800 | fish, dairy | pescatarian, gf |
| ribeye-for-two ★ | MIRADOR ribeye for two — embered bone marrow, sea salt, smoked butter | ريباي ميرادور لشخصين — نخاع على الجمر، ملح البحر، زبدة مدخّنة | 8900 | dairy | gf |
| wild-mushroom-risotto | Wild mushroom risotto — aged parmesan, truffle oil | ريزوتو الفطر البري — بارميزان معتّق، زيت كمأة | 2600 | dairy | vegetarian, gf |
| corn-fed-chicken | Corn-fed chicken — burnt lemon pan sauce | دجاج بذرة الذرة — صلصة ليمون محروق | 2800 | dairy | gf |

**S5 Sides / «الجانبات»** — slug `sides`

| slug | EN name — desc | AR name — desc | ¢ | allergens | diet |
|---|---|---|---|---|---|
| hand-cut-fries | Hand-cut fries — rosemary salt | بطاطا مقطعة يدوياً — إكليل الجبل، ملح بحري | 800 | — | vegan, gf |
| charred-cabbage | Charred hispi cabbage — anchovy cream, lemon | ملفوف محمّر — كريمة الأنشوغة، ليمون | 900 | dairy, fish | — |
| triple-cooked-potatoes | Triple-cooked potatoes — chicken fat, garlic | بطاطا ثلاثية الطهي — دهن دجاج، ثوم، أعشاب | 900 | — | gf |
| wilted-spinach | Wilted spinach — garlic, chili | سبانخ — ثوم، فلفل حار، زيت زيتون | 700 | — | vegan, gf |

**S6 To Finish / «للختام»** — slug `to-finish`

| slug | EN name — desc | AR name — desc | ¢ | allergens | diet |
|---|---|---|---|---|---|
| dark-chocolate-tart ★ | Dark chocolate tart — olive oil, sea salt | تارت الشوكولاتة الداكنة — زيت زيتون، ملح البحر | 1200 | gluten, dairy, egg | vegetarian |
| basque-cheesecake | Burnt Basque cheesecake — caramel, cream | تشيز كيك باسكي محروق — كراميل، كريمة | 1100 | gluten, dairy, egg | vegetarian |
| poached-pear † | Poached pear — elderflower, almond | كمثرى مسلوقة — زهر الخميلة، لوز | 1000 | nuts | vegetarian, gf |
| creme-brulee | Crème brûlée — vanilla, hard caramel | كريم بروليه — فانيلا، كراميل هشّ | 1000 | dairy, egg | vegetarian, gf |
| cheese-board | Cheese board for two — five cheeses, honey | طبق أجبان لشخصين — خمسة أجبان، عسل، مكسرات | 1800 | dairy, nuts | vegetarian, gf |

**Menu footer notes (rendered once, both locales):**

- Currency: EN "Prices in SYP are indicative, converted at 12,500 SYP per USD and rounded to the nearest 500. USD prices are authoritative." · AR «الأسعار بالليرة السورية استرشادية، محسوبة بسعر 12,500 ل.س للدولار وتُقرَّب لأقرب 500. الأسعار بالدولار هي المرجع.»
- Halal: EN "The kitchen is halal — no pork, no alcohol." · AR «المطبخ حلال — لا لحم خنزير ولا كحول.»
- Sold-out label: EN "Sold out tonight" · AR «نفد لهذه الليلة» · Signature label: EN "Signature" · AR «توقيع».

**Price display rule (PriceTag):** EN `$28 · 350,000 SYP` · AR `28$ · 350,000 ل.س` — Western digits in both locales, thousands separators, SYP = `round(usd × 12500 / 500) × 500`.

### 7.6 Story page (3 chapters + pull-quote)

- **Ch1 "The Climb" / «الصعود»:** EN "There is no valet. There is a lift that takes its time, and a final flight of stairs where the noise of the street drops away with every step. By the last landing, the city is already below you — a field of small lights going about its evening. We chose the sixth floor for exactly this: the moment the doors open and the street turns into a view." · AR «لا صفَّ سيارات ولا مضيفين عند الرصيف. يوجد مصعد يتمهّل، وسلالم أخيرة تسقط معها ضوضاء الشارع درجةً درجة. وعند آخر بلاطة تكون المدينة قد صارت تحتك: حقل أنوار صغيرة يعيش مساءه. اخترنا الطابق السادس لهذا بالذات: لحظة تنفتح فيها الأبواب ويتحول الشارع إلى إطلالة.»
- **Ch2 "The Room" / «القاعة»:** EN "One room, forty seats, a single long window facing west. Materials are few and honest: darkened oak, brushed brass, linen. Light comes from low amber sources, as if the room itself were lit by the city below. Nothing on the walls — the skyline is the art." · AR «قاعة واحدة، أربعون مقعداً، ونافذة طويلة وحيدة تتجه غرباً. مواد قليلة وصادقة: سنديان معتّم، نحاس مصقول، كتان. الضوء يأتي من مصادر عنبرية منخفضة كأن القاعة مضاءة بالمدينة نفسها. لا شيء على الجدران — الأفق هو اللوحة.»
- **Ch3 "The Evening" / «المساء»:** EN "Service begins at six and ends when it ends. Courses leave the pass in their own order; the fire decides some of it. Ask for the ribeye for two and you will see why it needs the whole evening." · AR «تبدأ الخدمة في السادسة وتنتهي حين تنتهي. تغادر الأطباق ممر المطبخ بترتيبها الخاص، والنار تقرر بعضه. اطلب الريباي لشخصين وسترى لماذا يحتاج المساء كله.»
- **Pull-quote:** EN "We kept only what the night required." · AR «أبقينا فقط ما يحتاجه الليل.»

### 7.7 Gallery (8 items — bilingual captions; one grading grammar)

| collection | EN title — caption | AR title — caption | w×h |
|---|---|---|---|
| Skyline | "The City, Switched On" — dusk falling over the rooftops | «المدينة تُضاء» — الغسق يهبط فوق الأسطح | 2560×1440 |
| Skyline | "Long Exposure" — light trails below the sixth floor | «تعرّض طويل» — مسارات النور تحت الطابق السادس | 2560×1440 |
| Fire | "The Pass, 21:00" — mid-service choreography | «ممر المطبخ، 21:00» — تناغم منتصف الخدمة | 1080×1350 |
| Fire | "Embers" — the hearth between services | «جمر» — الموقد بين خدمتين | 1080×1350 |
| Plates | "A Single Place Set" — mise en place before opening | «غطاء واحد» — الترتيب قبل الافتتاح | 1080×1350 |
| Plates | "First Pour" — the opening course leaving the pass | «السكب الأول» — الطبق الأول يغادر المطبخ | 1080×1350 |
| Room | "Amber Glass" — the window at last light | «زجاج عنبري» — النافذة عند آخر ضوء | 1080×1350 |
| Room | "The Final Flight" — stairs to the sixth floor | «الدرج الأخير» — سلالم الطابق السادس | 1080×1350 |

### 7.8 Private dining + forms

- **Offer:** EN "One room. Twelve seats. A private skyline." body "The west end of the dining room detaches into a private table for twelve, with its own service and a standing menu from $65 per guest. For buyouts, tastings, and quiet celebrations, tell us the date — we will tell you what the kitchen can do." · AR «قاعة. اثنا عشر مقعداً. إطلالة خاصة.» + «تنفصل نهاية القاعة الغربية إلى مائدة خاصة لاثني عشر، بخدمة خاصة وقائمة ثابتة من 65$ للضيف. للحوازات الكاملة وجلسات التذوق والاحتفالات الهادئة، أخبرنا بالتاريخ — ونخبرك بما يستطيع المطبخ.»
- **Form labels (EN/AR):** Name / الاسم · Phone / الهاتف · Preferred date / التاريخ المفضل · Party size / عدد الضيوف · Message / الرسالة · Submit: "Send inquiry" / «أرسل الاستفسار».
- **Field error pattern:** EN "Please use a valid phone number." · AR «يرجى إدخال رقم هاتف صحيح.» — per-field, inline, RTL-correct placement.
- **Success:** EN "Inquiry received. We reply within one business day — or reach us now on WhatsApp." · AR «وصل استفسارك. نرد خلال يوم عمل واحد — أو تواصل معنا الآن عبر واتساب.»

### 7.9 404 · global-error · confirmation

- **404:** EN "This floor doesn't exist." sub "The view you want is six floors up." CTA "Back to the ground floor". · AR «هذا الطابق غير موجود.» «الإطلالة التي تريدها في الطابق السادس.» CTA «عد إلى الطابق الأرضي».
- **global-error:** EN "The lights flickered." sub "Something failed on our side. Reload — the city is still there." · AR «ارتجّ الضوء لحظة.» «خطأ من جهتنا. أعد التحميل — المدينة ما تزال هناك.»
- **Confirmation:** EN "The table is yours." + WhatsApp CTA "Confirm on WhatsApp" + note "We hold your table for 15 minutes past the time." · AR «الطاولة لك.» + «أكّد عبر واتساب» + «نحفظ طاولتك لخمس عشرة دقيقة بعد الموعد.»

### 7.10 Venue constants (`src/lib/venue.ts` — fictional per A5, registered in ASSETS-REPLACE.md)

```ts
export const VENUE = {
  nameEn: "MIRADOR", nameAr: "ميرادور",
  addressEn: "Level 6, Lighthouse Tower, Abu Rummaneh Street, Damascus, Syria",
  addressAr: "الطابق السادس، برج المنارة، شارع أبو رمانة، دمشق، سوريا",
  phone: "+963 11 341 7700",            // tel:+963113417700
  whatsappNumber: "963955000111",        // wa.me/963955000111
  email: "reservations@miradordamascus.com",
  hoursEn: "Tuesday – Sunday, 18:00 – 23:30 · kitchen last order 22:45 · closed Monday",
  hoursAr: "الثلاثاء – الأحد، 18:00 – 23:30 · آخر طلب للمطبخ 22:45 · مغلق يوم الاثنين",
  sypPerUsd: 12500, sypRounding: 500,
  tablesPerSlot: 12, slotMinutes: 30, bookingHorizonDays: 60,
} as const;
```

The WhatsApp number resolves as `process.env.WHATSAPP_NUMBER ?? VENUE.whatsappNumber` — env overrides, the constant is the default: one source of truth in code.

### 7.11 Content-source table (placeholder policy: never ship)

| Content | Source | Replaceable via |
|---|---|---|
| All copy §7.1–§7.9 | authored in this brief (realistic sample) | `content/` locale files + `docs/copy-parity.md` |
| Venue constants §7.10 | fictional (A5) | `src/lib/venue.ts` |
| All images | sourced placeholders, art-directed to the grading grammar (A2) | repo-root `ASSETS-REPLACE.md` |
| Menu data | authored sample (D2) | seed + DB |
| Font binaries (4 families) | official OFL releases (google/fonts GitHub) | `app/fonts/` — subsetting via pyftsubset/glyphhanger, AR unicode-range splits |
| Placeholder photos | free-license stock (Unsplash/Pexels), night-city/amber subjects, re-graded to the grammar | `ASSETS-REPLACE.md` rows incl. source URL + license |

**Content files (created T0.6):** `content/en.json` + `content/ar.json`, flat `{ "key": "string" }`, key namespaces `nav.* · hero.* · acts.* · band.* · menu.notes.* · forms.* · errors.* · confirm.* · contact.* · meta.404 · meta.error` — seeded with §7 verbatim; T3.1 audits parity into `docs/copy-parity.md`.

> **AR (§7):** المحتوى ثنائي اللغة كاملاً هنا: قائمة 28 طبقاً بأسعار مزدوجة، حكاية، معرض، طاولة خاصة، و404 وتأكيد؛ وثوائق المقر الوهمية بملف واحد مسجّل؛ ولا عناصر مؤقتة تُشحن أبداً.

## 8. API & integrations (3 endpoints · Zod-validated · rate-limited)

### 8.1 Route table (freeze at T0.5 as `docs/api-route-table.md`)

| METHOD | Path | Purpose | Auth | Success | Errors | Rate limit |
|---|---|---|---|---|---|---|
| GET | `/api/availability?date=YYYY-MM-DD` | slots + remaining for a date | none | 200 | 400 (bad date) · 429 | 30/min/IP (read-only) |
| POST | `/api/reservations` | create reservation (transactional) | none | 201 | 400 · 409 SLOT_FULL · 409 DUPLICATE · 429 | 5/min/IP (shared POST bucket) |
| POST | `/api/inquiries` | persist private-dining/general inquiry | none | 201 | 400 · 429 | 5/min/IP (shared POST bucket) |

### 8.2 Zod schemas (verbatim — `src/lib/validation.ts`)

```ts
import { z } from "zod";

export const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).refine((v) => { const d = new Date(v.date + "T00:00:00Z"); return !Number.isNaN(d.getTime()); });

export const reservationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^\+?[0-9][0-9\s-]{6,18}$/),
  partySize: z.number().int().min(1).max(12),
  slot: z.string().datetime(),
  locale: z.enum(["en", "ar"]),
}).refine((v) => {           // slot sanity: on the 30-min grid, not past, ≤60 days ahead
  const t = new Date(v.slot).getTime();
  const okGrid = new Date(v.slot).getUTCMinutes() % 30 === 0 && new Date(v.slot).getUTCSeconds() === 0;
  return okGrid && t > Date.now() && t < Date.now() + 60 * 24 * 3600 * 1000;
});

export const inquirySchema = z.object({
  type: z.enum(["PRIVATE_DINING", "GENERAL"]),
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^\+?[0-9][0-9\s-]{6,18}$/),
  preferredDate: z.string().datetime().optional(),
  partySize: z.number().int().min(1).max(60).optional(),
  message: z.string().trim().min(10).max(1000),
  locale: z.enum(["en", "ar"]),
  website: z.string().max(200).optional(),  // honeypot — lenient in schema; HANDLER fakes 201 when non-empty
});
```

**Slot-day validation (server, beyond Zod):** the slot's Damascus-local date must fall on Tue–Sun within the horizon; Monday slots → 400. **Wire→DB mapping:** handlers map wire `en|ar` (Zod) to Prisma enum `EN|AR` and normalize the phone (`replace(/[\s-]/g, "")`) before insert + duplicate check. **Honeypot ruling:** a non-empty `website` field short-circuits BEFORE persistence — return the normal 201 shape with a fake id, create no row (F8-4).

### 8.3 Example request/response (per endpoint class)

```jsonc
// GET /api/availability?date=2026-10-02            → 200
{ "date": "2026-10-02",
  "slots": [ { "time": "18:00", "remaining": 12 },
             { "time": "18:30", "remaining": 11 },
             { "time": "19:00", "remaining": 0 } ] }   // illustrative, not seed state; remaining 0 ⇒ sold-out

// POST /api/reservations                            → 201
// req:  { "name": "Layal Haddad", "phone": "+963 955 123 4567",
//         "partySize": 2, "slot": "2026-10-02T15:00:00.000Z", "locale": "ar" }
{ "id": "cmabcdef123", "tableNumber": 7, "slot": "2026-10-02T15:00:00.000Z",
  "whatsappUrl": "https://wa.me/963955000111?text=..." }

// POST /api/reservations (full slot)                → 409
{ "error": "SLOT_FULL", "messageKey": "slotFull" }   // messageKey → locale file key

// POST /api/inquiries                               → 201
{ "id": "cmghijkl456" }
```

Validation errors: 400 `{ "error": "VALIDATION", "fields": { "phone": ["invalid_phone"] } }` — field keys map to locale files, rendered per-field inline.
Rate limit: 429 `{ "error": "RATE_LIMITED", "retryAfter": 42 }` + `Retry-After: 42` header.

### 8.4 Rate limiter + WhatsApp integration briefs

**Rate limiter (normative semantics: in-memory sliding 60s window per IP — timestamps array; this wording overrides any "bucket" phrasing):** the two POST routes share one limit — the 6th POST inside any 60s window → 429; `GET /api/availability` has its own 30-per-60s limit (browsing several dates inside the <90s flow never trips the write limit). 429 body `{ "error": "RATE_LIMITED", "retryAfter": <s> }` + `Retry-After` + `X-RateLimit-Remaining`. **IP derivation:** first hop of `x-forwarded-for`, falling back to `x-real-ip` (proxy assumption documented in AGENTS.md). **Test isolation (sanctioned):** the `capacity-*` / `ratelimit` / `dupguard` E2E scripts set `E2E_RATE_LIMIT=off` for the capacity/race cases — the limiter no-ops under this env flag, and the flag is ignored when `NODE_ENV=production` (boot-guard). Single-instance v1; NEVER a security boundary — the unique constraints are the booking-safety layer. Local PostgreSQL required for dev/verification (README setup; no managed DB in v1).

**WhatsApp (no SDK — deep links only):** `https://wa.me/${VENUE.whatsappNumber}?text=${encodeURIComponent(msg)}`. Prefilled confirmation message:
- EN: `Hello MIRADOR — confirming my reservation: ${name}, ${partySize} guests, ${date} at ${time} (ref ${id.slice(-6)}).`
- AR: `مرحباً ميرادور — أؤكد حجزي: ${name}، ${partySize} ضيوف، ${date} الساعة ${time} (رقم ${id.slice(-6)}).`
- General CTA message — EN: `Hello MIRADOR — I would like to ask about a table.` · AR: `مرحباً ميرادور — أودّ الاستفسار عن مائدة.`

**Env vars (`.env.example`, committed):**
```
DATABASE_URL="postgresql://user:pass@localhost:5432/mirador"
WHATSAPP_NUMBER="963955000111"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```
No other externals. No secret ever reaches client bundles (grep the build output — zero hits).

> **AR (§8):** ثلاث نقاط API بتحقق Zod حرفي وأمثلة طلب/استجابة لكل صنف؛ محدد المعدل: 5/دقيقة/IP للمسارين الكاتبين و30/دقيقة للقراءة؛ تكامل واتساب بروابط عميقة فقط؛ وثلاث متغيرات بيئية — لا أسرار في حزم العميل.

---

## 9. Acceptance criteria (binary · one criterion per line · every line names its check)

Task-level AC cap is 3–7 for feature tasks (contract-layer tasks T0.x / T0.5 may carry fewer); feature sets aggregate 3–8 (both Appendix A); T1.3's F4 set partitions 3+3+2 across its sub-diffs. **Canonical route enumeration for every AC below — 8 routable paths:** home · menu · reserve · confirmation · story · gallery · private-dining · contact (the "7 primary pages" = all but confirmation). Scripts named in checks live under `tests/e2e/` + `scripts/audit-*` — builder-authored artifacts whose expected outcomes are fixed by this section.

### F1 — i18n & dual-script fonts

- F1-1 Every public route serves `/en/...` and `/ar/...` with correct `<html lang>` + `dir` — check: Playwright `i18n-pair`.
- F1-2 Every page emits hreflang alternates for `en` + `ar` + `x-default` — check: saved-HTML grep ≥3 per route.
- F1-3 Locale switch performs an atomic `dir`+`lang` flip on `<html>` (both change in the same frame) with no full navigation — check: Playwright `locale-atomic`.
- F1-4 AR font weight payload ≤60KB (sum of its unicode-range files) — check: `pnpm audit:fonts` report in evidence.
- F1-5 LTR/RTL screenshot pair per route at 375/768/1440 — check: evidence count ≥2 per route×viewport.

### F2 — token contract

- F2-1 `@theme` holds every §5.2 color, §5.3 font var, §5.4 spacing/radius with exact §5 names+values — check: `pnpm audit:tokens` diff vs §5.
- F2-2 Zero raw hex/oklch color literals outside `globals.css` — check: grep gate G2 = 0 hits.
- F2-3 Zero arbitrary spacing utilities — check: grep gate G3 = 0 hits.
- F2-4 Zero ad-hoc radii (`rounded-[...]`) — check: grep gate G4 = 0 hits.
- F2-5 `tailwind.config.js` absent from the repo — check: file-not-exists assertion in the battery.

### F3 — menu & data

- F3-1 migrate + seed green: 5 entities · 6 sections × 4–6 = 28 dishes · 8 gallery items — check: seed count query in evidence.
- F3-2 Menu SSRs dish names in production HTML without JS — check: `curl` + grep.
- F3-3 ≤7 dishes visible per section — check: Playwright per-section DOM count.
- F3-4 Sold-out item renders a disabled row with the bilingual sold-out label — check: screenshot `menu--soldout--768.png` + DOM assert.
- F3-5 Diet filter announces counts via `aria-live`, animates via gsap Flip — check: keyboard log + screenshot pair.
- F3-6 Every dish row shows dual price matching the §7.5 formatting rule — check: DOM regex `\$[0-9]+` + `SYP|ل.س` per row.
- F3-7 Dish overlay: focus trap, Esc closes, allergen table exposed — check: axe + keyboard walkthrough.

### F4 — booking walking skeleton (R4 Critical)

- F4-1 Reserve page contains exactly 3 input fields + 1 slot picker — check: Playwright control count.
- F4-2 Slot picker loads live availability; `remaining: 0` renders disabled — check: network log + DOM assert.
- F4-3 Sequential overflow: 13th request on a 12-capacity slot → HTTP 409 `SLOT_FULL` (test isolation per §8.4) — check: E2E `capacity-sequential`.
- F4-4 Race safety: 20 parallel POSTs to one empty slot → exactly 12 rows, 8 × 409 (test isolation per §8.4) — check: E2E `capacity-race`.
- F4-5 Reservation persists (locale + PENDING); confirmation renders summary — check: DB query + screenshot.
- F4-6 Confirmation WhatsApp link encodes name, party, date, time, ref — check: href regex + decode assert.
- F4-7 6th reservation POST within 60s from one IP → 429 with `Retry-After` — check: E2E `ratelimit`.
- F4-8 Same phone+slot resubmission → 409 `DUPLICATE`, no second row — check: E2E `dupguard` + DB count.

### F5 — journey (signature)

- F5-1 The journey scrubs horizontally through acts Dusk → Fire → The Table under pinned scroll — check: Playwright scroll script.
- F5-2 `/ar` journey mirrors direction (RTL track) — check: mirrored translate assertion + LTR/RTL screenshot pair.
- F5-3 `prefers-reduced-motion` renders the static 3-act layout, all copy present — check: Playwright RM emulation screenshot.
- F5-4 All act copy present in raw SSR HTML — check: `curl` grep for the three act strings.

### F6 — WebGL moment (kill-switched)

- F6-1 The LCP element on `/en` and `/ar` home is the hero poster image — check: Lighthouse CI LCP-element label (perf trace).
- F6-2 The three.js chunk loads only after the journey intersects the viewport — check: Playwright network log.
- F6-3 The lazy chunk ≤400KB gz — check: build output size table row.
- F6-4 Kill-switch: `?webgl=off` → poster treatment, canvas unmounted — check: Playwright `webgl-kill` (+ auto-path emulation run).
- F6-5 At most one `<canvas>` per route site-wide — check: DOM query assertion per route.

### F7 — gallery

- F7-1 Lightbox fully keyboard-operable with focus trap — check: keyboard walkthrough log.
- F7-2 Below-fold gallery images are not fetched before scroll — check: Playwright network lazy assertion.
- F7-3 Captions render per locale from §7.7 — check: per-locale DOM snapshot.
- F7-4 Image-fail renders the bilingual caption card (no empty box) — check: forced-fail emulation screenshot.

### F8 — story · private dining · contact · inquiries

- F8-1 Story renders the 3 chapters + 1 pull-quote structure — check: DOM count assertions.
- F8-2 AR body text computes `line-height` ≥1.7 + `letter-spacing` 0 — check: `typo-ar` computed-style script.
- F8-3 Empty inquiry submit shows per-field bilingual errors, RTL-correct — check: E2E + screenshot.
- F8-4 Honeypot-filled inquiry returns 201 but creates no row — check: E2E `honeypot` + DB count.
- F8-5 A `wa.me` CTA link exists on every one of the 8 routable paths — check: per-path rendered-HTML grep.
- F8-6 Contact renders hours/address/phone/email exactly from `src/lib/venue.ts` — check: DOM-vs-constants diff script.

### F9 — authored bilingual copy

- F9-1 Banned wordlist zero hits in rendered copy — check: grep gate G1 = 0.
- F9-2 Zero lorem/Acme/test@example anywhere — check: grep gate G5 = 0.
- F9-3 Zero testimonial/review/press/awards sections — check: rendered-HTML grep + review sheet.
- F9-4 Menu descriptions ≤12 words EN / ≤9 words AR — check: `pnpm audit:copy` word-count report.
- F9-5 `docs/copy-parity.md` lists every §7 UI string as an AR/EN pair — check: ≥60 rows.

### F10 — image plan

- F10-1 Hero poster: the mobile-served LCP variant (750w/1080w AVIF) ≤60KB; ladder steps 1600w/2560w ≤250KB each — check: asset size report.
- F10-2 AVIF ladder 750/1080/1600/2560 for hero + journey + story + gallery images (404 mini + OG sized per §6.4) — check: build output listing.
- F10-3 Every `public/` image registered in `ASSETS-REPLACE.md` — check: register rows == image count.
- F10-4 All photography shares the single night-cinematic grading grammar — check: reviewer sheet (held-out side).

### F11 — states & SEO

- F11-1 404 route renders the designed brand surface with HTTP 404 — check: `curl -i` + screenshot.
- F11-2 `global-error.tsx` renders the §7.9 copy — check: forced-error render screenshot.
- F11-3 State-matrix set covers: empty-section hidden · sold-out · reserve loading/error/success · image-fail — check: `evidence/F11/state-matrix/`.
- F11-4 JSON-LD Restaurant + Menu validate with zero errors — check: schema validator output in evidence.
- F11-5 OG title/description/image render per locale — check: saved-HTML meta grep (both locales).

### F12 — release battery

- F12-1 Gate suite green: tsc 0 · eslint 0 warnings · build 0 errors · G1–G7 = 0 · Lighthouse CI (Appendix A) · axe 0/0 — check: CI log in evidence.
- F12-2 First-load JS ≤150KB gz per route (hard 200KB; home first-load excludes the lazy three chunk) — check: build size table.
- F12-3 Cold-start handoff: fresh clone + `pnpm i && pnpm migrate && pnpm seed && pnpm dev` runs clean — check: handoff log.
- F12-4 Every AC-ID has an evidence folder — check: `/evidence/<AC-ID>/` index script.
- F12-5 Zero console errors on all 8 paths × 2 locales — check: Playwright console capture.
- F12-6 No horizontal scroll at 375px on any route — check: Playwright `scrollWidth <= clientWidth` assert (Appendix A).
- F12-7 Interactive targets have effective size ≥44px — check: DOM probe battery (nav, filters, forms, lightbox).

> **AR (§9):** 65 معياراً ثنائياً على 12 ميزة، كل سطر يسمّي فحصه بأداة محددة؛ الحجز 8 معايير بينها سباق 20 طلباً متوازياً ينتج 12 صفاً بالضبط.

## 10. Verification loop (exact battery — run per task AND full at T4.1)

### 10.1 Deterministic gates (every round)

```
pnpm typecheck                           # tsc --noEmit · 0 errors
pnpm eslint . --max-warnings 0           # 0 warnings
pnpm build                               # production, 0 errors, route size table captured

G1 wordlist   : rg -i "seamlessly|supercharge|unlock|elevate|effortlessly|game-changing|cutting-edge|best-in-class|world-class" app/ src/ content/  → 0 hits
G2 raw color  : rg -n "#[0-9a-fA-F]{3,8}\b" app/ src/ --glob '!**/*.css'  → 0 hits
G3 arbritrary : rg -n "\b[mp][trblxy]?-\[[0-9]" app/ src/  → 0 hits
G4 ad-hoc radi: rg -n "rounded-\[" app/ src/  → 0 hits
G5 placeholder: rg -i "lorem|acme|test@example" --glob '!node_modules' --glob '!.next' .  → 0 hits
G6 2nd runtime: rg "framer-motion|from \"motion\"" package.json  → 0 hits
G7 transition : rg -n "transition-all" app/ src/  → 0 hits
```

All scripts/configs named here and below (`audit:*`, E2E specs, `lighthouserc`, `playwright.config.ts`) are builder-authored project artifacts (T0.1 stubs → T4.1 complete) with expected outcomes frozen by §9 — once frozen, read-only (NEVER-14).

### 10.2 Screenshot + E2E + perf + a11y battery

- Playwright, viewports **375 / 768 / 1440**, both locales (LTR/RTL), dark-only theme + one forced-colors pass per route. Naming `route--state--width.png` → `/evidence/<AC-ID>/`; diff tolerance ≤1% vs frozen baselines (human-approved — you NEVER edit them).
- E2E on the production build: `capacity-sequential` · `capacity-race` (20 parallel POSTs) · `ratelimit` · `dupguard` · `honeypot` · `locale-atomic` · `webgl-kill` · booking happy path (<90s, measured) · inquiry happy path.
- Lighthouse CI (mobile, prod build, 3 runs, median): **≥90 · LCP ≤2.5s · CLS ≤0.1 · TBT ≤300ms** (Appendix A).
- axe per route × viewport: **0 critical + 0 serious**; keyboard walkthrough per interactive route.
- Contrast 4.5:1 body · 3:1 large text + non-text UI — measured pairs only (tool JSON is ground truth; eyeballed contrast is inadmissible).
- Field INP (Appendix A) is a post-launch field metric — v1 ships no RUM (out of scope §3.2), so lab TBT is the v1 proxy; INP applies once field analytics exist.

### 10.3 Loop control

≤3 self-retries per failing task · ≤3 fix rounds per finding · then BLOCKED. Full deterministic suite re-runs every round. When every AC passes → STOP (§12.1).

### 10.4 Held-out notice (anti-gaming)

A reviewer-owned test subset exists OUTSIDE your write scope and is re-run read-only at acceptance. You never see its contents. You NEVER edit tests, thresholds, baselines, or gate configs — a diff on those files is automatic REVISE.

### 10.5 Message protocol (the only five messages you send)

**ACK · STATUS · DONE · BLOCKED · QUESTION** — numbered facts + paths, ≤15 lines each. BLOCKED anatomy: `condition → hypothesis → attempts (≤3) → options → default → the exact question`. STATUS = task-id + state + evidence path. DONE = matrix (§12.2) + paths.

> **AR (§10):** البطارية: بوابات حتمية وgrep ولقطات قياسية في /evidence/<AC-ID>/؛ Lighthouse بعتبات الملحق أ؛ axe صفر حرج/خطير؛ خمس رسائل نمطية؛ ≤3 محاولات ثم ≤3 دورات ثم BLOCKED؛ وفحوص محجوزة للمراجع لا يراها الباني.

---

## 11. NEVER rules (15 · each paired with its ALWAYS · defect signature)

| # | NEVER | ALWAYS | Defect signature |
|---|---|---|---|
| 1 | Build anything from §3.2 (payments, admin, auth, lite tier, …) | Treat every §3.2 item as "do NOT build", labeled | scope creep — unlabeled phase-2 got built |
| 2 | `pages/`, `getServerSideProps`, `getStaticProps`, `next/head` | App Router `app/` + route handlers + metadata API | era-drift architecture |
| 3 | `tailwind.config.js` / CSS-in-JS theming / untouched shadcn defaults | `@theme` in `globals.css` from §5 verbatim | token drift → default slop theme |
| 4 | Raw hex/oklch in `app/` `src/` components | Token utilities + CSS vars only | grep-flag Major (G2) |
| 5 | framer-motion / any second animation runtime / `transition-all` | GSAP + Lenis pack (§2.1) with `src/lib/motion.ts` constants | doubled runtime bytes + jank |
| 6 | `<img>` tags | `next/image` with the §F10-2 AVIF ladder | LCP breach (R5) |
| 7 | `<video>` / autoplay media anywhere in v1 | Poster-first AVIF, motion via GSAP | data-cost cliff on Syrian mobile (R5) |
| 8 | Ship lorem/Acme/test@example or empty stub sections | §7 copy verbatim + ASSETS-REPLACE registration | placeholder-ships (Major, R3) |
| 9 | Fabricate testimonials/reviews/press/awards/ratings | Ship v1 without any social-proof section (deleted by design) | fabricated trust — never acceptable |
| 10 | AR letter-spacing, ALL-CAPS, justified text, body line-height <1.7 | AR typography contract §5.3 | RTL breakage (Major, R2) |
| 11 | Physical directional CSS (`left:`, `margin-right:`) for layout | Logical properties (`inset-inline`, `margin-inline-start`) | RTL mirror failures (R2) |
| 12 | Check-then-write booking without transaction + unique guards | The §6.3 transactional pattern + `@@unique` constraints, verbatim | double-booking (Critical, R4) |
| 13 | Canvas as LCP element, three chunk in first-load, or unbounded particles | Poster-first LCP + lazy post-LCP mount + ≤6000 particles + kill-switch | perf cliff (Major, R1) |
| 14 | Edit FROZEN tests/thresholds/baselines/gate configs, or weaken any check, to make gates pass | Author checks to §9's fixed outcomes; report failures via BLOCKED | reward hacking → automatic REVISE |
| 15 | Banned copy words (§7.0 list) in any shipped string | Concrete nouns, numbers, times, named dishes | slop copy (G1 flag) |

---

## 12. Done definition (termination contract)

### 12.1 STOP rule

When every AC (§9, 65 criteria) passes with evidence → **STOP**. Gold-plating (unrequested extras) is a defect, returned for revert. All-AC-pass is the ONLY finish line; no partial credit — "mostly done" = NOT-DONE and ships as a blocker list.

### 12.2 Verification matrix (the DONE attachment)

```
AC-ID | check (command/script) | expected | actual | PASS/FAIL | evidence path (/evidence/<AC-ID>/…)
```
65 rows, one per §9 criterion, generated by running the §10 battery — never hand-written claims.

### 12.3 Delivery report + cold-start handoff artifacts (all committed)

`README.md` (verified run commands) · `AGENTS.md` (project DoD: tsc 0 · eslint 0-warnings · build green · tests green · console-clean · rate-limiter scale-out note) · `.env.example` · `prisma/migrations/` + `prisma/seed.ts` · `docs/versions.md` · `docs/api-route-table.md` · `docs/component-inventory.md` · `docs/copy-parity.md` · `ASSETS-REPLACE.md` · `tests/` (E2E specs) · `scripts/` (audit:*) · `lighthouserc` + `playwright.config.ts` · `ASSUMPTIONS.md` · the full `/evidence/` pack indexed by AC-ID.

### 12.4 Your first output — the ACK (≤15 lines, before any code)

```
ACK — mirador-site — brief v1.1
1. stack pins acknowledged (next 16.x · react 19.x · ts 5.x · tailwind 4.x · prisma 7.x · gsap 3.13.x · lenis 1.1.x · three pack) — exact versions resolve at T0.1 and are reported in the first STATUS
2. DAG accepted: 21 tasks, T0.1 → T4.1, one bounded diff each (lettered sub-diffs where a task owns >5 files)
3. inactive triggers confirmed inactive: payments · webhooks · uploads · auth · realtime · AR · PWA offline
4. standing assumptions A1–A5 loaded · new assumptions logged: <0 | ids>
5. concept locked: Direction B "Night Ribbon" · kill-switch target: Direction A poster treatment
6. first task started: T0.1
7. questions: none | <id — BLOCKER|ASSUMABLE — question>
```

---

## APPENDIX A — SHARED CONSTANTS (byte-identical mirror; verified by mechanical diff)

| Constant | Value |
|---|---|
| Viewports | 375 / 768 / 1440 |
| Screenshot naming | `route--state--width.png` |
| Responsive AC | no horizontal scroll at 375px |
| Screenshot diff tolerance | ≤1% pixels |
| Lab perf gates (mobile, prod build, 3 runs) | Lighthouse ≥90 · LCP ≤2.5s · CLS ≤0.1 · TBT ≤300ms |
| Field INP | ≤200ms at p75 (never quoted from lab) |
| A11y gate | axe 0 critical + 0 serious per route×viewport; keyboard walkthrough |
| Contrast | 4.5:1 body · 3:1 large text + non-text UI · both themes |
| Touch targets | effective ≥44px (WCAG floor 24×24) |
| AC per feature | 3–8, binary, each naming its check |
| Fix iterations | ≤3 self-retries · ≤3 fix rounds · then BLOCKED |
| Bounded task | ≤5 files · 3–7 AC · one commit |
| Route JS budget | ≤150KB gz (hard 200KB) marketing first-load |
| Brief token budget | 8–16K tokens (warn >20K, fail >25K) |
| NEVER registry cap | ≤15 entries paired with ALWAYS alternatives |
| Motion durations | ~100/200/350/600ms tokens · entrances ≤400ms · signature ≤600ms |
| Icon system | one family (Lucide), 16/20/24, one stroke rule |
| Evidence path | `/evidence/<AC-ID>/` |

**Dark-only note (disclosed once):** this project ships a single dark theme (§5.2), so the "both themes" contrast constant applies to that theme plus the forced-colors pass named in §10.2.

## APPENDIX B — Evidence labels

`[SPEC]` standards-based (WCAG/CWV/Tailwind docs) · `[CONSENSUS]` multi-agent convergence · `[RECALL]` version-sensitive — verify against the lockfile · `[HEURISTIC]` house default, overridable with justification on record · `[NEEDS-VERIFY]` unverified — excluded from rule bodies. Version-sensitive claims in this brief carry `[verify]`/`[pin-at-build]` and are resolved at T0.1.

---

**TERMINAL REMINDER (positional discipline — the middle rots first):** your first output is the ACK (§12.4), never code. You never edit tests/thresholds/baselines (NEVER-14). You never invent (rule zero, §1.2). All AC pass → STOP (§12.1). Evidence for everything: `/evidence/<AC-ID>/`.
