"use client";

import { useLiveData } from "@/lib/useLiveData";
import TestimonialsGrid from "@/components/TestimonialsGrid";
import type { Testimonial } from "@/lib/api";

export default function TestimonialsSection({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const testimonials = useLiveData<Testimonial[]>("/testimonials", initialTestimonials);

  return testimonials.length > 0 ? (
    <TestimonialsGrid testimonials={testimonials} />
  ) : (
    <p className="text-center text-slate-500">Nenhum depoimento publicado no momento.</p>
  );
}
