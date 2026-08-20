import { cn } from "@/lib/cn";

/* ============================================================================
   LOADING SKELETON
   ----------------------------------------------------------------------------
   Matched to the real rhythm of the list, not grey blobs: the same day headers,
   the same 2- and 3-line rows in the same proportion, the same padding tokens,
   and an amount block on the same grid — so nothing shifts when real data
   replaces it.

   Pulsing opacity rather than a sweeping shimmer, because a shimmer is a
   gradient and this design does not use them.
   ========================================================================== */

/* Deterministic — no Math.random, so server and client render identically. */
const DAYS: { lines: number; name: number; raw: number }[][] = [
  [
    { lines: 3, name: 42, raw: 78 },
    { lines: 3, name: 61, raw: 55 },
  ],
  [{ lines: 3, name: 34, raw: 63 }],
  [
    { lines: 2, name: 55, raw: 47 },
    { lines: 3, name: 47, raw: 84 },
    { lines: 3, name: 38, raw: 58 },
  ],
  [{ lines: 2, name: 66, raw: 40 }],
];

function Bar({
  w,
  h = 12,
  delay,
  className,
}: {
  w: number | string;
  h?: number;
  delay: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: typeof w === "number" ? `${w}%` : w,
        height: h,
        animationDelay: `${delay}ms`,
      }}
      className={cn(
        "block rounded-[3px] bg-surface-3 [animation:skeleton-pulse_1.4s_ease-in-out_infinite]",
        className,
      )}
    />
  );
}

export function ListSkeleton() {
  let i = 0;
  return (
    <div aria-hidden="true" className="-mx-[var(--gutter)] border-y border-line bg-surface">
      {DAYS.map((rows, d) => (
        <section key={d}>
          <header className="flex items-baseline justify-between border-y border-line bg-surface-2 px-[var(--gutter)] py-2">
            <Bar w={92} h={11} delay={d * 90} className="max-w-[7rem]" />
            <Bar w={72} h={11} delay={d * 90 + 40} className="max-w-[6rem]" />
          </header>
          <ul className="px-[var(--gutter)]">
            {rows.map((r, k) => {
              const delay = (i++ % 6) * 110;
              return (
                <li
                  key={k}
                  className={cn(
                    "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-[var(--row-gap)]",
                    "min-h-[var(--row-min-h)] py-[var(--row-pad-y)]",
                    k > 0 && "border-t border-line",
                  )}
                >
                  <span className="flex flex-col gap-[var(--row-line-gap)]">
                    <Bar w={r.name} h={15} delay={delay} />
                    <Bar w={r.raw} h={12} delay={delay + 50} className="mt-1" />
                    {r.lines === 3 && (
                      <Bar w={30} h={11} delay={delay + 100} className="mt-1.5" />
                    )}
                  </span>
                  <Bar
                    w="var(--amount-col)"
                    h={16}
                    delay={delay + 30}
                    className="mt-0.5"
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Placeholder for the in/out pair while the total is still being summed. */
export function SummarySkeleton() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-[5.5rem] rounded-[3px] bg-[color-mix(in_srgb,var(--hero-fg)_18%,transparent)] [animation:skeleton-pulse_1.4s_ease-in-out_infinite] align-middle"
    />
  );
}
