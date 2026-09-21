// MIRADOR — catch-all: routes unmatched URLs under /[locale]/* into notFound(),
// which renders the DESIGNED 404 brand surface ([locale]/not-found.tsx).
// notFound() is ALSO called from generateMetadata so the 404 status is
// committed BEFORE the streaming shell flushes (F11-1: HTTP status preserved).
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  notFound();
}

export default function CatchAllPage() {
  notFound();
}
