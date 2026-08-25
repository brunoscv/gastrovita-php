import type { Metadata } from "next";
import { apiGet, type Doctor } from "@/lib/api";
import DoctorsSection from "./DoctorsSection";
import CurveDivider from "@/components/CurveDivider";

export const metadata: Metadata = {
  title: "Corpo Clínico | Hospital Gastrovita",
  description:
    "Conheça o corpo clínico do Hospital Gastrovita, referência em gastroenterologia em Teresina/PI.",
};

export default async function CorpoClinicoPage() {
  const doctors = await apiGet<Doctor[]>("/doctors").catch(() => [] as Doctor[]);

  return (
    <div>
      <section className="relative bg-brand-footer text-white overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-[3vw] pb-24">
          <p className="font-body text-gold uppercase text-[24px] sm:text-[18px] tracking-[8px] leading-[1.3em] mb-2">
            profissionais
          </p>
          <h1 className="font-heading font-black text-[30px] sm:text-[45px] leading-[1.1] mb-4">
            Corpo Clínico
          </h1>
          <p className="font-body max-w-2xl mb-6">
            O nosso corpo clínico é composto por médicos qualificados para cuidar da sua saúde de
            forma integral.
          </p>
          <a
            href="https://api.whatsapp.com/send?phone=5586999780559"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gold text-white font-semibold rounded-[10px] shadow-button px-6 py-[0.6em] hover:bg-gold-dark transition-colors"
          >
            Agendar Exame
          </a>
        </div>
        <CurveDivider />
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-[29px]">
          <DoctorsSection initialDoctors={doctors} />
        </div>
      </section>
    </div>
  );
}
