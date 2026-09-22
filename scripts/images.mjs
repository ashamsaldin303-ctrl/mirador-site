// MIRADOR — image pipeline (T3.2): night-cinematic grading + AVIF ladder
// Sources: assets/img-src/raw/*.jpg (image-search results, manifest at
// assets/img-src/manifest.json) → outputs at the EXACT §6.4 contract paths.
// Grammar: near-black base, desaturated amber-brass highlights, S-curve
// contrast, 2–4% grain (Apple TV+ night-city reference).
import sharp from "sharp";
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const RAW = "assets/img-src/raw";
const OUT = "public/img";

// per-image grade config: [raw, out, w, h, brightness, saturation, gamma, quality]
const IMAGES = [
  ["hero.jpg", "hero/poster.avif", 2560, 1440, 0.82, 0.82, 1.08, 55],
  ["act1.jpg", "journey/act-1.avif", 2560, 1440, 0.80, 0.80, 1.08, 55],
  ["act2.jpg", "journey/act-2.avif", 2560, 1440, 0.86, 0.86, 1.06, 55],
  ["act3.jpg", "journey/act-3.avif", 2560, 1440, 0.82, 0.82, 1.08, 55],
  ["story.jpg", "story/night.avif", 2560, 1440, 0.80, 0.80, 1.08, 55],
  ["sky1.jpg", "gallery/skyline-1.avif", 2560, 1440, 0.80, 0.80, 1.08, 55],
  ["sky2.jpg", "gallery/skyline-2.avif", 2560, 1440, 0.80, 0.82, 1.08, 55],
  ["404.jpg", "404/night-mini.avif", 1080, 1350, 0.78, 0.80, 1.08, 55],
  ["og-en.jpg", "og/og-image-en.avif", 1200, 630, 0.82, 0.82, 1.08, 55],
  ["og-ar.jpg", "og/og-image-ar.avif", 1200, 630, 0.80, 0.82, 1.08, 55],
  ["fire3.jpg", "gallery/fire-3.avif", 1080, 1350, 0.85, 0.85, 1.06, 55],
  ["fire4.jpg", "gallery/fire-4.avif", 1080, 1350, 0.82, 0.85, 1.06, 55],
  ["plates5.jpg", "gallery/plates-5.avif", 1080, 1350, 0.86, 0.88, 1.05, 55],
  ["plates6.jpg", "gallery/plates-6.avif", 1080, 1350, 0.86, 0.88, 1.05, 55],
  ["room7.jpg", "gallery/room-7.avif", 1080, 1350, 0.80, 0.82, 1.08, 55],
  ["room8.jpg", "gallery/room-8.avif", 1080, 1350, 0.78, 0.80, 1.08, 55],
  ["sourdough.jpg", "menu/sourdough-butter.avif", 1080, 1350, 0.88, 0.90, 1.05, 55],
  ["ribeye.jpg", "menu/ribeye-for-two.avif", 1080, 1350, 0.86, 0.86, 1.06, 55],
  ["tart.jpg", "menu/dark-chocolate-tart.avif", 1080, 1350, 0.86, 0.88, 1.05, 55],
];

// ladder variants for 16:9 masters (F10-2): 750 / 1080 / 1600
const LADDER = [
  ["hero/poster.avif", 2560, 1440],
  ["journey/act-1.avif", 2560, 1440],
  ["journey/act-2.avif", 2560, 1440],
  ["journey/act-3.avif", 2560, 1440],
  ["story/night.avif", 2560, 1440],
  ["gallery/skyline-1.avif", 2560, 1440],
  ["gallery/skyline-2.avif", 2560, 1440],
];

const grainSvg = (w, h) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
     <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/></filter>
     <rect width="${w}" height="${h}" filter="url(#n)" opacity="0.035"/>
   </svg>`,
);

const amberSvg = (w, h) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
     <defs>
       <radialGradient id="g" cx="50%" cy="30%" r="80%">
         <stop offset="0%" stop-color="rgba(203,163,92,0.16)"/>
         <stop offset="55%" stop-color="rgba(203,163,92,0.06)"/>
         <stop offset="100%" stop-color="rgba(10,10,11,0.30)"/>
       </radialGradient>
     </defs>
     <rect width="${w}" height="${h}" fill="url(#g)"/>
   </svg>`,
);

