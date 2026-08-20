import { cn } from "@/lib/cn";
import { Warning } from "../primitives/icons";

/* ============================================================================
   NOTICE
   ----------------------------------------------------------------------------
   The banner that sits above the list when something is wrong but the data is
   still worth showing. Never replaces the list: an empty error screen destroys
   more value than honest stale data.
   ========================================================================== */

const TONE = {
  danger: "border-danger-line bg-danger-soft text-danger",
  pending: "border-pending-line bg-pending-soft text-pending",
} as const;

export function Notice({
  tone,
  title,
  children,
  action,
}: {
  tone: keyof typeof TONE;
  title: string;
  children?: React.ReactNode;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div
      role="status"
      className={cn(
        "mb-3 flex items-start gap-2.5 rounded-[var(--radius-md)] border px-3 py-2.5",
        TONE[tone],
      )}
    >
      <Warning size={16} className="mt-px shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-meta font-semibold">{title}</p>
        {children && (
          <p className="mt-0.5 text-meta leading-snug text-ink-2">{children}</p>
        )}
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="shrink-0 rounded-[var(--radius-sm)] border border-current px-2 py-1 text-meta font-semibold hover:bg-surface/50"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
