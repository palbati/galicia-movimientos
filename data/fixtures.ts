/* ============================================================================
   FIXTURES
   ----------------------------------------------------------------------------
   No database, no ORM. Typed data only.

   Rows 1–10 are the real movements read off the reference screenshot, verbatim
   in `raw`. Everything below them exists to break the layout:
     · a merchant name far too long for one line          02/08
     · an eight-figure amount                             02/08
     · a refund — positive amount against a purchase      02/08
     · a description that is pure bank code               02/08
     · a day with exactly one movement                    14/08, 13/08, 10/08, 06/08
     · a day with fifteen                                 03/08
     · a movement pending settlement                      14/08
     · two same-day rows nothing distinguishes            03/08 (Rappi ×2)
     · an automatic debit with no identifiable biller      03/08
   ========================================================================== */

import type { Account, Movement } from "@/lib/types";

/** Injected rather than read from the clock, so the demo is deterministic. */
export const TODAY = "2026-08-20";

/* The account identity is fictional. The reference screenshots came from a real
   account, and its holder, number, CBU and alias carry no design value — the
   screen renders identically with invented ones, and a portfolio repo is a
   worse place for real banking identifiers than a private banking session. The
   movement data below is unchanged. */
export const account: Account = {
  holder: "Camila Ortiz Ledesma",
  kind: "Caja de ahorro en pesos",
  number: "4012845-7 021-4",
  cbu: "00701285200004012845721",
  alias: "camila.ortiz.galicia",
  currency: "ARS",
  balance: 43_844_395, // $438.443,95 — from the desktop reference
};

/** Timestamp used by the connection-error state. */
export const CACHED_AT = "2026-08-20T09:12:00-03:00";

