"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSession } from "@/lib/auth";

/**
 * Client-side route guard for the protected area. While the session is
 * resolving we show a minimal loader; if there's no token/user we redirect to
 * /login (with a `next` param to bounce back).
 *
 * Note: this is a UX guard only — the backend enforces real authorization on
 * every request via the JWT.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=" + window.location.pathname);
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
