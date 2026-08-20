import { cn } from "@/lib/cn";
import { formatDate, relativeDayLabel } from "@/lib/format";
import type { DayGroup as Group } from "@/lib/types";
import { Amount } from "./amount";
import { TransactionRow } from "./transaction-row";

/* ============================================================================
   DAY GROUP
   ----------------------------------------------------------------------------
   The date is stamped once, on a header, instead of repeating on every row —
   the three consecutive «07/08/26» in the reference screen were the clearest
   evidence that the screen had no notion of a day at all.

   The subtotal is the NET of the day, and it renders through the same Amount
   component as the rows, so its digits land in the same column and the day can
   be compared against the movements that produced it without moving your eye.
   ========================================================================== */

export function DayGroup({
  group,
  today,
  headerClassName,
}: {
  group: Group;
  today: string;
  /** Sticky offset. Differs per breakpoint: the control bar only sticks on desktop. */
  headerClassName?: string;
}) {
  const label = relativeDayLabel(group.date, today);
  const tone = group.subtotal < 0 ? "debito" : "credito";

  return (
    <section aria-labelledby={`day-${group.date}`}>
      <header
        className={cn(
          "sticky z-10 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5",
          "border-y border-line bg-surface-2 px-[var(--gutter)] py-2",
          headerClassName,
        )}
      >
        <h3 id={`day-${group.date}`} className="flex items-baseline gap-1.5">
          <span className="text-meta font-semibold uppercase tracking-[var(--tracking-overline)] text-ink">
            {label}
          </span>
          <span className="num text-meta text-ink-3">
            {formatDate(group.date)}
          </span>
        </h3>
        <p className="ml-auto flex items-baseline gap-1.5">
          <span className="text-meta text-ink-3">Neto</span>
          <Amount cents={group.subtotal} tone={tone} size="meta" />
        </p>
      </header>

      <ul className="px-[var(--gutter)]">
        {group.movements.map((m, i) => (
          <TransactionRow
            key={m.id}
            movement={m}
            className={i > 0 ? "border-t border-line" : undefined}
          />
        ))}
      </ul>
    </section>
  );
}