export const movements: Movement[] = [
  /* ── 20/08 jueves · hoy ──────────────────────────────────────────────── */
  /* From the desktop reference. Sits first in the list, which is exactly where
     the unnamed-biller problem argues best — this is the row that makes people
     phone the bank, so it says so instead of showing the abbreviation. */
  {
    id: "m-00",
    date: "2026-08-20",
    raw: "Deb. Autom. De Serv.",
    merchant: null,
    unresolvedLabel: "Servicio no identificado",
    amount: -7_955_218,
    type: "debito_automatico",
    settlement: "liquidado",
    mandate: true,
  },
  {
    id: "m-01",
    date: "2026-08-20",
    raw: "COMPRA VISA DEB FARMACITY 4218 ****8214",
    merchant: "Farmacity",
    amount: -4_218_090,
    type: "compra",
    settlement: "pendiente",
    card: { brand: "Visa", last4: "8214" },
  },

  /* ── 13/08 jueves ── reference screenshot ────────────────────────────── */
  {
    id: "m-02",
    date: "2026-08-13",
    raw: "Coto sucursal 103",
    merchant: "Coto",
    amount: -15_730_070,
    type: "compra",
    settlement: "liquidado",
    card: { brand: "Visa", last4: "8214" },
  },

  /* ── 10/08 lunes ── reference screenshot ─────────────────────────────── */
  {
    id: "m-03",
    date: "2026-08-10",
    raw: "Reintegro promocion galicia",
    merchant: "Reintegro por promoción Galicia",
    amount: 1_000_000,
    type: "beneficio",
    settlement: "liquidado",
  },

  /* ── 07/08 viernes ── reference screenshot · the two Mastercard rows ─── */
  {
    id: "m-04",
    date: "2026-08-07",
    raw: "Pago tarjeta visa",
    merchant: "Pago de tarjeta Visa",
    amount: -57_705_686,
    type: "pago_tarjeta",
    settlement: "liquidado",
    card: { brand: "Visa", last4: "8214" },
  },
  {
    id: "m-05",
    date: "2026-08-07",
    raw: "Pago tarjeta master",
    merchant: "Pago de tarjeta Mastercard",
    amount: -26_581_803,
    type: "pago_tarjeta",
    settlement: "liquidado",
    card: { brand: "Mastercard", last4: "4417" },
  },
  {
    id: "m-06",
    date: "2026-08-07",
    raw: "Pago tarjeta master",
    merchant: "Pago de tarjeta Mastercard",
    amount: -3_470_160,
    type: "pago_tarjeta",
    settlement: "liquidado",
    card: { brand: "Mastercard", last4: "9036" },
  },

  /* ── 06/08 jueves ── reference screenshot ────────────────────────────── */
  {
    id: "m-07",
    date: "2026-08-06",
    raw: "Coto sucursal 103",
    merchant: "Coto",
    amount: -25_160_109,
    type: "compra",
    settlement: "liquidado",
    card: { brand: "Visa", last4: "8214" },
  },

  /* ── 05/08 miércoles ── reference screenshot ─────────────────────────── */
  {
    id: "m-08",
    date: "2026-08-05",
    raw: "Deb. autom. de serv.",
    merchant: "Edenor",
    amount: -4_722_200,
    type: "debito_automatico",
    settlement: "liquidado",
    biller: "Edenor",
    mandate: true,
  },
  {
    id: "m-09",
    date: "2026-08-05",
    raw: "Venta bursatil",
    merchant: "Venta de títulos",
    amount: 96_805_498,
    type: "titulos",
    settlement: "liquidado",
  },

  /* ── 04/08 martes ── reference screenshot ────────────────────────────── */
  {
    id: "m-10",
    date: "2026-08-04",
    raw: "Compra venta de dolares",
    merchant: "Venta de dólares",
    amount: 27_076_130,
    type: "cambio",
    settlement: "liquidado",
  },
  {
    id: "m-11",
    date: "2026-08-04",
    raw: "Transferencia a terceros",
    merchant: "Transferencia a Martina Fernández Cabral",
    amount: -26_104_523,
    type: "transferencia",
    settlement: "liquidado",
    counterparty: "Martina Fernández Cabral",
  },

  /* ── 03/08 lunes ── fifteen movements ────────────────────────────────── */
  {
    id: "m-12",
    date: "2026-08-03",
    raw: "COMPRA VISA DEB YPF EST 4412 ****8214",
    merchant: "YPF",
    amount: -8_945_000,
    type: "compra",
    settlement: "liquidado",
    card: { brand: "Visa", last4: "8214" },
  },
  {
    id: "m-13",
    date: "2026-08-03",
    raw: "FARMACITY 0231",
    merchant: "Farmacity",
    amount: -1_234_580,
    type: "compra",
    settlement: "liquidado",
    card: { brand: "Visa", last4: "8214" },
  },
  /* twin A — nothing distinguishes these two. The row must say so. */
  {
    id: "m-14",
    date: "2026-08-03",
    raw: "MERPAGO*RAPPI",
    merchant: "Rappi",
    amount: -876_540,
    type: "compra",
    settlement: "liquidado",
  },
  /* twin B */
  {
    id: "m-15",
    date: "2026-08-03",
    raw: "MERPAGO*RAPPI",
    merchant: "Rappi",
    amount: -876_540,
    type: "compra",
    settlement: "liquidado",
  },
  {
    id: "m-16",
    date: "2026-08-03",
    raw: "CARREFOUR EXPRESS 1180",
    merchant: "Carrefour Express",
    amount: -3_421_900,
    type: "compra",
    settlement: "liquidado",
    card: { brand: "Visa", last4: "8214" },
  },
  {
    id: "m-17",
    date: "2026-08-03",
    raw: "STARBUCKS ARG 0455",
    merchant: "Starbucks",
    amount: -689_000,
    type: "compra",
    settlement: "liquidado",
    card: { brand: "Visa", last4: "8214" },
  },
  {
    id: "m-18",
    date: "2026-08-03",
    raw: "NETFLIX.COM",
    merchant: "Netflix",
    amount: -1_299_900,
    type: "debito_automatico",
    settlement: "liquidado",
    biller: "Netflix",
    mandate: true,
  },
  {
    id: "m-19",
    date: "2026-08-03",
    raw: "DEB AUT MOVISTAR 7781204",
    merchant: "Movistar",
    amount: -2_845_000,
    type: "debito_automatico",
    settlement: "liquidado",
    biller: "Movistar",
    mandate: true,
  },
  {
    id: "m-20",
    date: "2026-08-03",
    raw: "DEB AUT AYSA 4478112",
    merchant: "Aysa",
    amount: -1_876_400,
    type: "debito_automatico",
    settlement: "liquidado",
    biller: "Aysa",
    mandate: true,
  },
  {
    id: "m-21",
    date: "2026-08-03",
    raw: "DEB AUT METROGAS 88213",
    merchant: "Metrogas",
    amount: -944_500,
    type: "debito_automatico",
    settlement: "liquidado",
    biller: "Metrogas",
    mandate: true,
  },
  {
    id: "m-22",
    date: "2026-08-03",
    raw: "TRANSFERENCIA RECIBIDA CBU 0070...4012",
    merchant: "Transferencia de Sofía Miranda",
    amount: 15_000_000,
    type: "transferencia",
    settlement: "liquidado",
    counterparty: "Sofía Miranda",
  },
  {
    id: "m-23",
    date: "2026-08-03",
    raw: "REINTEGRO QUIERO GALICIA 0812",
    merchant: "Reintegro Quiero! Galicia",
    amount: 450_000,
    type: "beneficio",
    settlement: "liquidado",
  },
  {
    id: "m-24",
    date: "2026-08-03",
    raw: "LA ANONIMA 0071",
    merchant: "La Anónima",
    amount: -4_587_320,
    type: "compra",
    settlement: "liquidado",
    card: { brand: "Visa", last4: "8214" },
  },
  {
    id: "m-25",
    date: "2026-08-03",
    raw: "MUSIMUNDO SUC 12",
    merchant: "Musimundo",
    amount: -18_990_000,
    type: "compra",
    settlement: "liquidado",
    card: { brand: "Mastercard", last4: "4417" },
  },
  {
    id: "m-26",
    date: "2026-08-03",
    raw: "Coto sucursal 103",
    merchant: "Coto",
    amount: -6_712_340,
    type: "compra",
    settlement: "liquidado",
    card: { brand: "Visa", last4: "8214" },
  },

  /* ── 02/08 domingo ── the shapes that break layouts ──────────────────── */
  /* a merchant name far too long for one line */
  {
    id: "m-27",
    date: "2026-08-02",
    raw: "AC FOMENTO EDUC CULT B PARQUE CHAS CUIT 30-71234567-9",
    merchant:
      "Transferencia a Asociación Civil de Fomento Educativo y Cultural Barrio Parque Chas",
    amount: -1_500_000,
    type: "transferencia",
    settlement: "liquidado",
    counterparty:
      "Asociación Civil de Fomento Educativo y Cultural Barrio Parque Chas",
  },
  /* an eight-figure amount */
  {
    id: "m-28",
    date: "2026-08-02",
    raw: "Venta bursatil - liquidacion T+1",
    merchant: "Venta de títulos",
    amount: 1_248_035_055, // $12.480.350,55
    type: "titulos",
    settlement: "liquidado",
  },
  /* The counterpart to the settlement above. Without it the period sums to a
     +$12.4M net against a $438k balance, which implies the account opened the
     period twelve million pesos overdrawn — a caja de ahorro cannot be. The
     header renders the balance beside the in/out pair, so a reader does that
     subtraction immediately.

     Selling títulos and converting the proceeds to dollars the same day is the
     ordinary MEP operation, which is also the thesis: in Argentina this is
     routine, not an exception, and it belongs in the `operacion` stream beside
     the settlement that funded it. */
  {
    id: "m-35",
    date: "2026-08-02",
    raw: "COMPRA VTA DE DOLARES - LIQ. MEP",
    merchant: "Compra de dólares",
    amount: -1_245_318_240, // -$12.453.182,40
    type: "cambio",
    settlement: "liquidado",
  },
  /* a refund — positive, but the customer's own money coming back, NOT green */
  {
    id: "m-29",
    date: "2026-08-02",
    raw: "DEVOLUCION FARMACITY 0231 ****8214",
    merchant: "Farmacity",
    amount: 3_842_015,
    type: "devolucion",
    settlement: "liquidado",
    card: { brand: "Visa", last4: "8214" },
  },
  /* pure bank code, no identifiable merchant */
  {
    id: "m-30",
    date: "2026-08-02",
    raw: "DB VAR CGO SERV 4412/AR REF 88213-A",
    merchant: null,
    unresolvedLabel: "Movimiento sin identificar",
    amount: -312_000,
    type: "sin_clasificar",
    settlement: "liquidado",
  },

  /* ── 30/07 jueves ── desktop reference ───────────────────────────────── */
  {
    id: "m-31",
    date: "2026-07-30",
    raw: "Coto Sucursal 103",
    merchant: "Coto",
    amount: -8_188_299,
    type: "compra",
    settlement: "liquidado",
    card: { brand: "Visa", last4: "8214" },
  },

  /* ── 27/07 lunes ── desktop reference ────────────────────────────────── */
  {
    id: "m-32",
    date: "2026-07-27",
    raw: "Reintegro Promocion Galicia",
    merchant: "Reintegro por promoción Galicia",
    amount: 536_727,
    type: "beneficio",
    settlement: "liquidado",
  },

  /* ── 23/07 jueves ── desktop reference ───────────────────────────────── */
  {
    id: "m-33",
    date: "2026-07-23",
    raw: "Coto Sucursal 103",
    merchant: "Coto",
    amount: -18_052_196,
    type: "compra",
    settlement: "liquidado",
    card: { brand: "Visa", last4: "8214" },
  },
  {
    id: "m-34",
    date: "2026-07-23",
    raw: "Transferencia De Terceros",
    merchant: "Transferencia de Nicolás Ferreyra",
    amount: 100_000_000,
    type: "transferencia",
    settlement: "liquidado",
    counterparty: "Nicolás Ferreyra",
  },
];
