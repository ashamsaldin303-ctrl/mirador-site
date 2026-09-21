// MIRADOR — E9 diagnostic (LCP element via in-browser PerformanceObserver) +
// F1-4/D-4 evidence (font-display grep + AR first-load font network waterfall).
// BOTH outputs are explicitly labeled DIAGNOSTIC-DEV-ONLY where applicable.
// Usage: bun evidence/tools/lcp-and-fonts.ts
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { BASE, EVIDENCE_ROOT } from "./lib";

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
});

// ---------- E9 diagnostic: LCP element on /en and /ar (mobile 375) ----------
for (const loc of ["en", "ar"] as const) {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/${loc}`, { waitUntil: "load" });
  const lcp = await page.evaluate(
    () =>
      new Promise<unknown>((resolve) => {
        const obs = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1] as (PerformanceEntry & { element?: Element }) | undefined;
          if (last) {
            resolve({
              lcpTimeMs: Math.round(last.startTime),
              element: last.element
                ? {
                    tag: last.element.tagName,
                    src: (last.element as HTMLImageElement).getAttribute("src")?.slice(0, 120) ?? null,
                    alt: (last.element as HTMLImageElement).getAttribute("alt")?.slice(0, 80) ?? null,
                  }
                : null,
            });
          }
        });
        obs.observe({ type: "largest-contentful-paint", buffered: true });
        setTimeout(() => resolve({ timeout: true }), 12000);
      }),
  );
  const data = {
    label: "DIAGNOSTIC-DEV-ONLY — NOT E9 GATE EVIDENCE (gate requires prod-build Lighthouse trace JSON)",
    url: `${BASE}/${loc}`,
    viewport: "375x812 (mobile, per gate context)",
    generatedAt: new Date().toISOString(),
    lcp: lcp as Record<string, unknown>,
  };
  writeFileSync(`${EVIDENCE_ROOT}lighthouse/lcp-element--${loc}--diagnostic.json`, JSON.stringify(data, null, 2));
  console.log(`LCP /${loc}:`, JSON.stringify(data.lcp));
  await context.close();
}

// ---------- F1-4 / D-4: font-display grep + AR first-load waterfall ----------
// 1) raw grep of every @font-face block's font-display
const grepOut = execSync(
  `grep -n -A6 "@font-face" src/app/globals.css | grep -E "@font-face|font-family|src:|font-display" || true`,
  { encoding: "utf8" },
);
const fontCount = (grepOut.match(/@font-face/g) ?? []).length;
const swapCount = (grepOut.match(/font-display: swap/g) ?? []).length;
const anyDisplay = (grepOut.match(/font-display:/g) ?? []).length;
const summary = [
  `# F1-4 / D-4 font-display verification — machine-generated ${new Date().toISOString()}`,
  `# rule: every @font-face declares font-display (swap; optional allowed for AR display faces)`,
  `@font-face declarations: ${fontCount}`,
  `font-display declarations: ${anyDisplay} (swap: ${swapCount})`,
  fontCount === anyDisplay && swapCount === fontCount
    ? `VERDICT: PASS — all ${fontCount} faces declare font-display: swap`
    : `VERDICT: CHECK — counts above (raw grep below)`,
  ``,
  `# raw grep (globals.css):`,
  grepOut,
  `# critical weights preloaded per active locale: src/app/[locale]/layout.tsx lines 79-96`,
  `# (AR: amiri-400-arabic + plex-arabic-400-arabic · EN: fraunces-var-latin + instrument-sans-var-latin)`,
].join("\n");
writeFileSync(`${EVIDENCE_ROOT}F1-4/font-display--grep.txt`, summary);

// 2) AR first-load network waterfall for fonts (CDP Network domain: real timestamps + encoded lengths)
{
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  const reqs = new Map<string, { url: string; sent: number; receive?: number; done?: number; bytes?: number }>();
  cdp.on("Network.requestWillBeSent", (e: { requestId: string; request: { url: string }; timestamp: number }) => {
    if (e.request.url.includes("/fonts/")) reqs.set(e.requestId, { url: e.request.url.split("/fonts/")[1], sent: e.timestamp });
  });
  cdp.on("Network.responseReceived", (e: { requestId: string; timestamp: number }) => {
    const r = reqs.get(e.requestId);
    if (r) r.receive = e.timestamp;
  });
  cdp.on("Network.loadingFinished", (e: { requestId: string; timestamp: number; encodedDataLength: number }) => {
    const r = reqs.get(e.requestId);
    if (r) { r.done = e.timestamp; r.bytes = e.encodedDataLength; }
  });
  await page.goto(`${BASE}/ar`, { waitUntil: "load" });
  await page.waitForTimeout(4000);
  const t0 = Math.min(...Array.from(reqs.values()).map((r) => r.sent));
  const out = Array.from(reqs.values())
    .map((r) => ({
      font: r.url,
      startMs: Math.round((r.sent - t0) * 1000),
      durationMs: r.done ? Math.round((r.done - r.sent) * 1000) : null,
      bytes: r.bytes ?? null,
    }))
    .sort((a, b) => a.startMs - b.startMs);
  writeFileSync(
    `${EVIDENCE_ROOT}F1-4/ar-first-load--fonts-network.json`,
    JSON.stringify(
      {
        label: "raw network capture — AR first load, font requests (375 viewport, CDP Network domain)",
        generatedAt: new Date().toISOString(),
        note: "timings from CDP timestamps (monotonic, ms relative to first font request)",
        requests: out,
      },
      null,
      2,
    ),
  );
  console.log("AR font requests:", JSON.stringify(out));
  await context.close();
}

await browser.close();
console.log("done — lcp diagnostics + F1-4 evidence written");
