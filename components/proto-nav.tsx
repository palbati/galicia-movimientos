import Link from "next/link";
import { cn } from "@/lib/cn";

/* Prototype chrome — deliberately dark and outside the app's own surface, so
   it never reads as part of the interface being judged. Route links, not
   Radix Tabs: these are navigations, and a tablist would lie to a screen
   reader about there being panels on this page. */

const TABS = [
  { href: "/", label: "Pantalla" },
  { href: "/showcase", label: "Showcase" },
] as const;

export function ProtoNav({ active }: { active: "/" | "/showcase" }) {
  return (
    <nav
      aria-label="Prototipo"
      className="sticky top-0 z-50 flex h-9 items-stretch gap-1 bg-ink px-2 text-meta"
    >
      {TABS.map((t) => {
        const current = t.href === active;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={current ? "page" : undefined}
            className={cn(
              "flex items-center rounded-[var(--radius-sm)] px-2.5 font-medium transition-colors",
              current
                ? "bg-brand text-on-brand"
                : "text-white/60 hover:text-white",
            )}
          >
            {t.label}
          </Link>
        );
      })}
      <span className="ml-auto flex items-center pr-1 text-[0.6875rem] text-white/35">
        Galicia · rediseño de Movimientos
      </span>
    </nav>
  );
}
