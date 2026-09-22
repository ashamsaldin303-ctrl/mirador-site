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
