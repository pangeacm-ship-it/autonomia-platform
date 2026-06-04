import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <Logo />

        <nav className="hidden items-center gap-8 text-sm text-slate-300 lg:flex">
          <a href="#modulos" className="hover:text-white">
            Módulos
          </a>

          <a href="#como-funciona" className="hover:text-white">
            Cómo funciona
          </a>

          <a href="#precios" className="hover:text-white">
            Precios
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-white hover:bg-white/10 sm:px-5 sm:text-sm"
          >
            <span className="sm:hidden">Entrar</span>
            <span className="hidden sm:inline">Iniciar sesión</span>
          </Link>

          <Link
            href="/onboarding"
            className="rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.35)] hover:opacity-90 sm:px-5 sm:text-sm"
          >
            <span className="sm:hidden">Demo</span>
            <span className="hidden sm:inline">Configurar demo</span>
          </Link>
        </div>

        <nav className="flex w-full gap-2 overflow-x-auto pb-1 text-sm text-slate-300 lg:hidden">
          <a href="#modulos" className="shrink-0 rounded-full border border-white/10 px-4 py-2 hover:bg-white/10 hover:text-white">
            Módulos
          </a>
          <a href="#precios" className="shrink-0 rounded-full border border-white/10 px-4 py-2 hover:bg-white/10 hover:text-white">
            Precios
          </a>
          <a href="#como-funciona" className="shrink-0 rounded-full border border-white/10 px-4 py-2 hover:bg-white/10 hover:text-white">
            Cómo funciona
          </a>
        </nav>
      </div>
    </header>
  );
}
