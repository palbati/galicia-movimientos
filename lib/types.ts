/* ============================================================================
   DOMAIN TYPES
   ----------------------------------------------------------------------------
   Amounts are INTEGER CENTAVOS, never floats. Day subtotals and the header
   in/out pair are sums; float cents drift, and a balance that is off by one
   centavo destroys more trust than a slow screen.
   ========================================================================== */

/** Integer centavos. −15730070 is −$157.300,70. */
export type Centavos = number;

/**
 * The two mental models the redesign separates.
 *   consumo   — where my money went
 *   operacion — what I ran
 * Derived from `type`, never stored, so there is one source of truth.
 */
export type Stream = "consumo" | "operacion";

export type MovementType =
  | "compra" /* purchase at a merchant                    → consumo   */
  | "debito_automatico" /* biller debit under a standing mandate      → consumo   */
  | "beneficio" /* reintegro / cashback / descuento           → consumo   */
  | "devolucion" /* merchant refund against a purchase         → consumo   */
  | "pago_tarjeta" /* credit-card statement payment             → operacion */
  | "transferencia" /* transfer in or out                        → operacion */
  | "cambio" /* FX — compra / venta de dólares            → operacion */
  | "titulos" /* securities settlement                     → operacion */
  | "sin_clasificar"; /* bank code we cannot classify              → operacion */

/**
 * How the amount is rendered. THREE treatments, not two.
 *   debito    − regular  muted ink
 *   credito   + semibold full ink     (the customer's own money)
 *   beneficio + semibold green        (an economic benefit the bank granted)
 */
export type Tone = "debito" | "credito" | "beneficio";

export type Settlement = "liquidado" | "pendiente";

export interface CardRef {
  brand: "Visa" | "Mastercard";
  last4: string;
}

export interface Movement {
  id: string;
  /** ISO `yyyy-mm-dd`. Rendered `dd/mm/aa`. */
  date: string;
  /**
   * Exactly what the bank sends, character for character.
   * Never edited, never hidden, never text-transformed. It is the only thing
   * the customer can reconcile against the PDF statement.
   */
  raw: string;
  /** Resolved merchant or counterparty. `null` when resolution failed. */
  merchant: string | null;
  /** Rendered in place of the merchant when `merchant` is null. Must be explicit. */
  unresolvedLabel?: string;
  amount: Centavos;
  type: MovementType;
  settlement: Settlement;
  /** Present on card movements. The discriminator for same-day duplicates. */
  card?: CardRef;
  /** Named biller on a `debito_automatico`. Absent ⇒ "Servicio no identificado". */
  biller?: string;
  /** Named counterparty on a `transferencia`. */
  counterparty?: string;
  /**
   * The bank holds a standing debit mandate for this movement.
   * A payment MECHANISM the bank has on record — not an inferred frequency.
   * We never label anything "recurrente"; that would be a guess.
   */
  mandate?: boolean;
}

export interface Account {
  holder: string;
  kind: string;
  number: string;
  cbu: string;
  alias: string;
  currency: "ARS";
  balance: Centavos;
  /** When the cached copy was taken. Surfaced by the connection-error state. */
  cachedAt?: string;
}

/** A movement with everything the row needs, derived once by the list layer. */
export interface DerivedMovement extends Movement {
  stream: Stream;
  tone: Tone;
  /** `{ index: 1, total: 2 }` when a same-day twin exists and nothing else separates them. */
  duplicate?: { index: number; total: number };
}

export interface DayGroup {
  /** ISO `yyyy-mm-dd`. */
  date: string;
  movements: DerivedMovement[];
  /** Net. Signed sum of the day. */
  subtotal: Centavos;
}

export type ScreenState =
  | "default"
  | "loading"
  | "empty-new"
  | "empty-filter"
  | "empty-quiet"
  | "error-connection"
  | "error-partial";
