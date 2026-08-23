"use client";

import { createContext, useContext } from "react";
import type { Me } from "@/lib/useCurrentUser";

// O layout protegido já resolve o usuário logado uma vez (useCurrentUser);
// as páginas filhas (dashboard, usuários) reaproveitam esse valor por aqui
// em vez de buscar de novo.
export const AdminUserContext = createContext<Me | null>(null);

export function useAdminUser(): Me {
  const user = useContext(AdminUserContext);
  if (!user) {
    throw new Error("useAdminUser só pode ser usado dentro do layout protegido do admin");
  }
  return user;
}
