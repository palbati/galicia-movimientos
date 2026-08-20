"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { applyFilters, type FilterKey, type Range } from "@/lib/filter";
import { formatAbs, formatStamp } from "@/lib/format";
import { derive, groupByDay, totals } from "@/lib/movements";
import { PRESETS } from "@/lib/states";
import type { Account, Movement, ScreenState } from "@/lib/types";
import { AccountHero } from "./account-hero";
import { DateRangeMenu } from "./date-range-menu";
import { DayGroup } from "./day-group";
import { ChipGroup } from "./primitives/chip-group";
import { SearchField } from "./primitives/search-field";
import { EmptyFilter, EmptyNew, EmptyQuiet } from "./states/empty";
import { Notice } from "./states/notice";
import { ListSkeleton } from "./states/skeleton";
import { TopActions } from "./top-actions";

/* ============================================================================
   MOVEMENTS SCREEN
   ----------------------------------------------------------------------------
   Search, filter and range live here because the header's in/out pair is
   computed from the same filtered set the list renders. That coupling is the
   point: applying a filter does not just hide rows, it re-answers the question
   at the top of the screen.

   Loading runs in three phases and loops, so it can be demoed live:
     0  skeleton
     1  real rows, summary still resolving  ← rows arrive before the total
     2  complete
   The total depends on the full set, so it cannot honestly appear before the
   rows do. Showing the rows meanwhile is the partial result that is already
   useful.
   ========================================================================== */

