import Link from "next/link";
import ActionCards from "@/components/centroia/ActionCards";
import ChatPanel from "@/components/centroia/ChatPanel";
import ConversationSidebar from "@/components/centroia/ConversationSidebar";
import {
  businessInsights,
  conversations,
  initialMessages,
  modules,
  pendingActions,
  quickPrompts,
} from "@/components/centroia/data";

const dailySummary = [
  {
    label: "Publicaciones pendientes",
    value: "2",
    href: "/dashboard/socialia",
  },
  {
    label: "Reseñas por responder",
    value: "1",
    href: "/dashboard/reviewia",
  },
  {
    label: "Leads sin contactar",
    value: "3",
    href: "/dashboard/leadia",
  },
  {
    label: "Reservas pendientes",
    value: "1",
    href: "/dashboard/reservaia",
  },
];

const priorityActions = [
  {
    title: "Aprobar publicación de Instagram",
    module: "SocialIA",
    text: "SocialIA ha generado una publicación para el menú del día.",
    href: "/dashboard/socialia",
  },
  {
    title: "Responder reseña negativa",
    module: "ReviewIA",
    text: "ReviewIA recomienda responder hoy para proteger la reputación.",
    href: "/dashboard/reviewia",
  },
  {
    title: "Contactar lead pendiente",
    module: "LeadIA",
    text: "Hay un contacto interesado sin seguimiento desde hace 2 días.",
    href: "/dashboard/leadia",
  },
];

const businessHealth = [
  {
    label: "Marketing",
    value: "78%",
  },
  {
    label: "Reputación",
    value: "92%",
  },
  {
    label: "Captación",
    value: "61%",
  },
  {
    label: "Automatización",
    value: "45%",
  },
];

const elenaConversations = [
  {
    title: "Plan semanal de publicaciones",
    type: "Elena Cliente",
    status: "Abierta",
  },
  {
    title: "Recomendación para reseñas",
    type: "Elena Proactiva",
    status: "Pendiente",
  },
  {
    title: "Objetivos de junio",
    type: "Elena Coach",
    status: "En seguimiento",
  },
];

const elenaRecommendations = [
  "Activar recordatorio de reseñas los lunes por la mañana.",
  "Preparar una campaña de fin de semana para reservas.",
  "Mantener tono cercano, directo y local en publicaciones.",
];

const elenaReminders = [
  {
    type: "publication_reminder",
    text: "Aprobar 2 publicaciones para Instagram y Facebook.",
  },
  {
    type: "review_reminder",
    text: "Responder la reseña pendiente antes de cerrar el día.",
  },
  {
    type: "lead_followup",
    text: "Contactar los leads sin seguimiento de las últimas 48 horas.",
  },
  {
    type: "seasonal_suggestion",
    text: "Preparar una propuesta de verano para clientes recurrentes.",
  },
];

const elenaObjectives = [
  "Publicar con constancia cada semana.",
  "Mejorar reputación online.",
  "Convertir más consultas en reservas.",
  "Reducir tareas manuales repetitivas.",
];

