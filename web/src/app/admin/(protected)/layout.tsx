"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { AdminUserContext } from "./AdminUserContext";
import AdminSidebar from "./AdminSidebar";
import LogoutButton from "./LogoutButton";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-argon-bg font-argon text-sm text-argon-secondary">
        Carregando...
      </div>
    );
  }

  if (!user) {
    // useEffect acima já disparou o redirect pro login.
    return null;
  }

  return (
    <AdminUserContext.Provider value={user}>
      <div className="min-h-screen flex bg-argon-bg font-argon">
        <AdminSidebar role={user.role} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex justify-between items-center px-6 py-4">
            <div className="text-sm">
              <span className="text-argon-dark font-semibold">{user.name ?? user.email}</span>
              <span className="text-argon-secondary"> — {user.role === "SUPER_ADMIN" ? "Super Administrador" : "Editor"}</span>
            </div>
            <LogoutButton />
          </header>
          <main className="px-6 pb-8 flex-1">{children}</main>
        </div>
      </div>
    </AdminUserContext.Provider>
  );
}
