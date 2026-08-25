"use client";

import Image from "next/image";
import Link from "next/link";
import { useLiveData } from "@/lib/useLiveData";
import type { Insurance } from "@/lib/api";

export default function HomeInsurancesSection({ initialInsurances }: { initialInsurances: Insurance[] }) {
  const insurances = useLiveData<Insurance[]>("/insurances", initialInsurances);

  if (insurances.length === 0) return null;

  return (
    <section className="bg-brand-pale">
      <div className="mx-auto max-w-6xl px-4 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div className="relative w-full aspect-[500/384] rounded-2xl overflow-hidden">
          <Image
            src="/home-convenios-pessoa.png"
            alt="Atendimento Hospital Gastrovita"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="font-heading font-black text-brand text-[32px] sm:text-[40px] mb-4">
            Convênios atendidos
          </h2>
          <div className="relative w-full aspect-[761/398] mb-6">
            <Image
              src="/home-convenios-portrait.png"
              alt="Convênios Hospital Gastrovita"
              fill
              className="object-contain"
            />
          </div>
          <Link
            href="/convenios"
            className="inline-block bg-gold text-white font-semibold rounded-[10px] shadow-button px-6 py-[0.6em] hover:bg-gold-dark transition-colors text-sm uppercase tracking-wide"
          >
            Saiba mais
          </Link>
        </div>
      </div>
    </section>
  );
}
