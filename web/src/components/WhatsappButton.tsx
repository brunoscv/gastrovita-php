import { apiGet, type ContactInfo } from "@/lib/api";

function toWhatsappLink(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}`;
}

export default async function WhatsappButton() {
  const info = await apiGet<ContactInfo>("/contact").catch(() => null);
  if (!info?.whatsapp) return null;

  return (
    <a
      href={toWhatsappLink(info.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="white">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.688 4.61 1.877 6.484L4 29l7.72-1.847A11.93 11.93 0 0 0 16.001 27C22.628 27 28 21.627 28 15S22.628 3 16.001 3Zm0 21.6a9.55 9.55 0 0 1-4.87-1.33l-.35-.207-4.583 1.097 1.12-4.464-.228-.365A9.54 9.54 0 0 1 5.4 15c0-5.85 4.75-10.6 10.601-10.6 5.85 0 10.6 4.75 10.6 10.6 0 5.85-4.75 10.6-10.6 10.6Zm5.815-7.94c-.318-.16-1.885-.93-2.177-1.037-.292-.107-.505-.16-.717.16-.212.318-.823 1.036-1.009 1.249-.186.212-.372.239-.69.08-.318-.16-1.342-.494-2.556-1.575-.945-.842-1.583-1.883-1.769-2.201-.186-.318-.02-.49.14-.649.144-.143.318-.372.477-.558.16-.186.212-.318.318-.53.106-.212.053-.398-.027-.558-.08-.16-.717-1.727-.982-2.365-.259-.622-.522-.538-.717-.548-.186-.01-.398-.012-.61-.012-.212 0-.558.08-.85.398-.292.318-1.115 1.09-1.115 2.657 0 1.567 1.141 3.081 1.3 3.294.16.212 2.246 3.43 5.442 4.81.76.328 1.353.524 1.816.671.763.243 1.457.209 2.006.127.612-.091 1.885-.771 2.15-1.515.266-.744.266-1.382.186-1.515-.08-.133-.292-.212-.61-.372Z" />
      </svg>
    </a>
  );
}
