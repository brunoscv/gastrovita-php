"use client";

import Image from "next/image";
import { useLiveData } from "@/lib/useLiveData";
import { uploadUrl, type Insurance } from "@/lib/api";

export default function InsurancesSection({ initialInsurances }: { initialInsurances: Insurance[] }) {
  const insurances = useLiveData<Insurance[]>("/insurances", initialInsurances);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
      {insurances.map((insurance) => (
        <div key={insurance.id} className="relative aspect-[3/2] rounded-[10px] overflow-hidden">
          {insurance.logoUrl && (
            <Image
              src={uploadUrl(insurance.logoUrl)!}
              alt={insurance.name}
              fill
              className="object-cover"
              sizes="200px"
            />
          )}
        </div>
      ))}
    </div>
  );
}
