import Image from "next/image";
import Link from "next/link";
import { apiGet, type Insurance, type Testimonial } from "@/lib/api";
import ContactForm from "@/components/ContactForm";
import CurveDivider from "@/components/CurveDivider";
import HomeInsurancesSection from "./HomeInsurancesSection";
import HomeTestimonialsSection from "./HomeTestimonialsSection";

// Lista de especialidades médicas exibida na Home — texto fixo extraído do
// conteúdo real do WordPress (não vem de uma tabela; são só 14 itens que
// raramente mudam). Se precisar editar pelo painel no futuro, vale virar
// um recurso gerenciável como Exames.
const ESPECIALIDADES = [
  "Anestesia",
  "Coloproctologia",
  "Cirurgia bariátrica",
  "Cirurgia geral",
  "Clínica médica",
  "Endoscopia",
  "Fisioterapia pélvica",
  "Fonoaudiologia",
  "Gastroenterologia",
  "Hepatologia",
  "Nutrição",
  "Oncologia",
  "Radiologia",
  "Ultrassonografia",
];

const WHATSAPP_AGENDAR = "https://api.whatsapp.com/send/?phone=5586994473581&text=Ol%C3%A1%2C+eu+gostaria+de+mais+informa%C3%A7%C3%B5es%21&type=phone_number&app_absent=0";
const ACHEMED_URL = "https://achemed-store.inkless.digital/";

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-body uppercase tracking-[8px] text-gold text-[18px] sm:text-[24px] font-semibold mb-3">
      {children}
    </p>
  );
}

