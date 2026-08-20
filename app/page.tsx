import { Suspense } from "react";
import { AccountScreen } from "@/components/account-screen";

/* useSearchParams needs a Suspense boundary for static rendering. */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <AccountScreen />
    </Suspense>
  );
}
