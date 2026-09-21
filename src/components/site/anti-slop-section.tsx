"use client";

/**
 * AntiSlopSection — the banned inventory as NEVER→ALWAYS pairs with semantic
 * fixed colors (destructive/success — meaning never by color alone: each cell
 * carries a text label too, §6.3). Flow arrows mirror under RTL
 * (X-axis direction flips — §7.3).
 */

import { ArrowRight, Ban, CircleCheck } from "lucide-react";

import { useLanguage } from "@/components/site/language-provider";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { disciplineSection } from "@/lib/manual-content";

export function AntiSlopSection() {
  const { t } = useLanguage();

  return (
    <section id="discipline" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
        <SectionHeading
          index={disciplineSection.index}
          kicker={disciplineSection.kicker}
          title={disciplineSection.title}
          intro={disciplineSection.intro}
        />

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-x-8">
          {disciplineSection.pairs.map((pair, index) => (
            <Reveal key={pair.never.en} delay={index <= 5 ? index * 50 : 0}>
              <div className="grid items-stretch gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-4">
                <div className="min-w-0 rounded-lg border border-destructive/25 bg-destructive/5 p-4">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-destructive">
                    <Ban className="size-3.5" aria-hidden="true" />
                    {t(disciplineSection.neverLabel)}
                  </span>
                  <p className="prose-body mt-2 text-sm">
                    {t(pair.never)}
                  </p>
                </div>

                <div className="flex items-center justify-center" aria-hidden="true">
                  <ArrowRight className="size-5 rotate-90 text-muted-foreground/60 md:rotate-0 rtl:md:-scale-x-100" />
                </div>

                <div className="min-w-0 rounded-lg border border-success/25 bg-success/5 p-4">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-success">
                    <CircleCheck className="size-3.5" aria-hidden="true" />
                    {t(disciplineSection.alwaysLabel)}
                  </span>
                  <p className="prose-body mt-2 text-sm">
                    {t(pair.always)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
