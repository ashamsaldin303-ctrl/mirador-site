"use client";
// MIRADOR — StatCounters (loop2-I4 §8): the HUD fact row under the chapter
// intro — floor · seats · tables. SSR renders the FINAL values (no-JS and
// crawlers read the facts immediately — no counter ever gates content); under
// the live document a one-shot rAF tween counts 0→final (800ms expo-out) the
// moment the enclosing section's [data-revealed] lands — a MutationObserver
// on the section, disconnected after the single fire. Values ride
// data-final attributes; the tween writes textContent directly (no re-render
// churn — the component never re-renders, so React never clobbers the digits).
// Reduced-motion: finals only, no count. Digits are Western numerals
// site-wide (AR labels + latn digits — the V8 clock law), tabular-nums so
// the tween never shifts layout. Direction-neutral: label-over-number
// columns in DOM order — logical flow does the RTL mirroring by itself.
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const TWEEN_MS = 800;

/** expo.out — the JS twin of --ease-out-expo (1 − 2^(−10t), clamped). */
const easeExpoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Two-digit latn form — the site's numeral law (06 · 40 · 12). */
const format = (n: number) => String(n).padStart(2, "0");

export type Stat = { value: number; label: string };

export function StatCounters({ stats }: { stats: Stat[] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    if (prefersReducedMotion()) return; // RM: the finals are already on the page
    // The section may already have been revealed (healer/anchor races) — then
    // the finals stay; counting down to 0 just to climb back would be noise.
    const section = row.closest("section");
    if (!section || section.hasAttribute("data-revealed")) return;

    const counters = Array.from(row.querySelectorAll<HTMLElement>("[data-counter]"));
    if (counters.length === 0) return;
    const finals = counters.map((el) => Number(el.dataset.final ?? "0"));

    let raf = 0;
    const fire = () => {
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - t0) / TWEEN_MS, 1);
        const e = easeExpoOut(p);
        counters.forEach((el, i) => {
          el.textContent = format(Math.round((finals[i] ?? 0) * e));
        });
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    // arm: zero the readouts (below-fold at mount — the flash never shows)
    // and watch for the section's [data-revealed]; ONE fire, then disconnect.
    counters.forEach((el) => {
      el.textContent = format(0);
    });
    const mo = new MutationObserver(() => {
      mo.disconnect();
      fire();
    });
    mo.observe(section, { subtree: true, attributeFilter: ["data-revealed"] });

    return () => {
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={rowRef}
      className="mt-10 flex flex-wrap items-start gap-x-10 gap-y-4 border-t border-line pt-6"
    >
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1">
          <span
            data-counter
            data-final={stat.value}
            dir="ltr"
            className="font-display text-h3 tabular-nums text-ink"
          >
            {format(stat.value)}
          </span>
          <span className="hud-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
