import { AntiSlopSection } from "@/components/site/anti-slop-section";
import { GatesSection } from "@/components/site/gates-section";
import { Hero } from "@/components/site/hero";
import { LawsSection } from "@/components/site/laws-section";
import { NeverSection } from "@/components/site/never-section";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SkipLink } from "@/components/site/skip-link";
import { StackSection } from "@/components/site/stack-section";
import { WorkflowSection } from "@/components/site/workflow-section";

/**
 * Full-Stack Agent Playground — one page, the whole operating system.
 * Root wrapper: min-h-dvh (never 100vh on mobile — §6.1) + flex column so the
 * footer sticks to the bottom on short viewports and is pushed naturally on
 * long ones. The grain layer sits above the canvas background and below all
 * content (§7.2).
 */
export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
        <LawsSection />
        <WorkflowSection />
        <StackSection />
        <GatesSection />
        <AntiSlopSection />
        <NeverSection />
      </main>
      <SiteFooter />
      <div aria-hidden="true" className="grain-layer" />
    </div>
  );
}
