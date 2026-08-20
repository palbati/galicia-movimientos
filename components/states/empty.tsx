import { cn } from "@/lib/cn";
import { formatDayShort } from "@/lib/format";

/* ============================================================================
   EMPTY STATES
   ----------------------------------------------------------------------------
   Three different nothings, and they are not interchangeable:

     new      the account has never had a movement. This is onboarding.
     filter   the criteria matched nothing. The way out has to be in reach.
     quiet    the period is real and simply had no activity. Nothing to undo.

   No invented illustration and no emoji — a rule drawn in the brand orange and
   real sentences.
   ========================================================================== */

function Shell({
  title,
  children,
  actions,
}: {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="-mx-[var(--gutter)] border-y border-line bg-surface px-[var(--gutter)] py-14 sm:py-16">
      <div className="mx-auto max-w-[26rem] text-center">
        <span
          aria-hidden="true"
          className="mx-auto mb-5 block h-0.5 w-10 rounded-full bg-brand"
        />
        <h3 className="text-title font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-body leading-relaxed text-ink-2">{children}</p>
        {actions && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}

const btn =
  "h-10 rounded-[var(--radius-md)] px-4 text-meta font-semibold transition-colors";

export function EmptyNew() {
  return (
    <Shell title="Todavía no hay movimientos">
      Tu caja de ahorro está abierta y lista para operar. Apenas entre o salga
      plata, cada movimiento va a aparecer acá, agrupado por día.
    </Shell>
  );
}

export function EmptyFilter({
  query,
  onClearQuery,
  onClearAll,
  hasRange,
}: {
  query: string;
  onClearQuery: () => void;
  onClearAll: () => void;
  hasRange: boolean;
}) {
  return (
    <Shell
      title="No encontramos movimientos con ese criterio"
      actions={
        <>
          {query && (
            <button
              type="button"
              onClick={onClearQuery}
              className={cn(btn, "bg-cta text-white hover:opacity-90")}
            >
              Borrar «{query}»
            </button>
          )}
          <button
            type="button"
            onClick={onClearAll}
            className={cn(
              btn,
              "border border-line text-ink-2 hover:border-line-2",
            )}
          >
            {hasRange ? "Quitar filtros y ampliar el rango" : "Quitar los filtros"}
          </button>
        </>
      }
    >
      Probá con el nombre del comercio o con la descripción tal cual la manda el
      banco. La búsqueda mira las dos.
    </Shell>
  );
}

export function EmptyQuiet({
  from,
  to,
  onWiden,
}: {
  from: string;
  to: string;
  onWiden: () => void;
}) {
  return (
    <Shell
      title="No hubo movimientos en este período"
      actions={
        <button
          type="button"
          onClick={onWiden}
          className={cn(btn, "bg-cta text-white hover:opacity-90")}
        >
          Ver todo el período
        </button>
      }
    >
      Entre el <span className="num">{formatDayShort(from)}</span> y el{" "}
      <span className="num">{formatDayShort(to)}</span> no entró ni salió plata
      de esta cuenta. No es un error y no hay nada que reintentar.
    </Shell>
  );
}
