"use client";
// MIRADOR — DateStrip (§4.3/§4.9): horizontal scrollable strip of the next 60
// Damascus-local days. Monday = closed: aria-disabled + dimmed + the
// closed-Monday line as title/aria note (focusable so the reason is
// discoverable — the WCAG aria-disabled pattern, not a dead native-disable).
// Western digits in both locales: Intl locale carries the -u-nu-latn extension
// (numerals policy — never Arabic-Indic). Selected day = amber hairline
// underline (border-b, matches the nav active-link idiom). loop2-I3: the
// strip scrolls with snap — snap-x snap-mandatory on the container, snap-start
// per day cell, so a flick settles a whole day, not half of one.
import { useMemo } from "react";
import { isBookableDay, slotInstant } from "@/lib/slots";
import { cn } from "@/lib/utils";

export type DateStripProps = {
  days: string[]; // Damascus-local "YYYY-MM-DD", from dateStrip(60)
  selected: string | null;
  onSelect: (date: string) => void;
  locale: "en" | "ar";
  closedMondayLabel: string;
  disabled?: boolean;
};

const isMonday = (day: string) => !isBookableDay(slotInstant(day, "00:00"));

export function DateStrip({ days, selected, onSelect, locale, closedMondayLabel, disabled }: DateStripProps) {
  const fmt = useMemo(() => {
    // ar-u-nu-latn: Arabic month/weekday names, Western digits
    const intlLocale = locale === "ar" ? "ar-u-nu-latn" : locale;
    const base = { timeZone: "UTC" as const };
    return {
      weekday: new Intl.DateTimeFormat(intlLocale, { ...base, weekday: "short" }),
      day: new Intl.DateTimeFormat(intlLocale, { ...base, day: "numeric" }),
      month: new Intl.DateTimeFormat(intlLocale, { ...base, month: "short" }),
      full: new Intl.DateTimeFormat(intlLocale, {
        ...base,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  }, [locale]);

  return (
    <div className="scroll-thin -mx-1 snap-x snap-mandatory overflow-x-auto px-1 pb-2">
      <div className="flex min-w-max items-stretch gap-1">
        {days.map((day, i) => {
          const monday = isMonday(day);
          // noon-UTC anchor: same civil date in any timezone, no DST surprises
          const dt = new Date(`${day}T12:00:00Z`);
          const monthStart = i === 0 || day.slice(0, 7) !== days[i - 1]?.slice(0, 7);
          const isSelected = selected === day;
          const label = monday
            ? `${fmt.full.format(dt)} — ${closedMondayLabel}`
            : fmt.full.format(dt);
          return (
            <button
              key={day}
              type="button"
              aria-pressed={isSelected}
              aria-disabled={monday || disabled || undefined}
              title={monday ? closedMondayLabel : undefined}
              aria-label={label}
              onClick={() => {
                if (monday || disabled) return; // closed day stays inert, reason on the label
                onSelect(day);
              }}
              className={cn(
                "flex min-h-11 w-16 shrink-0 snap-start flex-col items-center gap-1 border-b px-2 pb-2 pt-2 transition-colors duration-fast",
                isSelected ? "border-amber text-ink" : "border-transparent text-muted",
                !isSelected && !monday && "hover:bg-surface hover:text-ink",
                monday && "opacity-50",
                disabled && !monday && "opacity-50",
              )}
            >
              <span className="text-micro text-muted" aria-hidden>
                {monthStart ? fmt.month.format(dt) : fmt.weekday.format(dt)}
              </span>
              <span className="text-body" aria-hidden>
                {fmt.day.format(dt)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
