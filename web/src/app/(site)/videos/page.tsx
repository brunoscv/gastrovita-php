import type { Metadata } from "next";
import { apiGet, type Video } from "@/lib/api";
import VideosGrid from "@/components/VideosGrid";
import CurveDivider from "@/components/CurveDivider";

export const metadata: Metadata = {
  title: "Vídeos | Hospital Gastrovita",
  description: "Vídeos e conteúdos do Hospital Gastrovita sobre saúde digestiva.",
};

export default async function VideosPage() {
  const videos = await apiGet<Video[]>("/videos").catch(() => [] as Video[]);

  return (
    <div>
      <section className="relative bg-brand-footer text-white overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-24">
          <h1 className="font-heading font-black text-[30px] sm:text-[45px] leading-[1.1] mb-4">Vídeos</h1>
          <p className="font-body text-white/90 max-w-2xl">
            Descubra como cuidar melhor da sua saúde digestiva com os especialistas do Hospital
            Gastrovita! Assista aos nossos vídeos e fique por dentro das melhores dicas e
            tratamentos.
          </p>
        </div>
        <CurveDivider />
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          {videos.length > 0 ? (
            <VideosGrid videos={videos} />
          ) : (
            <p className="text-center text-slate-500">Nenhum vídeo publicado no momento.</p>
          )}
        </div>
      </section>
    </div>
  );
}
