import type { Metadata } from "next";
import Image from "next/image";
import { apiGet, type Insurance } from "@/lib/api";
import InsurancesSection from "./InsurancesSection";
import CurveDivider from "@/components/CurveDivider";

const WHATSAPP_AGENDAR =
  "https://api.whatsapp.com/send/?phone=5586994473581&text=Ol%C3%A1%2C+eu+gostaria+de+mais+informa%C3%A7%C3%B5es%21&type=phone_number&app_absent=0";

export const metadata: Metadata = {
  title: "Convênios | Hospital Gastrovita",
  description: "Confira os convênios atendidos pelo Hospital Gastrovita.",
};

export default async function ConveniosPage() {
  const insurances = await apiGet<Insurance[]>("/insurances").catch(() => []);

  return (
    <div>
      <section className="relative bg-brand text-white overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="font-heading font-black text-[30px] sm:text-[45px] leading-[1.1] mb-4">
              Convênios Atendidos
            </h1>
            <p className="font-body text-white/90 mb-8 max-w-md">
              Confira abaixo a lista completa de todos os convênios atendidos pelo Hospital
              Gastrovita
            </p>
            <a
              href={WHATSAPP_AGENDAR}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gold text-white font-semibold rounded-[10px] shadow-button px-6 py-[0.6em] hover:bg-gold-dark transition-colors text-sm uppercase tracking-wide"
            >
              Agendar Consulta
            </a>
          </div>
          <div className="relative w-full max-w-md aspect-[500/384]">
            <Image src="/convenios-hero.png" alt="Convênios Hospital Gastrovita" fill className="object-contain object-left" />
          </div>
        </div>
        <CurveDivider />
      </section>

      <section className="bg-[#f2f4fb]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <InsurancesSection initialInsurances={insurances} />
        </div>
      </section>
    </div>
  );
}
