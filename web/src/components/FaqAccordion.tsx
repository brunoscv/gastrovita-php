"use client";

import { useState } from "react";
import type { Faq } from "@/lib/api";

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="divide-y divide-slate-200">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id}>
            <button
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="w-full flex items-center justify-between gap-4 text-left py-4 font-heading font-extrabold text-[18px] text-brand-dark"
            >
              <span>{faq.question}</span>
              <span
                className={`shrink-0 text-gold text-xl leading-none transition-transform ${isOpen ? "rotate-45" : ""}`}
                aria-hidden
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="font-body pb-5 text-sm text-slate-600 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
