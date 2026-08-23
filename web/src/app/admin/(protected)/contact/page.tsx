"use client";

import { useApiResource } from "@/lib/useApiResource";
import type { ContactInfo } from "@/lib/api";
import ContactForm from "./ContactForm";

export default function ContactPage() {
  const { data: initial, loading } = useApiResource<ContactInfo>("/contact");

  if (loading) return <p className="text-argon-secondary">Carregando...</p>;
  return <ContactForm initial={initial} />;
}
