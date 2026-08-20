"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { account, CACHED_AT, movements, TODAY } from "@/data/fixtures";
import { parseState } from "@/lib/states";
import type { ScreenState } from "@/lib/types";
import { DevControl } from "./dev-control";
import { MovementsScreen } from "./movements-screen";
import { ProtoNav } from "./proto-nav";
import { Sidebar } from "./sidebar";

/* Owns the ?state= param so every state is reachable from a plain URL and from
   the floating control, and both stay in sync. */

export function AccountScreen() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const state = parseState(params.get("state"));

  const select = useCallback(
    (s: ScreenState) => {
      router.replace(s === "default" ? pathname : `${pathname}?state=${s}`, {
        scroll: false,
      });
    },
    [router, pathname],
  );

  /* A brand-new account has no history and no balance to show. */
  const isNew = state === "empty-new";

  return (
    <div className="min-h-dvh bg-surface-2">
      <ProtoNav active="/" />
      <div className="desk:flex">
        <Sidebar />
        <main className="min-w-0 flex-1">
          {/* Keyed on `state` so React remounts and re-initialises the screen's
              local state from that state's preset. Replaces an effect that
              reset query/range/filter on every change. */}
          <MovementsScreen
            key={state}
            account={isNew ? { ...account, balance: 0 } : account}
            movements={isNew ? [] : movements}
            today={TODAY}
            state={state}
            cachedAt={CACHED_AT}
          />
        </main>
      </div>
      <DevControl state={state} onSelect={select} />
    </div>
  );
}
