"use client";

import { useRouter } from "next/navigation";
import { LogoutIcon } from "./AdminIcons";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-sm font-semibold text-argon-error hover:opacity-80 transition-opacity"
    >
      <LogoutIcon className="w-4 h-4" />
      Sair
    </button>
  );
}
