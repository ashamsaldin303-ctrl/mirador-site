"use client";

/**
 * StackSection — the four stack-law panels in an accessible Tabs component
 * (keyboard navigation handled by Radix). Tab order visually reverses under
 * RTL via logical layout; every panel is a plain semantic list.
 */

import { Atom, Database, LayoutTemplate, ShieldCheck } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/site/language-provider";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { stackSection } from "@/lib/manual-content";

const tabIcons = {
  nextjs: LayoutTemplate,
  react: Atom,
  prisma: Database,
  zod: ShieldCheck,
} as const;

export function StackSection() {
  const { t } = useLanguage();

  return (
    <section id="stack" className="scroll-mt-24 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-8 lg:px-12">
        <SectionHeading
          index={stackSection.index}
          kicker={stackSection.kicker}
          title={stackSection.title}
          intro={stackSection.intro}
        />

        <Reveal>
          <Tabs defaultValue="nextjs" className="flex flex-col gap-8">
            <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-muted p-1.5 sm:w-auto sm:inline-flex">
              {stackSection.tabs.map((tab) => {
                const Icon = tabIcons[tab.id as keyof typeof tabIcons];
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="gap-2 px-4 py-2.5 text-sm data-[state=active]:bg-card"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {t(tab.label)}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {stackSection.tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <ul className="grid gap-x-10 gap-y-5 md:grid-cols-2">
                  {tab.laws.map((law) => (
                    <li
                      key={law.en}
                      className="border-s-2 border-primary/30 ps-4 text-sm"
                    >
                      <p className="prose-body text-card-foreground">{t(law)}</p>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            ))}
          </Tabs>
        </Reveal>
      </div>
    </section>
  );
}
