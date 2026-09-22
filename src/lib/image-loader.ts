// MIRADOR — custom image loader (PRF-3, prompt-4 R6/P-023).
// THE CONTRACT: "images.formats → AVIF actually served + custom loader".
// The site ships a pre-optimized AVIF LADDER (F10-2: 750/1080/1600 variants
// beside every 2560 master — scripts/images.mjs). This loader is attached
// PER-IMAGE (hero/journey/story fills + the skyline gallery tiles) and
// resolves ladder masters DIRECTLY to the smallest rung ≥ the requested
// width, so the browser downloads pre-graded AVIF bytes (deterministic,
// cache-forever static assets — content-type: image/avif from the static
// handler, E53) instead of a per-request optimizer re-encode. Images WITHOUT
// this loader keep the standard /_next/image optimizer (AVIF per formats).
// RTL/parity note: width mapping is script-independent — the same ladder
// serves both locales (parity = same authorship, not same pixels).
const LADDER_WIDTHS = [750, 1080, 1600] as const;

const LADDER_MASTERS = new Set([
  "/img/hero/poster.avif",
  "/img/journey/act-1.avif",
  "/img/journey/act-2.avif",
  "/img/journey/act-3.avif",
  "/img/story/night.avif",
  "/img/gallery/skyline-1.avif",
  "/img/gallery/skyline-2.avif",
]);

/** Does this src carry a pre-graded ladder? (gallery tiles are DB-driven —
 * the grid tests each tile's url against the ladder set.) */
export function isLadderMaster(src: string): boolean {
  return LADDER_MASTERS.has(src);
}

export function miradorImageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // smallest ladder rung ≥ requested width; above the ladder → the master.
  // The ?w= query keeps every srcset entry a UNIQUE url (Next requires the
  // loader's output to vary with width — duplicate urls collide in the
  // srcset); the static handler serves the rung file and ignores the query.
  const rung = LADDER_WIDTHS.find((w) => w >= width);
  const file = rung ? src.replace(".avif", `-${rung}w.avif`) : src;
  return `${file}?w=${width}`;
}

export default miradorImageLoader;
