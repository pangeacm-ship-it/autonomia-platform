import Link from "next/link";
import SubscriptionWarningBanner from "@/components/SubscriptionWarningBanner";
import VipAccessBanner from "@/components/VipAccessBanner";
import { shouldShowSubscriptionWarning } from "@/lib/auth/access-control";
import {
  getCommercialPlan,
  getCommercialPrice,
  normalizeCommercialPlanKey,
} from "@/lib/commercial-plans";
import { getCompanyCommercialAccess } from "@/lib/data/commercial-access";
import { getCurrentCompany } from "@/lib/data/companies";
import { getPlans } from "@/lib/data/plans";
import { getCurrentSubscription } from "@/lib/data/subscriptions";

type ToolDefinition = {
  key: string;
  name: string;
  description: string;
  href: string;
  minimumPlan: "gratuito" | "inicio" | "crecimiento" | "local-ia";
};

const planOrder = ["gratuito", "inicio", "crecimiento", "local-ia"] as const;

const tools: ToolDefinition[] = [
  {
    key: "socialia",
    name: "SocialIA",
    description: "Crea, revisa y programa contenido para tus redes.",
    href: "/dashboard/socialia",
    minimumPlan: "gratuito",
  },
  {
    key: "calendario",
    name: "Calendario Inteligente",
    description: "Centraliza publicaciones, tareas, citas y recomendaciones.",
    href: "/dashboard/calendario",
    minimumPlan: "gratuito",
  },
  {
    key: "elena_ia",
    name: "Elena IA",
    description: "Recibe orientación y recomendaciones adaptadas a tu negocio.",
    href: "/dashboard/centro-ia",
    minimumPlan: "gratuito",
  },
  {
    key: "google_business",
    name: "Google Business",
    description: "Mejora la presencia local y la actividad de tu ficha.",
    href: "/dashboard/google-business",
    minimumPlan: "crecimiento",
  },
  {
    key: "reviewia",
    name: "ReviewIA",
    description: "Prepara respuestas profesionales para cuidar tu reputación.",
    href: "/dashboard/reviewia",
    minimumPlan: "crecimiento",
  },
  {
    key: "insightia",
    name: "InsightIA",
    description: "Convierte actividad y métricas en decisiones más claras.",
    href: "/dashboard/insightia",
    minimumPlan: "crecimiento",
  },
  {
    key: "whatsappia",
    name: "WhatsApp Business",
    description: "Prepara una atención más ágil y automatizada por WhatsApp.",
    href: "/dashboard/whatsappia",
    minimumPlan: "local-ia",
  },
  {
    key: "tiktok_shorts",
    name: "TikTok & Shorts",
    description: "Organiza ideas y contenido para formatos de vídeo corto.",
    href: "/dashboard/tiktok-shorts",
    minimumPlan: "local-ia",
  },
  {
    key: "elena_ia_avanzada",
    name: "Elena IA avanzada",
    description: "Amplía recomendaciones, memoria y automatizaciones inteligentes.",
    href: "/dashboard/centro-ia",
    minimumPlan: "local-ia",
  },
];

const planSteps = [
  {
    key: "gratuito",
    name: "Gratuito",
    label: "Primer contacto",
    tools: ["SocialIA básico", "Calendario básico", "Elena IA básica"],
  },
  {
    key: "inicio",
    name: "Inicio",
    label: "Todo lo anterior +",
    tools: ["SocialIA completo", "Calendario Inteligente", "Elena IA básica"],
  },
  {
    key: "crecimiento",
    name: "Crecimiento",
    label: "Todo lo anterior +",
    tools: ["Google Business", "ReviewIA", "InsightIA"],
  },
  {
    key: "local-ia",
    name: "🏆 Local IA",
    label: "Todo lo anterior +",
    tools: [
      "WhatsApp Business",
      "TikTok & Shorts",
      "Elena IA avanzada",
      "Automatizaciones avanzadas",
    ],
  },
] as const;

function planAllowsTool(currentPlanKey: string, minimumPlan: ToolDefinition["minimumPlan"]) {
  return (
    planOrder.indexOf(currentPlanKey as (typeof planOrder)[number]) >=
    planOrder.indexOf(minimumPlan)
  );
}

function planAvailabilityLabel(minimumPlan: ToolDefinition["minimumPlan"]) {
  if (minimumPlan === "crecimiento") {
    return "Disponible en Crecimiento o superior";
  }

  if (minimumPlan === "local-ia") {
    return "Disponible en Local IA";
  }

  return "Incluido según plan";
}

