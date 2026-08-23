"use client";

import { useState, type FormEvent } from "react";

export default function AccountPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao trocar senha");
      }
      setMessage("Senha atualizada com sucesso.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  const label = "block text-xs font-semibold text-argon-secondary uppercase tracking-wide mb-1.5";
  const input =
    "w-full border border-argon-grey-300 rounded-argon-md px-3.5 py-2.5 text-sm text-argon-dark outline-none focus:border-argon-primary focus:ring-2 focus:ring-argon-primary/20 transition-shadow";

  return (
    <div className="max-w-sm space-y-6 pt-2">
      <h1 className="text-2xl font-semibold text-argon-dark">Minha conta</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-argon-xl shadow-argon-xxl p-6 sm:p-8 space-y-5">
        {error && (
          <p className="text-sm text-argon-error bg-argon-error/10 rounded-argon-md px-3 py-2">{error}</p>
        )}
        {message && (
          <p className="text-sm text-argon-success bg-argon-success/10 rounded-argon-md px-3 py-2">
            {message}
          </p>
        )}
        <div>
          <label className={label}>Senha atual</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={input}
          />
        </div>
        <div>
          <label className={label}>Nova senha</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={input}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-tl from-argon-primary to-argon-primary-state text-white text-sm font-semibold rounded-argon-md px-5 py-2.5 shadow-argon-md hover:shadow-argon-lg transition-shadow disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
