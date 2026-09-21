#!/usr/bin/env bash
# MIRADOR — battery verdict verification (prompt-3 Q4 gate): scans the prod-run
# evidence tree for FAIL verdicts and fails the job if any is present.
# The tools write verdicts into raw logs; this gate makes them exit-blocking.
# Round-2's preserved failure→fix history lives OUTSIDE this tree (dev-run
# surface) and is deliberately not scanned.
set -uo pipefail
cd "$(dirname "$0")/../.."
ROOT="${EVIDENCE_SURFACE:-prod-run}"
HITS=$(grep -rn "FAIL" "evidence/$ROOT" 2>/dev/null || true)
if [ -n "$HITS" ]; then
  echo "BATTERY VERIFICATION: FAIL — failing verdicts found:"
  echo "$HITS"
  exit 1
fi
echo "BATTERY VERIFICATION: PASS — no FAIL verdicts under evidence/$ROOT/"
