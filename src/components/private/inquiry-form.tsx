"use client";
// MIRADOR — Private dining inquiry form (§4.6 · §7.8): name · phone ·
// preferredDate · partySize (1–60, optional) · message + hidden honeypot
// ("website"). Client pre-validation uses the SAME wire schema as the API
// (src/lib/validation.ts → inquirySchema); the server's 400 fields map is
// translated into the same per-field bilingual inline errors (RTL-correct:
// each error renders directly under its field). 201 replaces the form with the
// calm success state: success line + reference (id first 8) + WhatsApp CTA.
import { useId, useState, type FormEvent } from "react";
import type { ZodIssue } from "zod";
import { inquirySchema } from "@/lib/validation";
import type { Locale } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type FieldKey = "name" | "phone" | "preferredDate" | "partySize" | "message";

type Labels = {
  name: string;
  phone: string;
  preferredDate: string;
  partySize: string;
  message: string;
  submit: string;
  submitting: string;
};

type ErrorStrings = {
  invalidName: string;
  invalidPhone: string;
  invalidDate: string;
  invalidParty: string;
  invalidMessage: string;
  required: string;
  validation: string;
  rateLimited: string;
  network: string;
};

type SuccessStrings = {
  message: string;
  referenceLabel: string;
  whatsappCta: string;
};

type FieldErrors = Partial<Record<FieldKey, string>>;

type InquiryPayload = {
  type: "PRIVATE_DINING";
  name: string;
  phone: string;
  preferredDate?: string;
  partySize?: number;
  message: string;
  locale: Locale;
  website: string;
};

// wire field → dictionary error key (client side, from the shared zod schema)
const FIELD_ERROR_KEY: Record<FieldKey, keyof ErrorStrings> = {
  name: "invalidName",
  phone: "invalidPhone",
  preferredDate: "invalidDate",
  partySize: "invalidParty",
  message: "invalidMessage",
};

// server 400 { fields: { <field>: ["<errorKey>"] } } → the same dictionary keys
const SERVER_FIELD: Record<string, FieldKey> = {
  name: "name",
  phone: "phone",
  preferredDate: "preferredDate",
  partySize: "partySize",
  message: "message",
};
const SERVER_ERROR_KEY: Record<string, keyof ErrorStrings> = {
  invalid_name: "invalidName",
  invalid_phone: "invalidPhone",
  invalid_date: "invalidDate",
  invalid_party: "invalidParty",
  invalid_message: "invalidMessage",
  required: "required",
};

/** Date-input value ("YYYY-MM-DD") → ISO datetime for the wire schema. */
function toIsoDatetime(value: string): string {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

function issuesToFieldErrors(
  issues: ZodIssue[],
  raw: { name: string; phone: string; message: string },
  errors: ErrorStrings,
): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field !== "string") continue;
    const key = field as FieldKey;
    if (!(key in FIELD_ERROR_KEY) || out[key]) continue;
    const isEmpty =
      (key === "name" && raw.name === "") ||
      (key === "phone" && raw.phone === "") ||
      (key === "message" && raw.message === "");
    out[key] = isEmpty ? errors.required : errors[FIELD_ERROR_KEY[key]];
  }
  return out;
}

