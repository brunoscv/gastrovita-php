/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build estático (HTML/CSS/JS puro) — a hospedagem compartilhada não roda
  // Node, então não há SSR/ISR/rewrites/redirects em produção. Ver
  // DEPLOY.md do projeto gastrovita-php pra estrutura completa.
  output: "export",
  trailingSlash: true,
  images: {
    // Sem servidor não tem otimização de imagem em tempo real.
    unoptimized: true,
  },
};

export default nextConfig;
