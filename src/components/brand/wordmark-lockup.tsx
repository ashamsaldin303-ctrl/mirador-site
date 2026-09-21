// MIRADOR — WordmarkLockup: the oversized dual-script display lockup (§4.1, §5.5 type trend)
import { cn } from "@/lib/utils";

export function WordmarkLockup({
  className,
  size = "md",
  ariaLabel = "MIRADOR",
}: {
  className?: string;
  size?: "sm" | "md" | "xl";
  ariaLabel?: string;
}) {
  const en =
    size === "xl"
      ? "text-display-xl"
      : size === "sm"
        ? "text-small"
        : "text-h3";
  const ar =
    size === "xl"
      ? "text-display-xl"
      : size === "sm"
        ? "text-small"
        : "text-h3";
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)} aria-label={ariaLabel}>
      <span className={cn("font-display-en leading-none text-ink", en)}>MIRADOR</span>
      <span aria-hidden="true" className="text-copper leading-none">
        ×
      </span>
      <span className={cn("font-display-ar leading-none text-ink", ar)}>ميرادور</span>
    </span>
  );
}
