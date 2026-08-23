"use client";

import Image from "next/image";
import { useState } from "react";
import { uploadUrl, type Video } from "@/lib/api";
import YoutubeLightbox from "./YoutubeLightbox";

export default function VideosGrid({ videos }: { videos: Video[] }) {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {videos.map((video) => (
          <button
            key={video.id}
            id={video.slug}
            onClick={() => setPlaying(video.youtubeId)}
            className="text-left group flex flex-col"
          >
            <div className="relative w-full aspect-video rounded-[20px] overflow-hidden bg-slate-200 shadow-md">
              <Image
                src={uploadUrl(video.thumbnailUrl) ?? `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="400px"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                  <svg width="20" height="24" viewBox="0 0 20 24" fill="#115278">
                    <path d="M0 0l20 12L0 24V0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-3 text-sm font-medium text-slate-800 line-clamp-2 min-h-[2.5rem]">
              {video.title}
            </div>
          </button>
        ))}
      </div>

      {playing && <YoutubeLightbox youtubeId={playing} onClose={() => setPlaying(null)} />}
    </>
  );
}
