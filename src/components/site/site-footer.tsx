"use client";

/**
 * SiteFooter — sticky to the bottom of the viewport on short pages and pushed
 * down naturally on long ones (root wrapper: min-h-screen flex flex-col +
 * mt-auto here). Content: brand line, section links, stack pin, license.
 */

import { ArrowUp } from "lucide-react";

import { useLanguage } from "@/components/site/language-provider";
import { footer, nav, ui } from "@/lib/manual-content";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-12 lg:px-12">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground"
              >
                §
              </span>
              <span className="text-sm font-semibold ltr:tracking-tight">
                {t({ ar: "ساحة الوكلاء", en: "Agent Playground" })}
              </span>
            </div>
            <p className="prose-body mt-4 text-sm text-muted-foreground">
              {t(footer.builtLine)}
            </p>
          </div>

          <nav aria-label={t(footer.sectionsLabel)}>
            <p className="font-mono text-xs font-medium uppercase text-muted-foreground ltr:tracking-wider">
              {t(footer.sectionsLabel)}
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-10 gap-y-2.5">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="rounded-sm py-1.5 text-sm text-muted-foreground transition-colors hover:text-primary outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    {t(item.label)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t pt-6 font-mono text-xs text-muted-foreground">
          <p>{t(footer.metaLine)}</p>
          <div className="flex items-center gap-5">
            <span>{t(footer.license)}</span>
            <a
              href="#top"
              className="flex items-center gap-1.5 rounded-sm py-1.5 text-muted-foreground transition-colors hover:text-primary outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <ArrowUp className="size-3.5" aria-hidden="true" />
              {t(ui.backToTop)}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
