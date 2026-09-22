#!/usr/bin/env python3
"""MIRADOR — font fallback metric matcher (P-082 CLS kills, prompt-4 R9).

Computes size-adjust / ascent-override / descent-override for metric-matched
@font-face fallbacks (the fontaine technique) from the TTF sources in
assets/fonts-src. The overrides make the PRE-swap line box equal the post-swap
one, so font-display:swap causes ~zero layout shift (CLS kill).

size-adjust matches x-height (closest visual size while swapping);
ascent/descent overrides then pin the line box to the real font's hhea box:
    S  = xHeight_real / xHeight_arial          (ratios of unitsPerEm)
    A  = ascent_real  / S
    D  = descent_real / S
Fallback reference: Arial (upem 2048 · asc 1854 · desc -434 · sxHeight 1062).

One fallback face PER FAMILY (weight range covers the family's weights —
metrics are weight-stable within these families; Plex 400/500/600 differ <1%).
Re-run: python3 scripts/font-fallback-metrics.py
"""
import struct

FONTS = [
    ("Fraunces Fallback", "assets/fonts-src/Fraunces-var.ttf", "400 600",
     "local(\"Arial\")"),
    ("Instrument Sans Fallback", "assets/fonts-src/InstrumentSans-var.ttf", "400 600",
     "local(\"Arial\")"),
    ("Amiri Fallback", "assets/fonts-src/Amiri-Regular.ttf", "400 700",
     "local(\"Arial\"), local(\"Geeza Pro\"), local(\"Noto Sans Arabic\")"),
    ("IBM Plex Sans Arabic Fallback", "assets/fonts-src/PlexArabic-Regular.ttf", "400 600",
     "local(\"Arial\"), local(\"Geeza Pro\"), local(\"Noto Sans Arabic\")"),
]

# Arial (the local() fallback reference): upem 2048, hhea 1854/-434, sxHeight 1062
ARIAL_ASC = 1854 / 2048
ARIAL_DESC = 434 / 2048
ARIAL_XH = 1062 / 2048


def ttf_metrics(path):
    with open(path, "rb") as f:
        data = f.read()
    num_tables = struct.unpack(">H", data[4:6])[0]
    tables = {}
    for i in range(num_tables):
        off = 12 + 16 * i
        tag = data[off:off + 4].decode("latin-1")
        _, offset, _ = struct.unpack(">III", data[off + 4:off + 16])
        tables[tag] = offset
    head = tables["head"]
    upem = struct.unpack(">H", data[head + 18:head + 20])[0]
    hhea = tables["hhea"]
    asc = struct.unpack(">h", data[hhea + 4:hhea + 6])[0]
    desc = struct.unpack(">h", data[hhea + 6:hhea + 8])[0]
    os2 = tables["OS/2"]
    ver = struct.unpack(">H", data[os2:os2 + 2])[0]
    xh = struct.unpack(">h", data[os2 + 86:os2 + 88])[0] if ver >= 2 else None
    if xh is None or xh == 0:
        raise SystemExit(f"{path}: no usable sxHeight (OS/2 v{ver})")
    return upem, asc / upem, desc / upem, xh / upem


print("/* — P-082 CLS kills: metric-matched fallback faces (script-generated —")
print("   scripts/font-fallback-metrics.py; regenerate, never hand-edit) — */")
for family, path, weight, src in FONTS:
    _, asc, desc, xh = ttf_metrics(path)
    s = xh / ARIAL_XH
    a = asc / s
    d = abs(desc) / s  # CSS descent-override is a positive magnitude
    print(
        f'@font-face {{ font-family: "{family}"; src: {src}; '
        f"font-weight: {weight}; font-style: normal; "
        f"size-adjust: {s * 100:.2f}%; "
        f"ascent-override: {a * 100:.2f}%; "
        f"descent-override: {d * 100:.2f}%; }}"
    )
