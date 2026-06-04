import AccessDeniedCard from "@/components/AccessDeniedCard";
import { getDashboardRouteAccess } from "@/lib/auth/access-control";

const stats = [
  { label: "Actividad IA", value: "87%", change: "+14% este mes", color: "text-emerald-300" },
  { label: "Leads generados", value: "17", change: "+32% vs mes anterior", color: "text-sky-300" },
  { label: "Reseñas gestionadas", value: "24", change: "Tiempo medio: 2h", color: "text-violet-300" },
  { label: "Reservas detectadas", value: "19", change: "5 pendientes", color: "text-amber-300" },
];

const modulePerformance = [
  { module: "SocialIA", score: "82%", detail: "Buena constancia de publicaciones", color: "from-blue-500 to-violet-500" },
  { module: "ReviewIA", score: "76%", detail: "Mejorar velocidad de respuesta", color: "from-violet-500 to-pink-500" },
  { module: "LeadIA", score: "68%", detail: "Hay oportunidades sin seguimiento", color: "from-pink-500 to-sky-500" },
  { module: "ReservaIA", score: "74%", detail: "Alta demanda en fines de semana", color: "from-cyan-500 to-blue-500" },
];

const recommendations = [
  "Publica los jueves y domingos entre las 19:00 y las 21:00.",
  "Activa una campaña de captación esta semana: Instagram está generando más leads.",
  "Responde reseñas negativas en menos de 24 horas para proteger reputación.",
  "Refuerza recordatorios de reserva los sábados para reducir cancelaciones.",
];

const alerts = [
  { title: "Leads sin seguimiento", text: "Hay 4 contactos interesados pendientes.", type: "warning" },
  { title: "Buen rendimiento social", text: "Las publicaciones con fotos reales generan más interacción.", type: "success" },
  { title: "Oportunidad de reservas", text: "Sábado concentra más demanda. Conviene lanzar promoción.", type: "info" },
];

const goals = [
  { title: "Publicar 3 veces por semana", progress: "78%" },
  { title: "Responder reseñas en 24h", progress: "64%" },
  { title: "Contactar leads nuevos", progress: "52%" },
];

export default async function InsightIAPage() {
  const access = await getDashboardRouteAccess("/dashboard/insightia");

  if (!access.allowed) {
    return (
      <AccessDeniedCard
        title="InsightIA no está disponible en tu plan"
        reason={access.reason ?? "Este módulo requiere ampliar el plan."}
        planName={access.plan?.name}
      />
    );
  }

  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-violet-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
          InsightIA
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Inteligencia global del negocio
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Analiza SocialIA, ReviewIA, LeadIA, ReservaIA y Google Business para
          detectar oportunidades, riesgos y próximas acciones recomendadas.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-4xl font-black">{stat.value}</p>
            <p className={`mt-3 text-sm font-bold ${stat.color}`}>{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Rendimiento por módulo</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {modulePerformance.map((item) => (
                <div key={item.module} className="rounded-3xl border border-white/10 bg-[#0b1024] p-5">
                  <div className={`mb-4 h-2 rounded-full bg-gradient-to-r ${item.color}`} />
                  <div className="flex items-center justify-between">
                    <h3 className="font-black">{item.module}</h3>
                    <span className="text-sm font-bold text-emerald-300">{item.score}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Recomendaciones inteligentes</h2>

            <div className="mt-6 space-y-4">
              {recommendations.map((item) => (
                <div key={item} className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-5">
                  <p className="text-sm leading-6 text-slate-300">✦ {item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Objetivos del mes</h2>

            <div className="mt-6 space-y-5">
              {goals.map((goal) => (
                <div key={goal.title}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">{goal.title}</span>
                    <span className="font-bold text-cyan-300">{goal.progress}</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                      style={{ width: goal.progress }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
            <p className="text-sm text-emerald-200">Estado del negocio</p>
            <h3 className="mt-2 text-3xl font-black">En crecimiento</h3>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              El negocio mejora en actividad digital, captación y reputación,
              pero debe reforzar seguimiento comercial y reservas.
            </p>
          </div>

          <div className="rounded-[2rem] border border-cyan-500/20 bg-cyan-500/10 p-6">
            <h3 className="text-xl font-black text-cyan-300">Resumen IA</h3>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              AutonomIA detecta una oportunidad clara: usar Instagram para
              captar reservas de fin de semana y responder más rápido los leads
              generados desde WhatsApp.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">Alertas</h3>

            <div className="mt-5 space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.title}
                  className={`rounded-2xl border p-4 ${
                    alert.type === "success"
                      ? "border-emerald-500/20 bg-emerald-500/10"
                      : alert.type === "warning"
                        ? "border-amber-500/20 bg-amber-500/10"
                        : "border-sky-500/20 bg-sky-500/10"
                  }`}
                >
                  <p className="text-sm font-black">{alert.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{alert.text}</p>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)]">
            Generar informe mensual
          </button>
        </aside>
      </div>
    </section>
  );
}
