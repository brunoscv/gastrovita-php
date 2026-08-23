"use client";

import { useEffect, useState, type FormEvent } from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: "SUPER_ADMIN" | "EDITOR";
  active: boolean;
  createdAt: string;
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<User["role"]>("EDITOR");
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users", { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar usuários");
      setUsers(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: newEmail, name: newName, password: newPassword, role: newRole }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao criar usuário");
      }
      setNewEmail("");
      setNewName("");
      setNewPassword("");
      setNewRole("EDITOR");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setCreating(false);
    }
  }

  async function updateUser(id: string, data: Partial<Pick<User, "role" | "active" | "name">>) {
    setError(null);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Falha ao atualizar usuário");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  }

  async function resetPassword(id: string) {
    const newPass = window.prompt("Nova senha (mínimo 8 caracteres):");
    if (!newPass) return;
    setError(null);
    try {
      const res = await fetch(`/api/users/${id}/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ newPassword: newPass }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Falha ao redefinir senha");
      }
      window.alert("Senha redefinida com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  }

  const label = "block text-xs font-semibold text-argon-secondary uppercase tracking-wide mb-1.5";
  const input =
    "w-full border border-argon-grey-300 rounded-argon-md px-3.5 py-2.5 text-sm text-argon-dark outline-none focus:border-argon-primary focus:ring-2 focus:ring-argon-primary/20 transition-shadow";
  const selectSm =
    "border border-argon-grey-300 rounded-argon-md px-2.5 py-1.5 text-sm text-argon-dark outline-none focus:border-argon-primary focus:ring-2 focus:ring-argon-primary/20 transition-shadow";

  return (
    <div className="space-y-8 pt-2">
      <h1 className="text-2xl font-semibold text-argon-dark">Usuários</h1>
      {error && (
        <p className="text-sm text-argon-error bg-argon-error/10 rounded-argon-md px-3 py-2">{error}</p>
      )}

      <form
        onSubmit={handleCreate}
        className="bg-white rounded-argon-xl shadow-argon-xxl p-6 sm:p-8 space-y-4 max-w-lg"
      >
        <h2 className="font-semibold text-argon-dark">Novo usuário</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Email</label>
            <input
              required
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Nome</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} className={input} />
          </div>
          <div>
            <label className={label}>Senha (mín. 8 caracteres)</label>
            <input
              required
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Papel</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as User["role"])}
              className={input}
            >
              <option value="EDITOR">Editor</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={creating}
          className="bg-gradient-to-tl from-argon-primary to-argon-primary-state text-white text-sm font-semibold rounded-argon-md px-5 py-2.5 shadow-argon-md hover:shadow-argon-lg transition-shadow disabled:opacity-50"
        >
          {creating ? "Criando..." : "Criar usuário"}
        </button>
      </form>

      {loading ? (
        <p className="text-argon-secondary text-sm">Carregando...</p>
      ) : (
        <div className="bg-white rounded-argon-xl shadow-argon-xxl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-argon-grey-100/60 text-argon-secondary text-xs uppercase tracking-wide">
                <th className="py-3 px-5 font-semibold">Nome</th>
                <th className="px-3 font-semibold">Email</th>
                <th className="px-3 font-semibold">Papel</th>
                <th className="px-3 font-semibold">Status</th>
                <th className="px-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-argon-grey-200 hover:bg-argon-grey-100/40 transition-colors">
                  <td className="py-2.5 px-5 text-argon-dark font-medium">{u.name ?? "-"}</td>
                  <td className="px-3 text-argon-text">{u.email}</td>
                  <td className="px-3">
                    <select
                      value={u.role}
                      onChange={(e) => updateUser(u.id, { role: e.target.value as User["role"] })}
                      className={selectSm}
                    >
                      <option value="EDITOR">Editor</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </td>
                  <td className="px-3">
                    <button
                      onClick={() => updateUser(u.id, { active: !u.active })}
                      className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                        u.active
                          ? "bg-argon-success/10 text-argon-success"
                          : "bg-argon-grey-200 text-argon-secondary"
                      }`}
                    >
                      {u.active ? "Ativo" : "Inativo"}
                    </button>
                  </td>
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => resetPassword(u.id)}
                      className="text-argon-primary font-semibold hover:opacity-75"
                    >
                      Redefinir senha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
