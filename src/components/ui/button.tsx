"use client";
// MIRADOR — THE Button API (P-035, prompt-4 R10): ONE surface, no ad-hoc
// variants. Variants × sizes, normative:
//   cta           — the amber pill (city light on night): bg-amber, ink-on-
//                   amber text, brightness-not-wash hover (bg-amber/90).
//   quiet         — the understated link-button: underline at the 8px
//                   altitude (P-075), line-color hairline → amber on hover.
//   quietOutline  — the hairline pill (dish overlay, secondary actions):
//                   1px line border (1px = state), amber border + ink text
//                   on hover — no fills.
// Sizes: full (px-8, hero/404) · compact (px-6, nav/success) · flow (px-4,
// in-flow secondary). EVERY button instance migrates onto this API —
// audit:idioms (A1–A12) enforces zero ad-hoc variants (E66).
// Ledger-family laws (documented as idiom contracts, docs/idiom-contracts.md):
//   1px = state · 2px = fact  ·  error = color, never weight  ·  inputs: no
//   hover, caret amber, LTR island. Focus is NOT styled here — the site-wide
//   BEZEL owns it (P-075).
// loop2-I3: the press transition — filter+colors on the house curve via the
// transition-press utility (a transition-[filter,colors,transform] literal is
// invalid in Tailwind 4), active:brightness-90 gives every press a physical
// dim. The cta pill speaks at text-body (16px) — command text, not caption.
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // base: the touch law (44px) + the press transition (filter+colors, 200ms,
  // expo-out — see @utility transition-press in globals.css)
  "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap font-sans text-small transition-press active:brightness-90 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        cta: "rounded-full bg-amber px-8 font-semibold text-body text-night hover:bg-amber/90",
        quiet:
          "px-1 text-muted underline decoration-line underline-offset-8 hover:text-ink hover:decoration-amber",
        quietOutline:
          "rounded-full border border-line bg-transparent px-4 text-muted hover:border-amber hover:bg-transparent hover:text-ink",
      },
      size: {
        full: "", // the variant's own padding stands (cta px-8 / quietOutline px-4)
        compact: "", // compound variants below retune the pill paddings
        flow: "",
      },
    },
    compoundVariants: [
      { variant: "cta", size: "compact", class: "px-6" },
      { variant: "cta", size: "flow", class: "px-4" },
    ],
    defaultVariants: {
      variant: "cta",
      size: "full",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
