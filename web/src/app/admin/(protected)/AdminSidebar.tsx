"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  DoctorIcon,
  VideoIcon,
  FaqIcon,
  InsuranceIcon,
  ExamIcon,
  TestimonialIcon,
  ContactIcon,
  InboxIcon,
  UsersIcon,
  AccountIcon,
} from "./AdminIcons";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: DashboardIcon, exact: true },
  { href: "/admin/doctors", label: "Médicos", icon: DoctorIcon },
  { href: "/admin/videos", label: "Vídeos", icon: VideoIcon },
  { href: "/admin/faqs", label: "Dúvidas Frequentes", icon: FaqIcon },
  { href: "/admin/insurances", label: "Convênios", icon: InsuranceIcon },
  { href: "/admin/exams", label: "Exames", icon: ExamIcon },
  { href: "/admin/testimonials", label: "Depoimentos", icon: TestimonialIcon },
  { href: "/admin/contact", label: "Contato", icon: ContactIcon },
  { href: "/admin/contact-submissions", label: "Mensagens", icon: InboxIcon },
];

export default function AdminSidebar({ role }: { role: "SUPER_ADMIN" | "EDITOR" }) {
  const pathname = usePathname();

  const items = [
    ...NAV,
    ...(role === "SUPER_ADMIN" ? [{ href: "/admin/users", label: "Usuários", icon: UsersIcon }] : []),
  ];

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="w-64 shrink-0 bg-white shadow-argon-xxl flex flex-col font-argon">
      <div className="px-6 py-6 border-b border-argon-grey-200">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-argon-md bg-gradient-to-br from-argon-primary to-argon-primary-state" />
          <span className="font-semibold text-argon-dark text-[15px]">Gastrovita Admin</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-argon-md text-sm transition-colors ${
                active
                  ? "bg-argon-info/10 text-argon-dark font-semibold shadow-argon-xxl"
                  : "text-argon-text hover:bg-argon-grey-100"
              }`}
            >
              <span
                className={`grid place-items-center w-8 h-8 rounded-argon-md shrink-0 ${
                  active ? "bg-gradient-to-br from-argon-primary to-argon-primary-state text-white" : "text-argon-secondary"
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-argon-grey-200">
        <Link
          href="/admin/account"
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-argon-md text-sm transition-colors ${
            isActive("/admin/account")
              ? "bg-argon-info/10 text-argon-dark font-semibold"
              : "text-argon-text hover:bg-argon-grey-100"
          }`}
        >
          <span className="grid place-items-center w-8 h-8 rounded-argon-md shrink-0 text-argon-secondary">
            <AccountIcon className="w-[18px] h-[18px]" />
          </span>
          Minha conta
        </Link>
      </div>
    </aside>
  );
}
