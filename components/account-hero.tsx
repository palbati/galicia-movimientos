import { cn } from "@/lib/cn";
import { formatAbs, formatRange, splitAmount } from "@/lib/format";
import type { Totals } from "@/lib/movements";
import type { Account } from "@/lib/types";
import { CopyButton } from "./primitives/copy-button";
import { SummarySkeleton } from "./states/skeleton";

/* ============================================================================
   ACCOUNT HERO
   ----------------------------------------------------------------------------
   One treatment at every width. The band is Galicia's orange with white type at
   320px and at 1440px alike; only the measurements change, and they change
   fluidly rather than snapping at a breakpoint.

   The balance is the primary element; account type and number drop to
   secondary. In the reference screens the balance shares a line with
   «N° 4012845-7 021-4» — a number checked twenty times a day competing with one
   checked never.

   The in/out pair is scoped to the movements actually loaded and currently
   filtered, and the range is printed beside it, so it can never be read as a
   claim about a month we do not have. Filter the list below and the pair
   recomputes.

   No colour on the pair: green means «the bank gave you something», not «money
   in». The labels carry direction.
   ========================================================================== */

function Figure({
  label,
  cents,
  pending,
}: {
  label: string;
  cents: number;
  /** The total depends on the full set, so it resolves after the rows do. */
  pending?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1.5 sm:flex-col sm:items-start sm:gap-0.5">
      <span className="text-meta [color:var(--hero-fg)]">{label}</span>
      {pending ? (
        <SummarySkeleton />
      ) : (
        <span className="num text-body font-semibold [color:var(--hero-fg)]">
          {formatAbs(cents)}
        </span>
      )}
    </div>
  );
}

export function AccountHero({
  account,
  totals,
  filtered,
  narrowing,
  hasHistory,
  pendingSummary = false,
}: {
  account: Account;
  totals: Totals;
  filtered: boolean;
  narrowing: boolean;
  hasHistory: boolean;
  pendingSummary?: boolean;
}) {
  const balance = splitAmount(account.balance);

  /* Three different nothings need three different labels. Saying "sin
     movimientos en el rango" when it was a search that matched nothing points
     the reader at the wrong control. */
  const scope =
    totals.count === 0
      ? narrowing
        ? "Sin resultados"
        : "Sin movimientos en el rango"
      : null;

  return (
    <header className="hero bg-[var(--hero-bg)] [color:var(--hero-fg)]">
      <div className="mx-auto w-full max-w-[var(--content-max)] px-[var(--gutter)] pb-5 pt-4 sm:pb-7 sm:pt-6">
        <p className="text-meta [color:var(--hero-fg)]">
          {account.kind}
          <span className="mx-1.5" aria-hidden="true">
            ·
          </span>
          <span className="num">N° {account.number}</span>
        </p>

        <p className="mt-1 num text-display font-semibold tracking-tight">
          {balance.digits}
        </p>

        {/* CBU and alias appear as soon as there is room for them. On the
            narrowest phones they stay behind «Más opciones», where the real
            app keeps them. */}
        <div className="mt-3 hidden flex-wrap items-center gap-x-6 gap-y-1 sm:flex">
          {[
            { label: "CBU", value: account.cbu },
            { label: "Alias", value: account.alias },
          ].map((f) => (
            <p key={f.label} className="flex items-center gap-1.5 text-meta">
              <span className="uppercase tracking-[var(--tracking-overline)]">
                {f.label}
              </span>
              <span className="num">{f.value}</span>
              <CopyButton value={f.value} label={f.label} />
            </p>
          ))}
        </div>

        {hasHistory && (
          <div
            className={cn(
              "mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2",
              "border-t border-[var(--hero-line)] pt-3 sm:mt-5 sm:gap-x-10",
            )}
          >
            <p className="text-meta [color:var(--hero-fg)]">
              {scope ?? (
                <>
                  {filtered ? "Del filtro · " : ""}
                  <span className="num">
                    {formatRange(totals.from!, totals.to!)}
                  </span>
                  <span className="mx-1.5" aria-hidden="true">
                    ·
                  </span>
                  <span className="num">{totals.count}</span>{" "}
                  {totals.count === 1 ? "movimiento" : "movimientos"}
                </>
              )}
            </p>
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 sm:gap-x-10">
              <Figure label="Entró" cents={totals.in} pending={pendingSummary} />
              <Figure label="Salió" cents={totals.out} pending={pendingSummary} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
