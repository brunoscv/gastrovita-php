"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export default function FaqForm({ mode, faq }: { mode: "create" | "edit"; faq?: Faq }) {
  const router = useRouter();

  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");
  const [order, setOrder] = useState(faq?.order ?? 0);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { question, answer, order: Number(order) };
      const res = await fetch(mode === "create" ? "/api/faqs" : `/api/faqs/${faq!.id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao salvar pergunta");
      }
      router.push("/admin/faqs");
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
        {mode === "create" ? "Nova pergunta" : "Editar pergunta"}
      </h1>

      {error && (
        <p className="text-sm text-argon-error bg-argon-error/10 rounded-argon-md px-3 py-2">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-argon-xl shadow-argon-xxl p-6 sm:p-8 space-y-5">
        <div>
          <label className={label}>Pergunta *</label>
          <input required value={question} onChange={(e) => setQuestion(e.target.value)} className={input} />
        </div>

        <div>
          <label className={label}>Resposta *</label>
          <textarea
            required
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={5}
            className={input}
          />
        </div>

        <div>
          <label className={label}>Ordem</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className={`${input} max-w-[10rem]`}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-gradient-to-tl from-argon-primary to-argon-primary-state text-white text-sm font-semibold rounded-argon-md px-5 py-2.5 shadow-argon-md hover:shadow-argon-lg transition-shadow disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
