"use client";

import { useAdminUser } from "../AdminUserContext";
import UsersManager from "./UsersManager";

export default function UsersPage() {
  const user = useAdminUser();

  if (user.role !== "SUPER_ADMIN") {
    return (
      <p className="text-argon-error bg-argon-error/10 rounded-argon-md px-3 py-2 mt-2">
        Acesso negado. Esta área é restrita a super administradores.
      </p>
    );
  }

  return <UsersManager />;
}
