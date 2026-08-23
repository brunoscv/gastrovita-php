"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { uploadUrl } from "@/lib/api";

type TestimonialType = "youtube" | "image" | "text";

interface Testimonial {
  id: string;
  authorName: string | null;
  type: TestimonialType;
  youtubeId: string | null;
  imageUrl: string | null;
  text: string | null;
  rating: number | null;
  order: number;
}

export default function TestimonialForm({
  mode,
  testimonial,
}: {
  mode: "create" | "edit";
  testimonial?: Testimonial;
}) {
  const router = useRouter();

  const [authorName, setAuthorName] = useState(testimonial?.authorName ?? "");
  const [type, setType] = useState<TestimonialType>(testimonial?.type ?? "youtube");
  const [youtubeInput, setYoutubeInput] = useState(testimonial?.youtubeId ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(testimonial?.imageUrl ?? null);
  const [text, setText] = useState(testimonial?.text ?? "");
  const [rating, setRating] = useState<number | "">(testimonial?.rating ?? "");
  const [order, setOrder] = useState(testimonial?.order ?? 0);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload?folder=testimonials", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao enviar imagem");
      }
      const data = await res.json();
      setImageUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        authorName: authorName || null,
        type,
        text: text || null,
        imageUrl,
        rating: rating === "" ? null : Number(rating),
        order: Number(order),
      };
      if (type === "youtube") payload.youtubeId = youtubeInput;

      const res = await fetch(
        mode === "create" ? "/api/testimonials" : `/api/testimonials/${testimonial!.id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao salvar depoimento");
      }
      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  const label = "block text-xs font-semibold text-argon-secondary uppercase tracking-wide mb-1.5";
  const input =
    "w-full border border-argon-grey-300 rounded-argon-md px-3.5 py-2.5 text-sm text-argon-dark outline-none focus:border-argon-primary focus:ring-2 focus:ring-argon-primary/20 transition-shadow";

  return (
    <div className="max-w-2xl space-y-6 pt-2">
      <h1 className="text-2xl font-semibold text-argon-dark">
        {mode === "create" ? "Novo depoimento" : `Editar depoimento`}
      </h1>

      {error && (
        <p className="text-sm text-argon-error bg-argon-error/10 rounded-argon-md px-3 py-2">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-argon-xl shadow-argon-xxl p-6 sm:p-8 space-y-5">
        <div>
          <label className={label}>Nome do autor</label>
          <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} className={input} />
        </div>

        <div>
          <label className={label}>Tipo *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TestimonialType)}
            className={input}
          >
            <option value="youtube">Vídeo do YouTube</option>
            <option value="image">Imagem</option>
            <option value="text">Texto</option>
          </select>
        </div>

        {type === "youtube" && (
          <div>
            <label className={label}>Link ou ID do YouTube *</label>
            <input
              required
              value={youtubeInput}
              onChange={(e) => setYoutubeInput(e.target.value)}
              placeholder="https://youtube.com/watch?v=... ou apenas o ID"
              className={input}
            />
          </div>
        )}

        {type !== "youtube" && (
          <div>
            <label className={label}>
              Imagem {type === "image" ? "*" : "(opcional, miniatura customizada)"}
            </label>
            {imageUrl && (
              <img src={uploadUrl(imageUrl)!} alt="Preview" className="w-32 h-32 rounded-argon-md object-cover mb-2" />
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="text-sm text-argon-text" />
            {uploading && <p className="text-sm text-argon-secondary mt-1">Enviando...</p>}
          </div>
        )}

        {type === "youtube" && (
          <div>
            <label className={label}>
              Miniatura customizada (opcional — se vazio, usa a miniatura padrão do YouTube)
            </label>
            {imageUrl && (
              <img src={uploadUrl(imageUrl)!} alt="Preview" className="w-32 h-32 rounded-argon-md object-cover mb-2" />
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="text-sm text-argon-text" />
            {uploading && <p className="text-sm text-argon-secondary mt-1">Enviando...</p>}
          </div>
        )}

        <div>
          <label className={label}>
            {type === "text" ? "Texto do depoimento *" : "Legenda (ex: cargo ou contexto do paciente)"}
          </label>
          <textarea
            required={type === "text"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={type === "text" ? 4 : 2}
            className={input}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Nota (1-5, opcional)</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value === "" ? "" : Number(e.target.value))}
              className={input}
            >
              <option value="">Sem nota</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} estrela{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Ordem</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className={input}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-gradient-to-tl from-argon-primary to-argon-primary-state text-white text-sm font-semibold rounded-argon-md px-5 py-2.5 shadow-argon-md hover:shadow-argon-lg transition-shadow disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
