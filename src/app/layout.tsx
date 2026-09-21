import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_Arabic, Space_Grotesk } from "next/font/google";

import { LanguageProvider } from "@/components/site/language-provider";
import { ThemeProvider } from "@/components/site/theme-provider";

import "./globals.css";

/* Self-hosted via next/font only (§10.1): display swap, explicit subsets.
   Latin glyphs resolve from Space Grotesk; Arabic falls through to IBM Plex
   Sans Arabic (real 700 weight — no faux bold); mono for code/commands. */
const latin = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-arabic",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono-code",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agent-playground.local"),
  title: {
    default: "ساحة الوكلاء — الدليل التشغيلي لبناء مواقع بجودة إنتاجية",
    template: "%s · ساحة الوكلاء",
  },
  description:
    "الدليل التشغيلي للوكلاء الذكيين لبناء مواقع الويب بجودة إنتاجية — عقود، رموز، بوابات تحقق، ومكافحة السلوب. The operating manual for agents building production-grade websites: contracts, tokens, gate battery, anti-slop discipline.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23a0563b'/%3E%3Ctext x='32' y='45' font-family='Georgia, serif' font-size='38' font-weight='700' fill='%23faf6f1' text-anchor='middle'%3E%C2%A7%3C/text%3E%3C/svg%3E",
  },
  openGraph: {
    title: "ساحة الوكلاء — Full-Stack Agent Playground",
    description:
      "الدليل التشغيلي لبناء مواقع الويب بجودة إنتاجية، ثنائي اللغة ومتحقَّق منه في الاتجاهين.",
    type: "website",
    locale: "ar_AR",
    alternateLocale: ["en_US"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6f1" },
    { media: "(prefers-color-scheme: dark)", color: "#211e1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /* lang/dir default to Arabic (SSR); the LanguageProvider flips them
       post-hydration on toggle. suppressHydrationWarning: theme class + dir
       are managed outside React (same pattern as next-themes). */
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${latin.variable} ${arabic.variable} ${mono.variable} antialiased`}
      >
        {/* Runs before paint: gates the reveal system so a JS-disabled render
            keeps all content visible (verification gate #10) */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.dataset.js = '1'",
          }}
        />
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
