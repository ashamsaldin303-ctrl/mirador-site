"use client";
// MIRADOR — TimeGrid (§4.3/§4.9): the 10 dinner slots (18:00–22:30) as a grid,
// availability LIVE from GET /api/availability. Loading → skeleton rows
// (§6.6); fetch error → errors.network + retry (never a dead-end);
// remaining 0 → disabled with the sold-out label (error token is designated
// "form errors + sold-out" in §5.2); selected slot amber. aria-label composed
// with reserve.tablesRemaining ("18:00 — 3 tables" / «18:00 — 3 طاولات»).
// P-098 (prompt-6 R7 · E97): THE ROOM'S LIGHT — the pre-attentive STATIC
// channel keyed off `remaining` (already in the slot DTO — zero API change):
// 4+ = the steady hairline (the base border) · 2–3 = the hairline at 70%
// (border-line/70) · 1 = the hairline at full amber (border-amber) + the
// count numeral in amber — the strongest static signal, NO loop, NO breathe
// rider (the stillness census is sacred). The text count STAYS (the
// redundant-encoding law); the aria-label format is UNCHANGED verbatim.
import { SLOT_TIMES } from "@/lib/slots";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type SlotAvailability = { time: string; remaining: number; past?: boolean };

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
  pastLabel: string;
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
  pastLabel,
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
          className="inline-flex min-h-11 items-center rounded-sm border border-line px-4 text-small text-ink transition-colors duration-base hover:border-amber hover:text-amber "
        >
          {retryLabel}
        </button>
      </div>
    );
  }

  return (
    <div className={GRID}>
      {slots.map(({ time, remaining, past }) => {
        const ended = past === true; // R11: «انتهى» — the night moved on (≠ sold out)
        const soldOut = !ended && remaining <= 0;
        const isSelected = selected === time;
        const lastTable = !ended && !soldOut && remaining === 1; // P-098: the room's last table
        const thinning = !ended && !soldOut && !lastTable && remaining <= 3; // P-098: 2–3 left
        const stateLabel = ended ? pastLabel : soldOut ? soldOutLabel : null;
        const ariaLabel = stateLabel
          ? `${time} — ${stateLabel}`
          : `${time} — ${remaining} ${tablesRemainingLabel}`;
        return (
          <button
            key={time}
            type="button"
            aria-pressed={isSelected}
            aria-label={ariaLabel}
            disabled={ended || soldOut || disabled}
            onClick={() => onSelect(time)}
            className={cn(
              "flex min-h-11 flex-col items-center justify-center gap-1 rounded-sm border px-2 py-3 transition-colors duration-fast",
              "",
              isSelected && "border-amber bg-amber/10 text-amber",
              !isSelected && !soldOut && !ended && "border-line text-ink hover:border-amber/60 hover:text-amber",
              // P-098: the room's light — direction-agnostic utility classes
              // keyed off `remaining`, ordered AFTER the base branch so the
              // scarcity hairlines win the merge; the steady state rides
              // the base border above (4+ remaining)
              thinning && "border-line/70",
              lastTable && "border-amber",
              (soldOut || ended) && "cursor-not-allowed border-line text-muted opacity-60",
            )}
          >
            <span className="text-body tabular-nums">{time}</span>
            {ended ? (
              <span className="text-micro text-muted">{pastLabel}</span>
            ) : soldOut ? (
              <span className="text-micro text-error">{soldOutLabel}</span>
            ) : (
              <span
                className={cn(
                  "text-micro tabular-nums text-muted",
                  lastTable && "text-amber", // P-098: the count numeral in amber at the last table
                )}
              >
                {remaining} {tablesRemainingLabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
