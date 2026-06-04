import Link from "next/link";
import Logo from "@/components/Logo";
import { businessSectors, defaultBusinessSector } from "@/lib/business-sectors";

const steps = [
  "Datos de empresa",
  "Sector",
  "Objetivo",
  "Tono IA",
  "Módulos",
  "Finalizar",
];

const objectives = [
  "Aumentar reservas",
  "Publicar mejor en redes",
  "Conseguir más reseñas",
  "Captar nuevos clientes",
];

const tones = ["Cercano", "Profesional", "Familiar", "Premium"];

const recommendedModules = [
  {
    name: "SocialIA",
    detail: "Contenido para Instagram, Facebook y Google Business.",
  },
  {
    name: "ReviewIA",
    detail: "Respuestas preparadas para mejorar reputación.",
  },
  {
    name: "ReservaIA",
    detail: "Gestión futura de reservas, citas o visitas.",
  },
  {
    name: "InsightIA",
    detail: "Resumen de actividad y recomendaciones de negocio.",
  },
];

export default function OnboardingPage() {
  const selectedSector = defaultBusinessSector;

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8 text-white sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
                Onboarding inicial
              </p>

              <h1 className="mt-4 text-3xl font-black sm:text-4xl">
                Configura AutonomIA para tu negocio
              </h1>

              <p className="mt-4 max-w-3xl text-slate-300">
                Una configuración guiada y simulada para preparar empresa,
                sector, tono IA y módulos recomendados antes de conectar datos
                reales.
              </p>
            </div>

            <span className="w-fit rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
              Demo visual
            </span>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`rounded-2xl px-4 py-3 text-sm font-black ${
                  index === 0
                    ? "bg-violet-500/20 text-violet-100"
                    : "bg-white/5 text-slate-400"
                }`}
              >
                <span className="mr-2 text-xs text-slate-500">
                  {index + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
              <div className="mb-6">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
                  Paso 1
                </p>
                <h2 className="mt-3 text-2xl font-black">
                  Datos de empresa
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Nombre comercial
                  </label>
                  <input
                    defaultValue="Bar La Plaza"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Ciudad
                  </label>
                  <input
                    defaultValue="Sevilla"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Teléfono
                  </label>
                  <input
                    defaultValue="+34 600 000 000"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Email
                  </label>
                  <input
                    defaultValue="hola@barlaplaza.com"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 outline-none focus:border-violet-400"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6 lg:p-8">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
                Paso 2
              </p>
              <h2 className="mt-3 text-2xl font-black">
                Sector del negocio
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                El sector adapta lenguaje, ejemplos de contenido, reservas y
                módulos recomendados.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {businessSectors.slice(0, 6).map((sector) => (
                  <div
                    key={sector.key}
                    className={`rounded-2xl border p-4 ${
                      sector.key === selectedSector.key
                        ? "border-cyan-300/40 bg-cyan-500/20"
                        : "border-white/10 bg-[#0b1024]"
                    }`}
                  >
                    <p className="font-black">{sector.name}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {sector.bookingLabel}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-300">
                    Paso 3
                  </p>
                  <h2 className="mt-3 text-2xl font-black">
                    Objetivo principal
                  </h2>

                  <div className="mt-6 grid gap-3">
                    {objectives.map((objective, index) => (
                      <div
                        key={objective}
                        className={`rounded-2xl border p-4 text-sm font-bold ${
                          index === 0
                            ? "border-amber-300/30 bg-amber-500/20 text-amber-100"
                            : "border-white/10 bg-[#0b1024] text-slate-300"
                        }`}
                      >
                        {objective}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
                    Paso 4
                  </p>
                  <h2 className="mt-3 text-2xl font-black">Tono IA</h2>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {tones.map((tone, index) => (
                      <span
                        key={tone}
                        className={`rounded-full px-4 py-3 text-sm font-bold ${
                          index === 0
                            ? "bg-violet-500/20 text-violet-100"
                            : "bg-white/10 text-slate-300"
                        }`}
                      >
                        {tone}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b1024] p-5">
                    <p className="text-sm leading-6 text-slate-300">
                      Ejemplo: “Hoy tenemos menú casero, preparado con producto
                      fresco y mucho mimo. Reserva tu mesa y ven a disfrutarlo.”
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-violet-400/20 bg-violet-500/10 p-6 lg:p-8">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-200">
                Paso 5
              </p>
              <h2 className="mt-3 text-2xl font-black">
                Módulos recomendados
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {recommendedModules.map((module) => (
                  <article
                    key={module.name}
                    className="rounded-2xl border border-white/10 bg-[#0b1024] p-5"
                  >
                    <p className="text-lg font-black">{module.name}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {module.detail}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
              <p className="text-sm text-emerald-200">Configuración estimada</p>
              <h3 className="mt-2 text-3xl font-black sm:text-4xl">82%</h3>
              <div className="mt-5 h-3 rounded-full bg-white/10">
                <div className="h-3 w-[82%] rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Faltaría conectar canales reales y confirmar facturación antes
                de activar producción.
              </p>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">
                Resumen
              </p>
              <div className="mt-5 space-y-4 text-sm">
                <p className="flex justify-between gap-4">
                  <span className="text-slate-400">Empresa</span>
                  <span className="font-bold">Bar La Plaza</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span className="text-slate-400">Sector</span>
                  <span className="font-bold">{selectedSector.name}</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span className="text-slate-400">Objetivo</span>
                  <span className="font-bold">Aumentar reservas</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span className="text-slate-400">Tono</span>
                  <span className="font-bold">Cercano</span>
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-amber-400/20 bg-amber-500/10 p-6">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-300">
                Paso 6
              </p>
              <h3 className="mt-3 text-xl font-black">Finalizar</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Esta acción es simulada. En el futuro creará la empresa,
                guardará el sector y activará módulos en Supabase.
              </p>

              <Link
                href="/dashboard"
                className="mt-5 block rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-4 text-center font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)] hover:opacity-90"
              >
                Finalizar configuración
              </Link>

              <Link
                href="/registro"
                className="mt-3 block rounded-2xl border border-white/10 px-5 py-4 text-center font-bold text-slate-300 hover:bg-white/10"
              >
                Volver al registro
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
