"use client";

import { useSearchParams } from "next/navigation";
import { useApiResource } from "@/lib/useApiResource";
import type { Video } from "@/lib/api";
import VideoForm from "../VideoForm";

export default function EditVideoPage() {
  const id = useSearchParams().get("id") ?? "";
  const { data: video, loading, notFound } = useApiResource<Video>(`/videos/${id}`);

  if (loading) return <p className="text-argon-secondary">Carregando...</p>;
  if (notFound || !video) return <p className="text-red-600">Vídeo não encontrado.</p>;
  return <VideoForm mode="edit" video={video} />;
}
