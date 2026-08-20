"use client";

import { Popover } from "radix-ui";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { STATES } from "@/lib/states";
import type { ScreenState } from "@/lib/types";
import { Close } from "./primitives/icons";

/* ============================================================================
   DEV CONTROL
   ----------------------------------------------------------------------------
   Floating, dismissible, and deliberately styled as prototype chrome — dark,
   outside the palette the app uses — so it can never be mistaken for part of
   the interface being judged.

   Every state is also reachable at ?state=<key>, so the screen can be demoed
   from a plain URL with the control dismissed.
   ========================================================================== */

export function DevControl({
  state,
  onSelect,
}: {
  state: ScreenState;
  onSelect: (s: ScreenState) => void;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const current = STATES.find((s) => s.key === state) ?? STATES[0];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-[var(--radius-pill)] bg-ink pl-1 pr-1 shadow-[0_8px_28px_-6px_rgb(22_24_29/0.45)]">
      <Popover.Root>
        <Popover.Trigger
          className={cn(
            "flex h-9 items-center gap-2 rounded-[var(--radius-pill)] px-3 text-meta font-medium text-white",
            "hover:bg-white/10",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5 rounded-full",
              state === "default" ? "bg-white/40" : "bg-brand",
            )}
          />
          Estado: {current.label}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            data-slot="menu"
            side="top"
            align="end"
            sideOffset={10}
            className="z-50 w-[17rem] rounded-[var(--radius-md)] border border-line bg-surface p-1.5 shadow-[0_16px_40px_-10px_rgb(22_24_29/0.3)]"
          >
            <p className="px-2.5 pb-1.5 pt-1 text-micro font-semibold uppercase tracking-[var(--tracking-overline)] text-ink-3">
              Estados de la pantalla
            </p>
            {STATES.map((s) => {
              const active = s.key === state;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => onSelect(s.key)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "block w-full rounded-[var(--radius-sm)] px-2.5 py-2 text-left transition-colors",
                    active ? "bg-brand-soft" : "hover:bg-surface-2",
                  )}
                >
                  <span
                    className={cn(
                      "block text-meta font-semibold",
                      active ? "text-brand-ink" : "text-ink",
                    )}
                  >
                    {s.label}
                  </span>
                  <span className="mt-0.5 block text-meta leading-snug text-ink-3">
                    {s.hint}
                  </span>
                  <span className="num mt-0.5 block text-[0.6875rem] text-ink-4">
                    ?state={s.key}
                  </span>
                </button>
              );
            })}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Ocultar el control de estados"
        className="grid size-8 shrink-0 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
      >
        <Close size={15} />
      </button>
    </div>
  );
}
