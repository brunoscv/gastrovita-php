"use client";

import { useEffect, useState } from "react";

export interface Me {
  id: string;
  email: string;
  name: string | null;
  role: "SUPER_ADMIN" | "EDITOR";
}

/**
 * Substitui o antigo getServerUser() (Server Component + cookies() do
 * next/headers) — build estático não tem servidor pra checar sessão a cada
 * request, então a checagem de auth vira client-side: o navegador já manda o
 * cookie httpOnly automaticamente em same-origin, então basta chamar
 * /api/auth/me com credentials:"include".
 */
export function useCurrentUser() {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: Me | null) => {
        if (!cancelled) setUser(data);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading };
}
