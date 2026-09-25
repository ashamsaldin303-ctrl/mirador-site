import * as React from "react"

import { cn } from "@/lib/utils"

// MIRADOR (loop2-I3) — the textarea twin of THE input idiom: same hairline
// border / surface@30 fill / amber caret / 16px body text (guaranteed via the
// [data-slot="textarea"] rule in globals.css), min 7 lines of room (min-h-28),
// content-sized growth. Focus = the global bezel; the 1px border state shift
// (amber on focus-visible, error on aria-invalid) rides on top.
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content flex min-h-28 w-full rounded-sm border border-line bg-surface/30 px-3 py-2 text-body text-ink transition-colors duration-base placeholder:text-muted caret-amber focus-visible:border-amber aria-invalid:border-error disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
