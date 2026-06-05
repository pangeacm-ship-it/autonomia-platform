import AccessDeniedCard from "@/components/AccessDeniedCard";
import ModuleStatusPanel from "@/components/ModuleStatusPanel";
import { getDashboardRouteAccess } from "@/lib/auth/access-control";

const reviewStats = [
  {
    label: "Valoración media",
    value: "4.8",
    detail: "Google Business",
    color: "text-yellow-300",
  },
  {
    label: "Reseñas",
    value: "128",
    detail: "Totales",
    color: "text-violet-300",
  },
  {
    label: "Respondidas",
    value: "92%",
    detail: "Por IA",
    color: "text-emerald-300",
  },
  {
    label: "Pendientes",
    value: "4",
    detail: "Necesitan revisión",
    color: "text-amber-300",
  },
];

const reviews = [
  {
    author: "María López",
    rating: 5,
    date: "Hoy",
    text: "Comida buenísima y trato excelente. Volveremos seguro.",
    status: "Pendiente",
    sentiment: "Positiva",
  },
  {
    author: "Carlos Ruiz",
    rating: 4,
    date: "Ayer",
    text: "Buen sitio para tapear. El servicio fue rápido.",
    status: "Respondida",
    sentiment: "Positiva",
  },
  {
    author: "Ana Gómez",
    rating: 2,
    date: "Hace 3 días",
    text: "Tardaron bastante en atendernos aunque la comida estaba bien.",
    status: "Requiere revisión",
    sentiment: "Negativa",
  },
];

