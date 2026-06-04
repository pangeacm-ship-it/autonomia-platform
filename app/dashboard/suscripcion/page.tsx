import SubscriptionWarningBanner from "@/components/SubscriptionWarningBanner";
import { shouldShowSubscriptionWarning } from "@/lib/auth/access-control";
import { getCurrentCompany } from "@/lib/data/companies";
import { getCompanyModules, getModules } from "@/lib/data/modules";
import { getPlans } from "@/lib/data/plans";
import { getCurrentSubscription } from "@/lib/data/subscriptions";
import type { Plan, SubscriptionStatus } from "@/types/database";

const planCards = [
  {
    name: "Gratuito",
    badge: "Futuro",
    officialPrice: "0€",
    launchPrice: "0€",
    description:
      "Para probar AutonomIA con un uso muy limitado antes de contratar.",
    features: [
      "1 usuario",
      "2 publicaciones semanales",
      "Instagram + Facebook",
      "Centro IA limitado",
      "Publicación de apoyo semanal",
      "Sin ReviewIA, WhatsAppIA, LeadIA, ReservaIA ni InsightIA avanzado",
    ],
  },
  {
    name: "Inicio",
    badge: "Entrada",
    officialPrice: "89€",
    launchPrice: "79€",
    description:
      "Para negocios que quieren mantener actividad constante en redes sin complicarse.",
    features: [
      "1 usuario",
      "SocialIA",
      "Instagram + Facebook",
      "Calendario de publicaciones",
      "Aprobación previa",
      "Recordatorios básicos",
      "12 publicaciones mensuales",
    ],
  },
  {
    name: "Crecimiento",
    badge: "Plan actual",
    officialPrice: "120€",
    launchPrice: "100€",
    description:
      "Para negocios que quieren más presencia local y mejores recomendaciones.",
    features: [
      "2 usuarios",
      "Todo Inicio",
      "Google Business",
      "ReviewIA básico",
      "Informes básicos",
      "Recomendaciones IA",
      "Mejor seguimiento mensual",
    ],
    current: true,
    recommended: true,
  },
  {
    name: "Local IA 360",
    badge: "Premium",
    officialPrice: "180€",
    launchPrice: "150€",
    description:
      "Para negocios que quieren delegar más marketing y reputación online.",
    features: [
      "Hasta 5 usuarios",
      "Todo Crecimiento",
      "ReviewIA",
      "InsightIA",
      "Prioridad soporte",
      "Automatizaciones avanzadas",
      "Mayor acompañamiento",
    ],
  },
  {
    name: "Enterprise",
    badge: "A medida",
    description:
      "Para franquicias, cadenas y empresas con varios centros que necesitan una solución personalizada.",
    features: [
      "Multiempresa",
      "Multiubicación",
      "Usuarios personalizados",
      "Automatizaciones a medida",
      "Soporte prioritario",
    ],
    enterprise: true,
  },
];

function formatMonthlyPrice(plan: Plan) {
  if (plan.monthly_price_cents === null) {
    return "Consultar";
  }

  return `${Math.round(plan.monthly_price_cents / 100)}€`;
}

function getPlanKey(name: string) {
  const planKeys: Record<string, string> = {
    Gratuito: "gratuito",
    Inicio: "inicio",
    Crecimiento: "crecimiento",
    "Local IA 360": "local_ia_360",
    Enterprise: "enterprise",
  };

  return planKeys[name] ?? name.toLowerCase();
}

const fallbackActiveModules = [
  "SocialIA",
  "Instagram",
  "Facebook",
  "Google Business",
  "Calendario IA",
  "Informes IA",
];

const fallbackAvailableModules = [
  "ReviewIA",
  "WhatsAppIA",
  "ReservaIA",
  "LeadIA",
  "InsightIA",
  "TikTok & Shorts",
];

function getUserLimit(planKey: string | null | undefined) {
  if (planKey === "gratuito" || planKey === "inicio") return "1 usuario";
  if (planKey === "crecimiento") return "2 usuarios";
  if (planKey === "local_ia_360") return "Hasta 5 usuarios";
  if (planKey === "enterprise") return "Personalizado";
  return "2 usuarios";
}