export default async function ModulosPage() {
  const [company, plans] = await Promise.all([
    getCurrentCompany(),
    getPlans(),
  ]);
  const subscription = await getCurrentSubscription(company.id);
  const currentPlan = plans.find((plan) => plan.id === subscription?.plan_id);
  const currentPlanKey = normalizeCommercialPlanKey(
    currentPlan?.key ?? "crecimiento",
  );
  const currentCommercialPlan = getCommercialPlan(currentPlanKey);
  const currentCommercialPrice = getCommercialPrice(currentPlanKey);
  const commercialAccess = await getCompanyCommercialAccess({
    company,
    subscription,
    plan: currentPlan,
  });
  const includedTools = tools.filter((tool) =>
    planAllowsTool(currentPlanKey, tool.minimumPlan),
  );
  const upgradeTools = tools.filter(
    (tool) =>
      !includedTools.some((included) => included.key === tool.key) &&
      !planAllowsTool(currentPlanKey, tool.minimumPlan),
  );
  const isLocalIa = currentPlanKey === "local-ia";

  return (
    <section className="p-4 sm:p-6 lg:p-10">
      {shouldShowSubscriptionWarning(subscription?.status) ? (
        <SubscriptionWarningBanner />
      ) : null}

      <header className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-6 lg:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Planes y herramientas
        </p>
        <h1 className="mt-4 text-3xl font-black sm:text-4xl">
          Cada plan desbloquea nuevas herramientas
        </h1>
        <p className="mt-4 max-w-3xl text-slate-300">
          Consulta qué incluye tu plan actual y qué capacidades puedes
          desbloquear cuando tu negocio necesite dar el siguiente paso.
        </p>
      </header>

      <section className="rounded-[2rem] border border-emerald-400/30 bg-gradient-to-br from-emerald-500/15 via-white/[0.05] to-violet-500/10 p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
              Tu plan actual
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h2 className="text-4xl font-black uppercase">
                {currentCommercialPlan.name}
              </h2>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/20 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-200">
                Activo
              </span>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              {currentCommercialPlan.description}
            </p>
            <p className="mt-3 text-sm font-bold text-emerald-300">
              {commercialAccess.isGifted
                ? `${commercialAccess.label} activo · Precio oficial ${commercialAccess.officialPrice}`
                : `${currentCommercialPrice.priceTypeLabel} · ${currentCommercialPrice.monthlyLabel}`}
            </p>
          </div>

          <Link
            href="/dashboard/suscripcion"
            className="w-fit rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 hover:bg-slate-200"
          >
            Ver suscripción
          </Link>
        </div>
      </section>

      <div className="mt-6">
        <VipAccessBanner access={commercialAccess} />
      </div>

      <section className="mt-10">
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
            Incluido ahora
          </p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">
            Herramientas incluidas en tu plan
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {includedTools.map((tool) => (
            <article
              key={tool.key}
              className="flex h-full flex-col rounded-[2rem] border border-emerald-400/20 bg-emerald-500/10 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-black">{tool.name}</h3>
                <span className="shrink-0 rounded-full bg-emerald-500/20 px-3 py-2 text-xs font-black text-emerald-200">
                  ✓ Incluido
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                {tool.description}
              </p>
              <Link
                href={tool.href}
                className="mt-6 block rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-bold hover:bg-white/10"
              >
                Abrir herramienta
              </Link>
            </article>
          ))}
        </div>
      </section>

      {!isLocalIa && upgradeTools.length ? (
        <section className="mt-10 rounded-[2rem] border border-violet-400/25 bg-violet-500/10 p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">
                Siguiente nivel
              </p>
              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Herramientas disponibles al actualizar
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                Actualiza tu plan para desbloquear más funcionalidades. No
                necesitas contratar herramientas por separado.
              </p>
            </div>
            <Link
              href="/dashboard/suscripcion"
              className="w-fit rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 text-sm font-black text-white shadow-[0_14px_40px_rgba(124,58,237,0.25)]"
            >
              Ver ventajas de Local IA
            </Link>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {upgradeTools.map((tool) => (
              <article
                key={tool.key}
                className="rounded-3xl border border-white/10 bg-black/20 p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">🔒</span>
                  <div>
                    <h3 className="text-xl font-black">{tool.name}</h3>
                    <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-violet-300">
                      {planAvailabilityLabel(tool.minimumPlan)}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  {tool.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-300">
            Evolución AutonomIA
          </p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">
            Más capacidad en cada plan
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-4">
          {planSteps.map((plan, index) => {
            const isCurrent = plan.key === currentPlanKey;
            const isComplete = plan.key === "local-ia";

            return (
              <article
                key={plan.key}
                className={`relative flex h-full flex-col rounded-[2rem] border p-6 ${
                  isComplete
                    ? "border-violet-300/40 bg-gradient-to-br from-blue-600/20 to-violet-600/20"
                    : isCurrent
                      ? "border-emerald-400/40 bg-emerald-500/10"
                      : "border-white/10 bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Paso {index + 1}
                  </span>
                  {isCurrent ? (
                    <span className="rounded-full bg-emerald-500/20 px-3 py-2 text-[10px] font-black uppercase text-emerald-200">
                      Tu plan
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-5 text-2xl font-black uppercase">{plan.name}</h3>
                <p className="mt-3 text-sm font-bold text-violet-300">{plan.label}</p>
                <ul className="mt-5 space-y-3 text-sm text-slate-300">
                  {plan.tools.map((tool) => (
                    <li key={tool}>✓ {tool}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-violet-50 p-7 text-slate-950 shadow-[0_24px_70px_rgba(37,99,235,0.10)] lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-700">
              🏆 Experiencia AutonomIA Completa
            </p>
            <h2 className="mt-4 text-3xl font-black">¿Por qué elegir Local IA?</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              La experiencia más completa para reducir trabajo manual y
              centralizar marketing, atención y automatización.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "WhatsApp Business",
              "TikTok & Shorts",
              "Elena IA avanzada",
              "Más automatizaciones",
              "Menos trabajo manual",
              "Más tiempo para tu negocio",
            ].map((benefit) => (
              <li
                key={benefit}
                className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm font-bold text-slate-700"
              >
                ✓ {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </section>
  );
}