export default function CentroIAPage() {
  return (
    <section className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-6 lg:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Centro IA
        </p>

        <div className="mt-5 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">
              Buenos días, Juanma 👋
            </h1>

            <p className="mt-4 max-w-3xl text-slate-300">
              He analizado la actividad de Bar La Plaza y tengo varias acciones
              recomendadas para mejorar publicaciones, reseñas, leads y
              reservas.
            </p>
          </div>

          <Link
            href="/dashboard/notificaciones"
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-center font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)]"
          >
            Ver notificaciones
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dailySummary.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-violet-400/40 hover:bg-white/[0.07]"
          >
            <p className="text-sm text-slate-400">{item.label}</p>

            <p className="mt-2 text-3xl font-black sm:text-4xl">{item.value}</p>

            <p className="mt-3 text-sm font-bold text-violet-300">
              Revisar ahora
            </p>
          </Link>
        ))}
      </div>

      <div className="mb-8 rounded-[2rem] border border-amber-400/20 bg-amber-500/10 p-6">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <h2 className="text-2xl font-black">
              Acciones prioritarias para hoy
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              AutonomIA ha detectado tareas que pueden mejorar la actividad del
              negocio si se revisan durante el día.
            </p>
          </div>

          <span className="rounded-full bg-amber-500/20 px-5 py-3 text-sm font-black text-amber-300">
            {priorityActions.length} acciones
          </span>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {priorityActions.map((action) => (
            <article
              key={action.title}
              className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                  {action.module}
                </span>

                <span className="text-xs text-amber-300">Prioridad</span>
              </div>

              <h3 className="text-lg font-black">{action.title}</h3>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                {action.text}
              </p>

              <Link
                href={action.href}
                className="mt-5 block rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-bold hover:bg-white/10"
              >
                Abrir módulo
              </Link>
            </article>
          ))}
        </div>
      </div>

      <section className="mb-8 rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
              Elena IA
            </p>
            <h2 className="mt-3 text-3xl font-black">
              Asistente inteligente de AutonomIA
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
              Elena ayuda a priorizar conversaciones, recomendaciones,
              recordatorios y objetivos del negocio. Esta sección está preparada
              con datos simulados para futura conexión IA.
            </p>
          </div>
          <span className="w-fit rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-100">
            Sin conexión OpenAI todavía
          </span>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-4">
          <article className="rounded-3xl border border-white/10 bg-[#0b1024] p-5 xl:col-span-1">
            <h3 className="text-xl font-black">Conversaciones</h3>
            <div className="mt-4 space-y-3">
              {elenaConversations.map((conversation) => (
                <div
                  key={conversation.title}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <p className="font-bold">{conversation.title}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {conversation.type} · {conversation.status}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#0b1024] p-5 xl:col-span-1">
            <h3 className="text-xl font-black">Recomendaciones</h3>
            <div className="mt-4 space-y-3">
              {elenaRecommendations.map((recommendation) => (
                <p
                  key={recommendation}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300"
                >
                  {recommendation}
                </p>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#0b1024] p-5 xl:col-span-1">
            <h3 className="text-xl font-black">Recordatorios</h3>
            <div className="mt-4 space-y-3">
              {elenaReminders.map((reminder) => (
                <div
                  key={reminder.type}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-300">
                    {reminder.type}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {reminder.text}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#0b1024] p-5 xl:col-span-1">
            <h3 className="text-xl font-black">Objetivos</h3>
            <div className="mt-4 space-y-3">
              {elenaObjectives.map((objective) => (
                <div
                  key={objective}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm font-bold text-slate-200"
                >
                  {objective}
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <div className="grid gap-6 xl:min-h-[740px] xl:grid-cols-[300px_1fr_360px]">
        <ConversationSidebar conversations={conversations} />

        <div className="space-y-6">
          <ChatPanel messages={initialMessages} quickPrompts={quickPrompts} />

          <ActionCards />
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6">
            <h3 className="text-xl font-black text-cyan-300">
              Recomendación IA del día
            </h3>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Las publicaciones con fotos reales de comida funcionan mejor entre
              jueves y domingo. Programa contenido para esos días y refuerza la
              promoción de reservas de fin de semana.
            </p>

            <Link
              href="/dashboard/socialia"
              className="mt-5 block rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-slate-950 hover:bg-slate-200"
            >
              Crear publicación
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">Estado general</h3>

            <div className="mt-6 space-y-5">
              {businessHealth.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="font-bold text-emerald-300">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-white/10">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                      style={{ width: item.value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">Acciones rápidas</h3>

            <div className="mt-5 space-y-3">
              {quickPrompts.slice(0, 6).map((prompt) => (
                <button
                  key={prompt}
                  className="w-full rounded-2xl border border-white/10 bg-[#0b1024] p-4 text-left text-sm font-bold text-slate-300 hover:bg-white/10"
                >
                  ✦ {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-400/20 bg-amber-500/10 p-6">
            <h3 className="text-xl font-black">Pendiente de aprobación</h3>

            <div className="mt-5 space-y-3">
              {pendingActions.map((item) => (
                <div key={item.title} className="rounded-2xl bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-amber-100">
                      {item.title}
                    </p>

                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-black text-amber-300">
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">{item.module}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6">
            <h3 className="text-xl font-black text-cyan-300">
              Resumen inteligente
            </h3>

            <div className="mt-5 space-y-3">
              {businessInsights.map((item) => (
                <p
                  key={item}
                  className="rounded-2xl bg-black/20 p-4 text-sm leading-6 text-slate-300"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-violet-400/30 bg-violet-500/10 p-6">
            <h3 className="text-xl font-black">Módulos conectados</h3>

            <div className="mt-5 flex flex-wrap gap-2">
              {modules.map((module) => (
                <span
                  key={module}
                  className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-slate-300"
                >
                  {module}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
