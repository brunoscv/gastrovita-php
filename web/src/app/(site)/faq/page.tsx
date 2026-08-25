import type { Metadata } from "next";
import { apiGet, type Faq } from "@/lib/api";
import FaqSection from "./FaqSection";
import CurveDivider from "@/components/CurveDivider";

export const metadata: Metadata = {
  title: "Dúvidas Frequentes | Hospital Gastrovita",
  description: "Tire suas dúvidas sobre o Hospital Gastrovita.",
};

export default async function FaqPage() {
  const faqs = await apiGet<Faq[]>("/faqs").catch(() => []);

  return (
    <div>
      <section className="relative bg-brand text-white overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 pt-16 pb-24 text-center">
          <p className="font-body uppercase tracking-[8px] text-gold text-[18px] sm:text-[24px] font-semibold mb-3">
            Ajuda
          </p>
          <h1 className="font-heading font-black text-[30px] sm:text-[45px] leading-[1.1]">
            Dúvidas Frequentes
          </h1>
        </div>
        <CurveDivider />
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <FaqSection initialFaqs={faqs} />
      </section>
    </div>
  );
}
