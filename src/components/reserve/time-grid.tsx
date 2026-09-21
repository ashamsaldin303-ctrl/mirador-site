"use client";
// MIRADOR — TimeGrid (§4.3/§4.9): the 10 dinner slots (18:00–22:30) as a grid,
// availability LIVE from GET /api/availability. Loading → skeleton rows
// (§6.6); fetch error → errors.network + retry (never a dead-end);
// remaining 0 → disabled with the sold-out label (error token is designated
// "form errors + sold-out" in §5.2); selected slot amber. aria-label composed
// with reserve.tablesRemaining ("18:00 — 3 tables" / «18:00 — 3 طاولات»).
import { SLOT_TIMES } from "@/lib/slots";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type SlotAvailability = { time: string; remaining: number };

export type TimeGridProps = {
  slots: SlotAvailability[] | null;
  loading: boolean;
  error: boolean;
  selected: string | null;
  onSelect: (time: string) => void;
  onRetry: () => void;
  loadingLabel: string;
  networkErrorLabel: string;
  retryLabel: string;
  soldOutLabel: string;
  tablesRemainingLabel: string;
  disabled?: boolean;
};

const GRID = "grid grid-cols-2 gap-2 sm:grid-cols-5";

export function TimeGrid({
  slots,
  loading,
  error,
  selected,
  onSelect,
  onRetry,
  loadingLabel,
  networkErrorLabel,
  retryLabel,
  soldOutLabel,
  tablesRemainingLabel,
  disabled,
}: TimeGridProps) {
  if (loading) {
    return (
      <div>
        <div className={GRID} aria-hidden>
          {SLOT_TIMES.map((t) => (
            <Skeleton key={t} className="h-16 rounded-sm" />
          ))}
        </div>
        <span role="status" className="sr-only">
          {loadingLabel}
        </span>
      </div>
    );
  }

  if (error || !slots) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-sm border border-line bg-night px-4 py-6">
        <p className="text-small text-error">{networkErrorLabel}</p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-11 items-center rounded-sm border border-line px-4 text-small text-ink transition-colors duration-base hover:border-amber hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50"
        >
          {retryLabel}
        </button>
      </div>
    );
  }

  return (
    <div className={GRID}>
      {slots.map(({ time, remaining }) => {
        const soldOut = remaining <= 0;
        const isSelected = selected === time;
        const ariaLabel = soldOut
          ? `${time} — ${soldOutLabel}`
          : `${time} — ${remaining} ${tablesRemainingLabel}`;
        return (
          <button
            key={time}
            type="button"
            aria-pressed={isSelected}
            aria-label={ariaLabel}
            disabled={soldOut || disabled}
            onClick={() => onSelect(time)}
            className={cn(
              "flex min-h-11 flex-col items-center justify-center gap-1 rounded-sm border px-2 py-3 transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50",
              isSelected && "border-amber bg-amber/10 text-amber",
              !isSelected && !soldOut && "border-line text-ink hover:border-amber/60 hover:text-amber",
              soldOut && "cursor-not-allowed border-line text-muted opacity-60",
            )}
          >
            <span className="text-body">{time}</span>
            {soldOut ? (
              <span className="text-micro text-error">{soldOutLabel}</span>
            ) : (
              <span className="text-micro text-muted">
                {remaining} {tablesRemainingLabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
