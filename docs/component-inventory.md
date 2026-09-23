# MIRADOR — component inventory (frozen at T0.5 + shipped additions)

Inventory per brief §4.9, mapped to shipped files. NEVER recreate inventoried
components. Route folders own their components; shared shells live under
`src/components/{layout,brand,home,menu,reserve,gallery,private}/`.

## Global shell
| Component | File | Notes |
|---|---|---|
| Nav | `src/components/layout/nav.tsx` | client · 6 links + CTA + locale switch + mobile Sheet (z-30) |
| MobileSheet | nav.tsx (Sheet) | keyboard-operable, RTL side-aware |
| LocaleSwitch | nav.tsx (mirroredPath Link) | atomic dir+lang flip, no reload (F1-3) |
| Footer | `src/components/layout/footer.tsx` | server · venue constants · mt-auto sticky |
| WordmarkLockup | `src/components/brand/wordmark-lockup.tsx` | MIRADOR × ميرادور, sm/md/xl |
| SmoothScroll | `src/components/layout/smooth-scroll.tsx` | Lenis+ScrollTrigger, RM-guarded (§2.4-C) |

## Home (§4.1)
| Hero | `src/components/home/hero.tsx` | poster LCP + lockup + CTA pair |
| ChapterIntro | `src/components/home/chapter-intro.tsx` | HUD + editorial paragraph |
| Journey + ActPanel ×3 | `src/components/home/journey.tsx` | pinned horizontal 3-act scrub + kill-switch + RM static fallback |
| SkylineCanvas (+kill-switch) | `src/components/home/skyline-canvas.tsx` | THE one WebGL moment, lazy chunk, ≤6000 particles |
| ReserveBand | `src/components/home/reserve-band.tsx` | title + sub + CTA pair + hours |

## Menu (§4.2)
| SectionNav | `src/components/menu/section-nav.tsx` | sticky z-10, 6 anchors, scroll-spy |
| DietFilterBar | `src/components/menu/diet-filter-bar.tsx` | 4 filters · gsap Flip · aria-live count |
| DishList/DishRow | `src/components/menu/dish-list.tsx` `dish-row.tsx` | SSR rows · sold-out disabled |
| DishOverlay | `src/components/menu/dish-overlay.tsx` | composes AtTheWindow (P-094) — the plate at the window: portrait master staged on the lower third, allergen table role=table as the view notes · Esc/focus-trap |
| PriceTag | `src/components/menu/price-tag.tsx` | dual price §7.5 rule |
| AllergenChips | `src/components/menu/allergen-chips.tsx` | hairline pills |

## Reserve + confirmation (§4.3)
| SlotPicker (DateStrip + TimeGrid) | `src/components/reserve/date-strip.tsx` `time-grid.tsx` | live availability · sold-out disabled |
| PartyStepper | `src/components/reserve/party-stepper.tsx` | 1–12 clamp · aria-live |
| FieldInput | `src/components/reserve/field-input.tsx` | hud label + inline error |
| ReservationSummary | `src/components/reserve/summary.tsx` | name/party/date/time/table — no phone echo |
| WhatsAppConfirm | confirmation page (waHref pill) | prefilled §8.4 message |

## Brand pages (§4.4–§4.7)
| Chapter + PullQuote | `src/components/../story/page.tsx` (inline) | HUD + H2 + max-w-[34rem] bodies |
| MasonryGrid | `src/components/gallery/gallery-grid.tsx` | CSS columns · lazy · fail cards · P-099 the observation deck (staggered altitudes by collection index + the bilingual sighting locution) |
| Lightbox | `src/components/gallery/lightbox.tsx` | composes AtTheWindow (P-094) — full-bleed night view · arrows/Esc · RTL-mirrored keys · counter |
| InquiryForm | `src/components/private/inquiry-form.tsx` | honeypot · per-field bilingual errors · success + reference |
| HoursTable / AddressBlock | `src/components/../contact/page.tsx` (inline) | venue.ts verbatim (F8-6) |

## States & errors (§4.8)
| Error404 | `src/app/[locale]/not-found.tsx` | designed brand surface · night-mini · HTTP 404 |
| GlobalError | `src/app/global-error.tsx` | own `<html>` · §7.9 copy · reload |
| RouteError | `src/app/[locale]/error.tsx` | shipped addition (app-wide state matrix T3.3) |
| SkeletonRow | `src/app/[locale]/loading.tsx` + reserve/menu skeletons | brand shimmer |

Stack notes: gsap (core+ScrollTrigger+Flip) owns all motion; Lenis smooth
scroll; three + @react-three/fiber in ONE lazy chunk (drei installed, not
imported); zod schemas in `src/lib/validation.ts`.

## prompt-6 · THE SIGNATURE FLOORS additions (P-094..P-101)

| Component | File | Notes |
|---|---|---|
| AtTheWindow (+Title/Description) | `src/components/ui/at-the-window.tsx` | P-094 THE WINDOW — the one overlay geometry: graded night scrim + horizon hairline at `--horizon` + close law at end-4 + settle descent / 100ms fade; Radix Dialog underneath (focus trap · Esc · aria-modal · described content). The dead `ui/dialog.tsx` DELETED (zero importers post-migration — the harvest rides the Exchange Ledger) |
| NightClock | `src/components/layout/night-clock.tsx` | P-097 the city's clock — html[data-night] set once at hydration (dusk/full/late; ?night= override); color-only; zero storage/network |
| FloorPlate (in DishList) | `src/components/menu/dish-list.tsx` | P-095 — the floor numeral (aria-hidden, deferred display face, Western digits) beside the H2 + the draw verb on the base hairline; the nav re-keyed (section-nav.tsx carries the floor per anchor) |
| The deck stagger (in GalleryGrid) | `src/components/gallery/gallery-grid.tsx` | P-099 — altitude offsets from the collection index (mt-0/8/16 cycle, CSS-only, DOM order = visual order) + the sighting captions (floors 1–6, content/{en,ar}.json) |
| The room's light (in TimeGrid) | `src/components/reserve/time-grid.tsx` | P-098 — the static scarcity channel keyed off `remaining` (border-line · border-line/70 · border-amber + the amber count numeral); aria-labels unchanged |
| The unbuilt floor dial (in NotFoundFloor) | `src/components/brand/not-found-floor.tsx` | P-101 — two stacked numerals (5/6) in the deferred display face, overflow clip, static half-offset; aria-hidden; zero motion |
