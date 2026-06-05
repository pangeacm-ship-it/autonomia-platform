import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm font-bold text-slate-600 lg:flex">
          <a href="#modulos" className="hover:text-blue-700">
            Módulos
          </a>

          <a href="#como-funciona" className="hover:text-blue-700">
            Cómo funciona
          </a>

          <a href="#precios" className="hover:text-blue-700">
            Precios
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50 sm:px-5 sm:text-sm"
          >
            <span className="sm:hidden">Entrar</span>
            <span className="hidden sm:inline">Iniciar sesión</span>
          </Link>

          <Link
            href="/onboarding"
            className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-2 text-xs font-bold text-white shadow-[0_12px_30px_rgba(79,70,229,0.24)] hover:opacity-90 sm:px-5 sm:text-sm"
          >
            <span className="sm:hidden">Gratis</span>
            <span className="hidden sm:inline">Prueba gratuita</span>
          </Link>
        </div>

        <nav className="flex w-full gap-2 overflow-x-auto pb-1 text-sm font-bold text-slate-600 lg:hidden">
          <a href="#modulos" className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 hover:bg-blue-50 hover:text-blue-700">
            Módulos
          </a>
          <a href="#precios" className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 hover:bg-blue-50 hover:text-blue-700">
            Precios
          </a>
          <a href="#como-funciona" className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 hover:bg-blue-50 hover:text-blue-700">
            Cómo funciona
          </a>
        </nav>
      </div>
    </header>
  );
}
