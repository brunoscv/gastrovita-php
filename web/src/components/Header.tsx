"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Estrutura de menu extraída do HTML real do WordPress (migration/html/home.html):
// Home | O Hospital ▾ (Quem Somos, Corpo Clínico, Exames, Vídeos, Depoimentos, FAQ) | Convênios | Contato
// "Especialidades" apontava pro mesmo conteúdo de Corpo Clínico (consolidados) — o item
// aponta direto pra /corpo-clinico agora, sem o hop extra pelo redirect.
const HOSPITAL_DROPDOWN = [
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/corpo-clinico", label: "Corpo Clínico" },
  { href: "/exames", label: "Exames" },
  { href: "/videos", label: "Vídeos" },
  { href: "/depoimentos", label: "Depoimentos" },
  { href: "/faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-header">
      <div className="mx-auto max-w-6xl px-4 py-[1vw] flex items-center justify-between gap-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo-horizontal.png"
            alt="Hospital Gastrovita"
            width={220}
            height={47}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6 font-body text-[13px] font-medium uppercase tracking-wide text-brand">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 uppercase hover:text-gold transition-colors">
              O Hospital
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 top-full pt-3">
                <div className="bg-white shadow-lg rounded-md py-2 min-w-[200px] normal-case">
                  {HOSPITAL_DROPDOWN.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-brand hover:bg-brand-pale hover:text-gold transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/corpo-clinico" className="hover:text-gold transition-colors">
            Especialidades
          </Link>
          <Link href="/convenios" className="hover:text-gold transition-colors">
            Convênios
          </Link>
          <Link href="/contato" className="hover:text-gold transition-colors">
            Contato
          </Link>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-brand-dark"
          aria-label="Abrir menu"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t bg-white px-4 py-3 flex flex-col gap-1 text-sm font-medium text-brand uppercase tracking-wide">
          <Link href="/" onClick={() => setOpen(false)} className="py-2 hover:text-gold">
            Home
          </Link>
          <div className="py-2 text-slate-400 text-xs normal-case">O Hospital</div>
          {HOSPITAL_DROPDOWN.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-2 pl-4 normal-case hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/corpo-clinico" onClick={() => setOpen(false)} className="py-2 hover:text-gold">
            Especialidades
          </Link>
          <Link href="/convenios" onClick={() => setOpen(false)} className="py-2 hover:text-gold">
            Convênios
          </Link>
          <Link href="/contato" onClick={() => setOpen(false)} className="py-2 hover:text-gold">
            Contato
          </Link>
        </nav>
      )}
    </header>
  );
}
