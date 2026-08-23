"use client";

import { useEffect, useState } from "react";

/**
 * Busca um recurso por id no client-side. Substitui os antigos Server
 * Components de edição (`[id]/page.tsx` fazendo fetch com cache:"no-store")
 * — build estático não tem como pré-renderizar uma página por id sem
 * enumerar todos eles no build (generateStaticParams), o que quebraria toda
 * vez que alguém criasse um registro novo pelo painel sem rebuildar o site.
 */
export function useApiResource<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    fetch(`/api${path}`, { credentials: "include" })
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        setData(await res.json());
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return { data, loading, notFound };
}
