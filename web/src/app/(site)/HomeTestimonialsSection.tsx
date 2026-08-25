"use client";

import Image from "next/image";
import { useLiveData } from "@/lib/useLiveData";
import { uploadUrl, type Testimonial } from "@/lib/api";

export default function HomeTestimonialsSection({
  initialTestimonials,
}: {
  initialTestimonials: Testimonial[];
}) {
  const testimonials = useLiveData<Testimonial[]>("/testimonials", initialTestimonials);
  const videoTestimonials = testimonials.filter((t) => t.type === "youtube").slice(0, 2);

  if (videoTestimonials.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 text-center">
      <h2 className="font-heading font-black text-brand text-[32px] sm:text-[40px] mb-2">Depoimentos</h2>
      <p className="font-body text-slate-600 mb-10">Assista aos vídeos de depoimento de nossos acolhidos</p>
      <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {videoTestimonials.map((t) => (
          <div key={t.id} className="text-left">
            <a
              href={`https://www.youtube.com/watch?v=${t.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block aspect-video rounded-xl overflow-hidden bg-brand group"
            >
              {t.imageUrl && (
                <Image src={uploadUrl(t.imageUrl)!} alt={t.authorName ?? ""} fill className="object-cover" />
              )}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#52A6C7">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </a>
            {t.rating && (
              <div className="text-gold mt-3" aria-hidden="true">
                {"★".repeat(t.rating)}
                <span className="text-slate-300">{"★".repeat(5 - t.rating)}</span>
              </div>
            )}
            <div className="font-heading font-bold text-brand-dark mt-1">{t.authorName}</div>
            {t.text && <div className="font-body text-sm text-slate-600">{t.text}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
