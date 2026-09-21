"use client";

import { useLanguage } from "@/components/site/language-provider";
import { ui } from "@/lib/manual-content";

/** Skip link — first focusable element, visible only on keyboard focus. */
export function SkipLink() {
  const { t } = useLanguage();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground"
    >
      {t(ui.skipToContent)}
    </a>
  );
}
