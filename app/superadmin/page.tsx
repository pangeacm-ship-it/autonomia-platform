import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import PasswordInput from "@/components/PasswordInput";
import SensitiveValue, {
  SensitiveValuesToggle,
} from "@/components/SensitiveValue";
import CommercialSettingsCard from "@/components/superadmin/CommercialSettingsCard";
import SuperadminSidebar from "@/components/superadmin/SuperadminSidebar";
import { isSuperadmin } from "@/lib/auth/roles";
import { resolveCommercialAccess } from "@/lib/data/commercial-access";
import { createCompanyWithAdminFormAction } from "@/lib/data/company-management";
import {
  filterDemoRecords,
  filterRealOperationalRecords,
} from "@/lib/data/demo-data";
import {
  convertDemoToCustomerFormAction,
  exemptCompanyFromPromoRequirementFormAction,
  extendCompanyDemoFormAction,
  setCompanyDemoUnlimitedFormAction,
  suspendCompanyDemoFormAction,
  updateCompanyModuleStatusFormAction,
} from "@/lib/data/superadmin-actions";
import {
  getSuperadminBusinessSectors,
  getSuperadminCompanies,
  getSuperadminCompanyModules,
  getSuperadminCompanyUsers,
  getSuperadminDemoRequests,
  getSuperadminModules,
  getSuperadminNotes,
  getSuperadminPlans,
  getSuperadminSubscriptions,
  getSuperadminUsageEvents,
  isRevenueEligibleCompany,
  shouldCountTowardsARR,
  shouldCountTowardsMRR,
} from "@/lib/data/superadmin";
import { getCurrentProfileContext } from "@/lib/data/profiles";
import { getSupabaseConfig } from "@/lib/supabase/config";
import type {
  Company,
  CompanyModule,
  CompanyUser,
  DemoRequest,
  Module,
  Plan,
  Subscription,
  SuperadminNote,
  UsageEvent,
} from "@/types/database";

type Priority = "Alta" | "Media" | "Baja";
type ClientStatus = "Activo" | "Renovación fallida" | "Demo";
type OnlineStatus = "Online ahora" | "Hace 3 min" | "Hace 8 min";
type SuperadminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const fallbackKpis = [
  { label: "Clientes activos", value: "0", change: "Sin empresas registradas", tone: "emerald" },
  { label: "MRR", value: "0€", change: "Solo clientes facturables", tone: "violet" },
  { label: "ARR estimado", value: "0€", change: "Anualizado", tone: "sky" },
  { label: "Usuarios activos", value: "0", change: "Sin usuarios activos", tone: "cyan" },
  { label: "Empresas en límite", value: "0", change: "Usuarios por plan", tone: "amber" },
  { label: "Churn", value: "0%", change: "Sin histórico", tone: "emerald" },
  { label: "Renovaciones fallidas", value: "0€", change: "Sin incidencias", tone: "amber" },
  { label: "Demos solicitadas", value: "0", change: "Sin demos pendientes", tone: "rose" },
  { label: "Uso IA", value: "0 acciones", change: "Sin actividad", tone: "violet" },
];

const fallbackClients: {
  id: string;
  name: string;
  plan: string;
  status: ClientStatus;
  city: string;
  users: string;
  userLimit: string;
  mrr: string;
  lastAccess: string;
  modules: string[];
}[] = [];

const fallbackOnlineUsers: {
  name: string;
  company: string;
  module: string;
  status: OnlineStatus;
}[] = [];

const fallbackModuleUsage = [
  { name: "SocialIA", value: 78 },
  { name: "ReviewIA", value: 42 },
  { name: "Google Business", value: 39 },
  { name: "WhatsAppIA", value: 31 },
  { name: "LeadIA", value: 27 },
  { name: "ReservaIA", value: 21 },
  { name: "InsightIA", value: 18 },
];

const fallbackPlanDistribution = [
  { name: "Gratuito", clients: "0 clientes", revenue: "0€/mes", users: "1 usuario" },
  { name: "Inicio", clients: "0 clientes", revenue: "0€/mes", users: "1 usuario" },
  { name: "Crecimiento", clients: "0 clientes", revenue: "0€/mes", users: "2 usuarios" },
  { name: "Local IA", clients: "0 clientes", revenue: "0€/mes", users: "Hasta 5 usuarios" },
];

const freePlanClients: {
  company: string;
  city: string;
  weeklyStatus: string;
  supportPost: string;
  nextUnlock: string;
  exempt: boolean;
}[] = [];

const fallbackRevenueMetrics = [
  { label: "MRR total", value: "1.840€" },
  { label: "ARPU medio", value: "102€" },
  { label: "Renovaciones fallidas", value: "240€" },
  { label: "Tarjetas caducadas", value: "2" },
  { label: "Próximos cobros", value: "9" },
];

const fallbackLocations: {
  city: string;
  clients: string;
  plan: string;
  opportunity: string;
}[] = [];

const fallbackDemoRequests: {
  company: string;
  city: string;
  interest: string;
  status: string;
}[] = [];

const fallbackDemoSummary = [
  { label: "Demos activas", value: "0", detail: "Sin demos activas", tone: "sky" },
  { label: "Demos VIP", value: "0", detail: "Sin accesos VIP", tone: "violet" },
  { label: "Caducan pronto", value: "0", detail: "Sin vencimientos", tone: "amber" },
  { label: "Conversiones del mes", value: "0", detail: "Sin histórico", tone: "emerald" },
];

const fallbackManagedDemos: {
  companyId: string;
  planId: string;
  company: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  remaining: string;
  plan: string;
  modules: string[];
}[] = [];

const alerts = [
  { text: "No hay alertas comerciales todavía", priority: "Baja" as Priority },
];

const fallbackAiUsage = [
  { label: "Publicaciones generadas", value: "0", width: "0%" },
  { label: "Respuestas a reseñas", value: "0", width: "0%" },
  { label: "Leads detectados", value: "0", width: "0%" },
  { label: "Reservas gestionadas", value: "0", width: "0%" },
  { label: "Informes generados", value: "0", width: "0%" },
  { label: "Conversaciones WhatsApp", value: "0", width: "0%" },
];

const healthStats = [
  { label: "Clientes en riesgo", value: "0", tone: "amber" },
  { label: "Clientes muy activos", value: "0", tone: "emerald" },
  { label: "Clientes nuevos", value: "0", tone: "sky" },
  { label: "Sin actividad 7 días", value: "0", tone: "rose" },
];

const customerHealth: {
  company: string;
  risk: string;
  reason: string;
}[] = [];

const tickets: {
  title: string;
  company: string;
  priority: Priority;
}[] = [];

const quickActions = [
  "Crear empresa",
  "Ver renovaciones",
  "Ver demos",
  "Exportar CSV",
  "Generar informe mensual",
  "Revisar clientes en riesgo",
  "Enviar comunicación global",
];

