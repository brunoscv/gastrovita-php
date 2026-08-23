"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { uploadUrl } from "@/lib/api";

interface Video {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl: string | null;
  order: number;
  published: boolean;
}

interface YoutubeStatus {
  connected: boolean;
  channelTitle?: string | null;
}

const ID_RE = /^[a-zA-Z0-9_-]{11}$/;

function previewIdFrom(input: string): string | null {
  const value = input.trim();
  if (ID_RE.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && ID_RE.test(id) ? id : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v");
        return id && ID_RE.test(id) ? id : null;
      }
      const parts = url.pathname.split("/").filter(Boolean);
      if ((parts[0] === "shorts" || parts[0] === "embed") && parts[1]) {
        return ID_RE.test(parts[1]) ? parts[1] : null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Upload de vídeo direto do navegador pro YouTube (sessão resumível), sem o
 * arquivo passar pelo nosso servidor — necessário porque a API roda em
 * hospedagem compartilhada, que não suporta receber/processar vídeos grandes.
 *
 * Fluxo:
 * 1. POST /api/videos/upload no nosso backend abre a sessão e devolve a
 *    uploadUrl (URL de upload resumível do próprio Google).
 * 2. O navegador faz um PUT do arquivo inteiro direto pra essa uploadUrl.
 * 3. A resposta desse PUT já é o recurso de vídeo criado no YouTube — usamos
 *    o `id` dele como youtubeId pra criar o registro via POST /api/videos
 *    (mesma rota de sempre, sem upload nenhum envolvido).
 */
async function uploadVideoToYoutube(
  file: File,
  fields: { title: string; published: boolean },
  onProgress: (pct: number) => void
): Promise<string> {
  const initRes = await fetch("/api/videos/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(fields),
  });
  if (!initRes.ok) {
    const data = await initRes.json().catch(() => ({}));
    throw new Error(data.error || "Falha ao iniciar upload pro YouTube");
  }
  const { uploadUrl: sessionUrl } = await initRes.json();

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", sessionUrl);
    xhr.setRequestHeader("Content-Type", file.type || "video/*");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (!data.id) throw new Error();
          resolve(data.id as string);
        } catch {
          reject(new Error("O YouTube não retornou o vídeo criado"));
        }
      } else {
        reject(new Error("Falha ao enviar o arquivo pro YouTube"));
      }
    };
    xhr.onerror = () => reject(new Error("Falha de rede ao enviar vídeo pro YouTube"));
    xhr.send(file);
  });
}

