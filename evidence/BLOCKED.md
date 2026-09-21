# BLOCKED INDEX — environment-blocked items (this run · 2026-09-21)

Executor: z.ai sandbox container (see /evidence/MANIFEST.md). One platform
constraint produces all entries below; every other contracted check ran and
ships as raw output.

| # | item | reason | evidence |
|---|---|---|---|
| B1 | P1 production build (`bun run build`) → route size table, chunk manifests | platform forbids production builds — dev daemon on :3000 is the only sanctioned server | /evidence/F12-2/BLOCKED.md · /evidence/F6-3/BLOCKED.md · /evidence/F2/BLOCKED.md |
| B2 | E8 Lighthouse CI gate-form (mobile, prod build, 3 runs, median) | requires B1 | /evidence/lighthouse/BLOCKED.md |
| B3 | E9 LCP element from committed Lighthouse trace JSON | requires B1 | /evidence/lighthouse/BLOCKED.md (+ diagnostic in-browser LCP-element capture if produced) |
| B4 | E5 prod-form 404 status semantics | dev-mode Turbopack 404-status quirk (disclosed by build round; raw round-trip shipped verbatim — body copy + noindex ARE verified) | /evidence/http/ |

Everything else in E1–E16 executed against the :3000 dev daemon with the
platform network path exactly as the preview user sees it.