function toneClass(tone: string) {
  if (tone === "emerald") return "text-emerald-300 bg-emerald-500/15 border-emerald-400/20";
  if (tone === "amber") return "text-amber-300 bg-amber-500/15 border-amber-400/20";
  if (tone === "rose") return "text-rose-300 bg-rose-500/15 border-rose-400/20";
  if (tone === "sky") return "text-sky-300 bg-sky-500/15 border-sky-400/20";
  if (tone === "cyan") return "text-cyan-300 bg-cyan-500/15 border-cyan-400/20";
  return "text-violet-300 bg-violet-500/15 border-violet-400/20";
}

function statusClass(status: ClientStatus) {
  if (status === "Activo") return "bg-emerald-500/20 text-emerald-300";
  if (status === "Renovación fallida") return "bg-amber-500/20 text-amber-300";
  return "bg-sky-500/20 text-sky-300";
}

function priorityClass(priority: Priority) {
  if (priority === "Alta") return "bg-rose-500/20 text-rose-300";
  if (priority === "Media") return "bg-amber-500/20 text-amber-300";
  return "bg-slate-500/20 text-slate-300";
}

function onlineClass(status: OnlineStatus) {
  if (status === "Online ahora") return "bg-emerald-500/20 text-emerald-300";
  if (status === "Hace 3 min") return "bg-cyan-500/20 text-cyan-300";
  return "bg-slate-500/20 text-slate-300";
}

function demoStatusClass(status: string) {
  if (status === "Sin límite") return "bg-violet-500/20 text-violet-300";
  if (status === "Trial") return "bg-amber-500/20 text-amber-300";
  if (status === "Convertida") return "bg-emerald-500/20 text-emerald-300";
  if (status === "Expirada") return "bg-rose-500/20 text-rose-300";
  return "bg-sky-500/20 text-sky-300";
}

function userLimitClass(users: string, userLimit: string) {
  if (userLimit === "Sin límite") return "bg-violet-500/20 text-violet-300";
  return Number(users) >= Number(userLimit)
    ? "bg-amber-500/20 text-amber-300"
    : "bg-emerald-500/20 text-emerald-300";
}

function freePlanStatusClass(status: string) {
  if (status === "Desbloqueado") return "bg-emerald-500/20 text-emerald-300";
  if (status === "Exento") return "bg-violet-500/20 text-violet-300";
  return "bg-amber-500/20 text-amber-300";
}

function companyModuleStatusClass(status: CompanyModule["status"]) {
  if (status === "active") return "bg-emerald-500/20 text-emerald-300";
  if (status === "recommended") return "bg-violet-500/20 text-violet-300";
  if (status === "disabled") return "bg-rose-500/20 text-rose-300";
  return "bg-slate-500/20 text-slate-300";
}

function companyModuleStatusLabel(status: CompanyModule["status"]) {
  if (status === "active") return "Activo";
  if (status === "recommended") return "Recomendado";
  if (status === "disabled") return "Bloqueado";
  return "Disponible";
}

function formatCurrency(cents: number | null | undefined) {
  if (cents === null || cents === undefined) {
    return "Consultar";
  }

  return `${Math.round(cents / 100)}€`;
}

function formatShortDate(date: string | null | undefined) {
  if (!date) {
    return "Sin actividad";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
  }).format(new Date(date));
}

function clientStatus(company: Company): ClientStatus {
  if (company.status === "past_due" || company.status === "suspended") {
    return "Renovación fallida";
  }

  if (company.status === "demo" || company.status === "trial") {
    return "Demo";
  }

  return "Activo";
}

function moduleLabel(moduleKey: string | null) {
  if (!moduleKey) {
    return "Sin módulo";
  }

  return moduleKey
    .split("_")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function buildClients(
  companies: Company[],
  companyUsers: CompanyUser[],
  subscriptions: Subscription[],
  companyModules: CompanyModule[],
  modules: Module[],
  plans: Plan[],
  notesByCompany: Record<string, SuperadminNote[]> = {},
) {
  const moduleById = new Map(modules.map((module) => [module.id, module.name]));
  const planById = new Map(plans.map((plan) => [plan.id, plan]));

  return companies.slice(0, 8).map((company) => {
    const users = companyUsers.filter(
      (user) => user.company_id === company.id && user.status === "active",
    );
    const subscription = subscriptions.find(
      (item) => item.company_id === company.id,
    );
    const plan = subscription ? planById.get(subscription.plan_id) : null;
    const onboardingNote = notesByCompany[company.id]?.find((note) =>
      note.note.toLowerCase().includes("onboarding_created:landing"),
    );
    const countsRevenue = subscription
      ? shouldCountTowardsMRR(subscription, company, notesByCompany[company.id])
      : false;
    const activeModules = companyModules
      .filter((item) => item.company_id === company.id && item.status === "active")
      .map((item) => moduleById.get(item.module_id))
      .filter(Boolean) as string[];
    const lastAccess = users
      .map((user) => user.last_access_at)
      .filter(Boolean)
      .sort()
      .at(-1);

    return {
      id: company.id,
      name: company.name,
      plan: plan?.name ?? subscription?.plan_id?.replace("plan-", "") ?? "Sin plan",
      status: clientStatus(company),
      city: company.city ?? "Sin ciudad",
      users: String(users.length || 1),
      userLimit: subscription?.plan_id?.includes("local") ? "5" : "2",
      mrr: countsRevenue
        ? `${formatCurrency(subscription?.monthly_price_cents)}/mes`
        : "No facturable",
      lastAccess: formatShortDate(lastAccess),
      modules: [
        ...(onboardingNote ? ["Origen: Landing"] : []),
        ...(activeModules.length ? activeModules : ["SocialIA"]),
      ],
    };
  });
}

function buildManagedDemos(
  companies: Company[],
  subscriptions: Subscription[],
  companyModules: CompanyModule[],
  modules: Module[],
) {
  const moduleById = new Map(modules.map((module) => [module.id, module.name]));

  return companies
    .filter((company) =>
      ["demo", "trial", "suspended"].includes(company.status),
    )
    .slice(0, 8)
    .map((company) => {
      const subscription = subscriptions.find(
        (item) => item.company_id === company.id,
      );
      const unlockedModules = companyModules
        .filter((item) => item.company_id === company.id && item.status === "active")
        .map((item) => moduleById.get(item.module_id))
        .filter(Boolean) as string[];

      return {
        companyId: company.id,
        planId: subscription?.plan_id ?? "",
        company: company.name,
        type: company.status === "trial" ? "Trial" : "Demo Comercial",
        status:
          company.status === "suspended"
            ? "Expirada"
            : company.status === "trial"
              ? "Trial"
              : "Demo activa",
        startDate: formatShortDate(company.created_at),
        endDate: subscription?.current_period_end
          ? formatShortDate(subscription.current_period_end)
          : "Pendiente",
        remaining: subscription?.current_period_end
          ? "Periodo registrado"
          : "Sin fecha definida",
        plan: subscription?.plan_id?.replace("plan-", "") ?? "Sin plan",
        modules: unlockedModules.length ? unlockedModules : ["SocialIA"],
      };
    });
}

function buildModuleManagement(
  companies: Company[],
  modules: Module[],
  companyModules: CompanyModule[],
) {
  const visibleCompanies = companies.slice(0, 4);
  const visibleModules = modules.slice(0, 6);

  return visibleCompanies.map((company) => ({
    companyId: company.id,
    company: company.name,
    modules: visibleModules.map((module) => {
      const companyModule = companyModules.find(
        (item) => item.company_id === company.id && item.module_id === module.id,
      );

      return {
        moduleId: module.id,
        name: module.name,
        status: companyModule?.status ?? "available",
      };
    }),
  }));
}

function buildDemoRequests(demos: DemoRequest[]) {
  return demos.slice(0, 8).map((demo) => {
    const fromLanding = demo.notes?.toLowerCase().includes("onboarding_source:landing");

    return {
      company: demo.company_name,
      city: demo.city ?? "Sin ciudad",
      interest: fromLanding
        ? `Plan Gratuito · Origen: Landing · ${demo.industry ?? "Sector pendiente"}`
        : demo.interested_module
          ? `Interesado en ${demo.interested_module}`
          : demo.industry ?? "Interés por demo",
      status:
        fromLanding
          ? "Nuevo registro"
          : demo.status === "new"
            ? "Nuevo"
            : demo.status === "pending"
              ? "Pendiente"
              : demo.status === "contacted"
                ? "Contactado"
                : demo.status === "converted"
                  ? "Convertido"
                  : "Archivado",
    };
  });
}

function buildUsage(usageEvents: UsageEvent[]) {
  const totals = usageEvents.reduce<Record<string, number>>((acc, event) => {
    const key = moduleLabel(event.module_key);
    acc[key] = (acc[key] ?? 0) + event.quantity;
    return acc;
  }, {});
  const max = Math.max(...Object.values(totals), 1);

  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7)
    .map(([name, value]) => ({
      name,
      value: Math.max(Math.round((value / max) * 100), 8),
    }));
}