function getStatusLabel(status: SubscriptionStatus | null | undefined) {
  const labels: Record<SubscriptionStatus, string> = {
    trial: "trial",
    active: "active",
    past_due: "past_due",
    suspended: "suspended",
    canceled: "canceled",
  };

  return status ? labels[status] : "active";
}

function getStatusClass(status: SubscriptionStatus | null | undefined) {
  if (status === "past_due" || status === "suspended") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-300";
  }

  if (status === "canceled") {
    return "border-rose-500/20 bg-rose-500/10 text-rose-300";
  }

  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
}

export default async function SuscripcionPage() {
  const [company, supabasePlans, allModules] = await Promise.all([
    getCurrentCompany(),
    getPlans(),
    getModules(),
  ]);
  const [subscription, companyModules] = await Promise.all([
    getCurrentSubscription(company.id),
    getCompanyModules(company.id),
  ]);
  const currentSupabasePlan = supabasePlans.find(
    (plan) => plan.id === subscription?.plan_id,
  );
  const currentPlanName = currentSupabasePlan?.name ?? "Crecimiento";
  const currentPrice =
    subscription?.monthly_price_cents !== null &&
    subscription?.monthly_price_cents !== undefined
      ? `${Math.round(subscription.monthly_price_cents / 100)}€/mes`
      : currentSupabasePlan
        ? `${formatMonthlyPrice(currentSupabasePlan)}/mes`
        : "100€/mes";
  const nextRenewal = subscription?.current_period_end
    ? new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(subscription.current_period_end))
    : "15 junio 2026";
  const currentPlanKey = currentSupabasePlan?.key ?? "crecimiento";
  const userLimit = getUserLimit(currentPlanKey);
  const subscriptionStatus = getStatusLabel(subscription?.status);
  const moduleById = new Map(allModules.map((module) => [module.id, module]));
  const activeModules = companyModules
    .filter((companyModule) => companyModule.status === "active")
    .map((companyModule) => moduleById.get(companyModule.module_id)?.name)
    .filter(Boolean) as string[];
  const activeModuleNames = activeModules.length ? activeModules : fallbackActiveModules;
  const availableModulesFromSupabase = allModules
    .filter((module) => !activeModuleNames.includes(module.name))
    .map((module) => module.name)
    .slice(0, 8);
  const availableModuleNames = availableModulesFromSupabase.length
    ? availableModulesFromSupabase
    : fallbackAvailableModules;
  const plans = planCards.map((plan) => {
    const supabasePlan = supabasePlans.find(
      (item) => item.key === getPlanKey(plan.name),
    );
    const launchPrice = supabasePlan ? formatMonthlyPrice(supabasePlan) : plan.launchPrice;

    return {
      ...plan,
      description: supabasePlan?.description ?? plan.description,
      launchPrice,
      current:
        supabasePlan?.id === subscription?.plan_id ||
        (!subscription && plan.current),
    };
  });

  return (
    <section className="p-6 lg:p-10">
      {shouldShowSubscriptionWarning(subscription?.status) ? (
        <SubscriptionWarningBanner />
      ) : null}

      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Suscripción
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Plan y servicios contratados
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
              Consulta tu plan actual, conserva tu tarifa de lanzamiento y amplía
              AutonomIA con nuevos módulos cuando tu negocio lo necesite.
        </p>
      </div>

      <div className="mb-8 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <h2 className="text-2xl font-black text-emerald-300">
              Oferta Fundadores activa
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {company.name} mantiene sus servicios preparados en modo demo o
              con datos de Supabase cuando la sesión esté disponible.
            </p>
          </div>

          <span className="rounded-full bg-emerald-500/20 px-5 py-3 text-sm font-black text-emerald-300">
            {subscriptionStatus}
          </span>
        </div>
      </div>

      <div className="mb-8 rounded-[2rem] border border-violet-400/25 bg-violet-500/10 p-6">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-200">
              Plan Gratuito
            </p>
            <h2 className="mt-3 text-2xl font-black">
              0€/mes con 2 publicaciones propias por semana
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
              Para renovar las publicaciones gratuitas de la semana siguiente,
              el cliente elige y publica una Publicación de apoyo semanal de
              AutonomIA. El superadmin puede eximir manualmente a clientes
              concretos de esta condición.
            </p>
          </div>

          <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-black text-violet-100">
            Sistema visual simulado
          </span>
        </div>
      </div>

      <div className="grid items-stretch gap-6 xl:grid-cols-2 2xl:grid-cols-5">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`flex h-full flex-col rounded-[2rem] border p-6 ${
              plan.current
                ? "border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_35px_rgba(16,185,129,0.16)]"
                : plan.enterprise
                  ? "border-sky-400/30 bg-sky-500/10"
                  : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <div className="mb-5 flex min-h-[44px] items-start justify-between gap-4">
              <h2 className="text-3xl font-black">{plan.name}</h2>

              <span
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-black ${
                  plan.current
                    ? "bg-emerald-500/20 text-emerald-300"
                    : plan.enterprise
                      ? "bg-sky-500/20 text-sky-300"
                      : "bg-violet-500/20 text-violet-300"
                }`}
              >
                {plan.badge}
              </span>
            </div>

            <p className="min-h-[96px] text-sm leading-6 text-slate-300">
              {plan.description}
            </p>

            <div className="mt-6 flex min-h-[245px] flex-col justify-between rounded-2xl border border-white/10 bg-black/20 p-5">
              {plan.enterprise ? (
                <>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">
                      Precio personalizado
                    </p>

                    <p className="mt-6 text-5xl font-black text-sky-300">
                      Consultar
                    </p>
                  </div>

                  <p className="mt-5 rounded-full bg-sky-500/15 px-3 py-2 text-xs font-bold text-sky-300">
                    Solución adaptada a cada empresa
                  </p>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Precio oficial
                    </p>

                    <p className="mt-2 text-2xl font-black text-slate-500 line-through decoration-red-400 decoration-2">
                      {plan.officialPrice}/mes
                    </p>

                    <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                      Precio lanzamiento
                    </p>

                    <div className="mt-1 flex items-end gap-2">
                      <p className="text-6xl font-black text-emerald-300">
                        {plan.launchPrice}
                      </p>

                      <p className="pb-3 text-lg font-bold text-slate-300">
                        /mes
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 rounded-full bg-emerald-500/15 px-3 py-2 text-xs font-bold text-emerald-300">
                    Tarifa fundador garantizada
                  </p>
                </>
              )}
            </div>

            <ul className="mt-6 min-h-[170px] space-y-3 text-sm text-slate-300">
              {plan.features.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>

            <button
              className={`mt-auto w-full rounded-2xl px-6 py-4 font-bold ${
                plan.current
                  ? "border border-white/10 text-white hover:bg-white/10"
                  : plan.enterprise
                    ? "bg-white text-slate-950 hover:bg-slate-200"
                    : "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_0_35px_rgba(124,58,237,0.25)] hover:opacity-90"
              }`}
            >
              {plan.current
                ? "Plan contratado"
                : plan.enterprise
                  ? "Solicitar propuesta"
                  : "Cambiar a este plan"}
            </button>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-black">Módulos activos</h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {activeModuleNames.map((module) => (
                <span
                  key={module}
                  className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300"
                >
                  {module}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-black">Módulos disponibles</h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {availableModuleNames.map((module) => (
                <span
                  key={module}
                  className="rounded-full bg-violet-500/20 px-4 py-2 text-sm font-bold text-violet-300"
                >
                  {module}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Próxima renovación</p>

            <h3 className="mt-2 text-3xl font-black">
              {nextRenewal}
            </h3>

            <p className="mt-3 text-sm text-emerald-300">
              {currentPlanName} · {currentPrice}
            </p>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
            <p className={`w-fit rounded-full border px-3 py-2 text-sm font-bold ${getStatusClass(subscription?.status)}`}>
              Estado: {subscriptionStatus}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Tu tarifa fundador se mantendrá mientras la suscripción esté
              activa. Plan actual: {currentPlanName} con límite de {userLimit}.
            </p>
          </div>

          <button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold">
            Ampliar plan
          </button>

          <button className="w-full rounded-2xl border border-white/10 px-6 py-4 font-bold hover:bg-white/10">
            Añadir módulo
          </button>

          <button className="w-full rounded-2xl border border-white/10 px-6 py-4 font-bold hover:bg-white/10">
            Solicitar asesoramiento
          </button>
        </aside>
      </div>
    </section>
  );
}
