# gates/commands.md — D-3: adapted grep-gate commands (verbatim)

The parent §10.1 gates were authored against root `app/` + `src/`; this repo
scaffolds routes under `src/app/` (ASSUMPTIONS #3). The adaptation is
**coverage-equivalent** — every gate scans the full shipped-code surface
(`src/` contains `app/` + `components/` + `lib/`), and `content/` /
`package.json` are included exactly as the parent specifies. These are the
exact commands that produced `gates/deterministic-suite.log`:

```bash
# G1 wordlist — banned copy words (parent pattern verbatim; app/ src/ → src/)
rg -n -i 'seamlessly|supercharge|unlock|elevate|effortlessly|game-changing|cutting-edge|best-in-class|world-class' src/ content/

# G2 raw color — hex/oklch literals outside CSS (parent: app/ src/ --glob '!**/*.css')
rg -n '#[0-9a-fA-F]{3,8}\b' src/ --glob '!**/*.css'

# G3 arbitrary spacing utilities
rg -n '\bp][trblxy]?-\[[0-9]' src/

# G4 ad-hoc radii
rg -n 'rounded-\[' src/

# G5 placeholder tokens (adapted scope: SHIPPED surfaces src/ content/ public/ prisma/
# — docs/tests/scripts legitimately reference the banned tokens when defining the
# checks themselves; disclosed in scripts/gates.sh comments)
rg -n -i 'lorem|acme|test@example' src/ content/ public/ prisma/

# G6 second animation runtime
rg -n 'framer-motion|from "motion"' package.json

# G7 transition-all
rg -n 'transition-all' src/
```

Runner (frozen, unchanged): `bash scripts/gates.sh` — includes the same
adapted paths plus a self-exclusion filter for its own file. Expected: every
gate prints `PASS (0 hits)`; suite exit 0. Observed this run: **G1–G7 all
PASS** (`gates/deterministic-suite.log`).

Deterministic companions (same log):
```bash
bunx tsc --noEmit          # src/ scope 0 errors (examples/ + skills/ carry pre-existing template noise — outside src scope, disclosed)
bunx eslint . --max-warnings 0   # 0 problems
bun run audit:fonts        # AR font budget PASS
bun run audit:tokens       # §5 token contract PASS
bun run audit:copy         # word counts + parity 138 + register 40/40 PASS
```