/** grade one raw image to w×h AVIF at the exact output path */
async function grade(rawPath, outPath, w, h, brightness, saturation, gamma, quality) {
  const pipeline = sharp(join(RAW, rawPath))
    .resize(w, h, { fit: "cover", position: sharp.strategy.attention })
    .modulate({ brightness, saturation })
    .gamma(gamma)
    .linear(1.06, -10)
    .composite([
      { input: amberSvg(w, h), blend: "soft-light" },
      { input: grainSvg(w, h), blend: "overlay" },
    ])
    .avif({ quality, effort: 4 });
  const out = join(OUT, outPath);
  mkdirSync(dirname(out), { recursive: true });
  await pipeline.toFile(out);
  return statSync(out).size;
}

const report = {};
const sizes = [];

async function mapLimit(items, limit, fn) {
  const ret = []; let i = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (i < items.length) { const idx = i++; ret[idx] = await fn(items[idx]); }
  });
  await Promise.all(workers); return ret;
}
await mapLimit(IMAGES, 3, async ([raw, out, w, h, b, s, g, q]) => {
  const size = await grade(raw, out, w, h, b, s, g, q);
  report[out] = size;
  console.log(`${out.padEnd(36)} ${String(size).padStart(7)} B  (${w}×${h})`);
});

// ladder variants (from the graded master, re-encoded smaller)
for (const [master, mw, mh] of LADDER) {
  for (const lw of [750, 1080, 1600]) {
    const lh = Math.round((lw / mw) * mh);
    const variant = master.replace(".avif", `-${lw}w.avif`);
    const src = join(OUT, master);
    const out = join(OUT, variant);
    const quality = lw <= 1080 ? 48 : 52; // small variants squeeze harder (≤60KB budget)
    sizes.push({ src, out, lw, lh, quality, variant });
  }
}

await mapLimit(sizes, 3, async ({ src, out, lw, lh, quality, variant }) => {
  await sharp(src).resize(lw, lh, { fit: "cover" }).avif({ quality, effort: 5 }).toFile(out);
  const size = statSync(out).size;
  report[variant] = size;
  console.log(`${variant.padEnd(36)} ${String(size).padStart(7)} B  (${lw}×${lh})`);
});

writeFileSync(join(OUT, "size-report.json"), JSON.stringify(report, null, 1));

// PRF-4 (prompt-4 R6): OG images → JPEG — social crawlers (facebookexternalhit,
// Twitterbot, WhatsApp preview) do NOT decode AVIF; the OG pair ships JPEG so
// the preview card actually renders. Chroma 4:4:4 keeps the amber grade clean
// under chroma-subsampled JPEG. The AVIF masters stay (browser-served surfaces
// never reference /img/og — only the <meta> crawlers do).
for (const loc of ["en", "ar"]) {
  const jpg = `og/og-image-${loc}.jpg`;
  await sharp(join(OUT, `og/og-image-${loc}.avif`))
    .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(join(OUT, jpg));
  report[jpg] = statSync(join(OUT, jpg)).size;
  console.log(`${jpg.padEnd(36)} ${String(report[jpg]).padStart(7)} B  (1200×630, PRF-4)`);
}
writeFileSync(join(OUT, "size-report.json"), JSON.stringify(report, null, 1));

// budget check (F10-1): hero 750w/1080w ≤ 60KB; every 1600w/2560w ≤ 250KB
const fails = [];
for (const [file, size] of Object.entries(report)) {
  if (file === "hero/poster-750w.avif" || file === "hero/poster-1080w.avif") {
    if (size > 60_000) fails.push(`${file} ${size}B > 60KB`);
  } else if ((file.includes("1600w") || size > 250_000 && file.match(/\/(poster|act-[123]|night|skyline-[12])\.avif$/)) ) {
    fails.push(`${file} ${size}B > 250KB`);
  }
}
console.log(fails.length ? `\nBUDGET FAILS:\n${fails.join("\n")}` : "\nAll byte budgets pass.");
