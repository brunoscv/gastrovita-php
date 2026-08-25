"use client";

import { useLiveData } from "@/lib/useLiveData";
import type { ContactInfo } from "@/lib/api";
import { toWhatsappLink } from "./contactHelpers";

export default function WhatsappButton({ initialInfo }: { initialInfo: ContactInfo | null }) {
  const info = useLiveData<ContactInfo | null>("/contact", initialInfo);

  if (!info?.whatsapp) return null;

  return (
    <a
      href={toWhatsappLink(info.whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gold text-white font-bold uppercase text-sm tracking-wider rounded-[10px] shadow-button px-6 py-[0.7em] hover:bg-gold-dark transition-colors"
    >
      WhatsApp
    </a>
  );
}
