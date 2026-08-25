"use client";

import { useLiveData } from "@/lib/useLiveData";
import VideosGrid from "@/components/VideosGrid";
import type { Video } from "@/lib/api";

export default function VideosSection({ initialVideos }: { initialVideos: Video[] }) {
  const videos = useLiveData<Video[]>("/videos", initialVideos);

  return videos.length > 0 ? (
    <VideosGrid videos={videos} />
  ) : (
    <p className="text-center text-slate-500">Nenhum vídeo publicado no momento.</p>
  );
}
