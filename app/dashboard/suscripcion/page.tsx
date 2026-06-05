import CommercialPrice from "@/components/CommercialPrice";
import SubscriptionWarningBanner from "@/components/SubscriptionWarningBanner";
import VipAccessBanner from "@/components/VipAccessBanner";
import { shouldShowSubscriptionWarning } from "@/lib/auth/access-control";
import {
  commercialPlans,
  founderOffer,
  getCommercialPrice,
  normalizeCommercialPlanKey,
} from "@/lib/commercial-plans";
import { getCompanyCommercialAccess } from "@/lib/data/commercial-access";
import { getCurrentCompany } from "@/lib/data/companies";
import { getCompanyModules, getModules } from "@/lib/data/modules";
import { getPlans } from "@/lib/data/plans";
import { getCurrentSubscription } from "@/lib/data/subscriptions";
import type { SubscriptionStatus } from "@/types/database";

function getPlanKey(name: string) {
  const planKeys: Record<string, string> = {
    Gratuito: "gratuito",
    Inicio: "inicio",
    Crecimiento: "crecimiento",
    "Local IA": "local_ia_360",
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
  const commercialAccess = await getCompanyCommercialAccess({
    company,
    subscription,
    plan: currentSupabasePlan,
  });
  const currentPlanName = currentSupabasePlan?.name ?? "Crecimiento";
  const nextRenewal = subscription?.current_period_end
    ? new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(subscription.current_period_end))
    : "15 junio 2026";
  const currentPlanKey = currentSupabasePlan?.key ?? "crecimiento";
  const currentCommercialPrice = getCommercialPrice(currentPlanKey);
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
  const plans = commercialPlans
    .filter((plan) => !commercialAccess.isGifted || plan.name !== "Gratuito")
    .map((plan) => {
    const supabasePlan = supabasePlans.find(
      (item) => item.key === getPlanKey(plan.name),
    );

    return {
      ...plan,
      description: supabasePlan?.description ?? plan.description,
      current:
        normalizeCommercialPlanKey(supabasePlan?.key ?? plan.key) ===
          normalizeCommercialPlanKey(currentPlanKey) ||
        (!subscription && plan.key === "crecimiento"),
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
              {founderOffer.isActive ? "Oferta Fundadores activa" : "Planes mensuales activos"}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              {commercialAccess.isGifted
                ? `${company.name} mantiene acceso profesional concedido por AutonomIA mientras esta condición permanezca activa.`
                : `${company.name} mantiene sus servicios preparados en modo demo o con datos de Supabase cuando la sesión esté disponible.`}
            </p>
          </div>

          <span className="rounded-full bg-emerald-500/20 px-5 py-3 text-sm font-black text-emerald-300">
            {subscriptionStatus}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <VipAccessBanner access={commercialAccess} />
      </div>

      {!commercialAccess.isGifted ? (
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
      ) : null}

      <div className="mb-8 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
        <h2 className="text-xl font-black text-emerald-300">
          Regla de precio lanzamiento
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Si contratas durante el lanzamiento, mantienes el precio promocional
          mientras sigas en el mismo plan o subas a uno superior. Si bajas de
          modalidad, se pierde la tarifa de lanzamiento y se aplica el precio
          normal vigente.
        </p>
      </div>

      <div className="grid items-stretch gap-6 xl:grid-cols-2 2xl:grid-cols-4">
        {plans.map((plan) => {
          const isLocalIa = plan.key === "local-ia";

          return (
          <article
            key={plan.name}
            className={`flex h-full min-h-[720px] flex-col rounded-[2rem] border p-6 ${
              isLocalIa
                ? "border-blue-200 bg-gradient-to-b from-blue-50 via-white to-violet-50 shadow-[0_28px_80px_rgba(37,99,235,0.14)]"
                : plan.current
                  ? "border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_35px_rgba(16,185,129,0.16)]"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <div className="mb-5 flex min-h-[78px] flex-col justify-between gap-3">
              <h2 className={`text-3xl font-black ${isLocalIa ? "text-slate-950" : ""}`}>
                {plan.name}
              </h2>

              <span
                className={`w-fit shrink-0 rounded-full px-3 py-2 text-xs font-black ${
                  isLocalIa
                    ? "bg-slate-950 text-white"
                    : plan.current
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-violet-500/20 text-violet-300"
                }`}
              >
                {isLocalIa ? "🏆 Experiencia AutonomIA Completa" : plan.current ? "Plan actual" : plan.label}
              </span>
            </div>

            <p className={`min-h-[118px] text-sm leading-6 ${isLocalIa ? "text-slate-600" : "text-slate-300"}`}>
              {plan.description}
            </p>

            <div
              className={`mt-6 flex h-[298px] flex-col justify-between rounded-2xl border p-5 ${
                isLocalIa
                  ? "border-blue-100 bg-white/80"
                  : "border-white/10 bg-black/20"
              }`}
            >
              <CommercialPrice planKey={plan.key} size="lg" />
            </div>

            <ul className={`mt-6 min-h-[170px] space-y-3 text-sm ${isLocalIa ? "text-slate-700" : "text-slate-300"}`}>
              {plan.features.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>

            <button
              className={`mt-auto w-full rounded-2xl px-6 py-4 font-bold ${
                plan.current
                ? "border border-white/10 text-white hover:bg-white/10"
                  : "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_0_35px_rgba(124,58,237,0.25)] hover:opacity-90"
              }`}
            >
              {plan.current
                ? "Plan contratado"
                : "Cambiar a este plan"}
            </button>
          </article>
          );
        })}
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
              {currentPlanName} · {currentCommercialPrice.monthlyLabel}
            </p>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
            <p className={`w-fit rounded-full border px-3 py-2 text-sm font-bold ${getStatusClass(subscription?.status)}`}>
              Estado: {subscriptionStatus}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              {commercialAccess.isGifted
                ? `Estás utilizando una versión profesional con ${commercialAccess.label.toLowerCase()} especial. Plan actual: ${currentPlanName} con límite de ${userLimit}.`
                : `Tu precio de lanzamiento se mantendrá mientras sigas en el mismo plan o subas a uno superior. Plan actual: ${currentPlanName} con límite de ${userLimit}.`}
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
