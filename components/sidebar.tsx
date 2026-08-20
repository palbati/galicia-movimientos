import { cn } from "@/lib/cn";
import { User } from "./primitives/icons";

/* ============================================================================
   SIDEBAR — desktop only
   ----------------------------------------------------------------------------
   Navigation taken verbatim from the reference web app, in its order and its
   grouping. It is context, not the object of the redesign: reproducing it
   faithfully is what lets the Movimientos panel be judged in situ.
   ========================================================================== */

const PRIMARY = [
  "Inicio",
  "Cuentas",
  "Tarjetas",
  "Transferencias",
  "Pagos de servicios",
  "Cobrá con Nave",
  "Inversiones",
  "Compra/Venta de Dólares",
  "Préstamos",
  "Seguros",
  "Cajas de Seguridad",
  "Quiero Recompensas",
  "Beneficios",
];

const SECONDARY = [
  "Ayuda",
  "Comparación de comisiones",
  "Autorización de Plazo Fijo",
  "Cuenta Gratuita Universal",
];

const ACTIVE = "Cuentas";

function Item({ label }: { label: string }) {
  const active = label === ACTIVE;
  return (
    <li>
      <span
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex min-h-8 items-center py-1 pl-3 pr-2 text-[0.8125rem] leading-snug",
          active ? "font-semibold text-ink" : "text-ink-2",
        )}
      >
        {active && (
          <span
            aria-hidden="true"
            className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-brand"
          />
        )}
        {label}
      </span>
    </li>
  );
}

export function Sidebar() {
  return (
    <nav
      aria-label="Menú principal"
      className="hidden w-[var(--sidebar-w)] shrink-0 border-r border-line bg-surface desk:block"
    >
      <div className="sticky top-[var(--proto-nav-h)] flex h-[calc(100dvh-var(--proto-nav-h))] flex-col overflow-y-auto py-4">
        {/* Placeholder for the Galicia logotype asset. */}
        <p className="mx-3 mb-4 inline-flex w-fit items-center rounded-[var(--radius-sm)] bg-brand px-2.5 py-1 text-[0.9375rem] font-semibold tracking-tight text-white">
          Galicia
        </p>

        <p className="mb-5 flex items-center gap-2 px-3 text-[0.8125rem] text-ink-2">
          <User size={16} />
          Camila Ortiz Ledesma
        </p>

        <ul className="space-y-px">
          {PRIMARY.map((l) => (
            <Item key={l} label={l} />
          ))}
        </ul>
        <ul className="mt-6 space-y-px">
          {SECONDARY.map((l) => (
            <Item key={l} label={l} />
          ))}
        </ul>
        <ul className="mt-6 space-y-px">
          <Item label="Cerrar Sesión" />
        </ul>
      </div>
    </nav>
  );
}