export function MovementsScreen({
  account,
  movements,
  today,
  state,
  cachedAt,
}: {
  account: Account;
  movements: Movement[];
  today: string;
  state: ScreenState;
  cachedAt: string;
}) {
  /* Entering a state applies its preset, so the empty states are reached
     through the real pipeline rather than mocked. This used to run in an
     effect that reset the three values whenever `state` changed; the component
     is now keyed on `state` in account-screen.tsx, so React remounts it and
     these initialisers do the same job without a cascading render. */
  const preset = PRESETS[state];
  const [query, setQuery] = useState(preset?.query ?? "");
  const [filter, setFilter] = useState<FilterKey>("todos");
  const [range, setRange] = useState<Range | null>(preset?.range ?? null);
  const [phase, setPhase] = useState(state === "loading" ? 0 : 2);
  /* A one-shot run of the same phases, for the retry in the error state. */
  const [retrying, setRetrying] = useState(false);
  const reduce = useReducedMotion();

  /* `loading` cycles so it can be demoed live without reloading. Remounting on
     `state` sets the opening phase, so this effect only has to own the timer. */
  useEffect(() => {
    if (state !== "loading") return;
    const id = window.setInterval(() => setPhase((p) => (p + 1) % 3), 1400);
    return () => window.clearInterval(id);
  }, [state]);

  /* The retry is one pass, not a loop: skeleton, then rows with the total still
     resolving, then settled. Phase 0 is set by the click handler, so nothing
     here fires synchronously on mount. */
  useEffect(() => {
    if (!retrying) return;
    const toRows = window.setTimeout(() => setPhase(1), 1200);
    const toDone = window.setTimeout(() => {
      setPhase(2);
      setRetrying(false);
    }, 2400);
    return () => {
      window.clearTimeout(toRows);
      window.clearTimeout(toDone);
    };
  }, [retrying]);

  const all = useMemo(() => derive(movements), [movements]);

  const bounds = useMemo<Range>(() => {
    if (all.length === 0) return { from: today, to: today };
    const dates = all.map((m) => m.date).sort();
    return { from: dates[0], to: dates[dates.length - 1] };
  }, [all, today]);

  const visible = useMemo(
    () => applyFilters(all, { query, filter, range }),
    [all, query, filter, range],
  );
  const groups = useMemo(() => groupByDay(visible), [visible]);
  const sums = useMemo(() => totals(visible), [visible]);

  const narrowing = query.trim() !== "" || filter !== "todos";
  const narrowed = narrowing || range !== null;

  const sequencing = state === "loading" || retrying;
  const showSkeleton = sequencing && phase === 0;
  const summaryPending = sequencing && phase < 2;

  const pending = all.find((m) => m.settlement === "pendiente");

  const clearAll = () => {
    setQuery("");
    setFilter("todos");
    setRange(null);
  };

  /* ── which nothing is this? ─────────────────────────────────────────────
     Three different empties, decided from what is actually true rather than
     from the state key, so a user who filters into nothing sees the same
     screen the demo shows. */
  let body: React.ReactNode;
  if (showSkeleton) {
    body = <ListSkeleton />;
  } else if (all.length === 0) {
    body = <EmptyNew />;
  } else if (visible.length === 0 && narrowing) {
    body = (
      <EmptyFilter
        query={query.trim()}
        hasRange={range !== null}
        onClearQuery={() => setQuery("")}
        onClearAll={clearAll}
      />
    );
  } else if (visible.length === 0) {
    body = (
      <EmptyQuiet
        from={range?.from ?? bounds.from}
        to={range?.to ?? bounds.to}
        onWiden={() => setRange(null)}
      />
    );
  } else {
    body = (
      <div className="-mx-[var(--gutter)] border-y border-line bg-surface">
        {/* Enter-only animation, deliberately.

            An earlier version wrapped these in AnimatePresence with
            mode="popLayout" and a layout prop. Filtering left the exiting day
            groups stuck at position:absolute with opacity:1 — operation rows
            stayed visible on screen after filtering to Consumos. In a list of
            money that is not a cosmetic bug, it is the screen lying about what
            matched. Groups now leave immediately and only arrive with a fade,
            which is also the better read: when you filter, you want the answer,
            not a transition. */}
        {groups.map((g) => (
          <motion.div
            key={g.date}
            initial={reduce ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <DayGroup
              group={g}
              today={today}
              headerClassName="top-[var(--proto-nav-h)]"
            />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <>
      <TopActions />
      <AccountHero
        account={account}
        totals={sums}
        filtered={narrowed}
        narrowing={narrowing}
        hasHistory={all.length > 0}
        pendingSummary={summaryPending}
      />

      <div className="bg-surface-2 pb-24">
        <div className="mx-auto w-full max-w-[var(--content-max)] px-[var(--gutter)]">
          {/* One control bar that reflows. It used to have two entirely
              separate arrangements either side of 1024px, which was a large
              part of why the phone and the desktop read as different products.
              Now it wraps: stacked when narrow, one row when there is room. */}
          {all.length === 0 ? (
            <h2 className="pb-3 pt-5 text-title font-semibold text-ink">
              Movimientos
            </h2>
          ) : (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-3 pb-3 pt-5">
              <h2 className="mr-auto text-title font-semibold text-ink">
                Movimientos
              </h2>
              <SearchField
                value={query}
                onValueChange={setQuery}
                className="h-10 w-full sm:w-[15rem] md:w-[17rem]"
              />
              {/* Chips and the range control share one scrollable strip: the
                  range is another filter, so it belongs beside them. */}
              <div
                className={cn(
                  "-mx-[var(--gutter)] flex w-[calc(100%+2*var(--gutter))] snap-x items-center gap-1.5",
                  "overflow-x-auto px-[var(--gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                  /* scroll-padding, not just padding. A snap point is measured
                     against the scrollport edge, which ignores padding — so the
                     browser snapped the first chip flush to the container and
                     ate the gutter, leaving the strip 16px left of the hero,
                     the heading and every row. This makes the snap respect it. */
                  "scroll-px-[var(--gutter)]",
                  "sm:mx-0 sm:w-auto sm:overflow-visible sm:px-0",
                )}
              >
                <ChipGroup value={filter} onValueChange={setFilter} />
                <div className="shrink-0">
                  <DateRangeMenu range={range} bounds={bounds} onApply={setRange} />
                </div>
              </div>
            </div>
          )}

          {state === "error-connection" && (
            <Notice
              tone="danger"
              title="No pudimos actualizar"
              action={{
                label: retrying ? "Actualizando…" : "Reintentar",
                onClick: () => {
                  if (retrying) return;
                  setPhase(0);
                  setRetrying(true);
                },
              }}
            >
              Mostrando datos del{" "}
              <span className="num">{formatStamp(cachedAt)}</span>. Es lo último
              que llegó a guardarse; puede que falte algún movimiento reciente.
            </Notice>
          )}

          {state === "error-partial" && pending && (
            <Notice tone="pending" title="Hay un movimiento sin liquidar">
              {pending.merchant ?? pending.unresolvedLabel} por{" "}
              <span className="num">{formatAbs(pending.amount)}</span>{" "}
              todavía no impactó en el saldo. El importe puede cambiar hasta que
              se acredite.
            </Notice>
          )}

          {body}
        </div>
      </div>
    </>
  );
}
