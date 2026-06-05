import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-blue-100 bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-center text-white shadow-[0_30px_90px_rgba(79,70,229,0.26)] sm:p-10 md:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.22),transparent_26%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.16),transparent_30%)]" />
        <div className="relative">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-blue-100">
            Empieza ahora
          </p>

          <h2 className="mx-auto max-w-4xl text-3xl font-black sm:text-4xl md:text-6xl">
            Empieza hoy con AutonomIA
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-50">
            Prueba la plataforma, configura tu negocio y empieza a organizar tu
            marketing en minutos.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/onboarding"
              className="rounded-2xl bg-white px-6 py-4 font-bold text-slate-950 shadow-lg hover:bg-slate-100 sm:px-8"
            >
              Crear cuenta gratuita
            </Link>
            <a
              href="#precios"
              className="rounded-2xl border border-white/30 px-6 py-4 font-bold text-white hover:bg-white/10 sm:px-8"
            >
              Ver planes
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
