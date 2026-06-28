import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="space-y-3">
        <h1 className="text-5xl font-bold tracking-tight">PR Guardian</h1>
        <p className="max-w-xl text-muted-foreground">
          A RAG-powered agentic GitHub Pull Request manager. Each agent learns
          your repo and its issues, then reviews incoming PRs through a
          multi-layer pipeline before a human ever sees them.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/login">Sign in</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/signup">Create account</Link>
        </Button>
      </div>
    </main>
  );
}
