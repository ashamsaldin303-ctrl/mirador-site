"use client";
// MIRADOR — Nav (§4.8): small wordmark lockup · 6 links · Reserve CTA · locale
// switch (atomic EN⇄AR flip, no reload — same-route prefix mirror) · mobile sheet
// (keyboard-operable). z-20 header.
// P-100 (loop-1, design audit 2-d): the locale switcher is a hairline segmented
// control (EN | عربي, active = surface fill); scrolled state deepens to
// bg-night/85 + a 24px drop shadow; non-active desktop links draw the link-draw
// hairline on hover (the bezel stays the ONLY focus indicator); the mobile sheet
// widens to 20rem and opens with the lockup + hud-rule, numeraled links
// (01–06 copper micro), and a bottom mini-meta block (address + hours, VENUE
// facts, the lamp-dot ember on the hours line) above the CTA.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { WordmarkLockup } from "@/components/brand/wordmark-lockup";
import { otherLocale, type Locale } from "@/lib/i18n";
import { VENUE } from "@/lib/venue";
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

/** The segmented control's fixed segment order (EN | عربي — reading order
 *  stays stable in both directions; only the fill moves). */
const LOCALE_CODES: readonly Locale[] = ["en", "ar"];

/** The venue's open hours, short form (first VENUE segment — days + times,
 *  no kitchen/monday detail) for the sheet's mini meta line. */
const hoursShortOf = (locale: Locale): string =>
  (locale === "ar" ? VENUE.hoursAr : VENUE.hoursEn).split(" · ")[0] ?? "";

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
  const hoursShort = hoursShortOf(locale);

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
          "inline-flex min-h-11 items-center px-3 text-small text-muted transition-colors duration-base hover:text-ink",
          // link-draw (hover underline draw) only on NON-active links — the
          // active link already carries its amber underline. The ::after also
          // draws on focus-visible — decoration ON TOP of the bezel, never a
          // replacement for it.
          !active && "link-draw",
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
        scrolled
          ? "border-line bg-night/85 shadow-[0_1px_24px_rgba(0,0,0,0.45)]"
          : "border-transparent bg-transparent",
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
          {/* The locale segmented control — a hairline pill, both scripts side by
              side; the active locale fills with surface. Same-route prefix flip
              (mirroredPath) exactly as before. */}
          <div
            role="group"
            aria-label={strings.localeSwitch}
            className="inline-flex items-center rounded-full border border-line"
          >
            {LOCALE_CODES.map((code) => {
              const isActive = locale === code;
              return (
                <Link
                  key={code}
                  href={mirroredPath(pathname, code)}
                  // R13/E79: NO prefetch — the switcher flips the whole page's
                  // language; its RSC payload carries the OTHER locale's font
                  // preloads, and React's head adoption pulls them into THIS
                  // page's request queue mid-load (amiri-wordmark + 29KB
                  // plex-arabic on the EN door — inside the modeled LCP path on
                  // runs 21-23). A locale flip is a full navigation anyway.
                  prefetch={false}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-full px-3 text-micro transition-colors duration-base",
                    isActive ? "bg-surface text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {code === "en" ? "EN" : "عربي"}
                </Link>
              );
            })}
          </div>
          <Button variant="cta" size="compact" asChild className="hidden sm:inline-flex">
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
              // loop2-I4 (§5): the localized sr-only string for the sheet's X —
              // the lost run shipped it unwired (hardcoded "Close" under AR).
              closeLabel={strings.closeMenu}
              className="w-[20rem] border-line bg-night p-6"
            >
              <SheetTitle className="sr-only">{strings.closeMenu}</SheetTitle>
              {/* the sheet opens as the house, not a dropdown — lockup + hairline */}
              <div className="flex min-h-11 items-center">
                <WordmarkLockup size="sm" />
              </div>
              <hr className="hud-rule" />
              <nav aria-label={strings.menu} className="flex flex-col">
                {NAV_LINKS.map(({ key, path }, i) => {
                  const href = localePath(locale, path);
                  const active =
                    path === "" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={key}
                      href={href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      // loop2-I4 (§5): the open cascade — .sheet-nav-link rides
                      // the [data-state=open] slot-in animation in globals.css;
                      // --sheet-i drives the i×40ms (cap 6) delay. DOM order =
                      // reading order in BOTH directions — RTL-safe by design.
                      style={{ "--sheet-i": Math.min(i, 6) } as React.CSSProperties}
                      className={cn(
                        "sheet-nav-link flex min-h-11 items-center gap-4 border-b border-line py-3 text-body-lg",
                        active ? "text-ink" : "text-muted",
                      )}
                    >
                      <span aria-hidden className="text-micro tabular-nums text-copper">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {strings[key]}
                    </Link>
                  );
                })}
                <Link
                  href={mirroredPath(pathname, otherLocale(locale))}
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  style={{ "--sheet-i": 6 } as React.CSSProperties}
                  className="sheet-nav-link flex min-h-11 items-center py-3 text-body text-copper"
                >
                  {strings.localeSwitch}
                </Link>
              </nav>
              {/* the bottom block: the house in micro (address + hours, VENUE
                  facts — the lamp-dot ember on the hours line) above the CTA */}
              <div className="mt-auto flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="hud-label">
                    {locale === "ar" ? VENUE.addressAr : VENUE.addressEn}
                  </p>
                  <p className="hud-label lamp-dot">{hoursShort}</p>
                </div>
                <Button variant="cta" size="compact" asChild>
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
