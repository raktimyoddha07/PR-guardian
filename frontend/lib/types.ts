/** Shared API types — mirror the Pydantic schemas in backend/app/schemas. */

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export type LlmProvider = "ollama" | "gemini";
export type VectorDbType = "pgvector" | "chromadb";

export interface Agent {
  id: number;
  user_id: number;
  name: string;
  repo_full_name: string;
  llm_provider: LlmProvider;
  vector_db_type: VectorDbType;
  is_active: boolean;
  ingestion_status: "pending" | "running" | "done" | "failed";
  last_ingested_at: string | null;
  chunk_count: number;
  created_at: string;
  updated_at: string;
}

export interface AgentCreateInput {
  name: string;
  repo_full_name: string;
  llm_provider: LlmProvider;
  vector_db_type: VectorDbType;
}

export type PrDecision = "approved" | "declined" | "error";
export type PrLayer =
  | "spam"
  | "malicious_code"
  | "hijack_proof"
  | "summary"
  | null;

export interface PREvent {
  id: number;
  agent_id: number;
  pr_number: number;
  pr_url: string;
  author_github: string;
  decision: PrDecision;
  layer_caught: PrLayer;
  reason: string | null;
  created_at: string;
}
