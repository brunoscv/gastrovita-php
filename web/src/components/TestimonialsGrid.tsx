"use client";

import Image from "next/image";
import { useState } from "react";
import { uploadUrl, type Testimonial } from "@/lib/api";
import YoutubeLightbox from "./YoutubeLightbox";
import StarRating from "./StarRating";

export default function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t) => {
          const thumb = t.type === "youtube" ? uploadUrl(t.imageUrl) : null;

          return (
            <div key={t.id} className="bg-white rounded-[20px] overflow-hidden shadow-md p-6 flex flex-col">
              {t.rating != null && (
                <div className="mb-3">
                  <StarRating rating={t.rating} />
                </div>
              )}

              {t.type === "text" && (
                <blockquote className="text-slate-600 italic flex-1">“{t.text}”</blockquote>
              )}

              {t.type === "image" && t.imageUrl && (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-100 mb-3">
                  <Image src={uploadUrl(t.imageUrl)!} alt={t.authorName ?? "Depoimento"} fill className="object-cover" sizes="400px" />
                </div>
              )}

              {t.type === "youtube" && t.youtubeId && (
                <button
                  onClick={() => setPlaying(t.youtubeId)}
                  className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-200 mb-3 group"
                >
                  <Image
                    src={thumb ?? `https://img.youtube.com/vi/${t.youtubeId}/mqdefault.jpg`}
                    alt={t.authorName ?? "Depoimento"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    sizes="400px"
                    unoptimized={!thumb}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <svg width="16" height="20" viewBox="0 0 20 24" fill="#115278">
                        <path d="M0 0l20 12L0 24V0z" />
                      </svg>
                    </div>
                  </div>
                </button>
              )}

              <div className="mt-auto pt-2">
                {t.authorName && <div className="font-semibold text-brand-dark">{t.authorName}</div>}
                {t.type !== "text" && t.text && (
                  <p className="text-slate-500 text-sm mt-0.5">{t.text}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {playing && <YoutubeLightbox youtubeId={playing} onClose={() => setPlaying(null)} />}
    </>
  );
}
