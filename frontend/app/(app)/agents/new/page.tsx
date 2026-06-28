"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApiError, api } from "@/lib/api";
import type { LlmProvider, VectorDbType } from "@/lib/types";

export default function NewAgentPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");
  const [llm, setLlm] = useState<LlmProvider>("ollama");
  const [vectorDb, setVectorDb] = useState<VectorDbType>("pgvector");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const agent = await api.createAgent({
        name: name.trim(),
        repo_full_name: repo.trim(),
        llm_provider: llm,
        vector_db_type: vectorDb,
      });
      router.push(`/agents/${agent.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create agent");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create agent</h1>
        <p className="text-muted-foreground">
          Point a guardbot at a GitHub repository.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent details</CardTitle>
          <CardDescription>
            The repo can be given as <code>owner/name</code> or a full GitHub
            URL. After creating the agent, install the GitHub App on the repo
            and set up the webhook (covered in the README).
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Agent name</Label>
              <Input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Backend Guardian"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repo">Repository</Label>
              <Input
                id="repo"
                required
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="octocat/Hello-World or https://github.com/octocat/Hello-World"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>LLM provider</Label>
                <Select
                  value={llm}
                  onValueChange={(v) => setLlm(v as LlmProvider)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ollama">Ollama (local)</SelectItem>
                    <SelectItem value="gemini">Gemini Flash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vector DB</Label>
                <Select
                  value={vectorDb}
                  onValueChange={(v) => setVectorDb(v as VectorDbType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vector DB" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pgvector">pgvector</SelectItem>
                    <SelectItem value="chromadb">ChromaDB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <div className="flex items-center justify-end gap-3 p-6 pt-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create agent"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
