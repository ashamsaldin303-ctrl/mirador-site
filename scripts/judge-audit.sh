#!/usr/bin/env bash
# MIRADOR — judge audit (prompt-3 E32): read-only, fresh-clone-safe.
# Runs the deterministic suite (tsc · eslint 0 warnings · G1–G7 adapted paths
# per D-3 · audits) + asserts the canonical-schema invariant (N22: the
# committed provider MUST be postgresql) + prints tool versions. Exits 0 when
# everything is green. Touches nothing tracked: writes only node_modules
# (dependency materialization) — no DB, no server, no evidence files.
# Usage: bash scripts/judge-audit.sh   (from anywhere; it cds to the repo root)
set -uo pipefail
cd "$(dirname "$0")/.."

echo "== MIRADOR judge audit (prompt-3 E32) =="
echo "repo: $(git rev-parse HEAD 2>/dev/null || echo '(not a git checkout)')"

echo "-- tools --"
echo "bun $(bun --version)"
echo "node $(node --version 2>/dev/null || echo absent)"
bunx tsc --version 2>/dev/null | tail -1 || echo "tsc absent"

echo "-- 0. canonical-schema invariant (N22) --"
PROVIDER_ROWS=$(grep -c 'provider *= *"postgresql"' prisma/schema.prisma || true)
echo "prisma/schema.prisma provider=postgresql rows: $PROVIDER_ROWS"
if [ "$PROVIDER_ROWS" -lt 1 ]; then
  echo "JUDGE AUDIT: FAIL — committed schema is NOT the canonical PostgreSQL §6.1 form"
  exit 1
fi
ENUMS=$(grep -c '^enum ' prisma/schema.prisma || true)
ARRAYS=$(grep -c 'String\[\]' prisma/schema.prisma || true)
echo "enums declared: $ENUMS (expect 3) · String[] columns: $ARRAYS (expect 2)"
if [ "$ENUMS" -ne 3 ] || [ "$ARRAYS" -ne 2 ]; then
  echo "JUDGE AUDIT: FAIL — §6.1 shape drifted (enums/String[] missing)"
  exit 1
fi

echo "-- 1. install (frozen lockfile) + client generation --"
bun install --frozen-lockfile || { echo "JUDGE AUDIT: FAIL — install"; exit 1; }
bun run db:generate || { echo "JUDGE AUDIT: FAIL — prisma generate"; exit 1; }

echo "-- 2. tsc --noEmit (whole repo; scaffold examples/skills excluded per ASSUMPTIONS #9) --"
bunx tsc --noEmit || { echo "JUDGE AUDIT: FAIL — tsc"; exit 1; }

echo "-- 3. eslint --max-warnings 0 --"
bunx eslint . --max-warnings 0 || { echo "JUDGE AUDIT: FAIL — eslint"; exit 1; }

echo "-- 4. grep gates G1–G7 (D-3 adapted paths) --"
bash scripts/gates.sh || { echo "JUDGE AUDIT: FAIL — gates"; exit 1; }

# NOTE: the frozen audits (fonts · tokens · copy) are NOT part of the E32
# contracted set — audit:copy reads seeded DB rows (menu descriptions), so it
# needs a reachable DATABASE_URL; it runs in the CI battery instead
# (evidence/prod-run/audits/audits-run.log), where the PostgreSQL service is up.

echo "== JUDGE AUDIT: PASS — canonical schema + deterministic suite all green =="
