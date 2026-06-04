import AccessDeniedCard from "@/components/AccessDeniedCard";
import { getDashboardRouteAccess } from "@/lib/auth/access-control";

const stats = [
  { label: "Leads nuevos", value: "14", detail: "Este mes", color: "text-pink-300" },
  { label: "En seguimiento", value: "8", detail: "Pendientes de cierre", color: "text-amber-300" },
  { label: "Convertidos", value: "5", detail: "Reservas o clientes", color: "text-emerald-300" },
  { label: "Conversión", value: "36%", detail: "+12% vs mes anterior", color: "text-sky-300" },
];

const pipeline = [
  { stage: "Nuevo", count: 14, color: "bg-pink-500" },
  { stage: "Contactado", count: 9, color: "bg-sky-500" },
  { stage: "Seguimiento", count: 8, color: "bg-amber-500" },
  { stage: "Convertido", count: 5, color: "bg-emerald-500" },
];

const leads = [
  {
    name: "Laura Martín",
    source: "Instagram",
    interest: "Quiere información sobre reservas para grupo",
    status: "Nuevo",
    time: "Hace 12 min",
    priority: "Alta",
  },
  {
    name: "Pedro Sánchez",
    source: "Formulario web",
    interest: "Solicita presupuesto para evento privado",
    status: "En seguimiento",
    time: "Hace 2 horas",
    priority: "Media",
  },
  {
    name: "Carmen Díaz",
    source: "Google Business",
    interest: "Pregunta por horarios y disponibilidad",
    status: "Convertido",
    time: "Ayer",
    priority: "Cerrado",
  },
];

const followUps = [
  "Llamar a Laura para confirmar número de personas.",
  "Enviar propuesta a Pedro para evento privado.",
  "Revisar leads sin respuesta de Instagram.",
];

const channels = [
  { name: "Instagram", leads: 6 },
  { name: "WhatsApp", leads: 4 },
  { name: "Google Business", leads: 3 },
  { name: "Web", leads: 1 },
];

export default async function LeadIAPage() {
  const access = await getDashboardRouteAccess("/dashboard/leadia");

  if (!access.allowed) {
    return (
      <AccessDeniedCard
        title="LeadIA no está disponible en tu plan"
        reason={access.reason ?? "Este módulo requiere ampliar el plan."}
        planName={access.plan?.name}
      />
    );
  }

  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-pink-600/20 via-violet-600/20 to-blue-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-pink-200">
          LeadIA
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Captación inteligente de clientes
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Detecta oportunidades, clasifica contactos, sugiere seguimientos y
          convierte conversaciones en reservas o clientes.
        </p>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-4xl font-black">{stat.value}</p>
            <p className={`mt-3 text-sm ${stat.color}`}>{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Pipeline comercial</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {pipeline.map((item) => (
                <div
                  key={item.stage}
                  className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
                >
                  <div className={`mb-4 h-2 rounded-full ${item.color}`} />
                  <p className="text-sm text-slate-400">{item.stage}</p>
                  <p className="mt-2 text-3xl font-black">{item.count}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black">Leads recientes</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Contactos interesados detectados por AutonomIA.
                </p>
              </div>

              <span className="rounded-full bg-pink-500/20 px-4 py-2 text-sm font-bold text-pink-300">
                {leads.length} oportunidades
              </span>
            </div>

            <div className="space-y-4">
              {leads.map((lead) => (
                <article
                  key={`${lead.name}-${lead.source}`}
                  className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black">{lead.name}</h3>

                        <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                          {lead.source}
                        </span>

                        <span className="text-xs text-slate-500">{lead.time}</span>
                      </div>

                      <p className="mt-4 leading-7 text-slate-300">
                        {lead.interest}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          lead.priority === "Alta"
                            ? "bg-red-500/20 text-red-300"
                            : lead.priority === "Media"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-emerald-500/20 text-emerald-300"
                        }`}
                      >
                        {lead.priority}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          lead.status === "Convertido"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : lead.status === "En seguimiento"
                              ? "bg-amber-500/20 text-amber-300"
                              : "bg-pink-500/20 text-pink-300"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-pink-400/20 bg-pink-500/10 p-4">
                    <p className="text-sm font-black text-pink-300">
                      Acción sugerida por IA
                    </p>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Contactar con {lead.name.split(" ")[0]} y responder con
                      información clara, disponibilidad y llamada a reserva o
                      contacto directo.
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-500/30">
                      Marcar contactado
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                      Crear seguimiento
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                      Convertir en reserva
                    </button>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                      Ver detalle
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-pink-500/20 bg-pink-500/10 p-6">
            <h3 className="text-xl font-black text-pink-300">
              Próximos seguimientos
            </h3>

            <div className="mt-5 space-y-3">
              {followUps.map((item) => (
                <div key={item} className="rounded-2xl bg-black/20 p-4 text-sm leading-6 text-slate-300">
                  ✦ {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">Origen de leads</h3>

            <div className="mt-5 space-y-3">
              {channels.map((channel) => (
                <div
                  key={channel.name}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <p className="font-bold">{channel.name}</p>
                  <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-300">
                    {channel.leads}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-violet-400/20 bg-violet-500/10 p-6">
            <h3 className="text-xl font-black">Recomendación IA</h3>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Instagram está generando más oportunidades que el resto de canales.
              Recomendamos lanzar una promoción específica esta semana para
              convertir más contactos en reservas.
            </p>
          </div>

          <button className="w-full rounded-2xl bg-gradient-to-r from-pink-600 to-violet-600 px-6 py-4 font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)]">
            Crear campaña de captación
          </button>
        </aside>
      </div>
    </section>
  );
}
