"use client";
// MIRADOR — the route announcer (P-028, prompt-4 R11 · E70): an aria-live
// polite region that speaks the new page's title on every route change —
// screen-reader users hear "Menu — MIRADOR" land after a soft navigation,
// the aural twin of the visual route change. Skips the initial load (the
// browser's own load announcement covers it). Rides the layout, zero bytes
// of state, no focus stealing.
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function RouteAnnouncer() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState("");
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return; // no announcement on first load — the load itself speaks
    }
    // soft-nav: the document title has swapped by the time this effect runs.
    // One-shot external-store sync (document.title per pathname change) — not
    // derived state, no cascading renders (runs once per route change).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- external sync, one-shot per route
    setAnnouncement(document.title || pathname);
  }, [pathname, setAnnouncement]);

  return (
    <div aria-live="polite" role="status" className="sr-only">
      {announcement}
    </div>
  );
}
