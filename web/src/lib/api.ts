// Só usada em build time (next build faz o fetch real pra gerar o HTML
// estático) — precisa ser uma URL absoluta e alcançável na hora do build,
// nunca em tempo de execução no navegador.
const API_URL = process.env.API_URL || "http://localhost:8000";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`Falha ao buscar ${path}: ${res.status}`);
  return res.json();
}

export interface Doctor {
  id: string;
  name: string;
  slug: string;
  photoUrl: string | null;
  crm: string | null;
  specialty: string | null;
  bio: string | null;
  order: number;
  active: boolean;
}

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl: string | null;
  slug: string;
  order: number;
  published: boolean;
}

export interface Testimonial {
  id: string;
  authorName: string | null;
  type: "youtube" | "image" | "text";
  youtubeId: string | null;
  imageUrl: string | null;
  text: string | null;
  rating: number | null;
  order: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface Insurance {
  id: string;
  name: string;
  logoUrl: string | null;
  order: number;
}

export interface Exam {
  id: string;
  name: string;
  order: number;
}

export interface ContactInfo {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  hours: string | null;
}

export function uploadUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  // Relativo de propósito (funciona tanto em páginas geradas em build time
  // quanto em componentes client-side): API e site ficam sob o mesmo
  // domínio, com a API em /api — ver DEPLOY.md do gastrovita-php.
  return `/api${path}`;
}
