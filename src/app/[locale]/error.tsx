"use client";
// MIRADOR — route-level error boundary (app-wide states, §6.6): brand surface,
// retry. Errors inside any [locale] route render here within the locale shell.
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[route-error]", error);
  }, [error]);

  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex max-w-xl flex-col items-center gap-6">
        <p className="hud-label">MIRADOR</p>
        <h1 className="font-display text-h2 text-ink">The lights flickered.</h1>
        <p className="font-sans text-body-lg text-muted" dir="rtl" lang="ar">
          ارتجّ الضوء لحظة. أعد المحاولة — المدينة ما تزال هناك.
        </p>
        <Button
          onClick={reset}
          className="mt-2 min-h-11 rounded-full bg-amber px-8 font-sans text-small font-semibold text-night hover:bg-amber/90"
        >
          <RotateCcw className="size-4" strokeWidth={1.5} aria-hidden />
          Retry
        </Button>
      </div>
    </section>
  );
}
