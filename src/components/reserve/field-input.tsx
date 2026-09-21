"use client";
// MIRADOR — FieldInput (§4.9 component inventory): hud-label + input + inline
// per-field error. RTL-correct placement: label above, error below, both
// text-start (logical). Error styling rides the Input's native aria-invalid
// token styles (destructive/error + amber focus ring per §5.2 mapping).
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type FieldInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "tel";
  autoComplete?: string;
  /** force LTR inner flow for phone numbers (Western digits, RTL-safe) */
  dir?: "ltr" | "rtl";
  disabled?: boolean;
};

export function FieldInput({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  dir,
  disabled,
}: FieldInputProps) {
  const errorId = `${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="hud-label">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        autoComplete={autoComplete}
        dir={dir}
        inputMode={type === "tel" ? "tel" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="h-11 min-h-11 rounded-sm border-line bg-night text-body text-ink dark:bg-night"
      />
      {error ? (
        <p id={errorId} className="text-start text-small text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