export function InquiryForm({
  locale,
  whatsappHref,
  labels,
  errors,
  success,
}: {
  locale: Locale;
  whatsappHref: string;
  labels: Labels;
  errors: ErrorStrings;
  success: SuccessStrings;
}) {
  const formId = useId();
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting || referenceId !== null) return;
    setFormError(null);

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const dateRaw = String(data.get("preferredDate") ?? "").trim();
    const partyRaw = String(data.get("partySize") ?? "").trim();
    const website = String(data.get("website") ?? ""); // honeypot — humans never fill it

    const payload: InquiryPayload = {
      type: "PRIVATE_DINING",
      name,
      phone,
      message,
      locale,
      website,
      preferredDate: dateRaw ? toIsoDatetime(dateRaw) : undefined,
      partySize: partyRaw ? Number(partyRaw) : undefined,
    };

    // same wire schema as the API (§8.2) — per-field bilingual errors up front
    const parsed = inquirySchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(issuesToFieldErrors(parsed.error.issues, { name, phone, message }, errors));
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        const body = (await response.json()) as { id?: string };
        setReferenceId(body.id ?? "");
        return;
      }

      if (response.status === 400) {
        const body = (await response.json()) as { fields?: Record<string, string[]> };
        const next: FieldErrors = {};
        let mapped = false;
        for (const [field, keys] of Object.entries(body.fields ?? {})) {
          const fieldKey = SERVER_FIELD[field];
          const errorKey = SERVER_ERROR_KEY[keys[0]];
          if (!fieldKey || !errorKey) continue;
          mapped = true;
          if (!next[fieldKey]) next[fieldKey] = errors[errorKey];
        }
        if (mapped) {
          setFieldErrors(next);
        } else {
          setFormError(errors.validation);
        }
        return;
      }

      if (response.status === 429) {
        setFormError(errors.rateLimited);
        return;
      }

      setFormError(errors.network);
    } catch {
      setFormError(errors.network);
    } finally {
      setSubmitting(false);
    }
  }

  if (referenceId !== null) {
    return (
      <div role="status" className="flex max-w-xl flex-col gap-6">
        <p className="font-sans text-body-lg text-ink/90">{success.message}</p>
        <p className="text-small text-muted">
          {success.referenceLabel}: <span dir="ltr">{referenceId.slice(0, 8)}</span>
        </p>
        <Button
          asChild
          className="min-h-11 self-start rounded-full bg-amber px-6 font-sans text-small font-semibold text-night hover:bg-amber/90"
        >
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            {success.whatsappCta}
          </a>
        </Button>
      </div>
    );
  }

  const describedBy = (key: FieldKey) =>
    fieldErrors[key] ? `${formId}-${key}-error` : undefined;

  return (
    <form onSubmit={onSubmit} noValidate className="flex max-w-xl flex-col gap-6">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute opacity-0"
      />

      <div className="flex flex-col gap-2">
        <label htmlFor={`${formId}-name`} className="text-small font-medium text-ink/90">
          {labels.name}
        </label>
        <Input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          className="h-11 min-h-11"
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={describedBy("name")}
        />
        {fieldErrors.name && (
          <p id={`${formId}-name-error`} className="text-small text-error">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${formId}-phone`} className="text-small font-medium text-ink/90">
          {labels.phone}
        </label>
        <Input
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          className="h-11 min-h-11"
          aria-invalid={fieldErrors.phone ? true : undefined}
          aria-describedby={describedBy("phone")}
        />
        {fieldErrors.phone && (
          <p id={`${formId}-phone-error`} className="text-small text-error">
            {fieldErrors.phone}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${formId}-date`} className="text-small font-medium text-ink/90">
          {labels.preferredDate}
        </label>
        <Input
          id={`${formId}-date`}
          name="preferredDate"
          type="date"
          autoComplete="off"
          className="h-11 min-h-11"
          aria-invalid={fieldErrors.preferredDate ? true : undefined}
          aria-describedby={describedBy("preferredDate")}
        />
        {fieldErrors.preferredDate && (
          <p id={`${formId}-preferredDate-error`} className="text-small text-error">
            {fieldErrors.preferredDate}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${formId}-party`} className="text-small font-medium text-ink/90">
          {labels.partySize}
        </label>
        <Input
          id={`${formId}-party`}
          name="partySize"
          type="number"
          min={1}
          max={60}
          step={1}
          autoComplete="off"
          className="h-11 min-h-11"
          aria-invalid={fieldErrors.partySize ? true : undefined}
          aria-describedby={describedBy("partySize")}
        />
        {fieldErrors.partySize && (
          <p id={`${formId}-partySize-error`} className="text-small text-error">
            {fieldErrors.partySize}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${formId}-message`} className="text-small font-medium text-ink/90">
          {labels.message}
        </label>
        <Textarea
          id={`${formId}-message`}
          name="message"
          rows={4}
          className="min-h-24"
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={describedBy("message")}
        />
        {fieldErrors.message && (
          <p id={`${formId}-message-error`} className="text-small text-error">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="min-h-11 self-start rounded-full bg-amber px-6 font-sans text-small font-semibold text-night hover:bg-amber/90"
      >
        {submitting ? labels.submitting : labels.submit}
      </Button>

      {formError && (
        <p role="alert" className="text-small text-error">
          {formError}
        </p>
      )}
    </form>
  );
}
