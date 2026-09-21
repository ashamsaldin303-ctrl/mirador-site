"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Dark mode via ONE mechanism: token swap (§5.2) — next-themes `class`
 * attribute with system default + toggle. next-themes injects its own
 * pre-paint script (no FOUC — never set theme in useEffect).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
