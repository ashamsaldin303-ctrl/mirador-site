"use client";
// MIRADOR — ReserveForm (§4.3, the <90s conversion path): EXACTLY 3 input
// fields (name · phone · party-size stepper 1–12) + 1 slot picker
// (DateStrip + TimeGrid). The server is the source of truth — client-side
// zod pre-validation (same reservationSchema as the API) only renders field
// errors before the network round-trip. Availability is fetched LIVE per
// date; submit POSTs slot = slotInstant(date, time).toISOString().
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { reservationSchema } from "@/lib/validation";
import { slotInstant } from "@/lib/slots";
import type { Locale } from "@/lib/i18n";
import { FieldInput } from "./field-input";
import { PartyStepper } from "./party-stepper";
import { DateStrip } from "./date-strip";
import { TimeGrid, type SlotAvailability } from "./time-grid";

export type ReserveErrorKey =
  | "invalid_name"
  | "invalid_phone"
  | "invalid_party"
  | "invalid_slot"
  | "invalid_date"
  | "required"
  | "slotFull"
  | "duplicate"
  | "rateLimited"
  | "validation"
  | "network";

export type ReserveStrings = {
  name: string;
  phone: string;
  partySize: string;
  date: string;
  time: string;
  submit: string;
  submitting: string;
  decreaseParty: string;
  increaseParty: string;
  partyUnit: string;
  loadingSlots: string;
  retry: string;
  slotSoldOut: string;
  slotPast: string;
  largePartyNote: string;
  largePartyLink: string;
  tablesRemaining: string;
  /** P-100 (design audit 2-d): the quiet line under the submit button — no
   *  deposit, the table is held. Reassurance, not instruction. */
  reassurance: string;
  closedMonday: string;
  errors: Record<ReserveErrorKey, string>;
};

export type ReserveFormProps = {
  locale: Locale;
  strings: ReserveStrings;
  days: string[]; // dateStrip(60), computed server-side (no hydration drift)
  initialDate: string; // today if open, else the first bookable day
};

type FieldKey = "name" | "phone" | "partySize" | "slot";
type FieldErrors = Partial<Record<FieldKey, ReserveErrorKey>>;

const FIELD_KEYS: readonly FieldKey[] = ["name", "phone", "partySize", "slot"];
const ERROR_KEYS: readonly ReserveErrorKey[] = [
  "invalid_name",
  "invalid_phone",
  "invalid_party",
  "invalid_slot",
  "invalid_date",
  "required",
  "slotFull",
  "duplicate",
  "rateLimited",
  "validation",
  "network",
];

/** zod issue path → error key (mirrors the API's FIELD_ERROR mapping; the
 *  root refine (slot sanity) carries an empty path → slot). */
const ISSUE_KEY: Record<string, ReserveErrorKey> = {
  name: "invalid_name",
  phone: "invalid_phone",
  partySize: "invalid_party",
  slot: "invalid_slot",
  locale: "required",
};

function issuesToFieldErrors(issues: readonly { path: readonly PropertyKey[] }[]): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "slot");
    if ((FIELD_KEYS as readonly string[]).includes(key)) {
      out[key as FieldKey] = ISSUE_KEY[key] ?? "validation";
    }
  }
  return out;
}

/** 400 body `fields` → per-field error keys, unknown codes fall back to validation. */
function serverFieldsToErrors(fields: Record<string, string[]>): FieldErrors {
  const out: FieldErrors = {};
  for (const key of FIELD_KEYS) {
    const code = fields[key]?.[0];
    if (code && (ERROR_KEYS as readonly string[]).includes(code)) {
      out[key] = code as ReserveErrorKey;
    }
  }
  return out;
}

type ReservationOk = { id: string };
type ReservationErr = {
  error?: string;
  messageKey?: string;
  fields?: Record<string, string[]>;
};

