"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { uploadUrl } from "@/lib/api";

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl: string | null;
  slug: string;
  order: number;
  published: boolean;
}

interface YoutubeStatus {
  connected: boolean;
  channelTitle?: string | null;
}

export default function VideosList() {
  const searchParams = useSearchParams();
  const youtubeParam = searchParams.get("youtube");

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [youtubeStatus, setYoutubeStatus] = useState<YoutubeStatus | null>(null);

  useEffect(() => {
    fetch("/api/youtube/status", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { connected: false }))
      .then(setYoutubeStatus)
      .catch(() => setYoutubeStatus({ connected: false }));
  }, [youtubeParam]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/videos?all=true", { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar vídeos");
      const data: Video[] = await res.json();
      data.sort((a, b) => a.order - b.order);
      setVideos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePublished(v: Video) {
    setError(null);
    try {
      const res = await fetch(`/api/videos/${v.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ published: !v.published }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao atualizar vídeo");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  }

  async function remove(v: Video) {
    if (!window.confirm(`Excluir "${v.title}"? Essa ação não pode ser desfeita.`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/videos/${v.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao excluir vídeo");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  }

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-argon-dark">Vídeos</h1>
        <Link
          href="/admin/videos/new"
          className="bg-gradient-to-tl from-argon-primary to-argon-primary-state text-white text-sm font-semibold rounded-argon-md px-5 py-2.5 shadow-argon-md hover:shadow-argon-lg transition-shadow"
        >
          Novo vídeo
        </Link>
      </div>

      {error && (
        <p className="text-sm text-argon-error bg-argon-error/10 rounded-argon-md px-3 py-2">{error}</p>
      )}

      {youtubeParam === "connected" && (
        <p className="text-sm text-argon-success bg-argon-success/10 rounded-argon-md px-3 py-2">
          Conta do YouTube conectada com sucesso!
        </p>
      )}
      {youtubeParam === "error" && (
        <p className="text-sm text-argon-error bg-argon-error/10 rounded-argon-md px-3 py-2">
          Não foi possível conectar a conta do YouTube. Tente novamente.
        </p>
      )}

      {youtubeStatus && (
        <div className="flex items-center justify-between bg-white rounded-argon-xl shadow-argon-xxl px-5 py-3">
          {youtubeStatus.connected ? (
            <p className="text-sm text-argon-dark">
              Conectado ao YouTube como{" "}
              <span className="font-semibold">{youtubeStatus.channelTitle}</span>
            </p>
          ) : (
            <p className="text-sm text-argon-secondary">Nenhuma conta do YouTube conectada ainda.</p>
          )}
          <a
            href="/api/youtube/connect"
            className="text-argon-primary text-sm font-semibold hover:opacity-75 whitespace-nowrap"
          >
            {youtubeStatus.connected ? "Reconectar" : "Conectar com YouTube"}
          </a>
        </div>
      )}

      {loading ? (
        <p className="text-argon-secondary text-sm">Carregando...</p>
      ) : (
        <div className="bg-white rounded-argon-xl shadow-argon-xxl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-argon-grey-100/60 text-argon-secondary text-xs uppercase tracking-wide">
                <th className="py-3 px-5 font-semibold">Miniatura</th>
                <th className="px-3 font-semibold">Título</th>
                <th className="px-3 font-semibold">Ordem</th>
                <th className="px-3 font-semibold">Status</th>
                <th className="px-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.id} className="border-t border-argon-grey-200 hover:bg-argon-grey-100/40 transition-colors">
                  <td className="py-2.5 px-5">
                    <img
                      src={uploadUrl(v.thumbnailUrl) ?? `https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                      alt={v.title}
                      className="w-24 h-14 rounded-argon-md object-cover bg-argon-grey-200"
                    />
                  </td>
                  <td className="px-3 text-argon-dark font-medium">{v.title}</td>
                  <td className="px-3 text-argon-text">{v.order}</td>
                  <td className="px-3">
                    <button
                      onClick={() => togglePublished(v)}
                      className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                        v.published
                          ? "bg-argon-success/10 text-argon-success"
                          : "bg-argon-grey-200 text-argon-secondary"
                      }`}
                    >
                      {v.published ? "Publicado" : "Despublicado"}
                    </button>
                  </td>
                  <td className="px-3 py-2.5 space-x-3 whitespace-nowrap">
                    <Link
                      href={`/admin/videos/edit?id=${v.id}`}
                      className="text-argon-primary font-semibold hover:opacity-75"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => remove(v)}
                      className="text-argon-error font-semibold hover:opacity-75"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {videos.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-argon-secondary">
                    Nenhum vídeo cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
