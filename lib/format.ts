/* ============================================================================
   FORMATTING — es-AR
   ----------------------------------------------------------------------------
   Currency  $1.234.567,89   period thousands, comma decimals
   Dates     dd/mm/aa
   ========================================================================== */

import type { Centavos } from "./types";

const groupFmt = new Intl.NumberFormat("es-AR", { useGrouping: true });

/** The true minus, U+2212 — not a hyphen. It is the same width as the plus. */
export const MINUS = "−";
export const PLUS = "+";

export interface AmountParts {
  /** `−` or `+`. Lives in its own fixed-width column so signs form a strip. */
  sign: string;
  /** `$157.300,70` — sign excluded, always includes the symbol and 2 decimals. */
  digits: string;
  negative: boolean;
}

/**
 * Formats integer centavos without ever going through a float, so a sum of
 * thirty movements is exact to the centavo.
 */
export function splitAmount(cents: Centavos): AmountParts {
  const negative = cents < 0;
  const abs = Math.abs(cents);
  const units = Math.trunc(abs / 100);
  const dec = String(abs % 100).padStart(2, "0");
  return {
    sign: negative ? MINUS : PLUS,
    digits: `$${groupFmt.format(units)},${dec}`,
    negative,
  };
}

/** `−$157.300,70` — for screen readers and copy, where the strip does not exist. */
export function formatAmount(cents: Centavos): string {
  const { sign, digits } = splitAmount(cents);
  return `${sign}${digits}`;
}

/** Unsigned. For in/out pairs, where the label already carries direction. */
export function formatAbs(cents: Centavos): string {
  return splitAmount(cents).digits;
}

/** Parses `yyyy-mm-dd` in LOCAL time. `new Date("2026-08-13")` is UTC and
 *  shifts a day backwards west of Greenwich, which would mislabel every row. */
export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** `13/08/26` */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y.slice(2)}`;
}

/**
 * `13/08` — day and month, never the year. There is no conditional here.
 *
 * Two callers, neither of them a day header: `formatRange`, for the period
 * label beside the balance, where repeating the year on both ends is noise; and
 * `EmptyQuiet`, which states the same range in a sentence. Day headers use
 * `formatDate` and keep the full `dd/mm/aa`.
 */
export function formatDayShort(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

const weekdayFmt = new Intl.DateTimeFormat("es-AR", { weekday: "long" });

/** `jueves` — lowercase, as Spanish requires. */
export function weekday(iso: string): string {
  return weekdayFmt.format(parseISO(iso));
}

/**
 * `Hoy`, `Ayer`, or the weekday. `today` is injected rather than read from the
 * clock so fixtures and screenshots stay deterministic.
 */
export function relativeDayLabel(iso: string, today: string): string {
  if (iso === today) return "Hoy";
  const diff = Math.round(
    (parseISO(today).getTime() - parseISO(iso).getTime()) / 86_400_000,
  );
  if (diff === 1) return "Ayer";
  return weekday(iso);
}

/** `04/08` al `13/08` — the range label the header summary is scoped to. */
export function formatRange(fromISO: string, toISO: string): string {
  return `${formatDayShort(fromISO)} al ${formatDayShort(toISO)}`;
}

/** `14/08 09:12` — the cached-data timestamp. */
export function formatStamp(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
