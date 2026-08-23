"use client";

import { useState, type FormEvent } from "react";

interface ContactInfo {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
}

export default function ContactForm({ initial }: { initial: ContactInfo | null }) {
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(initial?.whatsapp ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const payload = {
        phone: phone || null,
        whatsapp: whatsapp || null,
        email: email || null,
        address: address || null,
      };
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao salvar dados de contato");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
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
      <h1 className="text-2xl font-semibold text-argon-dark">Dados de Contato</h1>

      {error && (
        <p className="text-sm text-argon-error bg-argon-error/10 rounded-argon-md px-3 py-2">{error}</p>
      )}
      {saved && (
        <p className="text-sm text-argon-success bg-argon-success/10 rounded-argon-md px-3 py-2">Salvo!</p>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-argon-xl shadow-argon-xxl p-6 sm:p-8 space-y-5">
        <div>
          <label className={label}>Telefone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={input} />
        </div>

        <div>
          <label className={label}>WhatsApp</label>
          <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={input} />
        </div>

        <div>
          <label className={label}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </div>

        <div>
          <label className={label}>Endereço</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className={input} />
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
