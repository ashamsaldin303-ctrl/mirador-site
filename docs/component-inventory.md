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
| DishOverlay | `src/components/menu/dish-overlay.tsx` | Dialog z-40 · allergen table role=table · Esc/focus-trap |
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
| MasonryGrid | `src/components/gallery/gallery-grid.tsx` | CSS columns · lazy · fail cards |
| Lightbox | `src/components/gallery/lightbox.tsx` | Dialog z-40 · arrows/Esc · RTL-mirrored keys · counter |
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
