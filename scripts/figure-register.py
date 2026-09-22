#!/usr/bin/env python3
"""E63 (prompt-4 R8 · P-079): THE FIGURE REGISTER — generated from the FROZEN
tokens in src/app/globals.css (the tokens are the source of truth; this script
resolves clamp() at 375/768/1440 and emits docs/figure-register.md).
Usage: python3 scripts/figure-register.py"""
import re

css = open("src/app/globals.css").read()
RTL_RULE = "[dir=\"rtl\"] {"
en_block = css.split(RTL_RULE)[0]
ar_block = css.split(RTL_RULE)[1] if RTL_RULE in css else ""

def token(name):
    m = re.search(rf"--text-{re.escape(name)}:\s*([^;]+);", en_block)
    return m.group(1).strip() if m else "?"

def lh(name, block):
    m = re.search(rf"--text-{re.escape(name)}--line-height:\s*([\d.]+);", block)
    return m.group(1) if m else "?"

def resolve_clamp(expr, vw):
    m = re.match(r"clamp\(([\d.]+)rem,\s*([\d.]+)vw,\s*([\d.]+)rem\)", expr)
    if not m:
        return f"{expr} (fixed)"
    lo, slope, hi = float(m.group(1)), float(m.group(2)), float(m.group(3))
    v = max(lo, min(hi, slope / 100 * vw / 16.0))
    return f"{v:.2f}rem ({v*16:.0f}px)"

ROLES = [
    ("display", "display-xl", "Fraunces (EN) / Amiri (AR)", "the hero wordmark lockup + display figures"),
    ("title",   "h1",         "Fraunces (EN) / Amiri (AR)", "page h1 (hero line, page titles)"),
    ("title",   "h2",         "Fraunces (EN) / Amiri (AR)", "section headings (menu sections, journey acts)"),
    ("title",   "h3",         "Fraunces (EN) / Amiri (AR)", "dish names, gallery captions, wordmark sm"),
    ("body",    "body-lg",    "Instrument Sans (EN) / IBM Plex Sans Arabic (AR)", "lede paragraphs, act copy"),
    ("body",    "body",       "Instrument Sans (EN) / IBM Plex Sans Arabic (AR)", "body copy, nav, buttons"),
    ("body",    "small",      "Instrument Sans (EN) / IBM Plex Sans Arabic (AR)", "meta rows, captions, prices"),
    ("eyebrow", "micro",      "Instrument Sans (EN) / IBM Plex Sans Arabic (AR)", "hud labels — tracking 0.08em EN / 0 AR, weight 500, upper EN / none AR"),
]

WIDTHS = [375, 768, 1440]
lines = [
    "# THE FIGURE REGISTER (P-079 · prompt-4 R8) — machine-generated from the frozen @theme tokens",
    "",
    "Source of truth: `src/app/globals.css` @theme type scale (EN) + the `[dir=\"rtl\"]`",
    "overrides (AR). This table is GENERATED (`scripts/figure-register.py` → this file);",
    "tokens = table by construction — the generator reads the live token file, so",
    "drift regenerates rather than hand-edits (N25 kin).",
    "",
    "| Role | Token | Family (EN / AR) | 375px | 768px | 1440px | LH EN→AR | Weight |",
    "|---|---|---|---|---|---|---|---|",
]
for role, name, family, usage in ROLES:
    expr = token(name)
    cells = [resolve_clamp(expr, w) for w in WIDTHS]
    weight = "500" if name == "micro" else "400"
    lines.append(f"| {role} | text-{name} | {family} | {cells[0]} | {cells[1]} | {cells[2]} | {lh(name, en_block)}→{lh(name, ar_block)} | {weight} |")
lines += [
    "| digits | text-body / text-small | same family as the owning role | 1rem / 0.875rem fixed | same | same | 1.6→1.7 / 1.5→1.7 | 400 |",
    "",
    "AR overrides (all widths): display-xl 1.25 · h1 1.3 · h2 1.35 · h3 1.4 · body-lg 1.8 ·",
    "body 1.7 · small 1.7 · micro 1.6 — mirrored leading, zero tracking (NEVER-10).",
    "",
    "The wordmark faces (R9 · P-082/P-025): \"MIRADOR\" renders from the Fraunces Wordmark",
    "subset · «ميرادور» from the Amiri Wordmark subset — same figures as their parent roles.",
    "",
    "Digits role = tabular-nums contexts (grep `tabular-nums`: price-tag · party-stepper ·",
    "diet-filter-bar live count · time-grid slot buttons) — figures that mutate render in",
    "tabular form so columns never jitter.",
    "",
    "## Role → live sites (usage map)",
]
for role, name, family, usage in ROLES:
    lines.append(f"- **{role} / text-{name}**: {usage}")

open("docs/figure-register.md", "w").write("\n".join(lines) + "\n")
print("docs/figure-register.md regenerated —", len(lines), "lines")
