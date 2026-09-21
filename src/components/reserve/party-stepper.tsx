"use client";
// MIRADOR — PartyStepper (§4.3/§4.9): − / count / + · hard clamp 1–12 ·
// count + unit announced via aria-live="polite" · 44px targets · logical
// borders (border-s/e) so RTL mirrors the control correctly.
import { Minus, Plus } from "lucide-react";

export type PartyStepperProps = {
  value: number;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
  unit: string;
  min?: number;
  max?: number;
  disabled?: boolean;
};

export function PartyStepper({
  value,
  onChange,
  decreaseLabel,
  increaseLabel,
  unit,
  min = 1,
  max = 12,
  disabled = false,
}: PartyStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div className="inline-flex max-w-full items-stretch rounded-sm border border-line bg-night">
      <button
        type="button"
        aria-label={decreaseLabel}
        disabled={disabled || value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-s-sm text-muted transition-colors duration-fast hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50 disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus className="size-5" strokeWidth={1.5} aria-hidden />
      </button>
      <div
        aria-live="polite"
        className="flex min-w-24 items-center justify-center border-s border-e border-line px-4 py-2"
      >
        <p className="text-body text-ink">
          {value}
          <span className="ms-2 text-micro text-muted">{unit}</span>
        </p>
      </div>
      <button
        type="button"
        aria-label={increaseLabel}
        disabled={disabled || value >= max}
        onClick={() => onChange(clamp(value + 1))}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-e-sm text-muted transition-colors duration-fast hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50 disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus className="size-5" strokeWidth={1.5} aria-hidden />
      </button>
    </div>
  );
}