export default async function ReviewIAPage() {
  const access = await getDashboardRouteAccess("/dashboard/reviewia");

  if (!access.allowed) {
    return (
      <AccessDeniedCard
        title="ReviewIA no está disponible en tu plan"
        reason={access.reason ?? "Este módulo requiere ampliar el plan."}
        planName={access.plan?.name}
      />
    );
  }

  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          ReviewIA
        </p>

        <div className="mt-5 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-4xl font-black">
              Gestión inteligente de reseñas
            </h1>

            <p className="mt-4 max-w-3xl text-slate-300">
              Analiza opiniones, detecta riesgos reputacionales y genera
              respuestas profesionales listas para publicar.
            </p>
          </div>

          <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-300">
            Google conectado
          </span>
        </div>
      </div>

      <ModuleStatusPanel
        moduleName="ReviewIA"
        status="Disponible según plan"
        description="ReviewIA prepara la gestión profesional de reseñas. Las respuestas reales en Google se publicarán solo cuando la conexión esté configurada y aprobada."
        capabilities={[
          "Analizar reseñas y tono del cliente.",
          "Preparar respuestas profesionales.",
          "Detectar riesgos reputacionales.",
        ]}
        requirements={[
          "Plan con ReviewIA incluido o módulo recomendado.",
          "Conexión futura con Google Business.",
          "Aprobación humana antes de publicar respuestas reales.",
        ]}
        nextSteps={[
          "Revisar respuestas sugeridas.",
          "Conectar Google Business cuando proceda.",
          "Definir tono de marca en Configuración IA.",
        ]}
      />

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {reviewStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
          >
            <p className="text-sm text-slate-400">
              {stat.label}
            </p>

            <p className="mt-2 text-4xl font-black">
              {stat.value}
            </p>

            <p className={`mt-3 text-sm ${stat.color}`}>
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
                  <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black">
                  Reseñas recientes
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Revisa las respuestas propuestas antes de publicarlas.
                </p>
              </div>

              <span className="rounded-full bg-amber-500/20 px-4 py-2 text-sm font-bold text-amber-300">
                4 pendientes
              </span>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <article
                  key={`${review.author}-${review.date}`}
                  className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black">
                          {review.author}
                        </h3>

                        <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-300">
                          {"★".repeat(review.rating)}
                        </span>

                        <span className="text-xs text-slate-500">
                          {review.date}
                        </span>
                      </div>

                      <p className="mt-4 leading-7 text-slate-300">
                        “{review.text}”
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        review.status === "Respondida"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : review.status === "Requiere revisión"
                          ? "bg-red-500/20 text-red-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                        Análisis IA
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          review.sentiment === "Negativa"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {review.sentiment}
                      </span>
                    </div>

                    {review.sentiment === "Negativa" ? (
                      <div className="mt-4 space-y-2 text-sm text-slate-300">
                        <p>⚠️ Riesgo reputacional medio</p>
                        <p>• Tiempo de espera elevado</p>
                        <p>• Posible mejora en atención al cliente</p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-2 text-sm text-slate-300">
                        <p>✓ Cliente satisfecho</p>
                        <p>✓ Destaca atención recibida</p>
                        <p>✓ Posible cliente recurrente</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                    <p className="text-sm font-black text-emerald-300">
                      Respuesta sugerida por IA
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Muchas gracias por tu reseña,{" "}
                      {review.author.split(" ")[0]}. Nos alegra saber que tu
                      experiencia ha sido positiva. Seguiremos trabajando para
                      ofrecer el mejor servicio posible cada día.
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-500/30">
                      Aprobar respuesta
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                      Editar
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                      Publicar
                    </button>

                    <button className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-500/20">
                      Descartar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
                  </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Estado del módulo</p>

            <h3 className="mt-2 text-3xl font-black">
              ReviewIA Pro
            </h3>

            <p className="mt-3 text-sm text-emerald-300">
              Google Business conectado
            </p>
          </div>

          <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6">
            <h3 className="text-xl font-black text-cyan-300">
              Resumen IA
            </h3>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">Positivas</span>
                  <span className="font-bold text-emerald-300">78%</span>
                </div>
                <div className="h-3 rounded-full bg-white/10">
                  <div className="h-3 w-[78%] rounded-full bg-emerald-500" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">Neutras</span>
                  <span className="font-bold text-amber-300">15%</span>
                </div>
                <div className="h-3 rounded-full bg-white/10">
                  <div className="h-3 w-[15%] rounded-full bg-amber-500" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">Negativas</span>
                  <span className="font-bold text-red-300">7%</span>
                </div>
                <div className="h-3 rounded-full bg-white/10">
                  <div className="h-3 w-[7%] rounded-full bg-red-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-red-400/20 bg-red-500/10 p-6">
            <h3 className="text-xl font-black text-red-300">
              Alertas IA
            </h3>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-black/20 p-4">
                <p className="text-sm leading-6 text-slate-300">
                  ⚠️ 2 reseñas negativas detectadas esta semana.
                </p>
              </div>

              <div className="rounded-2xl bg-black/20 p-4">
                <p className="text-sm leading-6 text-slate-300">
                  ⚠️ El tiempo medio de respuesta supera las 48 horas.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
            <h3 className="text-xl font-black text-emerald-300">
              Google Business
            </h3>

            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>✓ Ficha conectada</p>
              <p>✓ Sincronización activa</p>
              <p>✓ Última revisión: hace 12 minutos</p>
              <p>✓ Permisos correctos</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-violet-400/30 bg-violet-500/10 p-6">
            <h3 className="text-xl font-black">
              Tendencias detectadas
            </h3>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-black/20 p-4">
                <p className="text-sm leading-6 text-slate-300">
                  ✓ Los clientes destacan la comida casera y el trato cercano.
                </p>
              </div>

              <div className="rounded-2xl bg-black/20 p-4">
                <p className="text-sm leading-6 text-slate-300">
                  ✓ La terraza recibe menciones positivas.
                </p>
              </div>

              <div className="rounded-2xl bg-black/20 p-4">
                <p className="text-sm leading-6 text-slate-300">
                  ⚠️ Varias menciones a tiempos de espera en horas punta.
                </p>
              </div>
            </div>
          </div>

          <button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)]">
            Generar informe de reputación
          </button>
        </aside>
      </div>
    </section>
  );
}
