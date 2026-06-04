import Link from "next/link";
import SubscriptionWarningBanner from "@/components/SubscriptionWarningBanner";
import VipAccessBanner from "@/components/VipAccessBanner";
import { shouldShowSubscriptionWarning } from "@/lib/auth/access-control";
import { getCompanyCommercialAccess } from "@/lib/data/commercial-access";
import { getCurrentCompany } from "@/lib/data/companies";
import {
  getCompanyModules,
  getModules,
} from "@/lib/data/modules";
import { getPlans } from "@/lib/data/plans";
import { getCurrentSubscription } from "@/lib/data/subscriptions";
import type { CompanyModule, Module } from "@/types/database";

type ModuleStatus = "Activo" | "Recomendado" | "Disponible";

type ModuleCard = {
  name: string;
  status: ModuleStatus;
  description: string;
  benefits: string[];
  price: string;
  href: string;
};

const fallbackSummary = [
  { label: "Módulos activos", value: "4", detail: "Operativos ahora" },
  { label: "Módulos recomendados", value: "3", detail: "Prioridad IA" },
  { label: "Disponibles", value: "5", detail: "Listos para activar" },
  { label: "Ahorro estimado", value: "12h/mes", detail: "Tiempo recuperado" },
];

const activeModules: ModuleCard[] = [
  {
    name: "SocialIA",
    status: "Activo",
    description:
      "Crea publicaciones para Instagram y Facebook desde ideas, fotos o mensajes enviados por WhatsApp.",
    benefits: ["Contenido recurrente", "Aprobación previa", "Calendario social"],
    price: "Incluido",
    href: "/dashboard/socialia",
  },
  {
    name: "Google Business",
    status: "Activo",
    description:
      "Mantiene la presencia local del negocio en Google con publicaciones, ficha y visibilidad básica.",
    benefits: ["Visibilidad local", "Publicaciones Google", "Mejor presencia en Maps"],
    price: "Incluido en plan actual",
    href: "/dashboard/google-business",
  },
  {
    name: "InsightIA",
    status: "Activo",
    description:
      "Resume métricas, actividad y oportunidades para entender qué acciones están funcionando mejor.",
    benefits: ["Informes claros", "Recomendaciones IA", "Seguimiento mensual"],
    price: "Incluido en plan actual",
    href: "/dashboard/insightia",
  },
  {
    name: "Calendario IA",
    status: "Activo",
    description:
      "Organiza publicaciones, campañas, reservas y tareas importantes desde una vista centralizada.",
    benefits: ["Planificación visual", "Fechas clave", "Control operativo"],
    price: "Incluido",
    href: "/dashboard/calendario",
  },
];

const recommendedModules: ModuleCard[] = [
  {
    name: "ReviewIA",
    status: "Recomendado",
    description:
      "Prepara respuestas profesionales a reseñas para proteger la reputación y acelerar la atención.",
    benefits: ["Respuestas rápidas", "Mejor reputación", "Aprobación manual"],
    price: "+19€/mes",
    href: "/dashboard/reviewia",
  },
  {
    name: "LeadIA",
    status: "Recomendado",
    description:
      "Detecta oportunidades comerciales y ayuda a hacer seguimiento de contactos interesados.",
    benefits: ["Más oportunidades", "Seguimiento comercial", "Prioridad por lead"],
    price: "+29€/mes",
    href: "/dashboard/leadia",
  },
  {
    name: "ReservaIA",
    status: "Recomendado",
    description:
      "Ayuda a gestionar consultas de reserva, confirmaciones y recordatorios para reducir olvidos.",
    benefits: ["Más reservas", "Recordatorios", "Menos tareas manuales"],
    price: "+19€/mes",
    href: "/dashboard/reservaia",
  },
];

