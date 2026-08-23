"use client";

import { useSearchParams } from "next/navigation";
import { useApiResource } from "@/lib/useApiResource";
import type { Exam } from "@/lib/api";
import ExamForm from "../ExamForm";

export default function EditExamPage() {
  const id = useSearchParams().get("id") ?? "";
  const { data: exam, loading, notFound } = useApiResource<Exam>(`/exams/${id}`);

  if (loading) return <p className="text-argon-secondary">Carregando...</p>;
  if (notFound || !exam) return <p className="text-red-600">Exame não encontrado.</p>;
  return <ExamForm mode="edit" exam={exam} />;
}
