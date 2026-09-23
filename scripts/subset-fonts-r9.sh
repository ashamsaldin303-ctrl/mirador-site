#!/usr/bin/env bash
# MIRADOR — R9 font subsets (prompt-4 P-082/P-025): corpus-shrink the AR latin
# arm + wordmark faces. Reproducible: sources in assets/fonts-src (see
# scripts/build-fonts.sh for the base pipeline).
#   1. The seven AR-latin faces re-subset to the ACTUAL AR-page latin corpus
#      (extracted from content/ar.json + runtime price/time/ref chars, 46 cp).
#   2. fraunces-wordmark-latin.woff2 ("MIRADOR") + amiri-wordmark-arabic.woff2
#      ("ميرادور") — the nav lockup's exact glyphs.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=assets/fonts-src
OUT=public/fonts
SUBSET=/home/z/.venv/bin/pyftsubset
LATIN_FEATURES="--layout-features='*' --no-hinting --desubroutinize"

# 1) AR-latin corpus (46 chars — matches globals.css's latin unicode-ranges)
CORPUS=' !"#$%&'"'"'()*+,-./0123456789:;@Eghilns©«·»×–—’…−'

sub () { # $1 src ttf, $2 out woff2, $3 text
  $SUBSET "$1" --text="$3" --flavor=woff2 \
    --layout-features='*' --no-hinting --desubroutinize \
    --output-file="$2" --name-IDs='*' 2>/dev/null
}

sub "$SRC/PlexArabic-Regular.ttf"   "$OUT/plex-arabic-400-latin.woff2"  "$CORPUS"
sub "$SRC/PlexArabic-Medium.ttf"    "$OUT/plex-arabic-500-latin.woff2"  "$CORPUS"
sub "$SRC/PlexArabic-SemiBold.ttf"  "$OUT/plex-arabic-600-latin.woff2"  "$CORPUS"
sub "$SRC/Amiri-Regular.ttf"        "$OUT/amiri-400-latin.woff2"        "$CORPUS"
sub "$SRC/Amiri-Bold.ttf"           "$OUT/amiri-700-latin.woff2"        "$CORPUS"

# 2) wordmark faces — the nav lockup renders EXACTLY these glyphs
sub "$SRC/Fraunces-var.ttf"         "$OUT/fraunces-wordmark-latin.woff2"  "MIRADOR"
sub "$SRC/Amiri-Regular.ttf"        "$OUT/amiri-wordmark-arabic.woff2"     "ميرادور"

ls -la "$OUT" | awk '{print $5, $9}' | sort -n

# 3) R13/E79 (the exit-gate LCP close): THE HERO FACES — the home H1's exact
#    line. Run-18's raw Lighthouse proved the LCP element is the hero H1 and
#    its paint waited on the CSS-discovered full display face (LOW priority,
#    queued behind the first-load). Pipeline parity (run-19 font lessons):
#    Fraunces: the SAME instancing as build-fonts.sh (SOFT=0 WONK=0 wght=400:600
#    — keeps opsz VARIABLE = auto optical sizing, zero visual delta) + subset
#    with layout-features='*' (rvrn/ss01 machinery intact) → 13,652B.
#    Amiri: full joining features (init/medi/fina/rlig/mark — the line is
#    joined Arabic, incl. the shadda U+0651 on «تستحقّ») → 21,228B.
#    BOTH text sets INCLUDE THE SPACES, and the CSS unicode-ranges MUST list
#    U+0020 — a spaceless range silently splits the H1 across faces (spaces
#    fall to the next family; see globals.css). Both faces are PRELOADED in
#    [locale]/layout.tsx so the swap lands in network wave 1.
/home/z/.venv/bin/fonttools varLib.instancer "$SRC/Fraunces-var.ttf" "SOFT=0" "WONK=0" "wght=400:600" -o /tmp/fraunces-hero-inst.ttf
$SUBSET /tmp/fraunces-hero-inst.ttf --text="Above the city, a table worth the climb." --flavor=woff2 \
  --layout-features='*' --no-hinting \
  --output-file="$OUT/fraunces-hero-latin.woff2" 2>/dev/null
$SUBSET "$SRC/Amiri-Regular.ttf" --text="فوق المدينة، مائدة تستحقّ الصعود." --flavor=woff2 \
  --layout-features='*' --no-hinting \
  --output-file="$OUT/amiri-hero-arabic.woff2" 2>/dev/null

ls -la "$OUT" | awk '{print $5, $9}' | sort -n
