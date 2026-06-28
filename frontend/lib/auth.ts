"use client";

/**
 * Client-side auth helpers. Token lives in localStorage; this hook exposes a
 * React-friendly view of the current session and a way to sign out.
 */

import { useCallback, useEffect, useState } from "react";

import { api, clearToken, getToken, setToken } from "./api";
import type { User } from "./types";

export interface Session {
  user: User | null;
  loading: boolean;
  signIn: (token: string) => Promise<User>;
  signOut: () => void;
}

export function useSession(): Session {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, if we have a token, fetch /me to confirm it.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    api
      .me()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        clearToken();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (token: string): Promise<User> => {
    setToken(token);
    const u = await api.me();
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return { user, loading, signIn, signOut };
}
