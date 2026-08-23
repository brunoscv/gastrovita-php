"use client";

import { useSearchParams } from "next/navigation";
import { useApiResource } from "@/lib/useApiResource";
import type { Insurance } from "@/lib/api";
import InsuranceForm from "../InsuranceForm";

export default function EditInsurancePage() {
  const id = useSearchParams().get("id") ?? "";
  const { data: insurance, loading, notFound } = useApiResource<Insurance>(`/insurances/${id}`);

  if (loading) return <p className="text-argon-secondary">Carregando...</p>;
  if (notFound || !insurance) return <p className="text-red-600">Convênio não encontrado.</p>;
  return <InsuranceForm mode="edit" insurance={insurance} />;
}
