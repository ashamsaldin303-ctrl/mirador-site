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
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// loop2-I3: the five hand-rolled field blocks are GONE — every field rides
// the ONE Field idiom (ui/field.tsx): floating label, hairline surface, id-
// paired errors + hints (partyHint wires aria-describedby), LTR phone island.
// Uncontrolled (FormData) — the submit handler reads the FormData natively.
// P-100 (loop-1, design audit 2-d): the form rides the reveal GROUP grammar —
// the whole form is SSR'd (client islands still server-render), so RevealProvider
// observes it on mount and the field blocks rise 6px staggered as one gesture.
// NO data-reveal on individual inputs — the bezel owns focus, facts stay instant.

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
  partyHint,
  whatsappNote,
}: {
  locale: Locale;
  whatsappHref: string;
  labels: Labels;
  errors: ErrorStrings;
  success: SuccessStrings;
  partyHint: string;
  whatsappNote: string;
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
      <div role="status" data-inquiry-success className="flex max-w-xl flex-col gap-6">
        <p className="font-sans text-body-lg text-ink/90">{success.message}</p>
        <p className="text-small text-muted">
          {success.referenceLabel}: <span dir="ltr">{referenceId.slice(0, 8)}</span>
        </p>
        <Button variant="cta" size="compact" asChild className="self-start">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            {success.whatsappCta}
          </a>
        </Button>
        {/* R11 minor: the WhatsApp egress disclosure — the handoff leaves the
            house (external app); the guest knows before the tap. */}
        <p className="text-micro text-muted">{whatsappNote}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex max-w-xl flex-col gap-6"
      data-reveal-group
      data-reveal-stagger="70"
      data-reveal-cap="4"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute opacity-0"
      />

      <Field
        id={`${formId}-name`}
        name="name"
        label={labels.name}
        autoComplete="name"
        error={fieldErrors.name}
      />

      <Field
        id={`${formId}-phone`}
        name="phone"
        label={labels.phone}
        type="tel"
        autoComplete="tel"
        // R11 minor: numbers are an LTR island inside RTL flow — the ledger
        // family's third law (inputs: LTR island).
        dir="ltr"
        error={fieldErrors.phone}
      />

      <Field
        id={`${formId}-date`}
        name="preferredDate"
        label={labels.preferredDate}
        type="date"
        autoComplete="off"
        required={false}
        error={fieldErrors.preferredDate}
      />

      <Field
        id={`${formId}-party`}
        name="partySize"
        label={labels.partySize}
        type="number"
        min={1}
        max={60}
        step={1}
        autoComplete="off"
        required={false}
        hint={partyHint}
        error={fieldErrors.partySize}
      />

      <Field
        id={`${formId}-message`}
        name="message"
        label={labels.message}
        as="textarea"
        rows={4}
        error={fieldErrors.message}
      />

      <Button
        type="submit"
        disabled={submitting}
        aria-busy={submitting || undefined}
        variant="cta"
        size="compact"
        className={cn("self-start", submitting && "motion-safe:breathe")}
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
