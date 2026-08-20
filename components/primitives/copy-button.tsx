"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Check, Copy } from "./icons";

/** Copy affordance from the real desktop screen, beside the CBU and the alias. */
export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          window.setTimeout(() => setDone(false), 1600);
        } catch {
          /* Clipboard can be blocked by permissions policy; the value stays
             selectable on screen either way, so there is nothing to recover. */
        }
      }}
      aria-label={done ? `${label} copiado` : `Copiar ${label}`}
      className={cn(
        "inline-grid size-7 place-items-center rounded-[var(--radius-sm)]",
        "opacity-80 transition-opacity hover:opacity-100",
        className,
      )}
    >
      {done ? <Check /> : <Copy />}
    </button>
  );
}
