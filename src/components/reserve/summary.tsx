// MIRADOR — ReservationSummary + WhatsAppConfirm (§4.9 inventory, §7.9 copy):
// server components for the confirmation route. Summary rows: name, party,
// date (Damascus-local, Western digits), time, table number — NO phone echo.
// The WhatsApp CTA is rebuilt server-side via waHref(confirmationMessage(...))
// per §8.4 — the deep link encodes name, party, date, time and the ref.
import { damascusDate, damascusTime } from "@/lib/slots";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ReservationSummaryStrings = {
  name: string;
  party: string;
  date: string;
  time: string;
  table: string;
  partyUnit: string;
};

export type ReservationSummaryProps = {
  strings: ReservationSummaryStrings;
  name: string;
  partySize: number;
  slot: Date;
  tableNumber: number;
};

export function ReservationSummary({ strings, name, partySize, slot, tableNumber }: ReservationSummaryProps) {
  const rows: { label: string; value: string; ltr?: boolean }[] = [
    { label: strings.name, value: name },
    { label: strings.party, value: `${partySize} ${strings.partyUnit}` },
    { label: strings.date, value: damascusDate(slot), ltr: true },
    { label: strings.time, value: damascusTime(slot), ltr: true },
    { label: strings.table, value: String(tableNumber), ltr: true },
  ];
  return (
    <dl className="elev-1 divide-y divide-line rounded-lg">
      {rows.map(({ label, value, ltr }) => (
        <div key={label} className="flex items-baseline justify-between gap-4 px-6 py-4">
          <dt className="hud-label shrink-0">{label}</dt>
          <dd dir={ltr ? "ltr" : undefined} className="text-end text-body text-ink">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export type WhatsAppConfirmProps = {
  href: string;
  label: string;
  note: string;
  className?: string;
};

export function WhatsAppConfirm({ href, label, note, className }: WhatsAppConfirmProps) {
  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <Button variant="cta" size="full" asChild className="w-full sm:w-auto">
        <a href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      </Button>
      {/* R11 minor: the WhatsApp egress disclosure — the handoff leaves the
          house (external app); the guest knows before the tap. */}
      <p className="text-micro text-muted">{note}</p>
    </div>
  );
}
