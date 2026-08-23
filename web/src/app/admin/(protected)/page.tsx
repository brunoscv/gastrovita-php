"use client";

import { useEffect, useState } from "react";
import { useAdminUser } from "./AdminUserContext";
import { DoctorIcon, VideoIcon, InsuranceIcon, FaqIcon } from "./AdminIcons";

async function count(path: string): Promise<number> {
  try {
    const res = await fetch(`/api${path}`, { credentials: "include" });
    if (!res.ok) return 0;
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

const STATS = [
  { key: "doctors", label: "Médicos ativos", icon: DoctorIcon, path: "/doctors" },
  { key: "videos", label: "Vídeos publicados", icon: VideoIcon, path: "/videos" },
  { key: "insurances", label: "Convênios", icon: InsuranceIcon, path: "/insurances" },
  { key: "faqs", label: "Dúvidas Frequentes", icon: FaqIcon, path: "/faqs" },
] as const;

export default function AdminDashboard() {
  const user = useAdminUser();
  const [counts, setCounts] = useState<number[]>(STATS.map(() => 0));

  useEffect(() => {
    let cancelled = false;
    Promise.all(STATS.map((s) => count(s.path))).then((values) => {
      if (!cancelled) setCounts(values);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8 pt-2">
      <div>
        <h1 className="text-2xl font-semibold text-argon-dark">
          Bem-vindo, {user.name ?? user.email}
        </h1>
        <p className="text-argon-secondary mt-1">
          Papel: {user.role === "SUPER_ADMIN" ? "Super Administrador" : "Editor"}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.key} className="bg-white rounded-argon-xl shadow-argon-xxl p-5 flex items-center gap-4">
              <span className="grid place-items-center w-12 h-12 rounded-argon-md bg-gradient-to-br from-argon-primary to-argon-primary-state text-white shrink-0">
                <Icon className="w-6 h-6" />
              </span>
              <div>
                <div className="text-2xl font-bold text-argon-dark leading-tight">{counts[i]}</div>
                <div className="text-xs text-argon-secondary">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