export default function VideoForm({ mode, video }: { mode: "create" | "edit"; video?: Video }) {
  const router = useRouter();

  const [sourceMode, setSourceMode] = useState<"upload" | "link">("link");
  const [youtubeStatus, setYoutubeStatus] = useState<YoutubeStatus | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [title, setTitle] = useState(video?.title ?? "");
  const [youtubeInput, setYoutubeInput] = useState(video?.youtubeId ?? "");
  const [order, setOrder] = useState(video?.order ?? 0);
  const [published, setPublished] = useState(video?.published ?? true);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(video?.thumbnailUrl ?? null);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload?folder=video-thumbnails", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao enviar thumbnail");
      }
      const data = await res.json();
      setThumbnailUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setThumbnailUploading(false);
    }
  }

  const previewId = previewIdFrom(youtubeInput);

  useEffect(() => {
    if (mode !== "create") return;
    fetch("/api/youtube/status", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { connected: false }))
      .then(setYoutubeStatus)
      .catch(() => setYoutubeStatus({ connected: false }));
  }, [mode]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let finalYoutubeId = youtubeInput;

      if (mode === "create" && sourceMode === "upload") {
        if (!file) throw new Error("Selecione um arquivo de vídeo");
        setUploadProgress(0);
        finalYoutubeId = await uploadVideoToYoutube(file, { title, published }, setUploadProgress);
      }

      const payload = { title, youtubeId: finalYoutubeId, thumbnailUrl, order: Number(order), published };
      const res = await fetch(mode === "create" ? "/api/videos" : `/api/videos/${video!.id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Falha ao salvar vídeo");
      }

      router.push("/admin/videos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  }

  const label = "block text-xs font-semibold text-argon-secondary uppercase tracking-wide mb-1.5";
  const input =
    "w-full border border-argon-grey-300 rounded-argon-md px-3.5 py-2.5 text-sm text-argon-dark outline-none focus:border-argon-primary focus:ring-2 focus:ring-argon-primary/20 transition-shadow";
  const tabBase = "flex-1 text-sm font-semibold rounded-argon-md py-2 transition-colors";

  return (
    <div className="max-w-2xl space-y-6 pt-2">
      <h1 className="text-2xl font-semibold text-argon-dark">
        {mode === "create" ? "Novo vídeo" : `Editar: ${video?.title}`}
      </h1>

      {error && (
        <p className="text-sm text-argon-error bg-argon-error/10 rounded-argon-md px-3 py-2">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-argon-xl shadow-argon-xxl p-6 sm:p-8 space-y-5">
        <div>
          <label className={label}>Título *</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className={input} />
        </div>

        {mode === "create" && (
          <div className="flex gap-2 bg-argon-grey-100 rounded-argon-md p-1">
            <button
              type="button"
              onClick={() => setSourceMode("upload")}
              className={`${tabBase} ${sourceMode === "upload" ? "bg-white shadow-argon-sm text-argon-primary" : "text-argon-secondary"}`}
            >
              Enviar arquivo
            </button>
            <button
              type="button"
              onClick={() => setSourceMode("link")}
              className={`${tabBase} ${sourceMode === "link" ? "bg-white shadow-argon-sm text-argon-primary" : "text-argon-secondary"}`}
            >
              Colar link do YouTube
            </button>
          </div>
        )}

        {mode === "create" && sourceMode === "upload" ? (
          <div>
            <label className={label}>Arquivo de vídeo *</label>
            {youtubeStatus && !youtubeStatus.connected ? (
              <p className="text-sm text-argon-warning bg-argon-warning/10 rounded-argon-md px-3 py-2">
                Nenhuma conta do YouTube conectada.{" "}
                <a href="/api/youtube/connect" className="font-semibold underline">
                  Conectar com YouTube
                </a>
              </p>
            ) : (
              <>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className={input}
                />
                <p className="text-xs text-argon-secondary mt-1.5">
                  O vídeo é enviado direto pro canal do YouTube conectado.
                </p>
                {uploadProgress !== null && (
                  <div className="w-full bg-argon-grey-200 rounded-full h-2 mt-3 overflow-hidden">
                    <div
                      className="bg-argon-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div>
            <label className={label}>Link ou ID do YouTube *</label>
            <input
              required
              value={youtubeInput}
              onChange={(e) => setYoutubeInput(e.target.value)}
              placeholder="https://youtube.com/watch?v=... ou apenas o ID"
              className={input}
            />
            <p className="text-xs text-argon-secondary mt-1.5">
              Aceita link completo (youtube.com, youtu.be, shorts) ou o ID puro do vídeo.
            </p>
            {previewId ? (
              <img
                src={`https://img.youtube.com/vi/${previewId}/mqdefault.jpg`}
                alt="Prévia"
                className="w-40 h-24 rounded-argon-md object-cover mt-2 bg-argon-grey-200"
              />
            ) : (
              youtubeInput.trim() !== "" && (
                <p className="text-xs text-argon-warning mt-1.5">
                  Não foi possível reconhecer um ID de vídeo aí ainda.
                </p>
              )
            )}
          </div>
        )}

        <div>
          <label className={label}>Thumbnail customizada (opcional)</label>
          {thumbnailUrl ? (
            <img
              src={uploadUrl(thumbnailUrl)!}
              alt="Prévia da thumbnail"
              className="w-40 h-24 rounded-argon-md object-cover mb-2 bg-argon-grey-200"
            />
          ) : (
            <p className="text-xs text-argon-secondary mb-2">
              Sem thumbnail, o site mostra um frame padrão do próprio vídeo antes do play.
            </p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            disabled={thumbnailUploading}
            className="text-sm text-argon-text"
          />
          {thumbnailUploading && <p className="text-sm text-argon-secondary mt-1">Enviando...</p>}
          {thumbnailUrl && (
            <button
              type="button"
              onClick={() => setThumbnailUrl(null)}
              className="block text-xs text-argon-error font-semibold mt-1.5 hover:opacity-75"
            >
              Remover thumbnail
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label className={label}>Ordem</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className={input}
            />
          </div>
          <label className="flex items-center gap-2 pb-2.5">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 accent-argon-primary"
            />
            <span className="text-sm text-argon-text">Publicado</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={
            saving ||
            thumbnailUploading ||
            (mode === "create" && sourceMode === "upload" && youtubeStatus?.connected === false)
          }
          className="bg-gradient-to-tl from-argon-primary to-argon-primary-state text-white text-sm font-semibold rounded-argon-md px-5 py-2.5 shadow-argon-md hover:shadow-argon-lg transition-shadow disabled:opacity-50"
        >
          {saving
            ? uploadProgress !== null
              ? `Enviando... ${uploadProgress}%`
              : "Salvando..."
            : "Salvar"}
        </button>
      </form>
    </div>
  );
}
