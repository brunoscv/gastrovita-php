"use client";

import { useSearchParams } from "next/navigation";
import { useApiResource } from "@/lib/useApiResource";
import type { Doctor } from "@/lib/api";
import DoctorForm from "../DoctorForm";

export default function EditDoctorPage() {
  const id = useSearchParams().get("id") ?? "";
  const { data: doctor, loading, notFound } = useApiResource<Doctor>(`/doctors/${id}`);

  if (loading) return <p className="text-argon-secondary">Carregando...</p>;
  if (notFound || !doctor) return <p className="text-red-600">Médico não encontrado.</p>;
  return <DoctorForm mode="edit" doctor={doctor} />;
}
