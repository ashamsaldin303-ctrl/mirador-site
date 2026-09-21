# ASSUMPTIONS.md — ساحة الوكلاء (Full-Stack Agent Playground)

Trivially-safe assumptions logged per §2.4 of the manual. Anything affecting
behavior, data, money, auth, or design direction would be a BLOCKED report —
none of that here. Max 5 per feature.

| id | decision | rationale | risk | blast radius | reversal |
|----|----------|-----------|------|--------------|----------|
| A1 | `metadataBase` set to `https://agent-playground.local` | Prevents the #1 metadata bug (OG/canonicals resolving to localhost — §10.2); sandbox has no public domain | None functional; OG absolute URLs resolve to a placeholder host | metadata only | Change one line in `layout.tsx` |
| A2 | No persistence layer (no Prisma models) | The build presents a static operating manual; the brief implies no data entities. Manual allows explicit "no persistence" (§2.2) | None — nothing to migrate | None | Add `schema.prisma` + `bun run db:push` |
| A3 | Locale is client-state (ar default) instead of `app/[locale]` routing | Sandbox exposes exactly one route (`/`); route-based i18n is impossible here. All §12 laws except URL routing are honored (dir, lang, catalogs, logical properties, both-direction verification) | No per-locale URLs / deep links to a language | Language switch only | Move to `app/[locale]/` when multi-route |
| A4 | Western digits (0-9) in both languages | "One digit system per product" (§6.2); the manual's own Arabic text uses Western digits | Cosmetic | None | Swap formatter |
| A5 | `og:image` not shipped | No real brand asset exists; fabricating one would violate §13-3 (never fabricate) | Social preview shows text card only | OG metadata | Generate a real 1200×630 asset |
