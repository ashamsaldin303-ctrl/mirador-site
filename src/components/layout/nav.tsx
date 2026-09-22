"use client";
// MIRADOR — Nav (§4.8): small wordmark lockup · 6 links · Reserve CTA · locale switch
// (atomic EN⇄AR flip, no reload) · mobile sheet (keyboard-operable). z-20 header.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { WordmarkLockup } from "@/components/brand/wordmark-lockup";
import { otherLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export type NavStrings = {
  home: string;
  menu: string;
  story: string;
  gallery: string;
  privateDining: string;
  contact: string;
  cta: string;
  localeSwitch: string;
  openMenu: string;
  closeMenu: string;
};

export const NAV_LINKS = [
  { key: "home", path: "" },
  { key: "menu", path: "/menu" },
  { key: "story", path: "/story" },
  { key: "gallery", path: "/gallery" },
  { key: "privateDining", path: "/private-dining" },
  { key: "contact", path: "/contact" },
] as const;

export function localePath(locale: Locale, path: string): string {
  return `/${locale}${path}`;
}

/** Mirrored path for the other locale (same route, flipped prefix). */
export function mirroredPath(pathname: string, to: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${to}`;
  segments[0] = to;
  return `/${segments.join("/")}`;
}

export function Nav({ locale, strings }: { locale: Locale; strings: NavStrings }) {
  const pathname = usePathname() ?? `/${locale}`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const link = (k: (typeof NAV_LINKS)[number]["key"], path: string) => {
    const href = localePath(locale, path);
    const active = path === "" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link
        key={k}
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "inline-flex min-h-11 items-center px-3 text-small text-muted transition-colors duration-200 hover:text-ink",
          active && "text-ink",
          active && "underline decoration-amber decoration-1 underline-offset-8",
        )}
      >
        {strings[k]}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-20 border-b backdrop-blur-md transition-colors duration-slow",
        scrolled ? "border-line bg-night/80" : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={localePath(locale, "")} className="flex min-h-11 items-center" aria-label="MIRADOR">
          <WordmarkLockup size="sm" />
        </Link>

        <nav aria-label={strings.menu} className="hidden items-center lg:flex">
          {NAV_LINKS.map(({ key, path }) => link(key, path))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={mirroredPath(pathname, otherLocale(locale))}
            className="inline-flex min-h-11 items-center px-3 text-small text-muted transition-colors duration-200 hover:text-ink"
            aria-label={strings.localeSwitch}
          >
            {strings.localeSwitch}
          </Link>
          <Button
            asChild
            className="hidden min-h-11 rounded-full bg-amber px-6 font-sans text-small font-semibold text-night hover:bg-amber/90 sm:inline-flex"
          >
            <Link href={localePath(locale, "/reserve")}>{strings.cta}</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={strings.openMenu}
                className="inline-flex size-11 items-center justify-center rounded-full text-ink lg:hidden"
              >
                <Menu className="size-5" strokeWidth={1.5} aria-hidden />
              </button>
            </SheetTrigger>
            <SheetContent
              side={locale === "ar" ? "left" : "right"}
              className="w-72 border-line bg-night p-6"
            >
              <SheetTitle className="sr-only">{strings.closeMenu}</SheetTitle>
              <div className="flex flex-col gap-1 pt-8">
                {NAV_LINKS.map(({ key, path }) => {
                  const href = localePath(locale, path);
                  const active =
                    path === "" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={key}
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 items-center border-b border-line py-3 text-body text-muted",
                        active && "text-ink",
                      )}
                    >
                      {strings[key]}
                    </Link>
                  );
                })}
                <Link
                  href={mirroredPath(pathname, otherLocale(locale))}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center py-3 text-body text-copper"
                >
                  {strings.localeSwitch}
                </Link>
                <Button
                  asChild
                  className="mt-4 min-h-11 rounded-full bg-amber px-6 font-sans text-small font-semibold text-night hover:bg-amber/90"
                >
                  <Link href={localePath(locale, "/reserve")} onClick={() => setOpen(false)}>
                    {strings.cta}
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
