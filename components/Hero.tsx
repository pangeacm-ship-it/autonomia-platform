import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 pt-36 text-center sm:px-6 lg:pt-24">
      <Image
        src="/autonomia-logo-hero.png"
        alt="AutonomIA"
        width={420}
        height={120}
        priority
        className="mb-8 h-auto w-full max-w-[320px] sm:mb-10 sm:max-w-[420px]"
      />

      <div className="mb-6 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
        Plataforma modular de IA para negocios locales
      </div>

      <h1 className="max-w-5xl text-4xl font-black leading-tight sm:text-5xl md:text-7xl">
        Empieza con lo básico.
        <br />
        <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
          Añade módulos cuando los necesites.
        </span>
      </h1>

      <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
        AutonomIA ayuda a bares, restaurantes y comercios a gestionar redes
        sociales, reseñas, WhatsApp, reservas, captación de clientes e informes
        desde una única plataforma impulsada por IA.
      </p>

      <div className="mt-10 flex w-full max-w-md flex-col gap-4 sm:w-auto sm:max-w-none sm:flex-row">
        <Link
          href="/onboarding"
          className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold shadow-[0_0_35px_rgba(124,58,237,0.45)] hover:opacity-90 sm:px-8"
        >
          Solicitar demo
        </Link>

        <a
          href="#modulos"
          className="rounded-2xl border border-white/15 px-6 py-4 font-bold text-white hover:bg-white/10 sm:px-8"
        >
          Ver módulos
        </a>
      </div>
    </section>
  );
}
