import type { Metadata } from "next";
import Image from "next/image";
import { apiGet, type Exam } from "@/lib/api";
import CurveDivider from "@/components/CurveDivider";

export const metadata: Metadata = {
  title: "Exames | Hospital Gastrovita",
  description: "Conheça os exames realizados no Hospital Gastrovita.",
};

export default async function ExamesPage() {
  const exams = await apiGet<Exam[]>("/exams").catch(() => []);

  return (
    <div>
      <section className="relative bg-brand text-white overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-body uppercase tracking-[8px] text-gold text-[18px] sm:text-[24px] font-semibold mb-3">
              Hospital Gastrovita
            </p>
            <h1 className="font-heading font-black text-[35px] sm:text-[55px] leading-[1.1] mb-4">
              Exames
              <br />
              Oferecidos
            </h1>
            <p className="font-body text-white/90 text-lg max-w-md">
              Conte com uma estrutura moderna, profissionais qualificados e tecnologia avançada
              para realizar seus exames com segurança, conforto e resultados confiáveis.
            </p>
          </div>
          <div className="relative aspect-[500/485] w-full max-w-sm mx-auto">
            <Image src="/exames-hero.png" alt="Exames Hospital Gastrovita" fill className="object-contain" />
          </div>
        </div>
        <CurveDivider />
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="flex flex-wrap gap-3 justify-center">
          {exams.map((exam) => (
            <span
              key={exam.id}
              className="font-body bg-gold text-white font-semibold text-sm rounded-[10px] shadow-button px-5 py-[0.6em]"
            >
              {exam.name}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
