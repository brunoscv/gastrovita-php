import type { Metadata } from "next";
import { apiGet, type ContactInfo } from "@/lib/api";
import ContactForm from "@/components/ContactForm";
import CurveDivider from "@/components/CurveDivider";

export const metadata: Metadata = {
  title: "Contato | Hospital Gastrovita",
  description:
    "Entre em contato com o Hospital Gastrovita: telefone, WhatsApp, e-mail, endereço e horário de funcionamento.",
};

function toWhatsappLink(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent("Olá, eu gostaria de mais informações!")}`;
}

const BLURB_ICONS = {
  whatsapp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  phone: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  email: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m22 6-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  address: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  hours: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// Ordem e conteúdo real extraídos de migration/html/contato.html (5 blurbs: whatsapp, telefone, email, endereço, horário)
const BLURB_ORDER: Array<keyof ContactInfo> = ["whatsapp", "phone", "email", "address", "hours"];

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
              {info?.whatsapp && (
                <a
                  href={toWhatsappLink(info.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold text-white font-bold uppercase text-sm tracking-wider rounded-[10px] shadow-button px-6 py-[0.7em] hover:bg-gold-dark transition-colors"
                >
                  WhatsApp
                </a>
              )}
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
        <div>
          <h3 className="font-heading font-black text-[28px] text-brand-dark mb-6">Hospital Gastrovita</h3>
          <div className="space-y-5">
            {BLURB_ORDER.map((key) => {
              const value = info?.[key];
              if (!value) return null;
              return (
                <div key={key} className="flex items-start gap-4">
                  <div className="shrink-0 h-9 w-9 rounded-full bg-gold text-white flex items-center justify-center">
                    {BLURB_ICONS[key as keyof typeof BLURB_ICONS]}
                  </div>
                  <div className="font-body font-black text-[18px] text-brand-dark pt-1 whitespace-pre-line">
                    {value}
                  </div>
                </div>
              );
            })}
          </div>

          {info?.address && (
            <div className="rounded-[10px] overflow-hidden border h-64 mt-8">
              <iframe
                title="Localização do Hospital Gastrovita"
                src={`https://www.google.com/maps?q=${encodeURIComponent(info.address)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>

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
