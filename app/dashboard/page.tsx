import Link from "next/link";
import SubscriptionWarningBanner from "@/components/SubscriptionWarningBanner";
import VipAccessBanner from "@/components/VipAccessBanner";
import {
  getCurrentDashboardAccess,
  shouldShowSubscriptionWarning,
} from "@/lib/auth/access-control";
import { getCommercialPrice } from "@/lib/commercial-plans";
import { getCompanyCommercialAccess } from "@/lib/data/commercial-access";
import { getCurrentCompany } from "@/lib/data/companies";
import { getDashboardStats } from "@/lib/data/dashboard-stats";
import { getPlans } from "@/lib/data/plans";
import { getCurrentSubscription } from "@/lib/data/subscriptions";

// Datos estáticos de navegación
const quickAccess = [
  {
    title: "Centro IA",
    detail: "Crear contenido y campañas",
    href: "/dashboard/centro-ia",
    icon: "🤖",
  },
  {
    title: "SocialIA",
    detail: "Publicaciones pendientes",
    href: "/dashboard/socialia",
    icon: "📝",
  },
  {
    title: "ReviewIA",
    detail: "Reseñas por responder",
    href: "/dashboard/reviewia",
    icon: "⭐",
  },
  {
    title: "LeadIA",
    detail: "Oportunidades nuevas",
    href: "/dashboard/leadia",
    icon: "🎯",
  },
  {
    title: "ReservaIA",
    detail: "Reservas próximas",
    href: "/dashboard/reservaia",
    icon: "📅",
  },
];


