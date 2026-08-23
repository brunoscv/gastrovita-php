"use client";

import Image from "next/image";
import { useEffect } from "react";
import { uploadUrl, type Doctor } from "@/lib/api";

export default function DoctorModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const photo = uploadUrl(doctor.photoUrl);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-2xl leading-none z-10"
        >
          ×
        </button>
        <div className="p-6 flex flex-col items-center text-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-100 mb-4">
            {photo && <Image src={photo} alt={doctor.name} fill className="object-cover" sizes="128px" />}
          </div>
          <h3 className="font-heading font-extrabold text-xl text-brand-dark">{doctor.name}</h3>
          {doctor.specialty && <p className="text-brand text-sm mt-1">{doctor.specialty}</p>}
          {doctor.crm && <p className="text-slate-500 text-xs mt-1">CRM {doctor.crm}</p>}
          {doctor.bio && <p className="text-slate-600 text-sm mt-4 text-left whitespace-pre-line">{doctor.bio}</p>}
        </div>
      </div>
    </div>
  );
}
