import { cn } from "@/lib/utils"

// MIRADOR (loop2-I3): the placeholder surface is the house's own — surface
// tint + sharp 2px corner (the stock accent roundness is gone). Pulse stays
// (skeleton idiom); breathe owns busy buttons, skeleton owns loading regions.
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-sm bg-surface", className)}
      {...props}
    />
  )
}

export { Skeleton }
