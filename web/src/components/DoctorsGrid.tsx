"use client";

import Image from "next/image";
import { useState } from "react";
import { uploadUrl, type Doctor } from "@/lib/api";
import DoctorModal from "./DoctorModal";

export default function DoctorsGrid({ doctors }: { doctors: Doctor[] }) {
  const [selected, setSelected] = useState<Doctor | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {doctors.map((doctor) => (
          <button
            key={doctor.id}
            onClick={() => setSelected(doctor)}
            className="text-center group"
          >
            <div className="relative w-full aspect-square overflow-hidden bg-slate-100 mb-3 border-[5px] border-white shadow-md group-hover:opacity-90 transition">
              {doctor.photoUrl ? (
                <Image
                  src={uploadUrl(doctor.photoUrl)!}
                  alt={doctor.name}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              ) : null}
            </div>
            {/* O nome/especialidade já vêm desenhados na própria foto (arte original do
                WordPress) — essa legenda é só um reforço discreto de acessibilidade. */}
            <div className="font-medium text-slate-500 text-xs">{doctor.name}</div>
          </button>
        ))}
      </div>

      {selected && <DoctorModal doctor={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
