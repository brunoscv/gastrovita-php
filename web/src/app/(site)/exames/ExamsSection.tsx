"use client";

import { useLiveData } from "@/lib/useLiveData";
import type { Exam } from "@/lib/api";

export default function ExamsSection({ initialExams }: { initialExams: Exam[] }) {
  const exams = useLiveData<Exam[]>("/exams", initialExams);

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {exams.map((exam) => (
        <span
          key={exam.id}
          className="font-body bg-gold text-white font-semibold text-sm rounded-[10px] shadow-button px-5 py-[0.6em]"
        >
          {exam.name}
        </span>
      ))}
    </div>
  );
}