export function ReserveForm({ locale, strings, days, initialDate }: ReserveFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [time, setTime] = useState<string | null>(null); // time defaults to none
  const [slots, setSlots] = useState<SlotAvailability[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const fetchId = useRef(0);

  const fetchAvailability = useCallback(async (date: string) => {
    const id = ++fetchId.current;
    setLoading(true);
    setLoadError(false);
    try {
      const res = await fetch(`/api/availability?date=${encodeURIComponent(date)}`);
      if (!res.ok) throw new Error(`availability ${res.status}`);
      const data = (await res.json()) as { date: string; slots: SlotAvailability[] };
      if (!Array.isArray(data.slots)) throw new Error("bad availability shape");
      if (fetchId.current !== id) return; // stale response — a newer date owns the grid
      setSlots(data.slots);
    } catch {
      if (fetchId.current !== id) return;
      setSlots(null);
      setLoadError(true);
    } finally {
      if (fetchId.current === id) setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTime(null); // new day, new availability — re-pick the time
    fetchAvailability(selectedDate);
  }, [selectedDate, fetchAvailability]);

  const clearField = (key: FieldKey) =>
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setFieldErrors({});
    setFormError(null);

    const slotIso = time ? slotInstant(selectedDate, time).toISOString() : "";
    const parsed = reservationSchema.safeParse({ name, phone, partySize, slot: slotIso, locale });
    if (!parsed.success) {
      setFieldErrors(issuesToFieldErrors(parsed.error.issues));
      return;
    }

    setSubmitting(true);
    let created = false;
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (res.status === 201) {
        const data = (await res.json()) as ReservationOk;
        created = true;
        router.push(`/${locale}/confirmation/${data.id}`);
        return;
      }
      const body = (await res.json().catch(() => null)) as ReservationErr | null;
      if (res.status === 400 && body?.fields) {
        setFieldErrors(serverFieldsToErrors(body.fields));
        setFormError(strings.errors.validation);
      } else if (res.status === 409 && (body?.messageKey === "slotFull" || body?.messageKey === "duplicate")) {
        setFormError(
          body.messageKey === "slotFull" ? strings.errors.slotFull : strings.errors.duplicate,
        );
        if (body.messageKey === "slotFull") {
          setTime(null);
          fetchAvailability(selectedDate); // server is the truth — refresh the grid
        }
      } else if (res.status === 429) {
        setFormError(strings.errors.rateLimited);
      } else {
        setFormError(strings.errors.network);
      }
    } catch {
      setFormError(strings.errors.network);
    } finally {
      if (!created) setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-12 flex flex-col gap-8">
      <FieldInput
        id="reserve-name"
        label={strings.name}
        value={name}
        onChange={(v) => {
          setName(v);
          clearField("name");
        }}
        error={fieldErrors.name ? strings.errors[fieldErrors.name] : undefined}
        autoComplete="name"
        disabled={submitting}
      />

      <FieldInput
        id="reserve-phone"
        label={strings.phone}
        type="tel"
        autoComplete="tel"
        dir="ltr"
        value={phone}
        onChange={(v) => {
          setPhone(v);
          clearField("phone");
        }}
        error={fieldErrors.phone ? strings.errors[fieldErrors.phone] : undefined}
        disabled={submitting}
      />

      <div
        role="group"
        aria-labelledby="reserve-party-label"
        aria-describedby={fieldErrors.partySize ? "reserve-party-error" : undefined}
        className="flex flex-col gap-2"
      >
        <span id="reserve-party-label" className="hud-label">
          {strings.partySize}
        </span>
        <PartyStepper
          value={partySize}
          onChange={(v) => {
            setPartySize(v);
            clearField("partySize");
          }}
          decreaseLabel={strings.decreaseParty}
          increaseLabel={strings.increaseParty}
          unit={strings.partyUnit}
          disabled={submitting}
        />
        {fieldErrors.partySize ? (
          <p id="reserve-party-error" className="text-start text-small text-error">
            {strings.errors[fieldErrors.partySize]}
          </p>
        ) : null}
        <p className="text-small text-muted">
          {strings.largePartyNote}{" "}
          <Link
            href={`/${locale}/private-dining`}
            className="text-copper underline decoration-copper underline-offset-4 transition-colors duration-base hover:text-amber"
          >
            {strings.largePartyLink}
          </Link>
        </p>
      </div>

      {/* min-w-0: flex items default to min-width:auto — without it the date
          fieldset sizes to its min-w-max strip content (≈4K px) and blows out
          the document scrollWidth at 375 (F12-6). The scroll container inside
          then scrolls internally as designed. */}
      <fieldset className="flex min-w-0 flex-col gap-2 border-0 p-0" disabled={submitting}>
        <legend className="hud-label">{strings.date}</legend>
        <DateStrip
          days={days}
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={locale}
          closedMondayLabel={strings.closedMonday}
          disabled={submitting}
        />
      </fieldset>

      <fieldset
        className="flex min-w-0 flex-col gap-2 border-0 p-0"
        disabled={submitting}
        aria-describedby={fieldErrors.slot ? "reserve-slot-error" : undefined}
      >
        <legend className="hud-label">{strings.time}</legend>
        <TimeGrid
          slots={slots}
          loading={loading}
          error={loadError}
          selected={time}
          onSelect={(t) => {
            setTime(t);
            clearField("slot");
          }}
          onRetry={() => fetchAvailability(selectedDate)}
          loadingLabel={strings.loadingSlots}
          networkErrorLabel={strings.errors.network}
          retryLabel={strings.retry}
          soldOutLabel={strings.slotSoldOut}
          pastLabel={strings.slotPast}
          tablesRemainingLabel={strings.tablesRemaining}
          disabled={submitting}
        />
        {fieldErrors.slot ? (
          <p id="reserve-slot-error" className="text-start text-small text-error">
            {strings.errors[fieldErrors.slot]}
          </p>
        ) : null}
      </fieldset>

      <div className="flex flex-col gap-4">
        {formError ? (
          <p role="alert" className="text-small text-error">
            {formError}
          </p>
        ) : null}
        <Button
          type="submit"
          variant="cta"
          size="full"
          disabled={submitting}
          aria-busy={submitting || undefined}
          className={submitting ? "motion-safe:breathe" : undefined}
        >
          {submitting ? strings.submitting : strings.submit}
        </Button>
        {/* P-100 (design audit 2-d): the reassurance line — under the submit
            button, micro + muted. NO data-reveal in here: the form is an intent
            surface, already visible when interacted. */}
        <p className="text-micro text-muted">{strings.reassurance}</p>
      </div>
    </form>
  );
}
