"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";

const menuSections = [
  {
    title: "General",
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Centro IA", href: "/dashboard/centro-ia" },
      { label: "Módulos", href: "/dashboard/modulos" },
      { label: "Calendario", href: "/dashboard/calendario" },
      { label: "Tareas", href: "/dashboard/tareas" },
      { label: "Notificaciones", href: "/dashboard/notificaciones" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "SocialIA", href: "/dashboard/socialia" },
      { label: "Google Business", href: "/dashboard/google-business" },
      { label: "ReviewIA", href: "/dashboard/reviewia" },
      { label: "TikTok & Shorts", href: "/dashboard/tiktok-shorts" },
    ],
  },
  {
    title: "Operaciones",
    items: [
      { label: "LeadIA", href: "/dashboard/leadia" },
      { label: "WhatsAppIA", href: "/dashboard/whatsappia" },
      { label: "ReservaIA", href: "/dashboard/reservaia" },
      { label: "InsightIA", href: "/dashboard/insightia" },
    ],
  },
  {
    title: "Empresa",
    items: [
      { label: "Mi empresa", href: "/dashboard/empresa" },
      { label: "Usuarios", href: "/dashboard/usuarios" },
      { label: "Conexiones", href: "/dashboard/conexiones" },
      { label: "Suscripción", href: "/dashboard/suscripcion" },
      { label: "Facturación", href: "/dashboard/facturacion" },
      { label: "Configuración", href: "/dashboard/configuracion" },
      { label: "Cuenta", href: "/dashboard/cuenta" },
      { label: "Legal", href: "/dashboard/legal" },
    ],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    General: true,
    Marketing: false,
    Operaciones: false,
    Empresa: false,
  });

  function toggleSection(title: string) {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b1c]/95 px-4 py-4 backdrop-blur lg:hidden">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Logo />

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-slate-300"
            >
              Dashboard
            </Link>

            <LogoutButton
              label="Salir"
              className="rounded-full border border-red-400/20 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-500/10"
            />
          </div>
        </div>

        <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {menuSections.flatMap((section) =>
            section.items.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                    isActive
                      ? "bg-white text-slate-950"
                      : "border border-white/10 bg-white/[0.04] text-slate-300"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }),
          )}
        </nav>
      </header>

      <aside className="hidden h-dvh w-60 shrink-0 overflow-y-auto border-r border-white/10 bg-[#070b1c] px-5 py-6 lg:block">
        <div className="mb-10">
          <Logo />

          <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            Panel de control
          </p>
        </div>

        <nav className="space-y-4 pb-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.22em] text-slate-500 transition hover:bg-white/5 hover:text-slate-300"
              >
                <span>{section.title}</span>

                <span className="text-sm">
                  {openSections[section.title] ? "−" : "+"}
                </span>
              </button>

              {openSections[section.title] && (
                <div className="mt-2 space-y-1.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-white text-slate-950"
                            : "text-slate-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-5">
          <LogoutButton className="w-full rounded-xl border border-red-400/20 px-4 py-3 text-sm font-bold text-red-200 hover:bg-red-500/10" />
        </div>
      </aside>
    </>
  );
}
