"use client";

/**
 * NeverSection — §13, the terminal block: fifteen terminal rules in a
 * terminal-styled panel (bounded component surface, not a page background).
 * Long list handling: max height + thin custom scrollbar (§UI kit).
 */

import { useLanguage } from "@/components/site/language-provider";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { neverSection, ui } from "@/lib/manual-content";

export function NeverSection() {
  const { t } = useLanguage();

  return (
    <section
      id="never"
      className="scroll-mt-24 border-t bg-secondary/30 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
        <SectionHeading
          index={neverSection.index}
          kicker={neverSection.kicker}
          title={neverSection.title}
          intro={neverSection.intro}
        />

        <Reveal>
          <div className="overflow-hidden rounded-lg border shadow-xs">
            <div className="flex flex-wrap items-center gap-3 bg-terminal px-4 py-3 text-terminal-foreground">
              <span aria-hidden="true" className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-destructive" />
                <span className="size-3 rounded-full bg-warning" />
                <span className="size-3 rounded-full bg-success" />
              </span>
              <span className="font-mono text-xs font-medium" dir="ltr">
                never-block.sh
              </span>
              <span className="ms-auto font-mono text-xs text-terminal-foreground/60">
                {t(ui.terminalTitle)}
              </span>
            </div>

            <div className="scroll-thin max-h-96 overflow-y-auto bg-terminal px-4 py-4 text-terminal-foreground md:px-5">
              <ol className="space-y-3.5">
                {neverSection.rules.map((rule, index) => (
                  <li
                    key={rule.en}
                    className="flex gap-3 font-mono text-sm leading-relaxed"
                  >
                    <span
                      aria-hidden="true"
                      className="shrink-0 tabular-nums text-terminal-foreground/40"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="min-w-0 [direction:inherit]">
                      {t(rule)}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
