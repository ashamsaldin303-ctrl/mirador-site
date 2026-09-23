"use client";
// MIRADOR — P-097 (prompt-6 R6 · E96) · THE CITY'S CLOCK: html[data-night]
// set ONCE at hydration from the local hour — dusk 18:00–20:00 · full night
// 20:00–23:00 · late 23:00–18:00 (all remaining hours; no unpinned "close")
// — or the ?night=dusk|full|late override (an addressable-state axis
// DISTINCT from P-067's ?d= kept-night DATE: hour-of-day vs date — both
// axes registered in docs/twins.md so Release 2's landing composes, never
// collides; the repo's precedents are ?webgl=off and ?diet=).
//
// The buckets swap COLOR-ONLY custom properties (the surface lift · the
// grain opacity · the window scrim's view depth — globals.css) + the
// skyline canvas's resting-density constant (one per bucket, wired there).
// SSR renders full night (the :root defaults); the hydration bucket shift
// is color-only, ≤200ms crossfade (twins.md discloses). The hour NEVER
// leaves the device: zero cookie/storage/network (the zero-RUM law).
import { useEffect } from "react";

const BUCKETS = ["dusk", "full", "late"] as const;
type Bucket = (typeof BUCKETS)[number];

function bucketFor(date: Date): Bucket {
  const hour = date.getHours();
  if (hour >= 18 && hour < 20) return "dusk";
  if (hour >= 20 && hour < 23) return "full";
  return "late";
}

export function NightClock() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const override = params.get("night");
    const bucket = (BUCKETS as readonly string[]).includes(override ?? "")
      ? (override as Bucket)
      : bucketFor(new Date());
    document.documentElement.dataset.night = bucket;
  }, []);
  return null;
}
