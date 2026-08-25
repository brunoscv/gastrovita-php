"use client";

import { useLiveData } from "@/lib/useLiveData";
import type { ContactInfo } from "@/lib/api";

const BLURB_ICONS = {
  whatsapp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  phone: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  email: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m22 6-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  address: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  hours: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// Ordem e conteúdo real extraídos de migration/html/contato.html (5 blurbs: whatsapp, telefone, email, endereço, horário)
const BLURB_ORDER: Array<keyof ContactInfo> = ["whatsapp", "phone", "email", "address", "hours"];

export default function ContactDetails({ initialInfo }: { initialInfo: ContactInfo | null }) {
  const info = useLiveData<ContactInfo | null>("/contact", initialInfo);

  return (
    <div>
      <h3 className="font-heading font-black text-[28px] text-brand-dark mb-6">Hospital Gastrovita</h3>
      <div className="space-y-5">
        {BLURB_ORDER.map((key) => {
          const value = info?.[key];
          if (!value) return null;
          return (
            <div key={key} className="flex items-start gap-4">
              <div className="shrink-0 h-9 w-9 rounded-full bg-gold text-white flex items-center justify-center">
                {BLURB_ICONS[key as keyof typeof BLURB_ICONS]}
              </div>
              <div className="font-body font-black text-[18px] text-brand-dark pt-1 whitespace-pre-line">
                {value}
              </div>
            </div>
          );
        })}
      </div>

      {info?.address && (
        <div className="rounded-[10px] overflow-hidden border h-64 mt-8">
          <iframe
            title="Localização do Hospital Gastrovita"
            src={`https://www.google.com/maps?q=${encodeURIComponent(info.address)}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  );
}
