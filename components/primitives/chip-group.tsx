"use client";

import { ToggleGroup } from "radix-ui";
import { cn } from "@/lib/cn";
import { FILTERS, type FilterKey } from "@/lib/filter";

/* Radix ToggleGroup, styled from scratch. Single-select: the group is a view
   selector, exactly as «Todos los movimientos ▾» is on the real web app.
   Active chip is Galicia orange with near-black text — 6.22:1, whereas white
   on the same orange would be 2.86:1. */

export function ChipGroup({
  value,
  onValueChange,
  className,
}: {
  value: FilterKey;
  onValueChange: (v: FilterKey) => void;
  className?: string;
}) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      /* Radix emits "" when the active item is pressed again; a view selector
         must always have exactly one selection, so that is ignored. */
      onValueChange={(v) => v && onValueChange(v as FilterKey)}
      aria-label="Filtrar movimientos"
      className={cn("flex shrink-0 gap-1.5", className)}
    >
      {FILTERS.map((f) => (
        <ToggleGroup.Item
          key={f.key}
          value={f.key}
          aria-label={f.label}
          className={cn(
            "shrink-0 snap-start rounded-[var(--radius-pill)] border px-3",
            "h-8 text-meta font-medium whitespace-nowrap transition-colors",
            "border-line bg-surface text-ink-2 hover:border-line-2",
            "data-[state=on]:border-brand data-[state=on]:bg-brand data-[state=on]:text-on-brand",
          )}
        >
          {f.short}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
