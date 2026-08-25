"use client";

import { useLiveData } from "@/lib/useLiveData";
import DoctorsGrid from "@/components/DoctorsGrid";
import type { Doctor } from "@/lib/api";

export default function DoctorsSection({ initialDoctors }: { initialDoctors: Doctor[] }) {
  const doctors = useLiveData<Doctor[]>("/doctors", initialDoctors);

  return doctors.length > 0 ? (
    <DoctorsGrid doctors={doctors} />
  ) : (
    <p className="text-center text-slate-500">Nenhum médico cadastrado no momento.</p>
  );
}
