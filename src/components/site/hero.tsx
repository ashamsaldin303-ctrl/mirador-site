"use client";

/**
 * Hero — the page's single signature moment: oversized display type over a
 * dot-grid that fades BEFORE the edges (§7.2). No entrance animation: the
 * headline is the LCP element and paints immediately (§6.5 / §10.1).
 * CTA labels are verb + object; one primary + one secondary.
 */

import { ArrowDown, FileCheck2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/site/language-provider";
import { hero } from "@/lib/manual-content";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section id="top" className="relative overflow-hidden border-b">
      <div aria-hidden="true" className="dot-grid absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 md:px-8 md:pb-20 md:pt-20 lg:px-12">
        {/* Kicker */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 font-mono text-xs font-medium text-muted-foreground">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
            {t(hero.kicker)}
          </span>
          <span className="rounded-full border bg-card px-3 py-1 font-mono text-xs font-medium text-muted-foreground">
            AR · EN / RTL · LTR
          </span>
        </div>

        {/* Headline — the LCP element, no animation gating */}
        <h1 className="mt-6 max-w-4xl text-hero ltr:leading-none ltr:tracking-tight rtl:leading-tight">
          {t(hero.title)}
        </h1>

        <p className="prose-body mt-6 max-w-prose text-lg text-muted-foreground">
          {t(hero.sub)}
        </p>

        {/* CTAs — must be visible without scroll at 1440×900 and 375×667
            (§6.5): they come directly after the subhead */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="h-11 px-6 text-base transition-colors">
            <a href="#laws">
              {t(hero.ctaPrimary)}
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-11 px-6 text-base transition-colors"
          >
            <a href="#gates">
              <FileCheck2 className="size-4" aria-hidden="true" />
              {t(hero.ctaSecondary)}
            </a>
          </Button>
        </div>
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          {t(hero.verifiedLine)}
        </p>

        {/* The golden rule — framed callout with a logical-property accent */}
        <figure className="mt-10 max-w-2xl rounded-lg border border-s-4 border-s-primary bg-card p-6 shadow-xs">
          <figcaption className="font-mono text-xs font-medium uppercase text-primary ltr:tracking-wider">
            {t(hero.goldenRuleLabel)}
          </figcaption>
          <blockquote className="prose-body mt-3 text-base font-medium md:text-lg">
            {t(hero.goldenRule)}
          </blockquote>
        </figure>

        {/* Stack chips */}
        <ul className="mt-10 flex flex-wrap gap-x-3 gap-y-2" aria-label="Stack">
          {hero.stackChips.map((chip) => (
            <li
              key={chip}
              className="rounded-sm border border-dashed px-2.5 py-1 font-mono text-xs text-muted-foreground"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
