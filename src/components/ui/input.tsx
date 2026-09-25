import * as React from "react"

import { cn } from "@/lib/utils"

// MIRADOR (loop2-I3) — THE input surface. One idiom sitewide (ledger law):
// 44px touch height, hairline 1px border (1px = state — amber on the bezel's
// focus, error when aria-invalid), surface@30 fill on night, sharp 2px corner,
// 16px body text ALWAYS (the [data-slot="input"] guarantee in globals.css
// keeps it merge-proof), amber caret, no hover states on inputs. Focus ring is
// NOT styled here — the site-wide BEZEL owns it (P-075); focus-visible adds
// only the 1px border state shift.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-sm border border-line bg-surface/30 px-3 text-body text-ink transition-colors duration-base placeholder:text-muted caret-amber focus-visible:border-amber aria-invalid:border-error disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
