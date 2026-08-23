"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Exam {
  id: string;
  name: string;
  order: number;
}

export default function ExamsList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/exams", { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar exames");
      const data: Exam[] = await res.json();
      data.sort((a, b) => a.order - b.order);
      setExams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(ex: Exam) {
    if (!window.confirm(`Excluir "${ex.name}"? Essa ação não pode ser desfeita.`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/exams/${ex.id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao excluir exame");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  }

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-argon-dark">Exames</h1>
        <Link
          href="/admin/exams/new"
          className="bg-gradient-to-tl from-argon-primary to-argon-primary-state text-white text-sm font-semibold rounded-argon-md px-5 py-2.5 shadow-argon-md hover:shadow-argon-lg transition-shadow"
        >
          Novo exame
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
                <th className="py-3 px-5 font-semibold">Nome</th>
                <th className="px-3 font-semibold">Ordem</th>
                <th className="px-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((ex) => (
                <tr key={ex.id} className="border-t border-argon-grey-200 hover:bg-argon-grey-100/40 transition-colors">
                  <td className="py-2.5 px-5 text-argon-dark font-medium">{ex.name}</td>
                  <td className="px-3 text-argon-text">{ex.order}</td>
                  <td className="px-3 py-2.5 space-x-3 whitespace-nowrap">
                    <Link href={`/admin/exams/edit?id=${ex.id}`} className="text-argon-primary font-semibold hover:opacity-75">
                      Editar
                    </Link>
                    <button onClick={() => remove(ex)} className="text-argon-error font-semibold hover:opacity-75">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-8 text-center text-argon-secondary">
                    Nenhum exame cadastrado ainda.
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
