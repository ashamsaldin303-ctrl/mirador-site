"use client";
// MIRADOR — P-022 (prompt-4 R4): the intent-hydrated reserve-form boundary.
// The SHELL is what the route's first-load JS pays for — a visually-matching,
// server-renderable form surface (labels + hairline boxes, one labelled group,
// aria-busy). The MOTOR (the real ReserveForm island: live availability grid,
// zod pre-validation, submit + WhatsApp encode) imports ONLY on interaction
// (pointerdown · keydown · focusin · touchstart inside the form region), so
// none of it sits in the route's first-load bundle. Keyboard intent = tabbing
// into the region (focusin); pointer intent = the first tap/click.
import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReserveFormProps } from "./reserve-form";

const INTENT_EVENTS = ["pointerdown", "keydown", "focusin", "touchstart"] as const;

export function ReserveFormLazy(props: ReserveFormProps) {
  const [Form, setForm] = useState<React.ComponentType<ReserveFormProps> | null>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const importingRef = useRef(false);

  const hydrate = useCallback(() => {
    if (importingRef.current) return;
    importingRef.current = true;
    void import("./reserve-form").then((module) => {
      setForm(() => module.ReserveForm);
    });
  }, []);

  useEffect(() => {
    const el = regionRef.current;
    if (!el || Form) return;
    const onIntent = () => hydrate();
    for (const ev of INTENT_EVENTS) {
      el.addEventListener(ev, onIntent, { passive: true });
    }
    return () => {
      for (const ev of INTENT_EVENTS) {
        el.removeEventListener(ev, onIntent);
      }
    };
  }, [Form, hydrate]);

  if (Form) {
    return (
      <div ref={regionRef}>
        <Form {...props} />
      </div>
    );
  }

  // The SSR shell: the form's visual rhythm (three labelled rows + the two
  // fieldset legends), inert and decorative — assistive tech hears ONE labelled
  // busy group, not a pile of fake inputs. The region is focusable so keyboard
  // intent (Tab into it) triggers the same hydration a first tap would.
  // loop2-I3: the bespoke pulse divs are gone — one Skeleton idiom (rounded-sm
  // surface pulse) paints every placeholder block, heights matched to the
  // motor form's real geometry (h-11 fields, size-11 stepper, h-11 submit).
  return (
    <div
      ref={regionRef}
      role="group"
      tabIndex={0}
      aria-busy="true"
      aria-label={`${props.strings.name} · ${props.strings.phone} · ${props.strings.partySize} · ${props.strings.date} · ${props.strings.time}`}
    >
      <div aria-hidden="true" className="mt-12 flex flex-col gap-8">
        {[
          { label: props.strings.name, height: "h-11" },
          { label: props.strings.phone, height: "h-11" },
        ].map((row) => (
          <div key={row.label} className="flex flex-col gap-2">
            <span className="hud-label">{row.label}</span>
            <Skeleton className={`${row.height} border border-line`} />
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <span className="hud-label">{props.strings.partySize}</span>
          <div className="flex h-11 items-center gap-4">
            <Skeleton className="size-11 rounded-full border border-line" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="size-11 rounded-full border border-line" />
          </div>
        </div>
        {[
          { label: props.strings.date, rows: 1 },
          { label: props.strings.time, rows: 3 },
        ].map((fieldset) => (
          <div key={fieldset.label} className="flex flex-col gap-2">
            <span className="hud-label">{fieldset.label}</span>
            <Skeleton
              className="border border-line"
              style={{ height: `${fieldset.rows * 4}rem` }}
            />
          </div>
        ))}
        <Skeleton className="h-11 rounded-full" />
        {/* P-100 (design audit 2-d): the reassurance line renders in the shell
            too — static text, matching the motor form's rhythm so hydration
            doesn't shift the submit block. */}
        <p className="text-micro text-muted">{props.strings.reassurance}</p>
      </div>
    </div>
  );
}
