"use client";
// MIRADOR — the route announcer (P-028, prompt-4 R11 · E70): an aria-live
// polite region that speaks the new page's title on every route change —
// screen-reader users hear "Menu — MIRADOR" land after a soft navigation,
// the aural twin of the visual route change. Skips the initial load (the
// browser's own load announcement covers it). Rides the layout, zero bytes
// of state, no focus stealing.
//
// Run-14/15 lesson: "the document title has swapped by the time this effect
// runs" is true on a settled prod build (React 19 title hoisting commits
// before passive effects) but NOT under dev on-demand compilation — the
// first soft-nav after an HMR invalidation read an empty title and the
// announcer permanently spoke the URL PATHNAME to SR users. The read now
// waits (bounded ~1.5s, one rAF-interval poll) for a non-empty title and
// only then falls back to the pathname. One-shot external sync — no
// derived state, no cascading renders.
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TITLE_WAIT_MS = 1500;
const POLL_MS = 90;

export function RouteAnnouncer() {
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState("");
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return; // no announcement on first load — the load itself speaks
    }
    let cancelled = false;
    const speak = () => {
      if (cancelled) return;
      setAnnouncement(document.title || pathname);
    };
    if (document.title) {
      speak();
      return;
    }
    const started = Date.now();
    const poll = setInterval(() => {
      if (cancelled) return;
      if (document.title || Date.now() - started > TITLE_WAIT_MS) {
        clearInterval(poll);
        speak();
      }
    }, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(poll);
    };
  }, [pathname]);

  return (
    <div aria-live="polite" role="status" className="sr-only">
      {announcement}
    </div>
  );
}