const availableModules: ModuleCard[] = [
  {
    name: "WhatsAppIA",
    status: "Disponible",
    description:
      "Automatiza respuestas frecuentes por WhatsApp para horarios, servicios y dudas habituales.",
    benefits: ["Atención 24/7", "Menos mensajes repetidos", "Respuestas consistentes"],
    price: "+29€/mes",
    href: "/dashboard/whatsappia",
  },
  {
    name: "TikTok & Shorts",
    status: "Disponible",
    description:
      "Genera ideas y guiones para vídeos cortos pensados para captar atención en redes.",
    benefits: ["Ideas virales", "Guiones cortos", "Contenido vertical"],
    price: "+25€/mes",
    href: "/dashboard/tiktok-shorts",
  },
  {
    name: "YouTube Shorts",
    status: "Disponible",
    description:
      "Adapta ideas y publicaciones a formatos breves para reforzar la presencia en YouTube.",
    benefits: ["Formato corto", "Mayor alcance", "Reutilización de contenido"],
    price: "+25€/mes",
    href: "/dashboard/tiktok-shorts",
  },
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function findModule(modules: Module[], card: ModuleCard) {
  return modules.find(
    (module) =>
      normalize(module.name) === normalize(card.name) ||
      module.key === normalize(card.name),
  );
}

function getModulePrice(card: ModuleCard, modules: Module[]) {
  const moduleData = findModule(modules, card);

  if (!moduleData) {
    return card.price;
  }

  if (moduleData.monthly_price_cents === null) {
    return card.status === "Activo" ? "Incluido" : card.price;
  }

  return `+${Math.round(moduleData.monthly_price_cents / 100)}€/mes`;
}

function mergeModulePrices(cards: ModuleCard[], modules: Module[]) {
  return cards.map((card) => ({
    ...card,
    price: getModulePrice(card, modules),
  }));
}

function getModuleHref(module: Pick<Module, "key" | "name">) {
  const hrefs: Record<string, string> = {
    socialia: "/dashboard/socialia",
    google_business: "/dashboard/google-business",
    insightia: "/dashboard/insightia",
    calendario_ia: "/dashboard/calendario",
    calendario: "/dashboard/calendario",
    reviewia: "/dashboard/reviewia",
    leadia: "/dashboard/leadia",
    reservaia: "/dashboard/reservaia",
    whatsappia: "/dashboard/whatsappia",
    tiktok_shorts: "/dashboard/tiktok-shorts",
    youtube_shorts: "/dashboard/tiktok-shorts",
  };

  return hrefs[module.key] ?? `/dashboard/${normalize(module.name)}`;
}

function getFallbackBenefits(moduleName: string) {
  const fallbackCards = [
    ...activeModules,
    ...recommendedModules,
    ...availableModules,
  ];
  const card = fallbackCards.find(
    (item) => normalize(item.name) === normalize(moduleName),
  );

  return card?.benefits ?? ["Ahorro de tiempo", "Seguimiento claro", "Preparado para IA"];
}

function formatModulePrice(module: Module, status: ModuleStatus) {
  if (module.monthly_price_cents === null) {
    return status === "Activo" ? "Incluido" : "Incluido según plan";
  }

  return `+${Math.round(module.monthly_price_cents / 100)}€/mes`;
}

function toModuleCard(module: Module, status: ModuleStatus): ModuleCard {
  return {
    name: module.name,
    status,
    description:
      module.description ??
      "Módulo preparado para ampliar automatizaciones y seguimiento del negocio.",
    benefits: getFallbackBenefits(module.name),
    price: formatModulePrice(module, status),
    href: getModuleHref(module),
  };
}

function buildModuleCards(
  modules: Module[],
  companyModules: CompanyModule[],
  status: ModuleStatus,
) {
  const statusByModuleId = new Map(
    companyModules.map((companyModule) => [
      companyModule.module_id,
      companyModule.status,
    ]),
  );

  return modules
    .filter((module) => {
      const companyStatus = statusByModuleId.get(module.id);

      if (status === "Activo") {
        return companyStatus === "active";
      }

      if (status === "Recomendado") {
        return companyStatus === "recommended";
      }

      return !companyStatus || companyStatus === "available";
    })
    .map((module) => toModuleCard(module, status));
}

function getStatusClass(status: ModuleStatus) {
  if (status === "Activo") {
    return "bg-emerald-500/20 text-emerald-300";
  }

  if (status === "Recomendado") {
    return "bg-amber-500/20 text-amber-300";
  }

  return "bg-violet-500/20 text-violet-300";
}

function getActionLabel(status: ModuleStatus) {
  if (status === "Activo") {
    return "Entrar al módulo";
  }

  if (status === "Recomendado") {
    return "Activar módulo";
  }

  return "Ver detalles";
}

function ModuleGrid({
  title,
  description,
  modules,
}: {
  title: string;
  description: string;
  modules: ModuleCard[];
}) {
  return (
    <section className="mt-8">
      <div className="mb-5 flex flex-col justify-between gap-3 xl:flex-row xl:items-end">
        <div>
          <h2 className="text-2xl font-black">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            {description}
          </p>
        </div>

        <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-black text-slate-300">
          {modules.length} módulos
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-4">
        {modules.map((module) => (
          <article
            key={module.name}
            className="flex h-full flex-col rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition hover:border-violet-400/40 hover:bg-white/[0.07]"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black">{module.name}</h3>
                <p className="mt-2 text-sm font-bold text-slate-400">
                  {module.price}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] ${getStatusClass(
                  module.status,
                )}`}
              >
                {module.status}
              </span>
            </div>

            <p className="text-sm leading-6 text-slate-300">
              {module.description}
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-violet-300">
                Beneficios
              </p>

              <ul className="space-y-2 text-sm text-slate-300">
                {module.benefits.map((benefit) => (
                  <li key={benefit}>✓ {benefit}</li>
                ))}
              </ul>
            </div>

            <Link
              href={module.href}
              className={`mt-6 block rounded-2xl px-5 py-3 text-center text-sm font-bold transition ${
                module.status === "Activo"
                  ? "border border-white/10 text-white hover:bg-white/10"
                  : "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-[0_0_28px_rgba(124,58,237,0.24)] hover:opacity-90"
              }`}
            >
              {getActionLabel(module.status)}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function ModulosPage() {
  const [company, modules, plans] = await Promise.all([
    getCurrentCompany(),
    getModules(),
    getPlans(),
  ]);
  const [companyModules, subscription] = await Promise.all([
    getCompanyModules(company.id),
    getCurrentSubscription(company.id),
  ]);
  const activeCount = companyModules.filter(
    (companyModule) => companyModule.status === "active",
  ).length;
  const recommendedCount = companyModules.filter(
    (companyModule) => companyModule.status === "recommended",
  ).length;
  const availableCount = Math.max(modules.length - activeCount - recommendedCount, 0);
  const currentPlan = plans.find((plan) => plan.id === subscription?.plan_id);
  const commercialAccess = await getCompanyCommercialAccess({
    company,
    subscription,
    plan: currentPlan,
  });
  const summary = [
    {
      ...fallbackSummary[0],
      value: activeCount ? String(activeCount) : fallbackSummary[0].value,
    },
    {
      ...fallbackSummary[1],
      value: recommendedCount
        ? String(recommendedCount)
        : fallbackSummary[1].value,
    },
    {
      ...fallbackSummary[2],
      value: availableCount ? String(availableCount) : fallbackSummary[2].value,
    },
    fallbackSummary[3],
  ];
  const realActiveModuleCards = buildModuleCards(
    modules,
    companyModules,
    "Activo",
  );
  const realRecommendedModuleCards = buildModuleCards(
    modules,
    companyModules,
    "Recomendado",
  );
  const realAvailableModuleCards = buildModuleCards(
    modules,
    companyModules,
    "Disponible",
  );
  const activeModuleCards = realActiveModuleCards.length
    ? realActiveModuleCards
    : mergeModulePrices(activeModules, modules);
  const recommendedModuleCards = realRecommendedModuleCards.length
    ? realRecommendedModuleCards
    : mergeModulePrices(recommendedModules, modules);
  const availableModuleCards = realAvailableModuleCards.length
    ? realAvailableModuleCards
    : mergeModulePrices(availableModules, modules);

  return (
    <section className="p-4 sm:p-6 lg:p-10">
      {shouldShowSubscriptionWarning(subscription?.status) ? (
        <SubscriptionWarningBanner />
      ) : null}

      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-6 lg:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Módulos
        </p>

        <div className="mt-5 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">Módulos de AutonomIA</h1>

            <p className="mt-4 max-w-3xl text-slate-300">
              Activa solo los módulos que tu negocio necesita ahora y amplía la
              plataforma cuando quieras automatizar más tareas, captar más
              clientes o mejorar la atención.
            </p>
          </div>

          <Link
            href="/dashboard/suscripcion"
            className="rounded-2xl border border-white/10 px-6 py-3 text-center text-sm font-bold hover:bg-white/10"
          >
            Revisar suscripción
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <article
            key={item.label}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
          >
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-2 text-3xl font-black sm:text-4xl">{item.value}</p>
            <p className="mt-3 text-sm font-bold text-violet-300">
              {item.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-[2rem] border border-amber-400/20 bg-amber-500/10 p-6">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-300">
              Recomendación IA
            </p>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-amber-50">
              AutonomIA recomienda activar ReviewIA y ReservaIA para mejorar
              reputación, responder más rápido y convertir más consultas en
              reservas.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {(recommendedModuleCards.length
              ? recommendedModuleCards.slice(0, 2)
              : [
                  { name: "ReviewIA", href: "/dashboard/reviewia" },
                  { name: "ReservaIA", href: "/dashboard/reservaia" },
                ]
            ).map((module, index) => (
              <Link
                key={module.name}
                href={module.href}
                className={
                  index === 0
                    ? "rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-slate-950 hover:bg-slate-200"
                    : "rounded-2xl border border-amber-300/30 px-5 py-3 text-center text-sm font-bold text-amber-100 hover:bg-amber-300/10"
                }
              >
                Ver {module.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-xl font-black">
              Plan actual: {currentPlan?.name ?? "Crecimiento"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {commercialAccess.isGifted
                ? "Estás utilizando una versión profesional con acceso VIP especial. Los módulos activos mantienen el valor real del plan mientras esta condición permanezca activa."
                : "Incluye 2 usuarios, SocialIA, Google Business, ReviewIA básico e InsightIA básico. Para más usuarios o módulos principales, Local IA amplía el límite hasta 5 usuarios."}
            </p>
          </div>

          <Link
            href="/dashboard/usuarios"
            className="rounded-2xl border border-white/10 px-5 py-3 text-center text-sm font-bold hover:bg-white/10"
          >
            Ver usuarios
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <VipAccessBanner access={commercialAccess} />
      </div>

      {!commercialAccess.isGifted ? (
      <div className="mt-6 rounded-[2rem] border border-emerald-400/20 bg-emerald-500/10 p-6">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
              Plan Gratuito
            </p>
            <h2 className="mt-3 text-2xl font-black">
              Solo incluye SocialIA limitado
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
              1 usuario, Instagram + Facebook, 2 publicaciones propias por
              semana y Centro IA limitado. ReviewIA, WhatsAppIA, LeadIA,
              ReservaIA e InsightIA avanzado quedan fuera del plan gratuito.
            </p>
          </div>

          <Link
            href="/dashboard/socialia"
            className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-slate-950 hover:bg-slate-200"
          >
            Ver SocialIA limitado
          </Link>
        </div>
      </div>
      ) : null}

      <ModuleGrid
        title="Módulos activos"
        description="Estos módulos ya están disponibles para operar el negocio y revisar actividad diaria."
        modules={activeModuleCards}
      />

      <ModuleGrid
        title="Recomendados para tu negocio"
        description="AutonomIA prioriza estos módulos por impacto directo en reputación, captación y reservas."
        modules={recommendedModuleCards}
      />

      <ModuleGrid
        title="Disponibles"
        description="Módulos adicionales que puedes revisar cuando quieras ampliar automatizaciones o contenidos."
        modules={availableModuleCards}
      />
    </section>
  );
}
