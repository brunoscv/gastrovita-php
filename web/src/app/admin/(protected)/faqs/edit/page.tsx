"use client";

import { useSearchParams } from "next/navigation";
import { useApiResource } from "@/lib/useApiResource";
import type { Faq } from "@/lib/api";
import FaqForm from "../FaqForm";

export default function EditFaqPage() {
  const id = useSearchParams().get("id") ?? "";
  const { data: faq, loading, notFound } = useApiResource<Faq>(`/faqs/${id}`);

  if (loading) return <p className="text-argon-secondary">Carregando...</p>;
  if (notFound || !faq) return <p className="text-red-600">Pergunta não encontrada.</p>;
  return <FaqForm mode="edit" faq={faq} />;
}
