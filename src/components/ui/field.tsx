"use client";
// MIRADOR — THE Field (loop2-I3): the ONE field idiom sitewide, lifted from
// reserve/field-input.tsx (deleted) and generalized. Contract:
//   · label FLOATS — rests INSIDE the field (16px, ink/70), rises on
//     :focus-within OR value (the placeholder=" " sentinel drives
//     :placeholder-shown for uncontrolled fields) → text-micro + muted,
//     28px lift, 200ms, pure CSS (`.field-shell`/`.field-label` in globals).
//     EN floats uppercase+tracked; AR NEVER (html[dir] gate, NEVER-10).
//     Date inputs never match :placeholder-shown → their label floats
//     permanently (correct: the UA format hint owns the resting line).
//   · hint      — persistent helper text, own id, wired aria-describedby.
//   · error     — client-side inline error (id + aria-invalid).
//   · serverError — the server's 400 field error, same wiring, own id.
//   · as        — "input" (default) | "textarea".
//   · controlled (value+onChange) AND uncontrolled (name/defaultValue,
//     FormData-native) — reserve is controlled, inquiry is uncontrolled.
// RTL: label + error + hint all text-start (logical); phone fields pass
// dir="ltr" for the Western-digit island. The bezel owns focus.
import * as React from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export type FieldProps = {
  id: string;
  label: string;
  /** controlled value — omit (with onChange) for uncontrolled fields */
  value?: string;
  onChange?: (value: string) => void;
  /** uncontrolled initial value (FormData fields) */
  defaultValue?: string;
  /** client-side inline error (own id, aria-invalid + error text) */
  error?: string;
  /** server 400 field error — same wiring as error, its own id */
  serverError?: string;
  /** persistent helper text — text-micro muted, id + aria-describedby wired */
  hint?: string;
  as?: "input" | "textarea";
  type?: "text" | "tel" | "date" | "number" | "email" | "url" | "password";
  /** real placeholder text (rare — the resting label IS the placeholder) */
  placeholder?: string;
  autoComplete?: string;
  /** force LTR inner flow for phone numbers (Western digits, RTL-safe) */
  dir?: "ltr" | "rtl";
  disabled?: boolean;
  /** native required flag (semantics only — validation is bespoke) */
  required?: boolean;
  name?: string;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  /** extra classes for the input/textarea control itself */
  className?: string;
};

export function Field({
  id,
  label,
  value,
  onChange,
  defaultValue,
  error,
  serverError,
  hint,
  as = "input",
  type = "text",
  placeholder,
  autoComplete,
  dir,
  disabled,
  required = true,
  name,
  rows,
  min,
  max,
  step,
  className,
}: FieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const serverErrorId = `${id}-server-error`;

  const describedBy =
    [
      hint ? hintId : null,
      error ? errorId : null,
      serverError ? serverErrorId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;
  const invalid = error || serverError ? true : undefined;

  const onInputChange = onChange
    ? (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)
    : undefined;
  const onAreaChange = onChange
    ? (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)
    : undefined;

  // controlled: value + onChange together. Uncontrolled: defaultValue and an
  // optional change listener (FormData still owns the source of truth).
  const controlState =
    value !== undefined
      ? { value, onChange: onInputChange }
      : { defaultValue, ...(onInputChange ? { onChange: onInputChange } : {}) };
  const areaState =
    value !== undefined
      ? { value, onChange: onAreaChange }
      : { defaultValue, ...(onAreaChange ? { onChange: onAreaChange } : {}) };

  // The whitespace sentinel: an empty field shows its (invisible) placeholder
  // → :placeholder-shown matches → the label rests. Never leave the attribute
  // undefined or the float loses its value signal for uncontrolled fields.
  const sentinel = placeholder ?? " ";

  return (
    <div className="flex flex-col gap-2">
      <div className={cn("field-shell relative", as === "textarea" && "field-shell--area")}>
        {as === "textarea" ? (
          <Textarea
            id={id}
            name={name}
            rows={rows}
            dir={dir}
            disabled={disabled}
            required={required}
            placeholder={sentinel}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={className}
            {...areaState}
          />
        ) : (
          <Input
            id={id}
            name={name}
            type={type}
            inputMode={type === "tel" ? "tel" : undefined}
            min={min}
            max={max}
            step={step}
            autoComplete={autoComplete}
            dir={dir}
            disabled={disabled}
            required={required}
            placeholder={sentinel}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={className}
            {...controlState}
          />
        )}
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      </div>
      {hint ? (
        <p id={hintId} className="text-start text-micro text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-start text-small text-error">
          {error}
        </p>
      ) : null}
      {serverError ? (
        <p id={serverErrorId} className="text-start text-small text-error">
          {serverError}
        </p>
      ) : null}
    </div>
  );
}