function buildAiUsage(usageEvents: UsageEvent[]) {
  const total = usageEvents.reduce((sum, event) => sum + event.quantity, 0);

  return [
    {
      label: "Acciones registradas",
      value: String(total),
      width: `${Math.min(Math.max(total, 12), 100)}%`,
    },
    ...buildUsage(usageEvents).slice(0, 4).map((item) => ({
      label: item.name,
      value: `${item.value}%`,
      width: `${item.value}%`,
    })),
  ];
}

function isSensitiveEconomicMetric(label: string) {
  const normalized = label.toLowerCase();

  return [
    "mrr",
    "arr",
    "ingreso",
    "facturación",
    "facturacion",
    "arpu",
    "cobro",
    "renovaciones fallidas",
  ].some((term) => normalized.includes(term));
}

function buildNotesByCompany(notes: SuperadminNote[]) {
  return notes.reduce<Record<string, SuperadminNote[]>>((acc, note) => {
    if (!note.company_id) {
      return acc;
    }

    acc[note.company_id] = [...(acc[note.company_id] ?? []), note];
    return acc;
  }, {});
}

function isTrialOrDemoCompany(company: Company) {
  return company.status === "demo" || company.status === "trial";
}

function UnauthorizedSuperadmin() {
  return (
    <main className="autonomia-light-shell flex min-h-screen items-center justify-center px-6 text-slate-950">
      <section className="max-w-lg rounded-[2rem] border border-rose-400/20 bg-rose-500/10 p-8 text-center">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-rose-200">
          Acceso restringido
        </p>
        <h1 className="mt-4 text-3xl font-black">Panel solo para superadmin</h1>
        <p className="mt-4 text-sm leading-6 text-slate-300">
          Hay una sesión real de Supabase, pero no tiene rol superadmin activo.
          Revisa `profiles`, `company_users` y `roles`.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-slate-200"
        >
          Volver al login
        </Link>
      </section>
    </main>
  );
}

