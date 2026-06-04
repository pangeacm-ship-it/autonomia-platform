import Link from "next/link";
import SubscriptionWarningBanner from "@/components/SubscriptionWarningBanner";
import VipAccessBanner from "@/components/VipAccessBanner";
import {
  getCurrentDashboardAccess,
  shouldShowSubscriptionWarning,
} from "@/lib/auth/access-control";
import { getCompanyCommercialAccess } from "@/lib/data/commercial-access";
import { getCurrentCompany } from "@/lib/data/companies";
import { getPlans } from "@/lib/data/plans";
import { getCurrentSubscription } from "@/lib/data/subscriptions";

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

const stats = [
  { label: "Publicaciones", value: "24", detail: "18 aprobadas · 6 pendientes", color: "text-emerald-300" },
  { label: "Reseñas", value: "14", detail: "Respondidas por IA", color: "text-violet-300" },
  { label: "Leads", value: "7", detail: "Este mes", color: "text-sky-300" },
  { label: "Reservas", value: "12", detail: "Últimos 30 días", color: "text-amber-300" },
];

const pendingTasks = [
  { title: "Publicación pendiente de aprobación", module: "SocialIA" },
  { title: "Nueva reseña para responder", module: "ReviewIA" },
  { title: "Lead pendiente de contactar", module: "LeadIA" },
];

const activity = [
  "SocialIA generó 3 publicaciones.",
  "ReviewIA preparó una respuesta para Google.",
  "LeadIA detectó un nuevo cliente potencial.",
  "InsightIA encontró una oportunidad de mejora.",
];

const activeModules = ["SocialIA", "Google Business", "ReviewIA", "LeadIA"];

export default async function DashboardPage() {
  const access = await getCurrentDashboardAccess();
  const company = await getCurrentCompany();
  const subscription = await getCurrentSubscription(company.id);
  const plans = await getPlans();
  const currentPlan = plans.find((plan) => plan.id === subscription?.plan_id);
  const commercialAccess = await getCompanyCommercialAccess({
    company,
    subscription,
    plan: currentPlan,
  });

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
        {stats.map((stat) => (
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
                {pendingTasks.length} pendientes
              </span>
            </div>

            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.title} className="rounded-2xl border border-white/10 bg-[#0b1024] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-bold">{task.title}</p>
                    <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                      {task.module}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Actividad IA reciente</h2>

            <div className="mt-6 space-y-3">
              {activity.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1024] p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
                    ✦
                  </span>
                  <p className="text-sm text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Módulos activos</h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {activeModules.map((module) => (
                <span key={module} className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300">
                  {module}
                </span>
              ))}
            </div>
          </div>
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
                : "Precio lanzamiento · 120€/mes"}
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
