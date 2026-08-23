"use client";

import { useEffect, useState } from "react";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  isPatient: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR");
}

export default function ContactSubmissionsList() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact-submissions", { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar mensagens");
      setSubmissions(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markAsRead(s: Submission) {
    if (s.read) return;
    try {
      const res = await fetch(`/api/contact-submissions/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ read: true }),
      });
      if (!res.ok) throw new Error("Falha ao marcar como lida");
      setSubmissions((prev) => prev.map((item) => (item.id === s.id ? { ...item, read: true } : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  }

  function toggleExpand(s: Submission) {
    setExpandedId((prev) => (prev === s.id ? null : s.id));
    markAsRead(s);
  }

  async function remove(s: Submission) {
    if (!window.confirm(`Excluir a mensagem de "${s.name}"? Essa ação não pode ser desfeita.`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/contact-submissions/${s.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao excluir mensagem");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  }

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-argon-dark">
          Mensagens{" "}
          {unreadCount > 0 && (
            <span className="text-sm font-normal text-argon-info">
              ({unreadCount} não lida{unreadCount > 1 ? "s" : ""})
            </span>
          )}
        </h1>
      </div>

      {error && (
        <p className="text-sm text-argon-error bg-argon-error/10 rounded-argon-md px-3 py-2">{error}</p>
      )}

      {loading ? (
        <p className="text-argon-secondary text-sm">Carregando...</p>
      ) : submissions.length === 0 ? (
        <p className="text-argon-secondary bg-white rounded-argon-xl shadow-argon-xxl px-3 py-8 text-center">
          Nenhuma mensagem recebida ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => {
            const expanded = expandedId === s.id;
            return (
              <div
                key={s.id}
                className={`bg-white rounded-argon-xl shadow-argon-xxl overflow-hidden ${
                  !s.read ? "border-l-4 border-argon-info" : ""
                }`}
              >
                <button
                  onClick={() => toggleExpand(s)}
                  className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-argon-grey-100/40 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          !s.read ? "font-semibold text-argon-dark" : "text-argon-text"
                        }`}
                      >
                        {s.name}
                      </span>
                      <span className="text-xs text-argon-secondary">{s.email}</span>
                      {!s.read && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide bg-argon-warning/10 text-argon-warning px-2 py-0.5 rounded-full">
                          Nova
                        </span>
                      )}
                    </div>
                    {s.subject && <div className="text-xs text-argon-secondary truncate">{s.subject}</div>}
                  </div>
                  <div className="text-xs text-argon-secondary shrink-0">{formatDate(s.createdAt)}</div>
                </button>

                {expanded && (
                  <div className="px-5 py-4 border-t border-argon-grey-200 bg-argon-grey-100/40 text-sm space-y-3">
                    <div className="grid sm:grid-cols-2 gap-2 text-argon-text">
                      {s.phone && (
                        <div>
                          <span className="font-semibold text-argon-dark">Telefone:</span> {s.phone}
                        </div>
                      )}
                      {s.city && (
                        <div>
                          <span className="font-semibold text-argon-dark">Cidade:</span> {s.city}
                        </div>
                      )}
                      {s.isPatient && (
                        <div>
                          <span className="font-semibold text-argon-dark">Já é paciente:</span> {s.isPatient}
                        </div>
                      )}
                      {s.subject && (
                        <div>
                          <span className="font-semibold text-argon-dark">Assunto:</span> {s.subject}
                        </div>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap text-argon-dark">{s.message}</p>
                    <button
                      onClick={() => remove(s)}
                      className="text-argon-error font-semibold hover:opacity-75 text-sm"
                    >
                      Excluir mensagem
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
