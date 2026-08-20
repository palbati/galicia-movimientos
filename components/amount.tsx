import { cn } from "@/lib/cn";
import { splitAmount } from "@/lib/format";
import type { Centavos, Tone } from "@/lib/types";

/* ============================================================================
   AMOUNT
   ----------------------------------------------------------------------------
   Two columns: the sign, then the digits.

   The sign lives in its own fixed-width column and the digit block carries a
   min-width, so the − and + glyphs land at the same x on every row and stack
   into a strip you can scan vertically without reading a single number. The
   digits are right-aligned and tabular, so the decimal comma aligns too.

   Direction is carried by three redundant channels — glyph, weight, colour —
   so it survives greyscale, and the sign is a true minus (U+2212), the same
   width as the plus.
   ========================================================================== */

const TONE_CLASS: Record<Tone, string> = {
  debito: "text-debit font-normal",
  credito: "text-credit font-semibold",
  beneficio: "text-benefit font-semibold",
};

const SR_PREFIX: Record<Tone, string> = {
  debito: "menos",
  credito: "más",
  beneficio: "más, beneficio de",
};

export function Amount({
  cents,
  tone,
  size = "row",
  className,
}: {
  cents: Centavos;
  tone: Tone;
  size?: "row" | "meta";
  className?: string;
}) {
  const { sign, digits } = splitAmount(cents);

  return (
    <span
      className={cn(
        "inline-grid shrink-0 items-baseline",
        "grid-cols-[var(--sign-col)_minmax(var(--amount-col),auto)]",
        size === "row" ? "text-amount" : "text-meta",
        TONE_CLASS[tone],
        className,
      )}
    >
      <span aria-hidden="true" className="num text-left tabular-nums">
        {sign}
      </span>
      <span aria-hidden="true" className="num text-right">
        {digits}
      </span>
      <span className="sr-only">{`${SR_PREFIX[tone]} ${digits}`}</span>
    </span>
  );
}
