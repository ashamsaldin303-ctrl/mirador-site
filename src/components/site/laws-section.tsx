"use client";

/**
 * LawsSection — the Seven Laws as an editorial numbered list with hairline
 * separators (NOT a card grid — §8.1 bans "3 identical cards"). Oversized
 * mono numerals flip to brand copper on row hover. Grid columns reverse
 * automatically under RTL (logical placement).
 */

import { useLanguage } from "@/components/site/language-provider";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { lawsSection } from "@/lib/manual-content";

export function LawsSection() {
  const { t } = useLanguage();

  return (
    <section id="laws" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
        <SectionHeading
          index={lawsSection.index}
          kicker={lawsSection.kicker}
          title={lawsSection.title}
          intro={lawsSection.intro}
        />

        <ol className="border-y">
          {lawsSection.laws.map((law, index) => (
            /* Stagger capped: 5 gaps × 60ms = 300ms (§7.1) */
            <Reveal key={law.n} delay={index <= 5 ? index * 60 : 0}>
              <li className="group grid gap-x-8 gap-y-1 border-b py-6 last:border-b-0 md:grid-cols-[5rem_minmax(0,1fr)] md:py-7">
                <span
                  className="font-mono text-2xl font-medium text-muted-foreground/70 transition-colors group-hover:text-primary tabular-nums"
                  aria-hidden="true"
                >
                  {law.n}
                </span>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold md:text-2xl">
                    {t(law.title)}
                  </h3>
                  <p className="prose-body mt-1.5 max-w-prose text-muted-foreground">
                    {t(law.desc)}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
