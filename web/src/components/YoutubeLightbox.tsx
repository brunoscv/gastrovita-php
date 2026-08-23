"use client";

import { useEffect } from "react";

export default function YoutubeLightbox({
  youtubeId,
  onClose,
}: {
  youtubeId: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute -top-10 right-0 text-white text-3xl leading-none hover:text-gold transition-colors"
        >
          ×
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title="Vídeo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
}
