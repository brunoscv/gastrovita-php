"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { uploadUrl } from "@/lib/api";

interface Doctor {
  id: string;
  name: string;
  slug: string;
  photoUrl: string | null;
  crm: string | null;
  specialty: string | null;
  order: number;
  active: boolean;
}

export default function DoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/doctors?all=true", { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar médicos");
      const data: Doctor[] = await res.json();
      data.sort((a, b) => a.order - b.order);
      setDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(d: Doctor) {
    setError(null);
    try {
      const res = await fetch(`/api/doctors/${d.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ active: !d.active }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao atualizar médico");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  }

  async function remove(d: Doctor) {
    if (!window.confirm(`Excluir "${d.name}"? Essa ação não pode ser desfeita.`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/doctors/${d.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao excluir médico");
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    }
  }

  return (
    <div className="space-y-6 pt-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-argon-dark">Médicos</h1>
        <Link
          href="/admin/doctors/new"
          className="bg-gradient-to-tl from-argon-primary to-argon-primary-state text-white text-sm font-semibold rounded-argon-md px-5 py-2.5 shadow-argon-md hover:shadow-argon-lg transition-shadow"
        >
          Novo médico
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
                <th className="py-3 px-5 font-semibold">Foto</th>
                <th className="px-3 font-semibold">Nome</th>
                <th className="px-3 font-semibold">Especialidade</th>
                <th className="px-3 font-semibold">CRM</th>
                <th className="px-3 font-semibold">Ordem</th>
                <th className="px-3 font-semibold">Status</th>
                <th className="px-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((d) => (
                <tr key={d.id} className="border-t border-argon-grey-200 hover:bg-argon-grey-100/40 transition-colors">
                  <td className="py-2.5 px-5">
                    {d.photoUrl ? (
                      <img src={uploadUrl(d.photoUrl)!} alt={d.name} className="w-11 h-11 rounded-argon-md object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-argon-md bg-argon-grey-200" />
                    )}
                  </td>
                  <td className="px-3 text-argon-dark font-medium">{d.name}</td>
                  <td className="px-3 text-argon-text">{d.specialty ?? "-"}</td>
                  <td className="px-3 text-argon-text">{d.crm ?? "-"}</td>
                  <td className="px-3 text-argon-text">{d.order}</td>
                  <td className="px-3">
                    <button
                      onClick={() => toggleActive(d)}
                      className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                        d.active
                          ? "bg-argon-success/10 text-argon-success"
                          : "bg-argon-grey-200 text-argon-secondary"
                      }`}
                    >
                      {d.active ? "Ativo" : "Inativo"}
                    </button>
                  </td>
                  <td className="px-3 py-2.5 space-x-3 whitespace-nowrap">
                    <Link
                      href={`/admin/doctors/edit?id=${d.id}`}
                      className="text-argon-primary font-semibold hover:opacity-75"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => remove(d)}
                      className="text-argon-error font-semibold hover:opacity-75"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {doctors.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-argon-secondary">
                    Nenhum médico cadastrado ainda.
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
