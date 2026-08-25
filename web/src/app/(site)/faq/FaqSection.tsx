"use client";

import { useLiveData } from "@/lib/useLiveData";
import FaqAccordion from "@/components/FaqAccordion";
import type { Faq } from "@/lib/api";

export default function FaqSection({ initialFaqs }: { initialFaqs: Faq[] }) {
  const faqs = useLiveData<Faq[]>("/faqs", initialFaqs);
  const sorted = [...faqs].sort((a, b) => a.order - b.order);

  return <FaqAccordion faqs={sorted} />;
}
