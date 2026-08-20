"use client";

import { cn } from "@/lib/cn";
import { Close, Search } from "./icons";

/* A real field, not a link labelled FILTRAR. Placeholder wording is the real
   app's own: «Buscar movimiento». Searches the resolved merchant AND the
   bank's raw string — see matchesQuery. */

export function SearchField({
  value,
  onValueChange,
  className,
}: {
  value: string;
  onValueChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center rounded-[var(--radius-md)] border border-line bg-surface",
        "focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/25",
        className,
      )}
    >
      <Search className="pointer-events-none absolute left-3 text-ink-3" />
      <input
        type="search"
        inputMode="search"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder="Buscar movimiento"
        aria-label="Buscar movimiento por comercio o por la descripción del banco"
        className={cn(
          "h-11 w-full bg-transparent pl-10 pr-10 text-body text-ink",
          "placeholder:text-ink-3 focus:outline-none",
          "[&::-webkit-search-cancel-button]:appearance-none",
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onValueChange("")}
          aria-label="Borrar búsqueda"
          className="absolute right-1.5 grid size-8 place-items-center rounded-[var(--radius-sm)] text-ink-3 hover:text-ink"
        >
          <Close size={16} />
        </button>
      )}
    </div>
  );
}