export default async function SuperadminPage({ searchParams }: SuperadminPageProps) {
  const { isConfigured } = getSupabaseConfig();
  const profileContext = await getCurrentProfileContext();
  const params = searchParams ? await searchParams : {};
  const actionFeedback = typeof params.action === "string" ? params.action : null;
  const actionMessage = typeof params.message === "string" ? params.message : null;
  const canRunSuperadminActions =
    isConfigured && !profileContext.isFallback && isSuperadmin(profileContext.primaryRole);

  if (isConfigured && !isSuperadmin(profileContext.primaryRole)) {
    return <UnauthorizedSuperadmin />;
  }

  const [
    realCompanies,
    realCompanyUsers,
    realSubscriptions,
    realModules,
    realDemoRequests,
    realUsageEvents,
    realCompanyModules,
    realPlans,
    realBusinessSectors,
    realSuperadminNotes,
  ] = await Promise.all([
    getSuperadminCompanies(),
    getSuperadminCompanyUsers(),
    getSuperadminSubscriptions(),
    getSuperadminModules(),
    getSuperadminDemoRequests(),
    getSuperadminUsageEvents(),
    getSuperadminCompanyModules(),
    getSuperadminPlans(),
    getSuperadminBusinessSectors(),
    getSuperadminNotes(),
  ]);
  const notesByCompany = buildNotesByCompany(realSuperadminNotes);
  const companyById = new Map(realCompanies.map((company) => [company.id, company]));
  const planById = new Map(realPlans.map((plan) => [plan.id, plan]));
  const subscriptionByCompanyId = new Map(
    realSubscriptions.map((subscription) => [subscription.company_id, subscription]),
  );
  const commercialAccessByCompanyId = new Map(
    realCompanies.map((company) => {
      const subscription = subscriptionByCompanyId.get(company.id) ?? null;
      return [
        company.id,
        resolveCommercialAccess({
          company,
          subscription,
          plan: subscription ? planById.get(subscription.plan_id) : null,
          notes: notesByCompany[company.id] ?? [],
        }),
      ];
    }),
  );
  const revenueEligibleCompanies = realCompanies.filter((company) =>
    isRevenueEligibleCompany(company, notesByCompany[company.id]),
  );
  const revenueSubscriptions = realSubscriptions.filter((subscription) =>
    shouldCountTowardsMRR(
      subscription,
      companyById.get(subscription.company_id),
      notesByCompany[subscription.company_id],
    ),
  );
  const arrSubscriptions = realSubscriptions.filter((subscription) =>
    shouldCountTowardsARR(
      subscription,
      companyById.get(subscription.company_id),
      notesByCompany[subscription.company_id],
    ),
  );
  const vipCompanies = realCompanies.filter(
    (company) => commercialAccessByCompanyId.get(company.id)?.kind === "vip",
  );
  const partnerCompanies = realCompanies.filter(
    (company) => commercialAccessByCompanyId.get(company.id)?.kind === "partner",
  );
  const betaCompanies = realCompanies.filter(
    (company) => commercialAccessByCompanyId.get(company.id)?.kind === "beta",
  );
  const unlimitedDemoCompanies = realCompanies.filter(
    (company) =>
      commercialAccessByCompanyId.get(company.id)?.kind === "unlimited_demo",
  );
  const demoCompanies = realCompanies.filter(
    (company) =>
      isTrialOrDemoCompany(company) &&
      !commercialAccessByCompanyId.get(company.id)?.isGifted,
  );
  const suspendedCompanies = realCompanies.filter(
    (company) => company.status === "suspended" || company.status === "canceled",
  );
  const realClients = buildClients(
    realCompanies,
    realCompanyUsers,
    realSubscriptions,
    realCompanyModules,
    realModules,
    realPlans,
    notesByCompany,
  );
  const clients = realClients.length ? realClients : fallbackClients;
  const realDemoRequestCards = buildDemoRequests(realDemoRequests);
  const demoRequests = realDemoRequestCards.length
    ? realDemoRequestCards
    : fallbackDemoRequests;
  const realOperationalUsageEvents = filterRealOperationalRecords(realUsageEvents);
  const demoUsageEvents = filterDemoRecords(realUsageEvents);
  const archivedUsageEvents = realUsageEvents.filter(
    (event) => Boolean(event.archived_at) && !event.deleted_at,
  );
  const deletableUsageEventsCount =
    demoUsageEvents.length + archivedUsageEvents.length;
  const realModuleUsage = buildUsage(realOperationalUsageEvents);
  const moduleUsage = realModuleUsage.length
    ? realModuleUsage
    : fallbackModuleUsage;
  const realAiUsage = buildAiUsage(realOperationalUsageEvents);
  const aiUsage = realAiUsage.length ? realAiUsage : fallbackAiUsage;
  const activeCompanies = realCompanies.filter((company) => company.status === "active");
  const totalMrr = revenueSubscriptions.reduce(
    (sum, subscription) => sum + (subscription.monthly_price_cents ?? 0),
    0,
  );
  const totalArr = arrSubscriptions.reduce(
    (sum, subscription) => sum + (subscription.monthly_price_cents ?? 0),
    0,
  ) * 12;
  const pastDueRevenueSubscriptions = revenueSubscriptions.filter(
    (subscription) => subscription.status === "past_due",
  );
  const upcomingRevenueRenewals = revenueSubscriptions.filter(
    (subscription) => subscription.current_period_end,
  );
  const paymentCustomerPercentage = realCompanies.length
    ? Math.round((revenueEligibleCompanies.length / realCompanies.length) * 100)
    : 0;
  const demoConversionRate = realDemoRequests.length
    ? Math.round(
      (realDemoRequests.filter((demo) => demo.status === "converted").length /
        realDemoRequests.length) *
        100,
    )
    : 0;
  const kpis = realCompanies.length ? [
    { label: "Clientes activos", value: String(activeCompanies.length), change: "Incluye clientes facturables y operativos", tone: "emerald" },
    { label: "MRR", value: formatCurrency(totalMrr), change: "Solo incluye clientes facturables", tone: "violet" },
    { label: "ARR estimado", value: formatCurrency(totalArr), change: "Solo incluye clientes facturables", tone: "sky" },
    { label: "Usuarios activos", value: String(realCompanyUsers.filter((user) => user.status === "active").length), change: "Sesiones y equipos", tone: "cyan" },
    { label: "Empresas en límite", value: String(clients.filter((client) => client.users === client.userLimit).length), change: "Usuarios por plan", tone: "amber" },
    { label: "Churn", value: "3.2%", change: "Pendiente de cálculo real", tone: "emerald" },
    { label: "Renovaciones fallidas", value: String(pastDueRevenueSubscriptions.length), change: "Solo clientes facturables", tone: "amber" },
    { label: "Demos solicitadas", value: String(realDemoRequests.length), change: "Solicitudes registradas", tone: "rose" },
    { label: "Uso IA", value: `${realOperationalUsageEvents.reduce((sum, event) => sum + event.quantity, 0)} acciones`, change: "Solo datos reales operativos", tone: "violet" },
  ] : fallbackKpis;
  const realOnlineUsers = realCompanyUsers
    .filter((user) => user.last_access_at)
    .slice(0, 6)
    .map((user, index) => {
      const company = realCompanies.find((item) => item.id === user.company_id);

      return {
        name: `Usuario ${index + 1}`,
        company: company?.name ?? "Superadmin",
        module: "Dashboard",
        status: index === 0 ? "Online ahora" as OnlineStatus : "Hace 3 min" as OnlineStatus,
      };
    });
  const onlineUsers = realOnlineUsers.length ? realOnlineUsers : fallbackOnlineUsers;
  const realPlanDistribution = Object.entries(
    revenueSubscriptions.reduce<Record<string, { clients: number; revenue: number }>>(
      (acc, subscription) => {
        const key = subscription.plan_id.replace("plan-", "") || "Sin plan";
        acc[key] = {
          clients: (acc[key]?.clients ?? 0) + 1,
          revenue: (acc[key]?.revenue ?? 0) + (subscription.monthly_price_cents ?? 0),
        };
        return acc;
      },
      {},
    ),
  ).map(([name, item]) => ({
    name,
    clients: `${item.clients} clientes`,
    revenue: `${formatCurrency(item.revenue)}/mes`,
    users: "Límite según plan",
  }));
  const planDistribution = realPlanDistribution.length
    ? realPlanDistribution
    : fallbackPlanDistribution;
  const revenueMetrics = realSubscriptions.length ? [
    { label: "MRR total", value: formatCurrency(totalMrr) },
    {
      label: "ARPU medio",
      value: formatCurrency(
        revenueSubscriptions.length ? Math.round(totalMrr / revenueSubscriptions.length) : 0,
      ),
    },
    { label: "Renovaciones fallidas", value: String(pastDueRevenueSubscriptions.length) },
    { label: "Tarjetas caducadas", value: "Pendiente" },
    { label: "Próximos cobros", value: String(upcomingRevenueRenewals.length) },
  ] : fallbackRevenueMetrics;
  const realLocations = Object.entries(
    realCompanies.reduce<Record<string, number>>((acc, company) => {
      const city = company.city ?? "Sin ciudad";
      acc[city] = (acc[city] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([city, count]) => ({
    city,
    clients: `${count} clientes`,
    plan: "Mixto",
    opportunity: "Datos reales por localidad desde Supabase",
  }));
  const locations = realLocations.length ? realLocations : fallbackLocations;
  const demoSummary = realCompanies.length || realDemoRequests.length ? [
    { label: "Demos activas", value: String(demoCompanies.length), detail: "Empresas trial/demo no facturables", tone: "sky" },
    { label: "Demos VIP", value: String(vipCompanies.length), detail: "Excluidas de ingresos", tone: "violet" },
    { label: "Caducan pronto", value: "0", detail: "Pendiente de fechas demo", tone: "amber" },
    { label: "Conversiones del mes", value: String(realDemoRequests.filter((demo) => demo.status === "converted").length), detail: `${demoConversionRate}% demo a cliente`, tone: "emerald" },
  ] : fallbackDemoSummary;
  const commercialMetrics = realCompanies.length ? [
    { label: "Clientes de pago", value: String(revenueEligibleCompanies.length), detail: "active/past_due facturables", tone: "emerald" },
    { label: "Clientes demo", value: String(demoCompanies.length), detail: "Pruebas sin ingreso", tone: "sky" },
    { label: "Clientes VIP", value: String(vipCompanies.length), detail: "Excluidos de MRR", tone: "violet" },
    { label: "Clientes partner", value: String(partnerCompanies.length), detail: "Excluidos de MRR", tone: "cyan" },
    { label: "Clientes beta", value: String(betaCompanies.length), detail: "Pruebas internas", tone: "amber" },
    { label: "Clientes suspendidos", value: String(suspendedCompanies.length), detail: "Sin ingreso operativo", tone: "rose" },
    { label: "Demos ilimitadas", value: String(unlimitedDemoCompanies.length), detail: "Sin límite, sin MRR", tone: "violet" },
    { label: "% clientes de pago", value: `${paymentCustomerPercentage}%`, detail: "Sobre empresas totales", tone: "emerald" },
  ] : [
    { label: "Clientes de pago", value: "4", detail: "active/past_due facturables", tone: "emerald" },
    { label: "Clientes demo", value: "3", detail: "Pruebas sin ingreso", tone: "sky" },
    { label: "Clientes VIP", value: "1", detail: "Excluidos de MRR", tone: "violet" },
    { label: "Clientes partner", value: "1", detail: "Excluidos de MRR", tone: "cyan" },
    { label: "Clientes beta", value: "1", detail: "Pruebas internas", tone: "amber" },
    { label: "Clientes suspendidos", value: "1", detail: "Sin ingreso operativo", tone: "rose" },
    { label: "Demos ilimitadas", value: "1", detail: "Sin límite, sin MRR", tone: "violet" },
    { label: "% clientes de pago", value: "62%", detail: "Sobre empresas totales", tone: "emerald" },
  ];
  const realManagedDemos = buildManagedDemos(
    realCompanies,
    realSubscriptions,
    realCompanyModules,
    realModules,
  );
  const managedDemos = realManagedDemos.length
    ? realManagedDemos
    : fallbackManagedDemos;
  const moduleManagement = buildModuleManagement(
    realCompanies,
    realModules,
    realCompanyModules,
  );
  const creationModuleKeys = [
    "socialia",
    "reviewia",
    "reservaia",
    "leadia",
    "whatsappia",
    "insightia",
    "google_business",
  ];
  const creationModules = realModules.filter((module) =>
    creationModuleKeys.includes(module.key),
  );
  const hasCreationOptions = Boolean(realPlans.length && creationModules.length);

  return (
    <main className="autonomia-light-shell min-h-screen text-slate-950">
      <section className="mx-auto max-w-[1600px] px-5 py-6 sm:px-6 lg:px-10">
        <header id="resumen" className="scroll-mt-6 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-violet-500/20 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-violet-200">
                  Propietario
                </span>
                <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-300">
                  Últimos 30 días
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black sm:text-4xl md:text-5xl">
                Superadmin AutonomIA
              </h1>

              <p className="mt-4 max-w-4xl text-slate-600">
                Control global de clientes, ingresos, uso de módulos y actividad
                de la plataforma.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <SensitiveValuesToggle />
              <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50">
                Exportar informe
              </button>
              <LogoutButton className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-100" />
              <Link
                href="/onboarding"
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-center text-sm font-bold text-white shadow-[0_18px_45px_rgba(79,70,229,0.24)] hover:opacity-90"
              >
                Nueva empresa
              </Link>
            </div>
          </div>
        </header>

        {actionMessage ? (
          <div
            className={`mt-6 rounded-[2rem] border p-4 text-sm font-bold ${
              actionFeedback === "success"
                ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                : "border-rose-400/20 bg-rose-500/10 text-rose-200"
            }`}
          >
            {actionFeedback === "success"
              ? "Acción realizada correctamente"
              : "No se pudo completar la acción"}
            : {actionMessage}
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
          <SuperadminSidebar />

          <div className="min-w-0">
        <section id="clientes" className="scroll-mt-6 rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
                Alta comercial
              </p>
              <h2 className="mt-3 text-3xl font-black">Nueva Empresa</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
                Crea una empresa real en Supabase con administrador inicial,
                plan, demo y módulos activos. No realiza cobros ni conecta
                Stripe.
              </p>
            </div>

            <span className="w-fit rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
              {canRunSuperadminActions ? "Alta real" : "Modo demo"}
            </span>
          </div>

          <form action={createCompanyWithAdminFormAction} className="mt-6 grid gap-5">
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Nombre empresa
                <input
                  name="companyName"
                  required
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-white outline-none focus:border-cyan-300/50"
                  placeholder="Ej. Nombre de empresa"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Sector
                <select
                  name="sectorId"
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-white outline-none focus:border-cyan-300/50"
                  defaultValue=""
                >
                  <option value="">Sin sector asignado</option>
                  {realBusinessSectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Plan
                <select
                  name="planId"
                  required
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-white outline-none focus:border-cyan-300/50"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Selecciona plan
                  </option>
                  {realPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} · {formatCurrency(plan.monthly_price_cents)}/mes
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Nombre administrador
                <input
                  name="adminName"
                  required
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-white outline-none focus:border-cyan-300/50"
                  placeholder="Nombre y apellidos"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Email administrador
                <input
                  name="adminEmail"
                  type="email"
                  required
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-white outline-none focus:border-cyan-300/50"
                  placeholder="admin@empresa.com"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Contraseña temporal opcional
                <PasswordInput
                  name="temporaryPassword"
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-white outline-none focus:border-cyan-300/50"
                  placeholder="Ej. Autonomia2026!"
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Tipo demo
                <select
                  name="demoType"
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-white outline-none focus:border-cyan-300/50"
                  defaultValue="normal"
                >
                  <option value="normal">Normal</option>
                  <option value="comercial">Comercial</option>
                  <option value="vip">VIP</option>
                  <option value="partner">Partner</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Duración
                <select
                  name="demoDays"
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-white outline-none focus:border-cyan-300/50"
                  defaultValue="14"
                >
                  <option value="7">7 días</option>
                  <option value="14">14 días</option>
                  <option value="30">30 días</option>
                  <option value="unlimited">Sin límite</option>
                </select>
              </label>
            </div>

            <div className="grid gap-3 rounded-[2rem] border border-white/10 bg-[#0b1024] p-5 text-sm text-slate-300 md:grid-cols-2">
              <label className="flex items-center gap-3 font-bold">
                <input
                  name="forcePasswordChange"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 accent-cyan-400"
                />
                Forzar cambio de contraseña al entrar
              </label>
              <label className="flex items-center gap-3 font-bold">
                <input
                  name="sendInvitation"
                  type="checkbox"
                  className="h-4 w-4 accent-cyan-400"
                />
                Enviar invitación
              </label>
              <p className="md:col-span-2">
                Si no se envía email real, muestra al finalizar: Empresa creada.
                Crea o comunica la contraseña temporal al cliente.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#0b1024] p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-200">
                Módulos iniciales
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {creationModules.map((module) => (
                  <label
                    key={module.id}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-slate-200"
                  >
                    <input
                      name="initialModules"
                      type="checkbox"
                      value={module.id}
                      defaultChecked={module.key === "socialia"}
                      className="h-4 w-4 accent-cyan-400"
                    />
                    {module.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-sm leading-6 text-slate-400">
                El administrador queda creado como perfil invitado. La creación
                de usuario Auth se hará en la siguiente fase de invitaciones.
              </p>
              <button
                disabled={!canRunSuperadminActions || !hasCreationOptions}
                className="rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 text-sm font-black text-white shadow-[0_0_35px_rgba(34,211,238,0.2)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Crear empresa
              </button>
            </div>
          </form>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <article
              key={kpi.label}
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-sm text-slate-400">{kpi.label}</p>
              <p className="mt-3 text-3xl font-black">
                {isSensitiveEconomicMetric(kpi.label) ? (
                  <SensitiveValue value={kpi.value} />
                ) : (
                  kpi.value
                )}
              </p>
              <p
                className={`mt-4 w-fit rounded-full border px-3 py-1 text-xs font-bold ${toneClass(
                  kpi.tone,
                )}`}
              >
                {kpi.change}
              </p>
              {isSensitiveEconomicMetric(kpi.label) ? (
                <p className="mt-3 text-xs font-bold text-slate-500">
                  Solo incluye clientes facturables
                </p>
              ) : null}
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-black">Ingresos reales y empresas en prueba</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                Los ingresos excluyen demos ilimitadas, VIP, partners, beta
                testers, pruebas internas y empresas no facturables.
              </p>
            </div>
            <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-200">
              MRR limpio
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {commercialMetrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-[#0b1024] p-4"
              >
                <p className="text-sm text-slate-400">{metric.label}</p>
                <p className="mt-2 text-2xl font-black">{metric.value}</p>
                <p
                  className={`mt-3 w-fit rounded-full border px-3 py-1 text-[11px] font-bold ${toneClass(
                    metric.tone,
                  )}`}
                >
                  {metric.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black">Clientes recientes</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Empresas activas, demos y cuentas con incidencias comerciales.
                </p>
              </div>
              <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-black text-slate-300">
                {clients.length} empresas
              </span>
            </div>

            <div className="space-y-4">
              {clients.length ? clients.map((client) => (
                <article
                  key={client.name}
                  className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
                >
                  <div className="grid gap-5 2xl:grid-cols-[1fr_360px_260px] 2xl:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black">{client.name}</h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                            client.status,
                          )}`}
                        >
                          {client.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        {client.city} · {client.plan} · {client.users} usuarios
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${userLimitClass(
                            client.users,
                            client.userLimit,
                          )}`}
                        >
                          Usuarios {client.users}/{client.userLimit}
                        </span>

                        {client.modules.map((module) => (
                          <span
                            key={`${client.name}-${module}`}
                            className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300"
                          >
                            {module}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          MRR
                        </p>
                        <p className="mt-2 font-bold text-slate-200">
                          <SensitiveValue value={client.mrr} />
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                          Último acceso
                        </p>
                        <p className="mt-2 font-bold text-slate-200">
                          {client.lastAccess}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 2xl:justify-end">
                      <Link
                        href={`/superadmin/empresas/${client.id}`}
                        className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold hover:bg-white/10"
                      >
                        Editar empresa
                      </Link>
                      {["Ver usuarios", "Gestionar plan"].map((action) => (
                        <button
                          key={`${client.name}-${action}`}
                          className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold hover:bg-white/10"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                </article>
              )) : (
                <div className="rounded-3xl border border-white/10 bg-[#0b1024] p-6">
                  <h3 className="text-xl font-black">No hay empresas registradas todavía.</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    Crea la primera empresa para empezar a operar AutonomIA con
                    clientes reales.
                  </p>
                  <Link
                    href="#clientes"
                    className="mt-5 inline-flex rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-bold"
                  >
                    Crear primera empresa
                  </Link>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <section id="usuarios" className="scroll-mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-black">Usuarios online</h2>
              <div className="mt-5 space-y-3">
                {onlineUsers.length ? onlineUsers.map((user) => (
                  <article
                    key={`${user.name}-${user.company}`}
                    className="rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black">{user.name}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {user.company} · {user.module}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black ${onlineClass(
                          user.status,
                        )}`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </article>
                )) : (
                  <div className="rounded-2xl border border-white/10 bg-[#0b1024] p-4 text-sm text-slate-300">
                    No hay usuarios online todavía.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-rose-400/20 bg-rose-500/10 p-6">
              <h2 className="text-2xl font-black">Alertas operativas</h2>
              <div className="mt-5 space-y-3">
                {alerts.map((alert) => (
                  <article key={alert.text} className="rounded-2xl bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm leading-6 text-slate-200">
                        {alert.text}
                      </p>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black ${priorityClass(
                          alert.priority,
                        )}`}
                      >
                        {alert.priority}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-3">
          <article id="modulos" className="scroll-mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Módulos más usados</h2>
            <div className="mt-6 space-y-5">
              {moduleUsage.map((module) => (
                <div key={module.name}>
                  <div className="mb-2 flex justify-between gap-4 text-sm">
                    <span className="font-bold text-slate-200">{module.name}</span>
                    <span className="text-violet-300">
                      {module.value}% clientes lo usan
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                      style={{ width: `${module.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article id="suscripciones" className="scroll-mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Ingresos y planes</h2>
            <p className="mt-2 text-xs font-bold text-slate-500">
              Solo incluye clientes facturables. Demos, VIP, partners, beta e
              internas quedan fuera del cálculo económico.
            </p>
            <div className="mt-5 space-y-3">
              {planDistribution.map((plan) => (
                <div
                  key={plan.name}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-black">{plan.name}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {plan.clients}
                      </p>
                      <p className="mt-1 text-xs font-bold text-slate-500">
                        {plan.users}
                      </p>
                    </div>
                    <p className="font-bold text-emerald-300">
                      <SensitiveValue value={plan.revenue} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {revenueMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-black/20 p-4">
                  <p className="text-xs text-slate-400">{metric.label}</p>
                  <p className="mt-2 font-black">
                    {isSensitiveEconomicMetric(metric.label) ? (
                      <SensitiveValue value={metric.value} />
                    ) : (
                      metric.value
                    )}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Localidades</h2>
            <div className="mt-5 space-y-3">
              {locations.length ? locations.map((location) => (
                <div
                  key={location.city}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black">{location.city}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {location.clients} · {location.plan}
                      </p>
                    </div>
                    <span className="rounded-full bg-sky-500/20 px-3 py-1 text-[10px] font-black text-sky-300">
                      Zona
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {location.opportunity}
                  </p>
                </div>
              )) : (
                <div className="rounded-2xl border border-white/10 bg-[#0b1024] p-4 text-sm text-slate-300">
                  No hay localidades con clientes registrados.
                </div>
              )}
            </div>
          </article>
        </section>

        <section id="demos" className="mt-6 scroll-mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Solicitudes de demo</h2>
            <div className="mt-5 space-y-4">
              {demoRequests.length ? demoRequests.map((demo) => (
                <article
                  key={demo.company}
                  className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
                >
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black">{demo.company}</h3>
                        <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                          {demo.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        {demo.city} · {demo.interest}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Contactar", "Convertir en cliente", "Archivar"].map(
                        (action) => (
                          <button
                            key={`${demo.company}-${action}`}
                            className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold hover:bg-white/10"
                          >
                            {action}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </article>
              )) : (
                <div className="rounded-3xl border border-white/10 bg-[#0b1024] p-5 text-sm text-slate-300">
                  No hay solicitudes de demo pendientes.
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <section id="analitica" className="scroll-mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-black">Analítica de uso IA</h2>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Las métricas excluyen datos demo, archivados o eliminados
                lógicamente.
              </p>
              <div className="mt-5 space-y-4">
                {aiUsage.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex justify-between gap-4 text-sm">
                      <span className="text-slate-300">{item.label}</span>
                      <span className="font-bold text-cyan-300">{item.value}</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                        style={{ width: item.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-amber-400/20 bg-amber-500/10 p-6">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-300">
                Mantenimiento de datos
              </p>
              <h2 className="mt-3 text-2xl font-black">
                Datos demo y pruebas
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Preparado para archivar o limpiar actividad de prueba sin tocar
                facturas, pagos, eventos de facturación ni registros fiscales.
              </p>

              <div className="mt-5 grid gap-3">
                {[
                  { label: "Datos demo detectados", value: demoUsageEvents.length },
                  { label: "Datos archivados", value: archivedUsageEvents.length },
                  { label: "Datos eliminables", value: deletableUsageEventsCount },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                  >
                    <span className="text-sm text-slate-300">{item.label}</span>
                    <span className="text-xl font-black text-amber-200">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3">
                {[
                  "Archivar datos demo",
                  "Eliminar datos demo",
                  "Limpiar actividad de prueba",
                ].map((action) => (
                  <button
                    key={action}
                    type="button"
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sm font-bold text-slate-300 hover:bg-white/10"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </section>

            <section id="configuracion" className="scroll-mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <CommercialSettingsCard />

              <div className="mt-6">
              <h2 className="text-2xl font-black">Acciones rápidas</h2>
              <div className="mt-5 grid gap-3">
                {quickActions.map((action) =>
                  action === "Crear empresa" ? (
                    <Link
                      key={action}
                      href="/onboarding"
                      className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-left text-sm font-bold text-slate-300 hover:bg-white/10"
                    >
                      {action}
                    </Link>
                  ) : (
                    <button
                      key={action}
                      className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-left text-sm font-bold text-slate-300 hover:bg-white/10"
                    >
                      {action}
                    </button>
                  ),
                )}
              </div>
              </div>
            </section>
          </aside>
        </section>

        <section className="mt-6 rounded-[2rem] border border-emerald-400/20 bg-emerald-500/10 p-6">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
                Plan Gratuito
              </p>
              <h2 className="mt-3 text-3xl font-black">
                Desbloqueo semanal promocional
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
                Seguimiento visual de clientes en Gratuito: 2 publicaciones por
                semana, renovación condicionada a Publicación de apoyo semanal
                y exención manual disponible desde superadmin.
              </p>
            </div>

            <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-black text-emerald-100">
              {freePlanClients.length} clientes gratuitos
            </span>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {freePlanClients.length ? freePlanClients.map((client) => {
              const matchedCompany = realCompanies.find(
                (company) => company.name === client.company,
              );
              const canExemptClient =
                canRunSuperadminActions && Boolean(matchedCompany?.id);

              return (
                <article
                  key={client.company}
                  className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
                >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black">{client.company}</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      {client.city} · Gratuito · 1 usuario
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${freePlanStatusClass(
                      client.weeklyStatus,
                    )}`}
                  >
                    {client.weeklyStatus}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Publicación de apoyo
                    </p>
                    <p className="mt-2 font-bold text-slate-200">
                      {client.supportPost}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Próxima semana
                    </p>
                    <p className="mt-2 font-bold text-slate-200">
                      {client.nextUnlock}
                    </p>
                  </div>
                </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold hover:bg-white/10">
                      Ver publicación
                    </button>
                    <form action={exemptCompanyFromPromoRequirementFormAction}>
                      <input
                        name="companyId"
                        type="hidden"
                        value={matchedCompany?.id ?? ""}
                      />
                      <input
                        name="exempt"
                        type="hidden"
                        value={client.exempt ? "false" : "true"}
                      />
                      <button
                        disabled={!canExemptClient}
                        className={`rounded-xl px-3 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-45 ${
                          client.exempt
                            ? "bg-violet-500/20 text-violet-300"
                            : "bg-white text-slate-950 hover:bg-slate-200"
                        }`}
                      >
                        {client.exempt ? "Exención activa" : "Eximir condición"}
                      </button>
                    </form>
                  </div>
                </article>
              );
            }) : (
              <div className="rounded-3xl border border-white/10 bg-[#0b1024] p-5 text-sm text-slate-300 lg:col-span-3">
                No hay clientes en plan Gratuito.
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-violet-400/20 bg-violet-500/10 p-6">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-200">
                Demos
              </p>
              <h2 className="mt-3 text-3xl font-black">
                Gestión de demos y pruebas gratuitas
              </h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
                Control operativo de pruebas, tipos de demo, planes asignados,
                módulos desbloqueados y conversiones. Las acciones reales solo
                se ejecutan con una sesión Supabase de superadmin.
              </p>
            </div>

            <span className="w-fit rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
              {canRunSuperadminActions ? "Acciones reales" : "Modo demo"}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {demoSummary.map((item) => (
              <article
                key={item.label}
                className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
              >
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-2 text-3xl font-black">{item.value}</p>
                <p
                  className={`mt-4 w-fit rounded-full border px-3 py-1 text-xs font-bold ${toneClass(
                    item.tone,
                  )}`}
                >
                  {item.detail}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {managedDemos.length ? managedDemos.map((demo) => (
              <article
                key={demo.company}
                className="rounded-[2rem] border border-white/10 bg-[#0b1024] p-5"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-black">{demo.company}</h3>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                        {demo.type}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${demoStatusClass(
                          demo.status,
                        )}`}
                      >
                        {demo.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-400">
                      {demo.plan} · {demo.remaining}
                    </p>
                  </div>

                  <span className="w-fit rounded-full border border-white/10 px-3 py-2 text-xs font-black text-violet-200">
                    {demo.modules.length} módulos
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-sm md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Inicio
                    </p>
                    <p className="mt-2 font-bold text-slate-200">
                      {demo.startDate}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Fin
                    </p>
                    <p className="mt-2 font-bold text-slate-200">
                      {demo.endDate}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      Plan
                    </p>
                    <p className="mt-2 font-bold text-slate-200">
                      {demo.plan}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-violet-300">
                    Módulos desbloqueados
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {demo.modules.map((module) => (
                      <span
                        key={`${demo.company}-${module}`}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <form action={extendCompanyDemoFormAction}>
                    <input name="companyId" type="hidden" value={demo.companyId} />
                    <input name="days" type="hidden" value="7" />
                    <button
                      disabled={!canRunSuperadminActions}
                      className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Extender 7 días
                    </button>
                  </form>
                  <form action={extendCompanyDemoFormAction}>
                    <input name="companyId" type="hidden" value={demo.companyId} />
                    <input name="days" type="hidden" value="30" />
                    <button
                      disabled={!canRunSuperadminActions}
                      className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Extender 30 días
                    </button>
                  </form>
                  <form action={setCompanyDemoUnlimitedFormAction}>
                    <input name="companyId" type="hidden" value={demo.companyId} />
                    <button
                      disabled={!canRunSuperadminActions}
                      className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Sin límite
                    </button>
                  </form>
                  <form action={convertDemoToCustomerFormAction}>
                    <input name="companyId" type="hidden" value={demo.companyId} />
                    <input name="planId" type="hidden" value={demo.planId ?? ""} />
                    <button
                      disabled={!canRunSuperadminActions || !demo.planId}
                      className="rounded-xl bg-emerald-500/20 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Convertir en cliente
                    </button>
                  </form>
                  <form action={suspendCompanyDemoFormAction}>
                    <input name="companyId" type="hidden" value={demo.companyId} />
                    <button
                      disabled={!canRunSuperadminActions}
                      className="rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Suspender demo
                    </button>
                  </form>
                  <form action={exemptCompanyFromPromoRequirementFormAction}>
                    <input name="companyId" type="hidden" value={demo.companyId} />
                    <input name="exempt" type="hidden" value="true" />
                    <button
                      disabled={!canRunSuperadminActions}
                      className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      Eximir publicación promocional
                    </button>
                  </form>
                </div>
              </article>
            )) : (
              <div className="rounded-[2rem] border border-white/10 bg-[#0b1024] p-5 text-sm text-slate-300 xl:col-span-2">
                No hay demos activas ni accesos VIP pendientes de gestionar.
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-sky-400/20 bg-sky-500/10 p-6">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-sky-200">
                Módulos
              </p>
              <h2 className="mt-3 text-3xl font-black">Módulos por empresa</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
                Cambia el estado comercial de cada módulo por empresa. El
                estado Bloqueado se guarda como desactivado en Supabase para
                respetar el esquema actual.
              </p>
            </div>

            <span className="w-fit rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
              {canRunSuperadminActions ? "Cambios reales" : "Modo demo"}
            </span>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {moduleManagement.map((company) => (
              <article
                key={company.companyId}
                className="rounded-[2rem] border border-white/10 bg-[#0b1024] p-5"
              >
                <h3 className="text-2xl font-black">{company.company}</h3>
                <div className="mt-5 space-y-4">
                  {company.modules.map((module) => (
                    <div
                      key={`${company.companyId}-${module.moduleId}`}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                        <div>
                          <p className="font-black">{module.name}</p>
                          <span
                            className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${companyModuleStatusClass(
                              module.status,
                            )}`}
                          >
                            {companyModuleStatusLabel(module.status)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 md:justify-end">
                          {[
                            ["active", "Activo"],
                            ["recommended", "Recomendado"],
                            ["available", "Disponible"],
                            ["locked", "Bloqueado"],
                          ].map(([status, label]) => (
                            <form
                              key={`${company.companyId}-${module.moduleId}-${status}`}
                              action={updateCompanyModuleStatusFormAction}
                            >
                              <input
                                name="companyId"
                                type="hidden"
                                value={company.companyId}
                              />
                              <input
                                name="moduleId"
                                type="hidden"
                                value={module.moduleId}
                              />
                              <input name="status" type="hidden" value={status} />
                              <button
                                disabled={!canRunSuperadminActions}
                                className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                              >
                                {label}
                              </button>
                            </form>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Salud de clientes</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {healthStats.map((stat) => (
                <article
                  key={stat.label}
                  className={`rounded-2xl border p-4 ${toneClass(stat.tone)}`}
                >
                  <p className="text-sm">{stat.label}</p>
                  <p className="mt-2 text-3xl font-black">{stat.value}</p>
                </article>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {customerHealth.length ? customerHealth.map((item) => (
                <article
                  key={item.company}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div>
                      <p className="font-black">{item.company}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {item.reason}
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                      {item.risk}
                    </span>
                  </div>
                </article>
              )) : (
                <div className="rounded-2xl border border-white/10 bg-[#0b1024] p-4 text-sm text-slate-300">
                  No hay datos de salud de clientes todavía.
                </div>
              )}
            </div>
          </div>

          <aside id="soporte" className="scroll-mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black">Soporte y tickets</h2>
                <p className="mt-2 text-sm text-slate-400">
                  0 abiertos · sin incidencias
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {tickets.length ? tickets.map((ticket) => (
                <article
                  key={ticket.title}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black">{ticket.title}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {ticket.company}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-black ${priorityClass(
                        ticket.priority,
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </div>
                </article>
              )) : (
                <div className="rounded-2xl border border-white/10 bg-[#0b1024] p-4 text-sm text-slate-300">
                  No hay tickets abiertos.
                </div>
              )}
            </div>
          </aside>
        </section>
          </div>
        </div>
      </section>
    </main>
  );
}
