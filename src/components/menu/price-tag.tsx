// MIRADOR — PriceTag: the §7.5 dual price, pre-formatted per locale by
// formatPrice(usdCents, locale) — `$28 · 350,000 SYP` / `28$ · 350,000 ل.س`.
import { cn } from "@/lib/utils";

export function PriceTag({
  price,
  className,
}: {
  price: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "shrink-0 whitespace-nowrap text-small tabular-nums text-ink",
        className,
      )}
    >
      {price}
    </p>
  );
}
