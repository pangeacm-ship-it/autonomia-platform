import Link from "next/link";
import Logo from "@/components/Logo";

export default function Navbar() {
  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 sm:py-4">
        <div className="flex items-center [&_img]:h-auto [&_img]:w-[154px] sm:[&_img]:w-[220px] lg:[&_img]:w-[260px]">
          <Logo />
        </div>

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

        <details className="group relative sm:hidden">
          <summary
            aria-label="Abrir menú"
            className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm [&::-webkit-details-marker]:hidden"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-5 rounded-full bg-slate-900" />
              <span className="block h-0.5 w-5 rounded-full bg-slate-900" />
              <span className="block h-0.5 w-5 rounded-full bg-slate-900" />
            </span>
          </summary>

          <div className="absolute right-0 top-14 w-56 rounded-3xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-700 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
            <a href="#modulos" className="block rounded-2xl px-4 py-3 hover:bg-blue-50 hover:text-blue-700">
              Módulos
            </a>
            <a href="#precios" className="block rounded-2xl px-4 py-3 hover:bg-blue-50 hover:text-blue-700">
              Precios
            </a>
            <a href="#como-funciona" className="block rounded-2xl px-4 py-3 hover:bg-blue-50 hover:text-blue-700">
              Cómo funciona
            </a>
            <Link href="/login" className="mt-2 block rounded-2xl border border-slate-200 px-4 py-3 text-center hover:bg-slate-50">
              Entrar
            </Link>
            <Link href="/onboarding" className="mt-2 block rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-center text-white">
              Prueba gratuita
            </Link>
          </div>
        </details>

        <div className="hidden items-center gap-2 sm:flex sm:gap-3">
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

        <nav className="hidden w-full gap-2 overflow-x-auto pb-1 text-sm font-bold text-slate-600 sm:flex lg:hidden">
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
