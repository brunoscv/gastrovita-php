import type { Metadata } from "next";
import { apiGet, type Testimonial } from "@/lib/api";
import TestimonialsGrid from "@/components/TestimonialsGrid";
import CurveDivider from "@/components/CurveDivider";

export const metadata: Metadata = {
  title: "Depoimentos | Hospital Gastrovita",
  description: "Veja o que nossos pacientes dizem sobre o Hospital Gastrovita.",
};

export default async function DepoimentosPage() {
  const testimonials = await apiGet<Testimonial[]>("/testimonials").catch(() => [] as Testimonial[]);

  return (
    <div>
      <section className="relative bg-brand-footer text-white overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-24 text-center">
          <p className="font-body text-gold uppercase text-[24px] sm:text-[18px] tracking-[8px] leading-[1.3em] mb-2">
            confiança
          </p>
          <h1 className="font-heading font-black text-[30px] sm:text-[65px] leading-[1.1]">
            Depoimentos
          </h1>
        </div>
        <CurveDivider />
      </section>

      <section className="bg-[#f2f4fb]">
        <div className="mx-auto max-w-6xl px-4 py-16">
          {testimonials.length > 0 ? (
            <TestimonialsGrid testimonials={testimonials} />
          ) : (
            <p className="text-center text-slate-500">Nenhum depoimento publicado no momento.</p>
          )}
        </div>
      </section>
    </div>
  );
}