export default async function DashboardPage() {
  const [access, company] = await Promise.all([
    getCurrentDashboardAccess(),
    getCurrentCompany(),
  ]);
  const [subscription, plans, stats] = await Promise.all([
    getCurrentSubscription(company.id),
    getPlans(),
    getDashboardStats(company.id),
  ]);
  const currentPlan = plans.find((plan) => plan.id === subscription?.plan_id);
  const currentCommercialPrice = getCommercialPrice(currentPlan?.key ?? "crecimiento");
  const commercialAccess = await getCompanyCommercialAccess({
    company,
    subscription,
    plan: currentPlan,
  });

  const statCards = [
    {
      label: "Publicaciones",
      value: String(stats.posts.total),
      detail: stats.posts.pending > 0
        ? `${stats.posts.pending} pendiente${stats.posts.pending !== 1 ? "s" : ""} de aprobación`
        : stats.posts.scheduled > 0
          ? `${stats.posts.scheduled} programada${stats.posts.scheduled !== 1 ? "s" : ""}`
          : "Sin actividad reciente",
      color: "text-emerald-300",
    },
    {
      label: "Tareas",
      value: String(stats.tasks.pending + stats.tasks.inProgress),
      detail: stats.tasks.inProgress > 0
        ? `${stats.tasks.inProgress} en curso`
        : "Sin tareas activas",
      color: "text-violet-300",
    },
    {
      label: "Notificaciones",
      value: String(stats.notifications.unread),
      detail: stats.notifications.unread > 0 ? "Sin leer" : "Todo al día",
      color: "text-sky-300",
    },
    {
      label: "Módulos activos",
      value: String(stats.modules.active.length || "—"),
      detail: stats.modules.active.length > 0
        ? stats.modules.active.slice(0, 2).join(" · ")
        : "Sin módulos activos",
      color: "text-amber-300",
    },
  ];

  return (
    <section className="p-4 sm:p-6 lg:p-10">
      {shouldShowSubscriptionWarning(access.subscriptionStatus) ? (
        <SubscriptionWarningBanner />
      ) : null}

      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-6 lg:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Dashboard
        </p>

        <div className="mt-5 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">Bienvenido a AutonomIA 🚀</h1>

            <p className="mt-4 max-w-3xl text-slate-300">
              Revisa actividad, publicaciones, reseñas, oportunidades y reservas
              desde un único centro de control.
            </p>
          </div>

          <Link
            href="/dashboard/centro-ia"
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-center font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)]"
          >
            Abrir Centro IA
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {quickAccess.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-violet-400/40 hover:bg-white/[0.07]"
          >
            <div className="text-3xl">{item.icon}</div>
            <h3 className="mt-4 font-black">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{item.detail}</p>
          </Link>
        ))}
      </div>

      {commercialAccess.isGifted ? (
        <div className="mb-8">
          <VipAccessBanner access={commercialAccess} compact />
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-black sm:text-4xl">{stat.value}</p>
            <p className={`mt-3 text-sm ${stat.color}`}>{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black">Pendiente de revisión</h2>
              <span className="rounded-full bg-amber-500/20 px-4 py-2 text-sm font-bold text-amber-300">
                {stats.posts.pending + stats.tasks.pending} pendientes
              </span>
            </div>

            <div className="space-y-4">
              {stats.posts.pending > 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#0b1024] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-bold">
                      {stats.posts.pending} publicación{stats.posts.pending !== 1 ? "es" : ""} pendiente{stats.posts.pending !== 1 ? "s" : ""} de aprobación
                    </p>
                    <Link href="/dashboard/socialia" className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                      SocialIA
                    </Link>
                  </div>
                </div>
              ) : null}
              {stats.tasks.pending > 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#0b1024] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-bold">
                      {stats.tasks.pending} tarea{stats.tasks.pending !== 1 ? "s" : ""} pendiente{stats.tasks.pending !== 1 ? "s" : ""}
                    </p>
                    <Link href="/dashboard/tareas" className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                      Tareas
                    </Link>
                  </div>
                </div>
              ) : null}
              {stats.posts.pending === 0 && stats.tasks.pending === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-[#0b1024] p-4 text-sm text-slate-400">
                  Todo al día. No hay pendientes ahora mismo.
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Actividad reciente</h2>

            <div className="mt-6 space-y-3">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1024] p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                      ✦
                    </span>
                    <div>
                      <p className="text-sm text-slate-300">{item.title}</p>
                      {item.module ? (
                        <p className="mt-1 text-xs text-slate-500">{item.module}</p>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-white/10 bg-[#0b1024] p-4 text-sm text-slate-400">
                  Aún no hay actividad registrada. Empieza creando una publicación.
                </p>
              )}
            </div>
          </div>

          {stats.modules.active.length > 0 ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-black">Módulos activos</h2>

              <div className="mt-6 flex flex-wrap gap-3">
                {stats.modules.active.map((module) => (
                  <span key={module} className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300">
                    {module}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-violet-400/30 bg-violet-500/10 p-6">
            <p className="text-sm text-violet-200">Plan actual</p>
            <h3 className="mt-2 text-3xl font-black">
              {commercialAccess.planDisplayName}
            </h3>
            <p className="mt-3 text-sm text-emerald-300">
              {commercialAccess.isGifted
                ? `${commercialAccess.label} · precio oficial ${commercialAccess.officialPrice}`
                : `${currentCommercialPrice.priceTypeLabel} · ${currentCommercialPrice.monthlyLabel}`}
            </p>
          </div>

          <div className="rounded-[2rem] border border-amber-400/20 bg-amber-500/10 p-6">
            <h3 className="text-xl font-black">Recomendación IA</h3>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Conecta Google Business para mejorar tu visibilidad local y
              permitir que ReviewIA gestione automáticamente las reseñas.
            </p>

            <Link
              href="/dashboard/google-business"
              className="mt-5 block rounded-xl bg-white px-4 py-3 text-center font-bold text-slate-950 hover:bg-slate-200"
            >
              Ver recomendación
            </Link>
          </div>

          <div className="rounded-[2rem] border border-emerald-400/20 bg-emerald-500/10 p-6">
            <h3 className="text-xl font-black">Estado IA</h3>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Todos los sistemas están operativos y preparados para generar
              contenido, responder reseñas y detectar oportunidades.
            </p>

            <div className="mt-5 rounded-xl bg-emerald-500/20 p-3 text-center text-sm font-bold text-emerald-300">
              IA Activa
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
