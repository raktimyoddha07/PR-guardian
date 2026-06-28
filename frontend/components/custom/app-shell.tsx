"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth";

/** Top navigation shell shown on every authenticated page. */
export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useSession();
  const router = useRouter();

  function handleSignOut() {
    signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-bold">
              PR Guardian
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">
                Agents
              </Link>
              <Link href="/dashboard/events" className="hover:text-foreground">
                Events
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            {loading ? (
              <span className="text-muted-foreground">…</span>
            ) : user ? (
              <>
                <span className="text-muted-foreground">{user.email}</span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
