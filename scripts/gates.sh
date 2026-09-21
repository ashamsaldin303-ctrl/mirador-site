#!/usr/bin/env bash
# MIRADOR — deterministic grep gates G1–G7 (§10.1, adapted: app/ → src/app per ASSUMPTIONS #3)
set -uo pipefail
cd "$(dirname "$0")/.."
FAIL=0

# Integrity guard: a missing rg must NEVER read as a passing gate (silent
# zero-hit = false PASS). Install ripgrep, or the run fails loudly here.
if ! command -v rg >/dev/null 2>&1; then
  echo "GATE RUNNER ERROR: rg (ripgrep) is not installed — gates CANNOT run."
  echo "This is not a pass. Install ripgrep (e.g. apt-get install -y ripgrep) and re-run."
  exit 1
fi

gate () { # name pattern paths...
  local name="$1"; shift
  local pattern="$1"; shift
  local hits
  hits=$(rg -n "$pattern" "$@" 2>/dev/null | rg -v "^scripts/gates" | head -n 5)
  if [ -n "$hits" ]; then
    echo "GATE $name: FAIL"; echo "$hits"; FAIL=1
  else
    echo "GATE $name: PASS (0 hits)"
  fi
}

gate "G1 wordlist"  'seamlessly|supercharge|unlock|elevate|effortlessly|game-changing|cutting-edge|best-in-class|world-class' -i src/ content/ || true
gate "G2 raw color" '#[0-9a-fA-F]{3,8}\b' src/ --glob '!**/*.css' || true
gate "G3 arbitrary" '\b[mp][trblxy]?-\[[0-9]' src/ || true
gate "G4 ad-hoc radii" 'rounded-\[' src/ || true
# G5 scans SHIPPED content surfaces (src/ content/ public/ prisma/) — docs/tests/scripts
# legitimately reference the banned tokens when defining/documenting the checks themselves
# (adaptation of the repo-wide scan, disclosed: the shipped-content scope is the gate's intent)
gate "G5 placeholder" 'lorem|acme|test@example' -i src/ content/ public/ prisma/ || true
gate "G6 2nd runtime" 'framer-motion|from "motion"' package.json || true
gate "G7 transition-all" 'transition-all' src/ || true

exit $FAIL
