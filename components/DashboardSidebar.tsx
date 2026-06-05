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
      { label: "Dashboard", href: "/dashboard", icon: "D" },
      { label: "Centro IA", href: "/dashboard/centro-ia", icon: "IA" },
      { label: "Módulos", href: "/dashboard/modulos", icon: "M" },
      { label: "Calendario", href: "/dashboard/calendario", icon: "C" },
      { label: "Tareas", href: "/dashboard/tareas", icon: "T" },
      { label: "Notificaciones", href: "/dashboard/notificaciones", icon: "N" },
    ],
  },
  {
    title: "Marketing",
    items: [
      { label: "SocialIA", href: "/dashboard/socialia", icon: "S" },
      { label: "Google Business", href: "/dashboard/google-business", icon: "G" },
      { label: "ReviewIA", href: "/dashboard/reviewia", icon: "R" },
      { label: "TikTok & Shorts", href: "/dashboard/tiktok-shorts", icon: "V" },
    ],
  },
  {
    title: "Operaciones",
    items: [
      { label: "LeadIA", href: "/dashboard/leadia", icon: "L" },
      { label: "WhatsAppIA", href: "/dashboard/whatsappia", icon: "W" },
      { label: "ReservaIA", href: "/dashboard/reservaia", icon: "R" },
      { label: "InsightIA", href: "/dashboard/insightia", icon: "I" },
    ],
  },
  {
    title: "Empresa",
    items: [
      { label: "Mi empresa", href: "/dashboard/empresa", icon: "E" },
      { label: "Usuarios", href: "/dashboard/usuarios", icon: "U" },
      { label: "Conexiones", href: "/dashboard/conexiones", icon: "X" },
      { label: "Suscripción", href: "/dashboard/suscripcion", icon: "P" },
      { label: "Facturación", href: "/dashboard/facturacion", icon: "F" },
      { label: "Configuración", href: "/dashboard/configuracion", icon: "C" },
      { label: "Cuenta", href: "/dashboard/cuenta", icon: "A" },
      { label: "Legal", href: "/dashboard/legal", icon: "L" },
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
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur lg:hidden">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Logo />

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700"
            >
              Dashboard
            </Link>

            <LogoutButton
              label="Salir"
              className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
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
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_12px_30px_rgba(79,70,229,0.22)]"
                      : "border border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  {item.label}
                </Link>
              );
            }),
          )}
        </nav>
      </header>

      <aside className="hidden h-dvh w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white/90 px-5 py-6 shadow-[18px_0_50px_rgba(30,41,59,0.04)] backdrop-blur lg:block">
        <div className="mb-10">
          <Logo />

          <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Panel de control
          </p>
        </div>

        <nav className="space-y-4 pb-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[11px] font-black uppercase tracking-[0.22em] text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
              >
                <span>{section.title}</span>

                <span className="text-sm">
                  {openSections[section.title] ? "-" : "+"}
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
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_12px_30px_rgba(79,70,229,0.18)]"
                            : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-black ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.icon}
                        </span>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200 pt-5">
          <LogoutButton className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-100" />
        </div>
      </aside>
    </>
  );
}
