/* ============================================================================
   DERIVATION
   ----------------------------------------------------------------------------
   Everything here is computed from data that is actually present. Nothing is
   inferred, guessed, or categorised. If the bank did not send it, the screen
   does not claim it.
   ========================================================================== */

import type {
  Centavos,
  DayGroup,
  DerivedMovement,
  Movement,
  MovementType,
  Stream,
  Tone,
} from "./types";

/** `type` is the bank's own product classification. The split is a lookup, not a guess. */
const STREAM_BY_TYPE: Record<MovementType, Stream> = {
  compra: "consumo",
  debito_automatico: "consumo",
  beneficio: "consumo",
  devolucion: "consumo",
  pago_tarjeta: "operacion",
  transferencia: "operacion",
  cambio: "operacion",
  titulos: "operacion",
  sin_clasificar: "operacion",
};

export function streamOf(m: Movement): Stream {
  return STREAM_BY_TYPE[m.type];
}

/**
 * Green is not "money in". Green is an economic benefit the bank granted.
 * A securities sale, an FX settlement and a merchant refund are all credits —
 * the customer's own money — and render as `credito`, not `beneficio`.
 */
export function toneOf(m: Movement): Tone {
  if (m.amount < 0) return "debito";
  return m.type === "beneficio" ? "beneficio" : "credito";
}

/**
 * Two rows on the same day are only ambiguous once every discriminator the
 * bank actually sent has been used. Card last-4 and counterparty are checked
 * first; the ordinal marker is the fallback, and it is derived from the list
 * itself rather than invented.
 */
function markDuplicates(list: DerivedMovement[]): void {
  const key = (m: DerivedMovement) =>
    [m.date, m.raw, m.amount, m.card?.last4 ?? "", m.counterparty ?? ""].join("|");

  const buckets = new Map<string, DerivedMovement[]>();
  for (const m of list) {
    const k = key(m);
    const b = buckets.get(k);
    if (b) b.push(m);
    else buckets.set(k, [m]);
  }
  for (const bucket of buckets.values()) {
    if (bucket.length < 2) continue;
    bucket.forEach((m, i) => {
      m.duplicate = { index: i + 1, total: bucket.length };
    });
  }
}

export function derive(movements: Movement[]): DerivedMovement[] {
  const list: DerivedMovement[] = movements.map((m) => ({
    ...m,
    stream: streamOf(m),
    tone: toneOf(m),
  }));
  markDuplicates(list);
  return list;
}

/** Newest day first; original order preserved inside a day. */
export function groupByDay(list: DerivedMovement[]): DayGroup[] {
  const byDate = new Map<string, DerivedMovement[]>();
  for (const m of list) {
    const b = byDate.get(m.date);
    if (b) b.push(m);
    else byDate.set(m.date, [m]);
  }
  return [...byDate.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, ms]) => ({
      date,
      movements: ms,
      subtotal: ms.reduce<Centavos>((acc, m) => acc + m.amount, 0),
    }));
}

export interface Totals {
  in: Centavos;
  out: Centavos; // stored positive
  from: string | null;
  to: string | null;
  count: number;
}

/**
 * Scoped to the movements actually loaded and currently visible — never to
 * "the month". The header renders the range alongside, so the pair can never
 * be read as a claim about a period we do not have.
 */
export function totals(list: DerivedMovement[]): Totals {
  let inSum = 0;
  let outSum = 0;
  let from: string | null = null;
  let to: string | null = null;
  for (const m of list) {
    if (m.amount >= 0) inSum += m.amount;
    else outSum -= m.amount;
    if (from === null || m.date < from) from = m.date;
    if (to === null || m.date > to) to = m.date;
  }
  return { in: inSum, out: outSum, from, to, count: list.length };
}
