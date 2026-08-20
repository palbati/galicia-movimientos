import { cn } from "@/lib/cn";
import type { DerivedMovement } from "@/lib/types";
import { Amount } from "./amount";

/* ============================================================================
   TRANSACTION ROW
   ----------------------------------------------------------------------------
   Three lines, the third only when there is something to put on it.

     1  Resolved merchant · · · · · · · · · · · · · · · ·  −  $157.300,70
     2  Coto sucursal 103                    ← the bank's raw string, verbatim
     3  Visa ••••8214 · 1 de 2 · Débito automático        ← only when it exists

   Line 2 is never edited, never truncated and never hidden. It is the only
   string the customer can match against the PDF statement, and on a phone
   there is no hover to reveal it from.

   Line 3 carries the disambiguators, so it is set in a darker ink than line 2
   despite sitting below it: it is the line that answers "why does this appear
   twice?", which line 2 cannot.
   ========================================================================== */

function CardRef({ brand, last4 }: { brand: string; last4: string }) {
  return (
    <span className="whitespace-nowrap">
      {brand} <span className="num">••••{last4}</span>
    </span>
  );
}

export function TransactionRow({
  movement: m,
  className,
}: {
  movement: DerivedMovement;
  className?: string;
}) {
  const isOperacion = m.stream === "operacion";
  const unresolved = m.merchant === null;

  const meta: React.ReactNode[] = [];
  if (m.card) {
    meta.push(<CardRef key="card" brand={m.card.brand} last4={m.card.last4} />);
  }
  if (m.duplicate) {
    meta.push(
      <span key="dup" className="whitespace-nowrap">
        <span className="num">{m.duplicate.index}</span> de{" "}
        <span className="num">{m.duplicate.total}</span>
      </span>,
    );
  }
  if (m.mandate) {
    meta.push(
      <span key="mandate" className="whitespace-nowrap">
        Débito automático
      </span>,
    );
  }

  const pending = m.settlement === "pendiente";
  const hasMetaLine = pending || meta.length > 0;

  return (
    <li
      data-stream={m.stream}
      data-tone={m.tone}
      className={cn(
        "relative grid grid-cols-[minmax(0,1fr)_auto] items-start",
        "gap-[var(--row-gap)] py-[var(--row-pad-y)]",
        "min-h-[var(--row-min-h)]",
        isOperacion && "pl-[var(--rail-inset)]",
        className,
      )}
    >
      {/* Lane marker. Operations only — see --rail-w in tokens.css. */}
      {isOperacion && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-0 top-[var(--row-pad-y)] bottom-[var(--row-pad-y)]",
            "w-[var(--rail-w)] rounded-full bg-line-2",
          )}
        />
      )}

      <div className="flex min-w-0 flex-col gap-[var(--row-line-gap)]">
        {/* 1 — resolved merchant, or an explicit statement that we could not resolve it */}
        <p
          className={cn(
            "text-name leading-snug",
            unresolved
              ? "font-normal italic text-ink-2"
              : "font-medium text-ink",
          )}
        >
          {m.merchant ?? m.unresolvedLabel}
        </p>

        {/* 2 — the bank's raw string, verbatim. Wraps; never truncated. */}
        <p className="text-raw leading-snug text-ink-3">{m.raw}</p>

        {/* 3 — disambiguators and status, only when present */}
        {hasMetaLine && (
          <p className="mt-[0.1875rem] flex flex-wrap items-center gap-x-1.5 gap-y-1 text-meta leading-tight text-ink-2">
            {pending && (
              <span className="rounded-[var(--radius-sm)] border border-pending-line bg-pending-soft px-1.5 py-px font-medium text-pending">
                Pendiente
              </span>
            )}
            {meta.map((node, i) => (
              <span key={i} className="flex items-center gap-x-1.5">
                {i > 0 && (
                  <span aria-hidden="true" className="text-ink-4">
                    ·
                  </span>
                )}
                {node}
              </span>
            ))}
          </p>
        )}
      </div>

      <Amount cents={m.amount} tone={m.tone} className="pt-px" />
    </li>
  );
}
