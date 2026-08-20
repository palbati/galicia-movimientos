/* ============================================================================
   SEARCH & FILTER
   ----------------------------------------------------------------------------
   Filter vocabulary is taken from the real desktop app — «Todos los
   movimientos», «Ingresos de dinero», «Egresos de dinero» — with the
   redesign's own facet, consumo vs operación, folded into the same control.

   One single-select group rather than two orthogonal ones: on a phone two chip
   rows eat the fold before a single movement is visible, and «consumos que
   salieron» is a query nobody runs — consumption is almost definitionally an
   egress.
   ========================================================================== */

import type { DerivedMovement } from "./types";

export type FilterKey =
  | "todos"
  | "consumos"
  | "operaciones"
  | "ingresos"
  | "egresos";

export const FILTERS: { key: FilterKey; label: string; short: string }[] = [
  { key: "todos", label: "Todos los movimientos", short: "Todos" },
  { key: "consumos", label: "Consumos", short: "Consumos" },
  { key: "operaciones", label: "Operaciones", short: "Operaciones" },
  { key: "ingresos", label: "Ingresos de dinero", short: "Entró" },
  { key: "egresos", label: "Egresos de dinero", short: "Salió" },
];

/** Accent- and case-insensitive: nobody types «Anónima» into a search box. */
export const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function matchesQuery(m: DerivedMovement, q: string): boolean {
  if (!q.trim()) return true;
  const needle = norm(q.trim());
  /* Searches the resolved name AND the bank's raw string — the whole point of
     keeping both. Someone reconciling against a PDF types the raw string. */
  const haystacks = [
    m.merchant ?? "",
    m.unresolvedLabel ?? "",
    m.raw,
    m.biller ?? "",
    m.counterparty ?? "",
    m.card ? `${m.card.brand} ${m.card.last4}` : "",
  ];
  return haystacks.some((h) => h && norm(h).includes(needle));
}

export function matchesFilter(m: DerivedMovement, f: FilterKey): boolean {
  switch (f) {
    case "todos":
      return true;
    case "consumos":
      return m.stream === "consumo";
    case "operaciones":
      return m.stream === "operacion";
    case "ingresos":
      return m.amount >= 0;
    case "egresos":
      return m.amount < 0;
  }
}

export interface Range {
  from: string;
  to: string;
}

export function inRange(m: DerivedMovement, r: Range | null): boolean {
  if (!r) return true;
  return m.date >= r.from && m.date <= r.to;
}

export function applyFilters(
  list: DerivedMovement[],
  opts: { query: string; filter: FilterKey; range: Range | null },
): DerivedMovement[] {
  return list.filter(
    (m) =>
      inRange(m, opts.range) &&
      matchesFilter(m, opts.filter) &&
      matchesQuery(m, opts.query),
  );
}
