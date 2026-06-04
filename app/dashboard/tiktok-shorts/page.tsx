import AccessDeniedCard from "@/components/AccessDeniedCard";
import { getDashboardRouteAccess } from "@/lib/auth/access-control";

const trends = [
  {
    title: "Detrás de cámaras",
    growth: "+42%",
  },
  {
    title: "Antes y después",
    growth: "+38%",
  },
  {
    title: "Consejos rápidos",
    growth: "+31%",
  },
];

const ideas = [
  {
    title: "Preparación del plato estrella",
    description:
      "Mostrar en 15 segundos cómo se prepara el plato más vendido del negocio.",
  },
  {
    title: "3 razones para visitarnos",
    description:
      "Vídeo corto destacando ambiente, calidad y atención al cliente.",
  },
  {
    title: "Un día en el negocio",
    description:
      "Resumen rápido mostrando actividad diaria y cercanía con los clientes.",
  },
];

const plannedVideos = [
  {
    day: "Lunes",
    title: "Menú del día",
  },
  {
    day: "Miércoles",
    title: "Detrás de cámaras",
  },
  {
    day: "Viernes",
    title: "Promoción fin de semana",
  },
];

export default async function TikTokShortsPage() {
  const access = await getDashboardRouteAccess("/dashboard/tiktok-shorts");

  if (!access.allowed) {
    return (
      <AccessDeniedCard
        title="TikTok & Shorts no está disponible en tu plan"
        reason={access.reason ?? "Este módulo requiere ampliar el plan."}
        planName={access.plan?.name}
      />
    );
  }

  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-pink-600/20 via-fuchsia-600/20 to-violet-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-pink-200">
          TikTok & Shorts
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Vídeos cortos impulsados por IA
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Genera ideas virales, planifica vídeos y aprovecha tendencias para
          aumentar alcance y visibilidad.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Vídeos publicados</p>
          <h3 className="mt-2 text-4xl font-black">18</h3>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Visualizaciones</p>
          <h3 className="mt-2 text-4xl font-black">24K</h3>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Interacciones</p>
          <h3 className="mt-2 text-4xl font-black">1.7K</h3>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Crecimiento</p>
          <h3 className="mt-2 text-4xl font-black text-emerald-300">
            +28%
          </h3>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">
              Ideas generadas por IA
            </h2>

            <div className="mt-6 space-y-4">
              {ideas.map((idea) => (
                <article
                  key={idea.title}
                  className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
                >
                  <h3 className="text-lg font-black">
                    {idea.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {idea.description}
                  </p>

                  <div className="mt-5 flex gap-3">
                    <button className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300">
                      Crear vídeo
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold">
                      Programar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">
              Calendario de vídeos
            </h2>

            <div className="mt-5 space-y-3">
              {plannedVideos.map((video) => (
                <div
                  key={video.day}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <span className="font-bold">{video.day}</span>
                  <span className="text-slate-300">{video.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-pink-500/20 bg-pink-500/10 p-6">
            <h3 className="text-xl font-black text-pink-300">
              Tendencias detectadas
            </h3>

            <div className="mt-5 space-y-3">
              {trends.map((trend) => (
                <div
                  key={trend.title}
                  className="rounded-2xl bg-black/20 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold">{trend.title}</p>
                    <span className="text-emerald-300 font-bold">
                      {trend.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">
              Recomendación IA
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Publica al menos 3 vídeos cortos por semana combinando contenido
              real del negocio y promociones. Los formatos &quot;detrás de cámaras&quot;
              muestran mejor rendimiento actualmente.
            </p>
          </div>

          <button className="w-full rounded-2xl bg-gradient-to-r from-pink-600 to-fuchsia-600 px-6 py-4 font-bold">
            Generar ideas virales
          </button>
        </aside>
      </div>
    </section>
  );
}
