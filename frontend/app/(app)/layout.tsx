import { AppShell } from "@/components/custom/app-shell";
import { AuthGuard } from "@/components/custom/auth-guard";

/**
 * Protected area layout. Wraps everything under the (app) route group
 * (/dashboard, /agents) in the auth guard + app shell.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
