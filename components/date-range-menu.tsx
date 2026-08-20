"use client";

import { Popover } from "radix-ui";
import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Range } from "@/lib/filter";
import { formatDate } from "@/lib/format";
import { Calendar } from "./primitives/icons";

/* ============================================================================
   DATE RANGE MENU
   ----------------------------------------------------------------------------
   Two dates and two buttons does not warrant a full-height side panel with an
   overlay and a focus trap — the weight of the interface should match the
   weight of the decision. This is a popover anchored to its own trigger, so the
   list stays visible behind it and the range can be read against the movements
   it is filtering.

   Radix Popover still gives the escape dismiss, the outside-click, the focus
   return and the aria wiring; only the presentation changed.
   ========================================================================== */

export function DateRangeMenu({
  range,
  bounds,
  onApply,
}: {
  range: Range | null;
  bounds: Range;
  onApply: (r: Range | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(range?.from ?? bounds.from);
  const [to, setTo] = useState(range?.to ?? bounds.to);

  /* The draft dates are seeded from the applied range each time the menu opens,
     so abandoning an edit does not leak into the next one. Done here in the
     open handler rather than in an effect watching `open`: same moment, same
     result, without a second render pass. */
  const onOpenChange = (next: boolean) => {
    if (next) {
      setFrom(range?.from ?? bounds.from);
      setTo(range?.to ?? bounds.to);
    }
    setOpen(next);
  };

  const invalid = from > to;
  const active = range !== null;

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger
        className={cn(
          "inline-flex h-9 shrink-0 items-center gap-2 rounded-[var(--radius-md)] border px-3",
          "text-meta font-medium transition-colors",
          active
            ? "border-brand bg-brand-soft text-brand-ink"
            : "border-line bg-surface text-ink-2 hover:border-line-2",
        )}
      >
        <Calendar />
        <span className="num whitespace-nowrap">
          {active
            ? `${formatDate(range.from)} a ${formatDate(range.to)}`
            : "Período"}
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          data-slot="menu"
          align="end"
          sideOffset={8}
          collisionPadding={12}
          className={cn(
            "z-50 w-[16.5rem] rounded-[var(--radius-md)] border border-line bg-surface p-3",
            "shadow-[0_16px_40px_-10px_rgb(22_24_29/0.3)]",
          )}
        >
          <p className="mb-2 text-micro font-semibold uppercase tracking-[var(--tracking-overline)] text-ink-3">
            Filtrar por fechas
          </p>

          <div className="space-y-2.5">
            {[
              { id: "desde", label: "Desde", value: from, set: setFrom },
              { id: "hasta", label: "Hasta", value: to, set: setTo },
            ].map((f) => (
              <div key={f.id} className="flex items-center gap-2">
                <label
                  htmlFor={f.id}
                  className="w-11 shrink-0 text-meta text-ink-2"
                >
                  {f.label}
                </label>
                <input
                  id={f.id}
                  type="date"
                  value={f.value}
                  min={bounds.from}
                  max={bounds.to}
                  onChange={(e) => f.set(e.target.value)}
                  className={cn(
                    "num h-9 w-full min-w-0 rounded-[var(--radius-sm)] border border-line bg-surface px-2",
                    "text-meta text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25",
                  )}
                />
              </div>
            ))}
          </div>

          {invalid && (
            <p role="alert" className="mt-2 text-meta text-danger">
              «Desde» tiene que ser anterior a «Hasta».
            </p>
          )}

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={invalid}
              onClick={() => {
                onApply({ from, to });
                setOpen(false);
              }}
              className={cn(
                "h-9 flex-1 rounded-[var(--radius-sm)] bg-cta text-meta font-semibold text-white",
                "transition-opacity hover:opacity-90 disabled:opacity-40",
              )}
            >
              Aplicar
            </button>
            {active && (
              <button
                type="button"
                onClick={() => {
                  onApply(null);
                  setOpen(false);
                }}
                className="h-9 rounded-[var(--radius-sm)] border border-line px-3 text-meta font-medium text-ink-2 hover:border-line-2"
              >
                Quitar
              </button>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
