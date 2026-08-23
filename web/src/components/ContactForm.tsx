"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [isPatient, setIsPatient] = useState("Não");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/contact-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, city, isPatient, subject, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao enviar mensagem");
      }
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setCity("");
      setIsPatient("Não");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar");
    } finally {
      setSending(false);
    }
  }

  if (success) {
    return (
      <div className="bg-brand-pale border border-brand-light rounded-lg p-6 text-brand-dark">
        <p className="font-semibold">Mensagem enviada com sucesso!</p>
        <p className="text-sm mt-1">Em breve entraremos em contato.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-3 text-sm underline hover:no-underline"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nome *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">E-mail *</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Já é paciente?</label>
          <select
            value={isPatient}
            onChange={(e) => setIsPatient(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Assunto</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem *</label>
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="bg-brand text-white font-semibold rounded px-6 py-2.5 hover:bg-brand-dark transition-colors disabled:opacity-50"
      >
        {sending ? "Enviando..." : "Enviar mensagem"}
      </button>
    </form>
  );
}
