// MIRADOR proxy (Next 16 middleware convention) — locale-prefix enforcement (§4 route-split contract)
// Bare `/` → `/en` (deterministic default — NO Accept-Language negotiation;
// hreflang x-default covers SEO). Bare unprefixed paths gain the default prefix.
import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["en", "ar"] as const;

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // pass through internals, API, assets, and any file with an extension
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/img") ||
    pathname.startsWith("/fonts") ||
    pathname === "/robots.txt" ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!hasLocale) {
    const url = req.nextUrl.clone();
    url.pathname = `/en${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }
  const locale = pathname.startsWith("/ar") ? "ar" : "en";
  const headers = new Headers(req.headers);
  headers.set("x-mirador-locale", locale);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // run on everything except internals/API/assets (finer checks inside)
  matcher: ["/((?!_next|api|img|fonts).*)"],
};
