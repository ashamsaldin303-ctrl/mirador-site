# THE FIGURE REGISTER (P-079 · prompt-4 R8) — machine-generated from the frozen @theme tokens

Source of truth: `src/app/globals.css` @theme type scale (EN) + the `[dir="rtl"]`
overrides (AR). This table is GENERATED (`scripts/figure-register.py` → this file);
tokens = table by construction — the generator reads the live token file, so
drift regenerates rather than hand-edits (N25 kin).

| Role | Token | Family (EN / AR) | 375px | 768px | 1440px | LH EN→AR | Weight |
|---|---|---|---|---|---|---|---|
| display | text-display-xl | Fraunces (EN) / Amiri (AR) | 3.50rem (56px) | 4.32rem (69px) | 8.10rem (130px) | 1.05→1.25 | 400 |
| title | text-h1 | Fraunces (EN) / Amiri (AR) | 2.75rem (44px) | 2.88rem (46px) | 5.40rem (86px) | 1.1→1.3 | 400 |
| title | text-h2 | Fraunces (EN) / Amiri (AR) | 2.00rem (32px) | 2.00rem (32px) | 3.50rem (56px) | 1.15→1.35 | 400 |
| title | text-h3 | Fraunces (EN) / Amiri (AR) | 1.50rem (24px) | 1.50rem (24px) | 2.00rem (32px) | 1.2→1.4 | 400 |
| body | text-body-lg | Instrument Sans (EN) / IBM Plex Sans Arabic (AR) | 1.125rem (fixed) | 1.125rem (fixed) | 1.125rem (fixed) | 1.6→1.8 | 400 |
| body | text-body | Instrument Sans (EN) / IBM Plex Sans Arabic (AR) | 1rem (fixed) | 1rem (fixed) | 1rem (fixed) | 1.6→1.7 | 400 |
| body | text-small | Instrument Sans (EN) / IBM Plex Sans Arabic (AR) | 0.875rem (fixed) | 0.875rem (fixed) | 0.875rem (fixed) | 1.5→1.7 | 400 |
| eyebrow | text-micro | Instrument Sans (EN) / IBM Plex Sans Arabic (AR) | 0.75rem (fixed) | 0.75rem (fixed) | 0.75rem (fixed) | 1.4→1.6 | 500 |
| digits | text-body / text-small | same family as the owning role | 1rem / 0.875rem fixed | same | same | 1.6→1.7 / 1.5→1.7 | 400 |

AR overrides (all widths): display-xl 1.25 · h1 1.3 · h2 1.35 · h3 1.4 · body-lg 1.8 ·
body 1.7 · small 1.7 · micro 1.6 — mirrored leading, zero tracking (NEVER-10).

The wordmark faces (R9 · P-082/P-025): "MIRADOR" renders from the Fraunces Wordmark
subset · «ميرادور» from the Amiri Wordmark subset — same figures as their parent roles.

Digits role = tabular-nums contexts (grep `tabular-nums`: price-tag · party-stepper ·
diet-filter-bar live count · time-grid slot buttons) — figures that mutate render in
tabular form so columns never jitter.

## Role → live sites (usage map)
- **display / text-display-xl**: the hero wordmark lockup + display figures
- **title / text-h1**: page h1 (hero line, page titles)
- **title / text-h2**: section headings (menu sections, journey acts)
- **title / text-h3**: dish names, gallery captions, wordmark sm
- **body / text-body-lg**: lede paragraphs, act copy
- **body / text-body**: body copy, nav, buttons
- **body / text-small**: meta rows, captions, prices
- **eyebrow / text-micro**: hud labels — tracking 0.08em EN / 0 AR, weight 500, upper EN / none AR
