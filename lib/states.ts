/* ============================================================================
   SCREEN STATES
   ----------------------------------------------------------------------------
   Six states, none of them decoration. Reachable via ?state= and from the
   floating dev control.

   Two of them are NOT faked. `empty-filter` presets a real query and lets the
   real pipeline return nothing; `empty-quiet` presets a real range over a month
   with no activity. Both then render through the same code path a user would
   hit, so the demo cannot drift from the behaviour.
   ========================================================================== */

import type { ScreenState } from "./types";

export const STATES: {
  key: ScreenState;
  label: string;
  hint: string;
}[] = [
  { key: "default", label: "Normal", hint: "35 movimientos cargados" },
  { key: "loading", label: "Cargando", hint: "Esqueleto → filas → resumen" },
  { key: "empty-new", label: "Cuenta nueva", hint: "Nunca tuvo movimientos" },
  { key: "empty-filter", label: "Filtro sin resultados", hint: "Búsqueda real que no encuentra nada" },
  { key: "empty-quiet", label: "Período sin actividad", hint: "Septiembre existe y está vacío" },
  { key: "error-connection", label: "Error de conexión", hint: "Datos cacheados + timestamp" },
  { key: "error-partial", label: "Error parcial", hint: "Un movimiento sin liquidar" },
];

export const isState = (v: string | null): v is ScreenState =>
  v !== null && STATES.some((s) => s.key === v);

export function parseState(v: string | null): ScreenState {
  return isState(v) ? v : "default";
}

/** Preset applied on entering a state, so empty states are reached honestly. */
export const PRESETS: Partial<
  Record<ScreenState, { query?: string; range?: { from: string; to: string } }>
> = {
  "empty-filter": { query: "kayak" },
  "empty-quiet": { range: { from: "2026-09-01", to: "2026-09-30" } },
};
