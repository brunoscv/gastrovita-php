"use client";

import { useEffect, useState } from "react";

/**
 * Recebe o dado já pré-renderizado no build (o que o Google e prévias de
 * link enxergam) e, depois que a página carrega no navegador, refaz o fetch
 * em /api pra pegar conteúdo editado no painel depois do último build. Se o
 * fetch falhar ou a API estiver fora do ar, fica com o dado do build — nunca
 * mostra vazio por causa disso.
 */
export function useLiveData<T>(path: string, initialData: T): T {
  const [data, setData] = useState<T>(initialData);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api${path}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((fresh: T | null) => {
        if (!cancelled && fresh !== null) setData(fresh);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [path]);

  return data;
}
