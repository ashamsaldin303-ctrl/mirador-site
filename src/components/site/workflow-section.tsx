"use client";

/**
 * WorkflowSection — the fixed phase grammar as a timeline. Desktop: a single
 * row of 6 phases connected by hairlines that grow in reading direction
 * (RTL flips automatically via logical layout). Mobile: stacked vertically
 * with a start-side rail.
 */

import { useLanguage } from "@/components/site/language-provider";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { workflowSection } from "@/lib/manual-content";

export function WorkflowSection() {
  const { t } = useLanguage();

  return (
    <section
      id="workflow"
      className="scroll-mt-24 border-y bg-secondary/30 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
        <SectionHeading
          index={workflowSection.index}
          kicker={workflowSection.kicker}
          title={workflowSection.title}
          intro={workflowSection.intro}
        />

        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
          {workflowSection.phases.map((phase, index) => (
            <Reveal key={phase.n} delay={index <= 5 ? index * 50 : 0}>
              <li className="group flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-card font-mono text-sm font-semibold text-primary tabular-nums"
                  >
                    {phase.n}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-3 w-px flex-1 bg-border group-last:hidden"
                  />
                </div>
                <div className="min-w-0 pt-1">
                  <h3 className="text-lg font-semibold">{t(phase.title)}</h3>
                  <p className="prose-body mt-1 text-sm text-muted-foreground">
                    {t(phase.desc)}
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
