"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { uploadUrl } from "@/lib/api";

interface Insurance {
  id: string;
  name: string;
  logoUrl: string | null;
  order: number;
}

export default function InsuranceForm({ mode, insurance }: { mode: "create" | "edit"; insurance?: Insurance }) {
  const router = useRouter();

  const [name, setName] = useState(insurance?.name ?? "");
  const [order, setOrder] = useState(insurance?.order ?? 0);
  const [logoUrl, setLogoUrl] = useState<string | null>(insurance?.logoUrl ?? null);

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
      const res = await fetch("/api/upload?folder=insurances", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao enviar logo");
      }
      const data = await res.json();
      setLogoUrl(data.url);
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
      const payload = { name, logoUrl, order: Number(order) };
      const res = await fetch(mode === "create" ? "/api/insurances" : `/api/insurances/${insurance!.id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao salvar convênio");
      }
      router.push("/admin/insurances");
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
        {mode === "create" ? "Novo convênio" : `Editar: ${insurance?.name}`}
      </h1>

      {error && (
        <p className="text-sm text-argon-error bg-argon-error/10 rounded-argon-md px-3 py-2">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-argon-xl shadow-argon-xxl p-6 sm:p-8 space-y-5">
        <div>
          <label className={label}>Nome *</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={input} />
        </div>

        <div>
          <label className={label}>Logo</label>
          {logoUrl && (
            <img
              src={uploadUrl(logoUrl)!}
              alt="Preview"
              className="w-24 h-24 rounded-argon-md object-contain bg-argon-grey-100 mb-2"
            />
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="text-sm text-argon-text" />
          {uploading && <p className="text-sm text-argon-secondary mt-1">Enviando...</p>}
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
          disabled={saving || uploading}
          className="bg-gradient-to-tl from-argon-primary to-argon-primary-state text-white text-sm font-semibold rounded-argon-md px-5 py-2.5 shadow-argon-md hover:shadow-argon-lg transition-shadow disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
