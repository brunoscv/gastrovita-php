import type { Metadata } from "next";
import { apiGet, type ContactInfo } from "@/lib/api";
import ContactForm from "@/components/ContactForm";
import CurveDivider from "@/components/CurveDivider";
import WhatsappButton from "./WhatsappButton";
import ContactDetails from "./ContactDetails";

export const metadata: Metadata = {
  title: "Contato | Hospital Gastrovita",
  description:
    "Entre em contato com o Hospital Gastrovita: telefone, WhatsApp, e-mail, endereço e horário de funcionamento.",
};

export default async function ContatoPage() {
  const info = await apiGet<ContactInfo>("/contact").catch(() => null);

  return (
    <div>
      <section className="relative bg-brand pb-20 pt-14 overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-2 text-white">
            <h3 className="font-body uppercase text-gold text-[24px] tracking-[8px] leading-[1.3em] mb-2">
              Contato
            </h3>
            <h1 className="font-heading font-black text-[45px] leading-[1.1] mb-4">Fale conosco</h1>
            <p className="font-body text-white/90 mb-8">
              Estamos à disposição para tirar qualquer dúvida pelo canal de comunicação que for mais
              conveniente para você.
            </p>
            <div className="flex flex-wrap gap-3">
              <WhatsappButton initialInfo={info} />
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSd9HIah8uwwrVd0fTrI259eXl_-a6-EWigDIEiaWVVzg5FPiA/viewform?usp=sf_link"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/70 text-white font-bold uppercase text-sm tracking-wider rounded-[10px] px-6 py-[0.7em] hover:bg-white/10 transition-colors"
              >
                Trabalhe conosco
              </a>
            </div>
          </div>
          <div className="lg:col-span-3" />
        </div>

        <CurveDivider />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 grid lg:grid-cols-2 gap-12">
        <ContactDetails initialInfo={info} />

        <div className="bg-white border rounded-[10px] p-6 sm:p-8 shadow-sm">
          <h2 className="font-heading font-extrabold text-2xl text-brand-dark mb-6">
            Envie uma mensagem
          </h2>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
