"use client";
// MIRADOR — Private dining inquiry form (§4.6 · §7.8): name · phone ·
// preferredDate · partySize (1–60, optional) · message + hidden honeypot
// ("website"). Client pre-validation MIRRORS the API's wire schema (see
// validateInquiry below — no zod on the wire to the browser); the server's
// zod parse stays the truth and its 400 fields map renders the same
// per-field bilingual inline errors (RTL-correct: each error renders directly
// under its field). 201 replaces the form with the calm success state:
// success line + reference (id first 8) + WhatsApp CTA.
import { useId, useState, type FormEvent } from "react";
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

/** P-024/E43 (prompt-4 R7 ledger finding): the round-1 build shipped the FULL
 * zod runtime to the browser for five trim/regex checks — /private-dining
 * first-load measured 232.4KB gz (run-11 raw), OVER the 200KB hard cap.
 * This is the client-side MIRROR of inquirySchema (§8.2): same fields, same
 * bounds, same error mapping — zero dependency bytes. The server's zod parse
 * remains the source of truth; its 400 fields map reuses these keys. */
const PHONE_RE = /^\+?[0-9][0-9\s-]{6,18}$/;

function validateInquiry(
  raw: { name: string; phone: string; preferredDate: string; partyRaw: string; message: string },
  errors: ErrorStrings,
): FieldErrors {
  const out: FieldErrors = {};
  const set = (key: FieldKey, empty: boolean, invalid: keyof ErrorStrings) => {
    out[key] = empty ? errors.required : errors[invalid];
  };
  if (raw.name === "" || raw.name.length < 2 || raw.name.length > 80) {
    set("name", raw.name === "", "invalidName");
  }
  if (raw.phone === "" || !PHONE_RE.test(raw.phone)) {
    set("phone", raw.phone === "", "invalidPhone");
  }
  if (raw.preferredDate !== "") {
    const iso = toIsoDatetime(raw.preferredDate);
    if (Number.isNaN(new Date(iso).getTime())) out.preferredDate = errors.invalidDate;
  }
  if (raw.partyRaw !== "") {
    const n = Number(raw.partyRaw);
    if (!Number.isInteger(n) || n < 1 || n > 60) out.partySize = errors.invalidParty;
  }
  if (raw.message === "" || raw.message.length < 10 || raw.message.length > 1000) {
    set("message", raw.message === "", "invalidMessage");
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

    // client mirror of the wire schema (§8.2) — per-field bilingual errors up
    // front; the server re-validates with zod (the truth) and maps 400 fields
    // through SERVER_FIELD/SERVER_ERROR_KEY below.
    const mirrorErrors = validateInquiry(
      { name, phone, preferredDate: dateRaw, partyRaw, message },
      errors,
    );
    if (Object.keys(mirrorErrors).length > 0) {
      setFieldErrors(mirrorErrors);
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
          const first = keys[0]; // noUncheckedIndexedAccess: index access is string | undefined
          const errorKey = first ? SERVER_ERROR_KEY[first] : undefined;
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
