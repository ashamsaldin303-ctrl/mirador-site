// MIRADOR — [locale] layout-level 404 floor (§4.8, §7.9, F11-1).
// P-024 (prompt-4 R9): this boundary is deliberately STATIC (no headers()) —
// a dynamic API here poisons the whole [locale] layout segment and forced
// every route to ƒ in the round-1 build (route-size-table.txt). It serves:
//   · invalid-locale paths (/xx/… → layout notFound()) — EN is the correct
//     default floor (the same fallback the header detection used), and
//   · any stray notFound() under segments without their own boundary.
// The LOCALIZED floors live one segment down where dynamism is already
// justified: [locale]/[...rest]/not-found.tsx (the honest-404 catch-all) and
// [locale]/confirmation/not-found.tsx (per-id lookups, COP-2 dynamic).
import { NotFoundFloor } from "@/components/brand/not-found-floor";

export default function NotFound() {
  return <NotFoundFloor locale="en" />;
}