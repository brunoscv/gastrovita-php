"use client";

import { useSearchParams } from "next/navigation";
import { useApiResource } from "@/lib/useApiResource";
import type { Testimonial } from "@/lib/api";
import TestimonialForm from "../TestimonialForm";

export default function EditTestimonialPage() {
  const id = useSearchParams().get("id") ?? "";
  const { data: testimonial, loading, notFound } = useApiResource<Testimonial>(`/testimonials/${id}`);

  if (loading) return <p className="text-argon-secondary">Carregando...</p>;
  if (notFound || !testimonial) return <p className="text-red-600">Depoimento não encontrado.</p>;
  return <TestimonialForm mode="edit" testimonial={testimonial} />;
}
