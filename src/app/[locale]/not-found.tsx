// MIRADOR — designed 404 brand surface (§4.8, §7.9, F11-1): night mini-poster +
// home CTA, HTTP 404. Server-rendered; locale resolved from the proxy header
// (the not-found boundary receives no params).
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function NotFound() {
  const h = await headers();
  const raw = h.get("x-mirador-locale") ?? "en";
  const locale = isLocale(raw) ? raw : "en";
  const dict = getDictionary(locale);
  return (
    <section className="media-grain relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <Image
        src="/img/404/night-mini.avif"
        alt={dict["meta.404.title"]}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-night/70" />
      <div className="relative z-10 flex max-w-xl flex-col items-center gap-6 py-24">
        <p className="hud-label">404 · FLOOR</p>
        <h1 className="font-display text-h1 text-ink">{dict["meta.404.title"]}</h1>
        <p className="font-sans text-body-lg text-muted">{dict["meta.404.sub"]}</p>
        <Button
          asChild
          className="mt-4 min-h-11 rounded-full bg-amber px-8 font-sans text-small font-semibold text-night hover:bg-amber/90"
        >
          <Link href={`/${locale}`}>{dict["meta.404.cta"]}</Link>
        </Button>
      </div>
    </section>
  );
}
