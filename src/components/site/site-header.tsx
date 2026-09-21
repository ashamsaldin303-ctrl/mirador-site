"use client";

/**
 * SiteHeader — one layout-level nav + a route manifest (§6.5):
 * visible active state via scroll-spy + aria-current, 5–7 links,
 * mobile navigation through an accessible Radix dropdown (focus handled),
 * 44px touch targets, solid surface (no glass over plain background — §7.2).
 */

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Languages, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/components/site/language-provider";
import { nav, ui } from "@/lib/manual-content";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { t, locale, toggleLocale } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const [activeId, setActiveId] = useState<string | null>(null);
  /* Scroll-spy: the section crossing the upper-middle band is the active one */
  useEffect(() => {
    const sections = nav
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* Theme toggle — icons swap via the .dark class (pre-painted by
     next-themes): zero hydration mismatch, zero effect state */
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-8 lg:px-12">
        {/* Wordmark */}
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5 rounded-md outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-md bg-primary font-mono text-base font-bold text-primary-foreground"
          >
            §
          </span>
          <span className="hidden text-sm font-semibold ltr:tracking-tight sm:inline">
            {t({ ar: "ساحة الوكلاء", en: "Agent Playground" })}
          </span>
        </a>

        {/* Desktop nav — 6 links, active state + aria-current */}
        <nav aria-label={t({ ar: "أقسام الدليل", en: "Manual sections" })} className="mx-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "relative rounded-md px-3 py-3 text-sm font-medium transition-colors outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring",
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t(item.label)}
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          {/* Language toggle — 44px hit area */}
          <Button
            variant="ghost"
            onClick={toggleLocale}
            aria-label={t(ui.switchToEnglish)}
            className="h-11 gap-2 px-4 transition-colors"
          >
            <Languages className="size-4" aria-hidden="true" />
            <span className="font-mono text-sm font-semibold">
              {locale === "ar" ? "EN" : "ع"}
            </span>
          </Button>

          <Button
            variant="ghost"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label={t(ui.toggleTheme)}
            className="size-11 transition-colors"
          >
            <Sun className="size-5 dark:hidden" aria-hidden="true" />
            <Moon className="hidden size-5 dark:block" aria-hidden="true" />
          </Button>

          {/* Mobile nav — accessible dropdown */}
          <div className="md:hidden">
            <DropdownMenu dir={locale === "ar" ? "rtl" : "ltr"}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  aria-label={t(ui.openMenu)}
                  className="size-11 transition-colors"
                >
                  <Menu className="size-5" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {nav.map((item) => (
                  <DropdownMenuItem key={item.id} asChild className="py-3">
                    <a href={`#${item.id}`}>{t(item.label)}</a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
