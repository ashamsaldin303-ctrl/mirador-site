# BLOCKED — F12-2 · F6-3 · F2 — production build outputs (P1)

## Condition (verbatim policy)
The execution platform mandates the auto dev daemon as the ONLY sanctioned
server surface for this project and forbids production builds outright:
"never use `bun run build`" (platform runtime rule, non-negotiable in this
container). The build round of 2026-09-21 hit and disclosed the same
constraint (worklog · Task 3: "sandbox forbids production builds").

`next build` therefore cannot execute here, and with it these contracted
artifacts are unproducible in this environment:

| AC | artifact | status here |
|---|---|---|
| F12-2 / E2 | route size table (first-load JS ≤150KB gz per route, hard 200KB) | BLOCKED-by-policy |
| F6-3 / E3 | lazy three-chunk size (≤400KB gz) + proof of absence from every route's first-load JS | BLOCKED-by-policy |
| F2 (bonus) | motion-stack base-bundle total (gsap+ScrollTrigger+Flip+lenis ≤90KB gz) | BLOCKED-by-policy |

## What was deliberately NOT done
- No dev-mode bundle numbers are presented as gate evidence. Dev-mode output
  is unminified + HMR-instrumented; quoting it against §9 budgets would
  misrepresent the contracted metric (N16 polished-evidence / N17
  check-tampering risk — refused).
- No fake or hand-typed size table (N20).

## Resolution path (judge / human, on a build-capable machine)
```
bun install
bun run build          # expect exit 0
# capture: full route size table + .next build manifests
# assert: per-route first-load JS ≤150KB gz (hard 200KB)
# assert: three/fiber/drei appear ONLY in the lazy chunk; lazy chunk ≤400KB gz
```
Exact commands: /evidence/REPLAY.md §build.
Also registered as blocking pre-deployment checklist: docs/deploy-pre.md (D-2).