export default async function HomePage() {
  const [insurances, testimonials] = await Promise.all([
    apiGet<Insurance[]>("/insurances").catch(() => []),
    apiGet<Testimonial[]>("/testimonials").catch(() => []),
  ]);

  return (
    <div>
      {/* 1. Hero */}
      <section className="relative bg-brand text-white overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-24 sm:pb-32">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <SectionKicker>Hospital Gastrovita</SectionKicker>
              <h1 className="font-heading font-black text-[35px] sm:text-[45px] leading-[1.15] mb-4">
                Cuidando do bem-estar completo dos nossos acolhidos
              </h1>
              <p className="font-body text-white/90 text-lg max-w-md">
                Disponibilizamos uma ampla gama de especialidades médicas para garantir o cuidado
                integral e personalizado de cada acolhido.
              </p>
            </div>
            <div className="relative w-full max-w-md mx-auto aspect-[757/614]">
              <Image src="/home-hero.webp" alt="Equipe do Hospital Gastrovita" fill className="object-contain" priority />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-10 p-6">
            <a
              href={ACHEMED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="justify-self-center bg-gold text-white font-semibold rounded-[10px] shadow-button px-6 py-[1.17em] hover:bg-gold-dark transition-colors text-sm uppercase tracking-wide"
            >
              Agendar Consulta
            </a>
            <a
              href={ACHEMED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="justify-self-center bg-gold text-white font-semibold rounded-[10px] shadow-button px-6 py-[1.17em] hover:bg-gold-dark transition-colors text-sm uppercase tracking-wide"
            >
              Resultado de Exames
            </a>
            <a
              href={WHATSAPP_AGENDAR}
              target="_blank"
              rel="noopener noreferrer"
              className="justify-self-center bg-gold text-white font-semibold rounded-[10px] shadow-button px-6 py-[1.17em] hover:bg-gold-dark transition-colors text-sm uppercase tracking-wide"
            >
              Agendar Exames
            </a>
          </div>
        </div>
        <CurveDivider />
      </section>

      {/* 2. Sobre nós */}
      <section className="mx-auto max-w-6xl px-4 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="font-heading font-black text-gold text-[32px] sm:text-[40px] mb-4">Sobre nós</h2>
          <p className="font-body text-slate-700 mb-4">
            Somos o <strong>Hospital Gastrovita</strong>, referência no diagnóstico e tratamento
            das patologias do aparelho digestivo do Piauí, o primeiro hospital com registro no
            CNES 7866267 na categoria hospital dia, possuindo a mais avançada tecnologia
            diagnóstica disponível atualmente. Contamos com um corpo clínico altamente
            qualificado, composto por diversos especialistas para atender as mais variadas
            necessidades dos nossos acolhidos.
          </p>
          <p className="font-body text-slate-700 mb-6">
            Nossos profissionais incluem gastroenterologistas, gastropediatras, hepatologistas,
            oncologistas, coloproctologistas, cirurgiões gerais, cirurgiões oncológicos,
            cirurgiões bariátricos, fisioterapeutas do assoalho pélvico, fonoaudiólogas da
            deglutição, nutricionistas, radiologistas, endoscopistas e anestesistas.
          </p>
          <Link
            href="/quem-somos"
            className="inline-block bg-gold text-white font-semibold rounded-[10px] shadow-button px-6 py-[0.6em] hover:bg-gold-dark transition-colors text-sm uppercase tracking-wide"
          >
            Saiba mais
          </Link>
        </div>
        <div className="relative w-full aspect-[812/649] rounded-2xl overflow-hidden">
          <Image src="/home-sobre-nos.webp" alt="Instalações do Hospital Gastrovita" fill className="object-cover" />
        </div>
      </section>

      {/* 3. Especialidades Médicas */}
      <section className="bg-brand-pale">
        <div className="mx-auto max-w-6xl px-4 py-16 grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-heading font-black text-brand text-[32px] sm:text-[40px] mb-4">
              Especialidades Médicas
            </h2>
            <p className="font-body text-slate-700 mb-6 max-w-sm">
              O Hospital Gastrovita disponibiliza diversas especialidades médicas para garantir o
              cuidado completo da sua saúde.
            </p>
            <Link
              href="/corpo-clinico"
              className="inline-block bg-gold text-white font-semibold rounded-[10px] shadow-button px-6 py-[0.6em] hover:bg-gold-dark transition-colors text-sm uppercase tracking-wide"
            >
              Saiba mais
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 content-start">
            {ESPECIALIDADES.map((esp) => (
              <div key={esp} className="flex items-start gap-2 font-body font-semibold text-brand-dark">
                <span className="text-gold mt-1">•</span>
                {esp}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Resultado Online */}
      <section className="mx-auto max-w-6xl px-4 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <SectionKicker>Resultado Online</SectionKicker>
          <p className="font-body text-slate-700 max-w-md">
            Para trazer mais comodidade e facilidade aos nossos acolhidos, oferecemos os
            resultados online dos exames realizados. Por aqui, você tem também acesso ao
            histórico centralizado de todos os exames realizados conosco.
          </p>
        </div>
        <div className="bg-brand bg-[url('/resultado-online-cta-bg.webp')] bg-contain bg-right bg-no-repeat rounded-2xl p-8 text-white">
          <h3 className="font-heading font-bold text-2xl mb-4">Agende sua consulta de forma rápida!</h3>
          <a
            href={WHATSAPP_AGENDAR}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gold text-white font-semibold rounded-[10px] shadow-button px-6 py-[0.6em] hover:bg-gold-dark transition-colors text-sm uppercase tracking-wide"
          >
            Agendar Consulta
          </a>
        </div>
      </section>

      {/* 5. Convênios atendidos */}
      <HomeInsurancesSection initialInsurances={insurances} />

      {/* 6. Depoimentos */}
      <HomeTestimonialsSection initialTestimonials={testimonials} />

      {/* 7. Fale Conosco */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative w-full max-w-sm mx-auto aspect-[730/765] hidden lg:block">
            <Image src="/home-fale-conosco.webp" alt="Fale com o Hospital Gastrovita" fill className="object-contain" />
          </div>
          <div className="bg-brand rounded-2xl p-8 text-white">
            <h2 className="font-heading font-black text-2xl mb-6">Fale Conosco</h2>
            <div className="bg-white rounded-xl p-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
