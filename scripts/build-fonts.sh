#!/usr/bin/env bash
# MIRADOR — font subsetting pipeline (T0.2, reproducible)
# Sources: official OFL releases from google/fonts GitHub (raw.githubusercontent.com/google/fonts/main/ofl/...)
#   assets/fonts-src: Fraunces-var.ttf · InstrumentSans-var.ttf · Amiri-{Regular,Bold}.ttf · PlexArabic-{Regular,Medium,SemiBold}.ttf
# Output: self-hosted WOFF2 subsets under public/fonts/ (declared via unicode-range @font-face in globals.css)
#
# F1-4 budget: AR font weight payload ≤60KB = sum of that weight's unicode-range files.
#   amiri 400: 36,108 + 18,984 = 55.1KB ✓ · amiri 700: 56.0KB ✓
#   plex 400: 42.6KB ✓ · 500: 45.8KB ✓ · 600: 46.1KB ✓
# Amiri is DISPLAY-ONLY (wordmark/headings) and every shipped AR string is frozen in
# the brief (§7 verbatim + §0–§11 AR summaries), so Amiri subsets to the brief's
# Arabic character corpus (+ explicit 28-letter core) — body AR (IBM Plex Sans Arabic,
# which renders user-typed input) keeps the full Unicode block subsets.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=assets/fonts-src
OUT=public/fonts
mkdir -p "$OUT"

LATIN="U+0000-007E,U+00A0-00FF,U+2013-2014,U+2018-2019,U+201C-201D,U+2022,U+2026"
ARABIC="U+0600-06FF,U+0750-077F,U+08A0-08FF,U+FB50-FDFF,U+FE70-FEFF"
SHAPE="calt,ccmp,liga,rclt,rlig,init,medi,fina,mark,mkmk,kern"

# 0) Amiri display corpus — every Arabic char present in the build brief + letter core
python3 - <<'PY'
text = open('upload/build-brief.md', encoding='utf-8').read()
chars = {c for c in text if any(a <= ord(c) <= b for a, b in
         ((0x0600, 0x06FF), (0x0750, 0x077F), (0x08A0, 0x08FF), (0xFB50, 0xFDFF), (0xFE70, 0xFEFF)))}
core = 'ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوي'
corpus = ''.join(sorted(chars | set(core))) + ' '
open('assets/fonts-src/amiri-corpus.txt', 'w', encoding='utf-8').write(corpus)
print(f'amiri corpus: {len(corpus)} chars')
PY

# 1) variable-font axis restriction (pin unused axes, clamp wght to the used range)
fonttools varLib.instancer "$SRC/Fraunces-var.ttf" "SOFT=0" "WONK=0" "wght=400:600" -o "$SRC/Fraunces-inst.ttf" 2>/dev/null
fonttools varLib.instancer "$SRC/InstrumentSans-var.ttf" "wdth=100" "wght=400:600" -o "$SRC/InstrumentSans-inst.ttf" 2>/dev/null

subset () { # src out range [features]
  pyftsubset "$1" --output-file="$2" --flavor=woff2 --layout-features='*' \
    --unicodes="$3" --no-hinting
}

# 2) EN display + body (variable: one file covers 400–600)
subset "$SRC/Fraunces-inst.ttf"        "$OUT/fraunces-var-latin.woff2"        "$LATIN"
subset "$SRC/InstrumentSans-inst.ttf"  "$OUT/instrument-sans-var-latin.woff2" "$LATIN"

# 3) AR display (Amiri 400/700) — corpus subset (arabic) + block subset (latin)
for w in Regular:400 Bold:700; do
  f="${w%%:*}"; n="${w##*:}"
  pyftsubset "$SRC/Amiri-$f.ttf" --output-file="$OUT/amiri-$n-arabic.woff2" \
    --flavor=woff2 --layout-features="$SHAPE" --text-file="$SRC/amiri-corpus.txt" --no-hinting
  pyftsubset "$SRC/Amiri-$f.ttf" --output-file="$OUT/amiri-$n-latin.woff2" \
    --flavor=woff2 --layout-features="$SHAPE" --unicodes="$LATIN" --no-hinting
done

# 4) AR body (IBM Plex Sans Arabic 400/500/600) — full block subsets (user input renders here)
for w in Regular:400 Medium:500 SemiBold:600; do
  f="${w%%:*}"; n="${w##*:}"
  pyftsubset "$SRC/PlexArabic-$f.ttf" --output-file="$OUT/plex-arabic-$n-arabic.woff2" \
    --flavor=woff2 --layout-features="$SHAPE" --unicodes="$ARABIC" --no-hinting
  pyftsubset "$SRC/PlexArabic-$f.ttf" --output-file="$OUT/plex-arabic-$n-latin.woff2" \
    --flavor=woff2 --layout-features='kern,liga' --unicodes="$LATIN" --no-hinting
done

echo "--- font subset sizes (bytes) ---"
ls -la "$OUT"/*.woff2 | awk '{print $5, $9}'
