"use client";

import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/cn";
import { ChevronDown, ChevronLeft, Info } from "./primitives/icons";

/* «Más opciones» — items verbatim from the reference web app, in its order.
   Radix DropdownMenu, styled from scratch: it brings the roving focus, the
   escape/outside-dismiss and the aria wiring that a hand-rolled menu gets
   wrong. These are context actions, so they are inert here. */

const OPTIONS = [
  "Compartir datos",
  "Descargar movimientos en Excel",
  "Descargar constancia de CBU",
  "Extraer efectivo sin tarjeta",
  "Modificar alias",
  "Dar de baja este producto",
  "Resúmenes mensuales",
  "Transferir",
  "Mostrar titulares",
];

/* Full --color-hero-ink at rest. These used to sit at opacity-90, which is
   exactly what the --color-hero comment in tokens.css forbids: knocking the ink
   back on this ground costs contrast the band cannot spare. The hover and open
   affordances use --color-hero-wash instead: it darkens the band locally, so
   white text goes from 4.62:1 to 6.14:1 on hover. A lightening wash would have
   taken it to 2.81:1 — the same failure moved into a different state. */
const bar =
  "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1 text-meta font-medium uppercase tracking-[var(--tracking-overline)] [color:var(--hero-fg)] transition-colors hover:bg-[var(--color-hero-wash)]";

export function TopActions() {
  return (
    <div className="hero bg-[var(--hero-bg)]">
      <div className="mx-auto flex w-full max-w-[var(--content-max)] items-center justify-between px-[var(--gutter)] pt-3">
      <button type="button" className={cn(bar, "-ml-2")}>
        <ChevronLeft />
        Volver a cuentas
      </button>

      <div className="flex items-center gap-1">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className={cn(bar, "data-[state=open]:bg-[var(--color-hero-wash)]")}>
            Más opciones
            <ChevronDown size={14} />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              data-slot="menu"
              align="end"
              sideOffset={8}
              className={cn(
                "z-50 min-w-[15rem] rounded-[var(--radius-md)] border border-line bg-surface p-1.5",
                "shadow-[0_12px_32px_-8px_rgb(22_24_29/0.22)]",
              )}
            >
              {OPTIONS.map((o) => (
                <DropdownMenu.Item
                  key={o}
                  className={cn(
                    "cursor-default rounded-[var(--radius-sm)] px-2.5 py-2 text-body text-ink-2 outline-none",
                    "data-[highlighted]:bg-surface-2 data-[highlighted]:text-ink",
                  )}
                >
                  {o}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <button
          type="button"
          aria-label="Información de la cuenta"
          className="grid size-8 place-items-center rounded-[var(--radius-sm)] [color:var(--hero-fg)] transition-colors hover:bg-[var(--color-hero-wash)]"
        >
          <Info />
        </button>
        </div>
      </div>
    </div>
  );
}
