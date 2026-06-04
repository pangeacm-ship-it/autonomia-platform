import Link from "next/link";
import Logo from "@/components/Logo";

export default function ModulosPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>

        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-300">
            Paso 2 de 3
          </p>

          <h1 className="text-5xl font-black">
            Selecciona tus módulos
          </h1>

          <p className="mt-4 text-lg text-slate-400">
            Empieza con SocialIA y añade funcionalidades cuando las necesites.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-violet-400/40 bg-violet-500/10 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-black">SocialIA</h3>
              <span className="rounded-full bg-violet-400 px-3 py-1 text-xs font-bold text-slate-950">
                Obligatorio
              </span>
            </div>

            <p className="text-slate-300">
              Instagram + Facebook + WhatsApp + generación de publicaciones.
            </p>

            <p className="mt-4 text-2xl font-black">
              39€/mes
            </p>
          </div>

          {[
            "ReviewIA",
            "WhatsAppIA",
            "ReservaIA",
            "LeadIA",
            "InsightIA",
            "Google Business",
            "TikTok & Shorts",
          ].map((module) => (
            <div
              key={module}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-black">{module}</h3>

                <input
                  type="checkbox"
                  className="h-5 w-5 accent-violet-500"
                />
              </div>

              <p className="text-slate-400">
                Activar este módulo para ampliar las capacidades de tu negocio.
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-between">
          <Link
            href="/onboarding"
            className="rounded-2xl border border-white/10 px-6 py-3 font-bold text-slate-300"
          >
            Volver
          </Link>

          <Link
            href="/onboarding/facturacion"
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-3 font-bold"
          >
            Continuar
          </Link>
        </div>
      </div>
    </main>
  );
}