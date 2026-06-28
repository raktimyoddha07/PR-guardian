"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiError, api } from "@/lib/api";
import type { Agent, PREvent } from "@/lib/types";

export default function AgentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const agentId = Number(params.id);

  const [agent, setAgent] = useState<Agent | null>(null);
  const [events, setEvents] = useState<PREvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggling, setToggling] = useState(false);

  async function load() {
    try {
      const [a, evs] = await Promise.all([
        api.getAgent(agentId),
        api.listEvents({ agent_id: agentId, limit: 50 }),
      ]);
      setAgent(a);
      setEvents(evs);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to load agent");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  async function handleToggle() {
    if (!agent) return;
    setToggling(true);
    try {
      const updated = await api.updateAgent(agent.id, {
        is_active: !agent.is_active,
      });
      setAgent(updated);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to update agent");
    } finally {
      setToggling(false);
    }
  }

  async function handleDelete() {
    if (!agent) return;
    if (!window.confirm(`Delete agent "${agent.name}"? This cannot be undone.`)) {
      return;
    }
    try {
      await api.deleteAgent(agent.id);
      router.push("/dashboard");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Failed to delete agent");
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>;
  if (error && !agent) {
    return (
      <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
        {error}
      </div>
    );
  }
  if (!agent) return null;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to agents
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{agent.name}</h1>
            <Badge variant={agent.is_active ? "success" : "secondary"}>
              {agent.is_active ? "Active" : "Paused"}
            </Badge>
          </div>
          <p className="font-mono text-sm text-muted-foreground">
            {agent.repo_full_name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleToggle}
            disabled={toggling}
          >
            {agent.is_active ? "Pause" : "Resume"}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>LLM</CardDescription>
            <CardTitle className="text-base capitalize">
              {agent.llm_provider}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Vector DB</CardDescription>
            <CardTitle className="text-base capitalize">
              {agent.vector_db_type}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ingestion</CardDescription>
            <CardTitle className="text-base capitalize">
              {agent.ingestion_status}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Knowledge chunks</CardDescription>
            <CardTitle className="text-base">{agent.chunk_count}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PR events</CardTitle>
          <CardDescription>
            Webhook events received for this agent. Real pipeline decisions land
            here in Phase 3.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No events yet. Install the GitHub App and open a PR to see webhook
              events arrive here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Date</th>
                    <th className="pb-2 pr-4 font-medium">PR #</th>
                    <th className="pb-2 pr-4 font-medium">Author</th>
                    <th className="pb-2 pr-4 font-medium">Decision</th>
                    <th className="pb-2 pr-4 font-medium">Layer</th>
                    <th className="pb-2 font-medium">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 text-muted-foreground">
                        {new Date(ev.created_at).toLocaleString()}
                      </td>
                      <td className="py-2 pr-4">
                        <a
                          href={ev.pr_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-primary underline"
                        >
                          #{ev.pr_number}
                        </a>
                      </td>
                      <td className="py-2 pr-4">{ev.author_github}</td>
                      <td className="py-2 pr-4">
                        <Badge
                          variant={
                            ev.decision === "approved" ? "success" : "destructive"
                          }
                        >
                          {ev.decision}
                        </Badge>
                      </td>
                      <td className="py-2 pr-4">
                        {ev.layer_caught ?? "—"}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {ev.reason ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
