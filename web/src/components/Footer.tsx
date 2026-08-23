import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { apiGet, type ContactInfo } from "@/lib/api";

function toWhatsappLink(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}`;
}

const USEFUL_LINKS = [
  { href: "/", label: "Home" },
  { href: "/corpo-clinico", label: "Especialidades" },
  { href: "/exames", label: "Exames" },
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/depoimentos", label: "Depoimentos" },
  { href: "/convenios", label: "Convênios" },
  { href: "/faq", label: "FAQ" },
  { href: "/contato", label: "Contato" },
  { href: "/politica-de-privacidade", label: "Política de Privacidade" },
];

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/hospitalgastrovita",
    label: "Facebook",
    icon: (
      <path d="M22 12.06C22 6.48 17.52 2 11.94 2S1.88 6.48 1.88 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.42V9.91c0-2.39 1.42-3.71 3.6-3.71 1.04 0 2.13.19 2.13.19v2.34h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.91h-2.22V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    ),
  },
  {
    href: "https://www.youtube.com/@HospitalGastrovita",
    label: "YouTube",
    icon: (
      <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z" />
    ),
  },
  {
    href: "https://www.instagram.com/hospitalgastrovita/",
    label: "Instagram",
    icon: (
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 01-1.15 1.76 4.9 4.9 0 01-1.76 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 01-1.76-1.15 4.9 4.9 0 01-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76A4.9 4.9 0 015.44 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 1.8c-2.67 0-2.99.01-4.04.06-.87.04-1.34.18-1.65.3-.42.16-.72.36-1.03.67-.31.31-.51.61-.67 1.03-.12.31-.26.78-.3 1.65C4.26 8.5 4.25 8.82 4.25 11.5v1c0 2.67.01 2.99.06 4.04.04.87.18 1.34.3 1.65.16.42.36.72.67 1.03.31.31.61.51 1.03.67.31.12.78.26 1.65.3 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.87-.04 1.34-.18 1.65-.3.42-.16.72-.36 1.03-.67.31-.31.51-.61.67-1.03.12-.31.26-.78.3-1.65.05-1.05.06-1.37.06-4.04v-1c0-2.67-.01-2.99-.06-4.04-.04-.87-.18-1.34-.3-1.65a2.75 2.75 0 00-.67-1.03 2.75 2.75 0 00-1.03-.67c-.31-.12-.78-.26-1.65-.3C14.99 3.81 14.67 3.8 12 3.8zm0 3.05a5.15 5.15 0 110 10.3 5.15 5.15 0 010-10.3zm0 1.8a3.35 3.35 0 100 6.7 3.35 3.35 0 000-6.7zm5.35-1.99a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
    ),
  },
];

const PHONE_ICON = (
  <path d="M6.6 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.57.57 1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.49a1 1 0 011 1 11.36 11.36 0 00.57 3.57 1 1 0 01-.25 1.01l-2.21 2.21z" />
);
const MAIL_ICON = (
  <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 2.01V6l8 6.99L20 6v.01L12 13 4 6.01zM4 8.24V18h16V8.24l-7.4 6.47a1 1 0 01-1.2 0L4 8.24z" />
);
const PIN_ICON = (
  <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" />
);

function ContactIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gold flex items-center justify-center">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
        {children}
      </svg>
    </span>
  );
}

export default async function Footer() {
  const info = await apiGet<ContactInfo>("/contact").catch(() => null);

  return (
    <footer className="mt-16">
      <div className="bg-brand-footer text-white">
        <div className="mx-auto max-w-[1234px] px-4 pt-[31px] pb-10 grid gap-x-[99px] gap-y-10 sm:grid-cols-3">
          <div>
            <Image
              src="/logo-horizontal-branco.png"
              alt="Hospital Gastrovita"
              width={1315}
              height={280}
              className="w-full h-auto mb-4"
            />
            <p className="text-[14.4px] leading-[1.6] text-white/90 mb-2">
              No <strong>Hospital Gastrovita</strong>, cada paciente é único e merece o melhor
              atendimento. Estamos aqui para cuidar da saúde dos nossos pacientes com dedicação,
              profissionalismo e humanização.
            </p>
            <p className="text-[14.4px] font-semibold mb-3">Venha nos conhecer!</p>
            <p className="text-xs text-white/80">Diretor técnico: Dr. George Macêdo, PhD / CRM-PI: 2962</p>
          </div>

          <div>
            <h3 className="font-heading font-extrabold text-xl border-b-[5px] border-gold mb-[30px]">
              Links Úteis
            </h3>
            <ul className="text-[14.4px] leading-[1.8] text-white/90">
              {USEFUL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-gold transition-colors">
                    • {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-extrabold text-xl border-b-[5px] border-gold mb-[30px]">
              Contato
            </h3>
            <ul className="space-y-3 text-base text-white/90">
              {info?.whatsapp && (
                <li className="flex items-center gap-3">
                  <ContactIcon>{PHONE_ICON}</ContactIcon>
                  <a
                    href={toWhatsappLink(info.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold transition-colors"
                  >
                    {info.whatsapp}
                  </a>
                </li>
              )}
              {info?.phone && (
                <li className="flex items-center gap-3">
                  <ContactIcon>{PHONE_ICON}</ContactIcon>
                  <a
                    href={`tel:${info.phone.replace(/\D/g, "")}`}
                    className="hover:text-gold transition-colors"
                  >
                    {info.phone}
                  </a>
                </li>
              )}
              {info?.email && (
                <li className="flex items-center gap-3">
                  <ContactIcon>{MAIL_ICON}</ContactIcon>
                  <a href={`mailto:${info.email}`} className="hover:text-gold transition-colors">
                    {info.email}
                  </a>
                </li>
              )}
              {info?.address && (
                <li className="flex items-center gap-3">
                  <ContactIcon>{PIN_ICON}</ContactIcon>
                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(info.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold transition-colors"
                  >
                    Endereço: {info.address}
                  </a>
                </li>
              )}
            </ul>

            <div className="flex gap-2 mt-5">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-[52px] h-[42px] rounded-[9px] bg-gold flex items-center justify-center text-white shadow-[0_2px_18px_rgba(0,0,0,0.3)] hover:bg-gold-dark transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-footer-bottom py-[10px] text-center text-xs italic text-white/80">
        © {new Date().getFullYear()} Hospital Gastrovita. Todos os direitos reservados.
      </div>
    </footer>
  );
}
