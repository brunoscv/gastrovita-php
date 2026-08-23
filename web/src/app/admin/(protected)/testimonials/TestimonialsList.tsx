"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { uploadUrl } from "@/lib/api";

interface Testimonial {
  id: string;
  authorName: string | null;
  type: "youtube" | "image" | "text";
  youtubeId: string | null;
  imageUrl: string | null;
  text: string | null;
  order: number;
}

const TYPE_LABEL: Record<Testimonial["type"], string> = {
  youtube: "YouTube",
  image: "Imagem",
  text: "Texto",
};

export default function TestimonialsList() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/testimonials", { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar depoimentos");
      const data: Testimonial[] = await res.json();
      data.sort((a, b) => a.order - b.order);
      setTestimonials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(t: Testimonial) {
    if (!window.confirm(`Excluir depoimento de "${t.authorName ?? "sem nome"}"? Essa ação não pode ser desfeita.`))
      return;
    setError(null);
    try {
      const res = await fetch(`/api/testimonials/${t.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao excluir depoimento");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  }

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-argon-dark">Depoimentos</h1>
        <Link
          href="/admin/testimonials/new"
          className="bg-gradient-to-tl from-argon-primary to-argon-primary-state text-white text-sm font-semibold rounded-argon-md px-5 py-2.5 shadow-argon-md hover:shadow-argon-lg transition-shadow"
        >
          Novo depoimento
        </Link>
      </div>

      {error && (
        <p className="text-sm text-argon-error bg-argon-error/10 rounded-argon-md px-3 py-2">{error}</p>
      )}

      {loading ? (
        <p className="text-argon-secondary text-sm">Carregando...</p>
      ) : (
        <div className="bg-white rounded-argon-xl shadow-argon-xxl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-argon-grey-100/60 text-argon-secondary text-xs uppercase tracking-wide">
                <th className="py-3 px-5 font-semibold">Prévia</th>
                <th className="px-3 font-semibold">Autor</th>
                <th className="px-3 font-semibold">Tipo</th>
                <th className="px-3 font-semibold">Ordem</th>
                <th className="px-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((t) => (
                <tr key={t.id} className="border-t border-argon-grey-200 hover:bg-argon-grey-100/40 transition-colors">
                  <td className="py-2.5 px-5">
                    {t.type === "youtube" && t.youtubeId && (
                      <img
                        src={`https://img.youtube.com/vi/${t.youtubeId}/mqdefault.jpg`}
                        alt={t.authorName ?? "Depoimento"}
                        className="w-20 h-12 rounded-argon-md object-cover bg-argon-grey-200"
                      />
                    )}
                    {t.type === "image" && t.imageUrl && (
                      <img
                        src={uploadUrl(t.imageUrl)!}
                        alt={t.authorName ?? "Depoimento"}
                        className="w-20 h-12 rounded-argon-md object-cover bg-argon-grey-200"
                      />
                    )}
                    {t.type === "text" && (
                      <span className="text-argon-text line-clamp-2 max-w-xs inline-block">
                        {t.text?.slice(0, 80)}
                        {(t.text?.length ?? 0) > 80 ? "..." : ""}
                      </span>
                    )}
                  </td>
                  <td className="px-3 text-argon-dark font-medium">{t.authorName ?? "-"}</td>
                  <td className="px-3">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-argon-info/10 text-argon-info text-xs font-semibold">
                      {TYPE_LABEL[t.type]}
                    </span>
                  </td>
                  <td className="px-3 text-argon-text">{t.order}</td>
                  <td className="px-3 py-2.5 space-x-3 whitespace-nowrap">
                    <Link
                      href={`/admin/testimonials/edit?id=${t.id}`}
                      className="text-argon-primary font-semibold hover:opacity-75"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => remove(t)}
                      className="text-argon-error font-semibold hover:opacity-75"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-argon-secondary">
                    Nenhum depoimento cadastrado ainda.
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
