"use client";
// MIRADOR — P-094 (prompt-6 R2 · E92) · THE WINDOW: one overlay geometry —
// every entrance is the same window onto the same night. Radix Dialog
// underneath, the a11y contract byte-identical to the migrated surfaces:
// focus trap, Esc, aria-modal, described content (Title + Description are
// the consumer's semantics — compose AtTheWindowTitle/Description inside
// the slot; Radix requires a Title on every open dialog).
//
// The surface: the graded night scrim (.window-scrim — the one scrim all
// three surfaces share) + the horizon hairline at the datum (bottom from
// --horizon, the journey's own ground line) + ONE close affordance at end-4
// (the close law: size-11 touch target, localized sr-only label) + the
// content slot.
//
// Entrance = the existing settle verb (600ms vertical arrival — the descent
// through the window; the .window-arrive rule in globals.css, motion-safe
// gated, NO new keyframe). Exit = fade at duration-fast (100ms) — the
// closed-state tempo. The z-rung is 40 (§5.4: below toasts, above page).
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AtTheWindow({
  open,
  onOpenChange,
  trigger,
  closeLabel,
  onKeyDown,
  children,
  contentClassName,
}: {
  /** Controlled open state (the lightbox); uncontrolled + trigger otherwise. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The trigger surface (the dish overlay's Details button). */
  trigger?: React.ReactNode;
  /** The localized sr-only label on the one close affordance. */
  closeLabel: string;
  /** Key events on the pane (the lightbox's mirrored arrow navigation). */
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  children: React.ReactNode;
  /** Layout geometry for the pane's scroll region — the window's frame is
   * invariant; the consumer's view composes inside it. */
  contentClassName?: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="window-scrim fixed inset-0 z-40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-base data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-fast"
        >
          {/* the horizon hairline at the datum — the same line the journey
              grounds; visible through the pane wherever the view lets it */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-(--horizon) border-t border-line/60"
          />
        </DialogPrimitive.Overlay>
        <DialogPrimitive.Content
          data-slot="at-the-window"
          onKeyDown={onKeyDown}
          className={cn(
            "fixed inset-0 z-40 flex flex-col overflow-y-auto scroll-thin",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-fast",
            contentClassName,
          )}
        >
          <DialogPrimitive.Close className="absolute end-4 top-4 z-20 flex size-11 items-center justify-center rounded text-muted transition-colors duration-base hover:text-ink">
            <X className="size-4" strokeWidth={1.5} aria-hidden />
            <span className="sr-only">{closeLabel}</span>
          </DialogPrimitive.Close>
          {/* the pane's view: the slot — the arrival (.window-arrive) rides
              the content wrapper so the descent composes over the flex
              centering (never over a transform of the consumer's own) */}
          <div className="window-arrive flex flex-1 flex-col">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** The dialog's accessible name — compose visibly inside the slot (the
 * a11y contract: described content, byte-identical to the migrated
 * surfaces' DialogTitle/DialogDescription semantics). */
export function AtTheWindowTitle(
  props: React.ComponentProps<typeof DialogPrimitive.Title>,
) {
  return <DialogPrimitive.Title data-slot="at-the-window-title" {...props} />;
}

export function AtTheWindowDescription(
  props: React.ComponentProps<typeof DialogPrimitive.Description>,
) {
  return <DialogPrimitive.Description data-slot="at-the-window-description" {...props} />;
}
