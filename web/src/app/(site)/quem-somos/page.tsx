import type { Metadata } from "next";
import CurveDivider from "@/components/CurveDivider";

export const metadata: Metadata = {
  title: "Quem Somos | Hospital Gastrovita",
  description:
    "Conheça o Hospital Gastrovita, referência no diagnóstico e tratamento das patologias do aparelho digestivo no Piauí.",
};

const VALORES = [
  "Gentileza",
  "Agilidade",
  "Segurança Biológica",
  "Tecnologia",
  "Respeito às Diferenças",
  "Orgulho de acolher pessoas, melhorar e prolongar a vida",
];

const STATS = [
  { value: "30+", label: "especialistas" },
  { value: "8500+", label: "Exames realizados" },
  { value: "10500+", label: "Pacientes atendidos" },
];

export default function QuemSomosPage() {
  return (
    <div>
      <section className="relative bg-brand text-white overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 pt-16 sm:pt-20 pb-24 text-center">
          <p className="font-body uppercase tracking-[8px] text-gold text-[18px] sm:text-[24px] font-semibold mb-3">
            Quem Somos
          </p>
          <h1 className="font-heading font-black text-[30px] sm:text-[45px] leading-[1.1]">
            Um hospital completo para cuidar da sua saúde de forma plena
          </h1>
          <p className="font-body text-white/90 text-lg mt-4">
            Aqui no Hospital Gastrovita, acreditamos que o bem-estar do nosso paciente vem sempre em
            primeiro lugar.
          </p>
        </div>
        <CurveDivider />
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 space-y-6 font-body text-slate-700 leading-relaxed">
        <h2 className="font-heading font-black text-[28px] sm:text-[35px] text-brand">Quem somos nós</h2>
        <p>
          Somos o <strong>Hospital Gastrovita</strong>, referência no diagnóstico e tratamento das
          patologias do aparelho digestivo do Piauí. O primeiro hospital com registro no CNES
          7866267 na categoria hospital dia, possuindo a mais avançada tecnologia diagnóstica
          disponível atualmente. Contamos com um corpo clínico altamente qualificado, composto por
          diversos especialistas para atender as mais variadas necessidades dos nossos acolhidos.
        </p>
        <p>
          Nossos profissionais incluem gastroenterologistas, gastropediatras, hepatologistas,
          oncologistas, coloproctologistas, cirurgiões gerais, cirurgiões oncológicos, cirurgiões
          bariátricos, fisioterapeutas do assoalho pélvico, fonoaudiólogas da deglutição,
          nutricionistas, radiologistas, endoscopistas e anestesistas.
        </p>
        <p>
          Os nossos <strong>aparelhos médicos de alta tecnologia</strong> possibilitam o
          diagnóstico precoce das doenças, permitindo o tratamento e a cura ainda em uma fase
          inicial como, por exemplo, os aparelhos de endoscopia que possuem alta resolução e
          permitem a magnificação de imagem, tecnologia restrita a poucos centros de referência,{" "}
          <strong>tornando possível o diagnóstico precoce de câncer</strong>, quando este ainda tem
          milímetros e pode inclusive ser tratado por endoscopia, evitando cirurgias.
        </p>
        <p>
          Somos uma instituição comprometida em prestar serviços de saúde com excelência,
          acolhimento e inovação tecnológica na Região Meio-Norte do Brasil. Nossa missão é
          promover o bem-estar e prolongar a vida dos nossos acolhidos, oferecendo atendimento
          médico de alta qualidade em um ambiente acolhedor e seguro.
        </p>
        <p>
          Nosso maior orgulho é poder contribuir para a saúde e o bem-estar das pessoas,
          proporcionando uma vida mais longa e saudável. No <strong>Hospital Gastrovita</strong>,
          cada acolhido é único e merece o melhor atendimento. Estamos aqui para cuidar da saúde
          dos nossos acolhidos com dedicação, profissionalismo e humanização.
        </p>
      </section>

      <section className="bg-brand-pale">
        <div className="mx-auto max-w-4xl px-4 py-14 grid grid-cols-3 gap-6 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="font-heading font-black text-[28px] sm:text-[35px] text-brand">
                {stat.value}
              </div>
              <div className="font-body text-sm text-slate-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="font-heading font-black text-[20px] text-brand mb-2">Missão</h3>
            <p className="font-body text-slate-600 text-sm leading-relaxed">
              Prestar serviço na área de saúde com excelência no acolhimento, atendimento médico e
              inovação tecnológica na Região Meio-Norte do Brasil, promovendo bem-estar e
              prolongando a vida.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-black text-[20px] text-brand mb-2">Visão</h3>
            <p className="font-body text-slate-600 text-sm leading-relaxed">
              Ser referência no acolhimento, prestação de serviços e inovação tecnológica na área
              de saúde na Região Meio-Norte do Brasil.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-black text-[20px] text-brand mb-2">Valores</h3>
            <ul className="font-body text-slate-600 text-sm leading-relaxed space-y-1 list-disc list-inside">
              {VALORES.map((valor) => (
                <li key={valor}>{valor}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16 space-y-4 text-slate-700 leading-relaxed">
          <h2 className="font-heading font-black text-[28px] sm:text-[35px] text-brand mb-2">Telemedicina</h2>
          <p>
            No Hospital Gastrovita, oferecemos o serviço de telemedicina para facilitar seu
            atendimento com segurança e comodidade. Veja como funciona:
          </p>
          <p>
            <strong>Agendamento:</strong> Você pode agendar sua consulta de forma prática, seja
            presencialmente na recepção do hospital, pelo aplicativo Achemed ou pelo nosso call
            center.
          </p>
          <p>
            <strong>Pré-consulta:</strong> Até o dia marcado, nossa equipe de recepção entrará em
            contato para agilizar o pagamento e fornecer orientações detalhadas sobre o processo,
            garantindo que tudo esteja pronto para o dia da consulta.
          </p>
          <p>
            <strong>No dia da consulta:</strong> Quando o horário agendado se aproximar, você
            receberá uma notificação lembrando da consulta. No horário marcado, de onde estiver,
            basta acessar o aplicativo do Hospital Gastrovita no seu celular para realizar a
            consulta diretamente com o médico, sem precisar se deslocar.
          </p>
          <p>
            A <strong>telemedicina do Gastrovita</strong> foi criada para dar mais praticidade ao
            seu cuidado, conectando você ao médico de forma simples e eficiente.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 space-y-4 text-slate-700 leading-relaxed">
        <h2 className="font-heading font-black text-[28px] sm:text-[35px] text-brand mb-2">
          Centro de Infusão
        </h2>
        <p>
          O Centro de Infusão do Hospital Gastrovita é uma unidade de saúde especializada no
          tratamento de acolhidos por meio da administração controlada de medicamentos diretamente
          na corrente sanguínea. Utilizando tecnologia de ponta, como cateteres intravenosos e
          bombas de infusão, o centro oferece um ambiente seguro e eficiente para terapias que
          exigem monitoramento contínuo e infusões prolongadas.
        </p>
        <p>
          Entre os tratamentos realizados, destacam-se a administração de imunobiológicos,
          antibióticos e medicamentos para doenças crônicas, garantindo o cuidado ideal para
          acolhidos que necessitam de atenção especializada e acompanhamento cuidadoso.
        </p>
        <p>
          No Centro de Infusão Gastrovita, a equipe médica e de enfermagem altamente qualificada
          oferece um atendimento humanizado, com foco na segurança e no conforto dos acolhidos,
          proporcionando um ambiente acolhedor e tranquilo para quem precisa de tratamentos mais
          complexos.
        </p>
      </section>
    </div>
  );
}
