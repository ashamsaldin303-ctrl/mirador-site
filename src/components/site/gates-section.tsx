"use client";

/**
 * GatesSection — the 12-gate battery as an interactive verification matrix
 * (§11.1 / §11.2). Toggle each gate your build passes; watch the termination
 * contract: when all 12 turn green, the only legal move is STOP (§11.3).
 *
 * RTL notes: commands are LTR islands (code — no-mirror inventory, §6.2);
 * the progress bar fills from the reading side via a logical transform origin
 * (the stock Progress component translates physically and breaks RTL).
 */

import { useEffect, useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/components/site/language-provider";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { gatesSection, ui } from "@/lib/manual-content";
import { cn } from "@/lib/utils";

export function GatesSection() {
  const { t } = useLanguage();
  const [passed, setPassed] = useState<boolean[]>(() =>
    gatesSection.gates.map(() => false),
  );
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle",
  );

  const total = gatesSection.gates.length;
  const count = passed.filter(Boolean).length;
  const allGreen = count === total;
  const pct = Math.round((count / total) * 100);

  /* Copied feedback reverts after 2s — feedback visible <100ms on click */
  useEffect(() => {
    if (copyState === "idle") return;
    const timer = setTimeout(() => setCopyState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [copyState]);

  function toggleGate(index: number) {
    setPassed((current) =>
      current.map((value, i) => (i === index ? !value : value)),
    );
  }

  async function copyCommands() {
    const script = gatesSection.gates
      .map((gate) => `$ ${gate.command}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(script);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <section
      id="gates"
      className="scroll-mt-24 border-y bg-secondary/30 py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
        <SectionHeading
          index={gatesSection.index}
          kicker={gatesSection.kicker}
          title={gatesSection.title}
          intro={gatesSection.intro}
        />

        <Reveal>
          <div className="overflow-hidden rounded-lg border shadow-xs">
            {/* Terminal chrome */}
            <div className="flex flex-wrap items-center gap-3 bg-terminal px-4 py-3 text-terminal-foreground">
              <span aria-hidden="true" className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-destructive" />
                <span className="size-3 rounded-full bg-warning" />
                <span className="size-3 rounded-full bg-success" />
              </span>
              <span className="font-mono text-xs font-medium" dir="ltr">
                {gatesSection.terminalName}
              </span>
              <div className="ms-auto flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyCommands}
                  className={cn(
                    "h-9 gap-1.5 font-mono text-xs text-terminal-foreground transition-colors hover:bg-white/10 hover:text-terminal-foreground",
                    copyState === "copied" && "text-success",
                    copyState === "failed" && "text-destructive",
                  )}
                >
                  {copyState === "copied" ? (
                    <Check className="size-3.5" aria-hidden="true" />
                  ) : (
                    <Copy className="size-3.5" aria-hidden="true" />
                  )}
                  {copyState === "copied"
                    ? t(ui.copied)
                    : copyState === "failed"
                      ? t(ui.copyFailed)
                      : t(ui.copyCommands)}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPassed(gatesSection.gates.map(() => false))}
                  className="h-9 gap-1.5 font-mono text-xs text-terminal-foreground transition-colors hover:bg-white/10 hover:text-terminal-foreground"
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  {t(ui.resetGates)}
                </Button>
              </div>
            </div>

            {/* Gate rows */}
            <div className="bg-terminal px-4 py-2 text-terminal-foreground md:px-5">
              <ol>
                {gatesSection.gates.map((gate, index) => (
                  <li
                    key={gate.n}
                    className="flex items-start gap-3 border-t border-white/10 py-3.5 first:border-t-0"
                  >
                    <Checkbox
                      id={`gate-${gate.n}`}
                      checked={passed[index]}
                      onCheckedChange={() => toggleGate(index)}
                      className="mt-1"
                      aria-label={t(gate.label)}
                    />
                    <label
                      htmlFor={`gate-${gate.n}`}
                      className="min-w-0 flex-1 cursor-pointer select-none"
                    >
                      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-mono text-xs text-terminal-foreground/50 tabular-nums">
                          {gate.n}
                        </span>
                        <span className="text-sm font-medium">
                          {t(gate.label)}
                        </span>
                      </span>
                      <span
                        dir="ltr"
                        className="mt-1 block w-fit overflow-x-auto font-mono text-xs text-terminal-foreground/75"
                      >
                        $ {gate.command}
                      </span>
                      <span className="prose-body mt-0.5 block text-xs text-terminal-foreground/60">
                        {t(gate.desc)}
                      </span>
                    </label>
                  </li>
                ))}
              </ol>
            </div>

            {/* Status footer */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 bg-terminal px-4 py-4 text-terminal-foreground md:px-5">
              <div
                className="min-w-40 flex-1 basis-48"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                aria-label={t(ui.gatesPassed)}
              >
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full w-full origin-left bg-success transition-transform duration-350 ease-out rtl:origin-right"
                    style={{ transform: `scaleX(${pct / 100})` }}
                  />
                </div>
              </div>
              <span
                aria-live="polite"
                className="font-mono text-sm tabular-nums text-terminal-foreground/85"
              >
                {count} / {total} {t(ui.gatesPassed)}
              </span>
              <span
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-xs font-semibold",
                  allGreen
                    ? "border-success/40 bg-success/15 text-success"
                    : "border-white/15 bg-white/5 text-terminal-foreground/70",
                )}
              >
                {allGreen ? t(ui.allGreen) : t(ui.inProgress)}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
