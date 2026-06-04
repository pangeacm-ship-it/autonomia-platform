import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { isSuperadmin } from "@/lib/auth/roles";
import { createCompanyWithAdminFormAction } from "@/lib/data/company-management";
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
  getSuperadminPlans,
  getSuperadminSubscriptions,
  getSuperadminUsageEvents,
} from "@/lib/data/superadmin";
import { getCurrentProfileContext } from "@/lib/data/profiles";
import { getSupabaseConfig } from "@/lib/supabase/config";
import type {
  Company,
  CompanyModule,
  CompanyUser,
  DemoRequest,
  Module,
  Subscription,
  UsageEvent,
} from "@/types/database";

type Priority = "Alta" | "Media" | "Baja";
type ClientStatus = "Activo" | "Renovación fallida" | "Demo";
type OnlineStatus = "Online ahora" | "Hace 3 min" | "Hace 8 min";
type SuperadminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const fallbackKpis = [
  { label: "Clientes activos", value: "18", change: "+4 este mes", tone: "emerald" },
  { label: "MRR", value: "1.840€", change: "+22%", tone: "violet" },
  { label: "ARR estimado", value: "22.080€", change: "Anualizado", tone: "sky" },
  { label: "Usuarios activos", value: "64", change: "12 online ahora", tone: "cyan" },
  { label: "Empresas en límite", value: "4", change: "Usuarios por plan", tone: "amber" },
  { label: "Churn", value: "3.2%", change: "Bajo control", tone: "emerald" },
  { label: "Renovaciones fallidas", value: "240€", change: "2 tarjetas a revisar", tone: "amber" },
  { label: "Demos solicitadas", value: "11", change: "5 sin gestionar", tone: "rose" },
  { label: "Uso IA", value: "3.482 acciones", change: "+31% este mes", tone: "violet" },
];

const fallbackClients = [
  {
    name: "Bar La Plaza",
    plan: "Crecimiento",
    status: "Activo" as ClientStatus,
    city: "Sevilla",
    users: "2",
    userLimit: "2",
    mrr: "100€",
    lastAccess: "Hoy 09:42",
    modules: ["SocialIA", "Google Business", "InsightIA"],
  },
  {
    name: "Clínica Nova",
    plan: "Local IA 360",
    status: "Activo" as ClientStatus,
    city: "Málaga",
    users: "4",
    userLimit: "5",
    mrr: "150€",
    lastAccess: "Hoy 08:15",
    modules: ["SocialIA", "ReviewIA", "WhatsAppIA", "LeadIA"],
  },
  {
    name: "Beauty Studio",
    plan: "Inicio",
    status: "Activo" as ClientStatus,
    city: "Córdoba",
    users: "1",
    userLimit: "1",
    mrr: "79€",
    lastAccess: "Ayer",
    modules: ["SocialIA"],
  },
  {
    name: "Restaurante Alameda",
    plan: "Crecimiento",
    status: "Renovación fallida" as ClientStatus,
    city: "Sevilla",
    users: "2",
    userLimit: "2",
    mrr: "100€",
    lastAccess: "Hace 2 días",
    modules: ["SocialIA", "ReservaIA", "ReviewIA"],
  },
  {
    name: "Dental Sur",
    plan: "Enterprise",
    status: "Demo" as ClientStatus,
    city: "Granada",
    users: "12",
    userLimit: "Sin límite",
    mrr: "Consultar",
    lastAccess: "Hace 4 días",
    modules: ["Multiubicación"],
  },
];

const fallbackOnlineUsers = [
  { name: "María López", company: "Bar La Plaza", module: "SocialIA", status: "Online ahora" as OnlineStatus },
  { name: "Pedro Ruiz", company: "Clínica Nova", module: "WhatsAppIA", status: "Hace 3 min" as OnlineStatus },
  { name: "Ana Gómez", company: "Beauty Studio", module: "Dashboard", status: "Hace 8 min" as OnlineStatus },
  { name: "Juanma", company: "Superadmin", module: "Analítica", status: "Online ahora" as OnlineStatus },
];

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
  { name: "Gratuito", clients: "2 demos", revenue: "0€/mes", users: "1 usuario" },
  { name: "Inicio", clients: "6 clientes", revenue: "474€/mes", users: "1 usuario" },
  { name: "Crecimiento", clients: "8 clientes", revenue: "800€/mes", users: "2 usuarios" },
  { name: "Local IA 360", clients: "3 clientes", revenue: "450€/mes", users: "Hasta 5 usuarios" },
  { name: "Enterprise", clients: "1 cliente", revenue: "Personalizado", users: "Usuarios personalizados" },
];

const freePlanClients = [
  {
    company: "Peluquería Laura",
    city: "Málaga",
    weeklyStatus: "Pendiente",
    supportPost: "No publicada",
    nextUnlock: "Bloqueado hasta apoyo semanal",
    exempt: false,
  },
  {
    company: "Cafetería Sol",
    city: "Granada",
    weeklyStatus: "Desbloqueado",
    supportPost: "Publicada",
    nextUnlock: "2 publicaciones disponibles",
    exempt: false,
  },
  {
    company: "Asesoría Norte",
    city: "Huelva",
    weeklyStatus: "Exento",
    supportPost: "Exención manual",
    nextUnlock: "Sin obligación promocional",
    exempt: true,
  },
];

const fallbackRevenueMetrics = [
  { label: "MRR total", value: "1.840€" },
  { label: "ARPU medio", value: "102€" },
  { label: "Renovaciones fallidas", value: "240€" },
  { label: "Tarjetas caducadas", value: "2" },
  { label: "Próximos cobros", value: "9" },
];

const fallbackLocations = [
  { city: "Sevilla", clients: "8 clientes", plan: "Crecimiento", opportunity: "Alta demanda en restauración" },
  { city: "Málaga", clients: "4 clientes", plan: "Local IA 360", opportunity: "Clínicas y estética" },
  { city: "Córdoba", clients: "3 clientes", plan: "Inicio", opportunity: "Comercios locales" },
  { city: "Granada", clients: "2 clientes", plan: "Enterprise", opportunity: "Multiubicación" },
  { city: "Huelva", clients: "1 cliente", plan: "Inicio", opportunity: "Primeras demos" },
];

const fallbackDemoRequests = [
  { company: "Gimnasio CentroFit", city: "Sevilla", interest: "Interesado en LeadIA", status: "Pendiente" },
  { company: "Peluquería Laura", city: "Málaga", interest: "Interesado en SocialIA", status: "Pendiente" },
  { company: "Clínica Dental Norte", city: "Córdoba", interest: "Interesado en ReviewIA", status: "Contactado" },
  { company: "Cafetería Sol", city: "Granada", interest: "Interesado en ReservaIA", status: "Nuevo" },
];

const fallbackDemoSummary = [
  { label: "Demos activas", value: "4", detail: "Con seguimiento comercial", tone: "sky" },
  { label: "Demos VIP", value: "1", detail: "Sin límite definido", tone: "violet" },
  { label: "Caducan pronto", value: "2", detail: "Menos de 7 días", tone: "amber" },
  { label: "Conversiones del mes", value: "3", detail: "+27% sobre mayo", tone: "emerald" },
];

const fallbackManagedDemos = [
  {
    companyId: "demo-company-bar-la-plaza",
    planId: "plan-crecimiento",
    company: "Bar La Plaza",
    type: "Demo Comercial",
    status: "Demo activa",
    startDate: "20 mayo 2026",
    endDate: "15 junio 2026",
    remaining: "12 días restantes",
    plan: "Crecimiento",
    modules: ["SocialIA", "Google Business", "InsightIA", "ReviewIA"],
  },
  {
    companyId: "demo-company-clinica-nova",
    planId: "plan-local-ia-360",
    company: "Clínica Nova",
    type: "Demo VIP",
    status: "Sin límite",
    startDate: "08 mayo 2026",
    endDate: "Sin límite",
    remaining: "Sin límite",
    plan: "Local IA 360",
    modules: ["SocialIA", "ReviewIA", "WhatsAppIA", "LeadIA", "ReservaIA"],
  },
  {
    companyId: "demo-company-beauty-studio",
    planId: "plan-inicio",
    company: "Beauty Studio",
    type: "Demo Normal",
    status: "Trial",
    startDate: "28 mayo 2026",
    endDate: "07 junio 2026",
    remaining: "4 días restantes",
    plan: "Inicio",
    modules: ["SocialIA", "Calendario IA"],
  },
  {
    companyId: "demo-company-dental-sur",
    planId: "plan-enterprise",
    company: "Dental Sur",
    type: "Demo Enterprise",
    status: "Sin límite",
    startDate: "14 mayo 2026",
    endDate: "Sin límite",
    remaining: "Sin límite",
    plan: "Enterprise",
    modules: ["Multiubicación", "ReviewIA", "InsightIA", "Soporte prioritario"],
  },
];

const alerts = [
  { text: "2 renovaciones fallidas pendientes de regularizar", priority: "Alta" as Priority },
  { text: "5 demos sin gestionar", priority: "Alta" as Priority },
  { text: "1 cliente Enterprise pendiente de propuesta", priority: "Media" as Priority },
  { text: "WhatsAppIA tiene alta demanda esta semana", priority: "Media" as Priority },
  { text: "3 clientes en riesgo de suspensión por baja actividad", priority: "Baja" as Priority },
];

const fallbackAiUsage = [
  { label: "Publicaciones generadas", value: "1.248", width: "92%" },
  { label: "Respuestas a reseñas", value: "438", width: "56%" },
  { label: "Leads detectados", value: "312", width: "44%" },
  { label: "Reservas gestionadas", value: "196", width: "36%" },
  { label: "Informes generados", value: "87", width: "22%" },
  { label: "Conversaciones WhatsApp", value: "1.201", width: "88%" },
];

const healthStats = [
  { label: "Clientes en riesgo", value: "3", tone: "amber" },
  { label: "Clientes muy activos", value: "9", tone: "emerald" },
  { label: "Clientes nuevos", value: "4", tone: "sky" },
  { label: "Sin actividad 7 días", value: "3", tone: "rose" },
];

const customerHealth = [
  { company: "Restaurante Alameda", risk: "Riesgo medio", reason: "Renovación fallida" },
  { company: "Beauty Studio", risk: "Riesgo bajo", reason: "Poco uso semanal" },
  { company: "Clínica Nova", risk: "Salud alta", reason: "Uso recurrente" },
];

const tickets = [
  { title: "Error al conectar Instagram", company: "Bar La Plaza", priority: "Alta" as Priority },
  { title: "Duda sobre factura", company: "Beauty Studio", priority: "Media" as Priority },
  { title: "Solicitud módulo Enterprise", company: "Dental Sur", priority: "Alta" as Priority },
];

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
) {
  const moduleById = new Map(modules.map((module) => [module.id, module.name]));

  return companies.slice(0, 8).map((company) => {
    const users = companyUsers.filter(
      (user) => user.company_id === company.id && user.status === "active",
    );
    const subscription = subscriptions.find(
      (item) => item.company_id === company.id,
    );
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
      name: company.name,
      plan: subscription?.plan_id?.replace("plan-", "") ?? "Sin plan",
      status: clientStatus(company),
      city: company.city ?? "Sin ciudad",
      users: String(users.length || 1),
      userLimit: subscription?.plan_id?.includes("local") ? "5" : "2",
      mrr: `${formatCurrency(subscription?.monthly_price_cents)}/mes`,
      lastAccess: formatShortDate(lastAccess),
      modules: activeModules.length ? activeModules : ["SocialIA"],
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
  return demos.slice(0, 8).map((demo) => ({
    company: demo.company_name,
    city: demo.city ?? "Sin ciudad",
    interest: demo.interested_module
      ? `Interesado en ${demo.interested_module}`
      : demo.industry ?? "Interés por demo",
    status:
      demo.status === "new"
        ? "Nuevo"
        : demo.status === "pending"
          ? "Pendiente"
          : demo.status === "contacted"
            ? "Contactado"
            : demo.status === "converted"
              ? "Convertido"
              : "Archivado",
  }));
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

function UnauthorizedSuperadmin() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
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
  ]);
  const realClients = buildClients(
    realCompanies,
    realCompanyUsers,
    realSubscriptions,
    realCompanyModules,
    realModules,
  );
  const clients = realClients.length ? realClients : fallbackClients;
  const realDemoRequestCards = buildDemoRequests(realDemoRequests);
  const demoRequests = realDemoRequestCards.length
    ? realDemoRequestCards
    : fallbackDemoRequests;
  const realModuleUsage = buildUsage(realUsageEvents);
  const moduleUsage = realModuleUsage.length
    ? realModuleUsage
    : fallbackModuleUsage;
  const realAiUsage = buildAiUsage(realUsageEvents);
  const aiUsage = realAiUsage.length ? realAiUsage : fallbackAiUsage;
  const activeCompanies = realCompanies.filter((company) => company.status === "active");
  const totalMrr = realSubscriptions.reduce(
    (sum, subscription) => sum + (subscription.monthly_price_cents ?? 0),
    0,
  );
  const kpis = realCompanies.length ? [
    { label: "Clientes activos", value: String(activeCompanies.length), change: "Datos Supabase/demo", tone: "emerald" },
    { label: "MRR", value: formatCurrency(totalMrr), change: "Suscripciones actuales", tone: "violet" },
    { label: "ARR estimado", value: formatCurrency(totalMrr * 12), change: "Anualizado", tone: "sky" },
    { label: "Usuarios activos", value: String(realCompanyUsers.filter((user) => user.status === "active").length), change: "Sesiones y equipos", tone: "cyan" },
    { label: "Empresas en límite", value: String(clients.filter((client) => client.users === client.userLimit).length), change: "Usuarios por plan", tone: "amber" },
    { label: "Churn", value: "3.2%", change: "Pendiente de cálculo real", tone: "emerald" },
    { label: "Renovaciones fallidas", value: String(realSubscriptions.filter((subscription) => subscription.status === "past_due").length), change: "Suscripciones past_due", tone: "amber" },
    { label: "Demos solicitadas", value: String(realDemoRequests.length), change: "Solicitudes registradas", tone: "rose" },
    { label: "Uso IA", value: `${realUsageEvents.reduce((sum, event) => sum + event.quantity, 0)} acciones`, change: "Eventos usage_events", tone: "violet" },
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
    realSubscriptions.reduce<Record<string, { clients: number; revenue: number }>>(
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
        realSubscriptions.length ? Math.round(totalMrr / realSubscriptions.length) : 0,
      ),
    },
    { label: "Renovaciones fallidas", value: String(realSubscriptions.filter((subscription) => subscription.status === "past_due").length) },
    { label: "Tarjetas caducadas", value: "Pendiente" },
    { label: "Próximos cobros", value: String(realSubscriptions.filter((subscription) => subscription.current_period_end).length) },
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
    { label: "Demos activas", value: String(realCompanies.filter((company) => company.status === "demo" || company.status === "trial").length), detail: "Empresas trial/demo", tone: "sky" },
    { label: "Demos VIP", value: "0", detail: "Pendiente de campo real", tone: "violet" },
    { label: "Caducan pronto", value: "0", detail: "Pendiente de fechas demo", tone: "amber" },
    { label: "Conversiones del mes", value: String(realDemoRequests.filter((demo) => demo.status === "converted").length), detail: "Solicitudes convertidas", tone: "emerald" },
  ] : fallbackDemoSummary;
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
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="mx-auto max-w-[1600px] px-5 py-6 sm:px-6 lg:px-10">
        <header className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-6 lg:p-8">
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

              <p className="mt-4 max-w-4xl text-slate-300">
                Control global de clientes, ingresos, uso de módulos y actividad
                de la plataforma.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold hover:bg-white/10">
                Exportar informe
              </button>
              <LogoutButton className="rounded-2xl border border-red-400/20 px-5 py-3 text-sm font-bold text-red-200 hover:bg-red-500/10" />
              <Link
                href="/onboarding"
                className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-center text-sm font-bold shadow-[0_0_35px_rgba(124,58,237,0.28)] hover:opacity-90"
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

        <section className="mt-6 rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6">
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
                  placeholder="Ej. Restaurante Alameda"
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
              <p className="mt-3 text-3xl font-black">{kpi.value}</p>
              <p
                className={`mt-4 w-fit rounded-full border px-3 py-1 text-xs font-bold ${toneClass(
                  kpi.tone,
                )}`}
              >
                {kpi.change}
              </p>
            </article>
          ))}
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
              {clients.map((client) => (
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
                          {client.mrr}
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
                      {["Ver empresa", "Ver usuarios", "Gestionar plan"].map(
                        (action) => (
                          <button
                            key={`${client.name}-${action}`}
                            className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold hover:bg-white/10"
                          >
                            {action}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-black">Usuarios online</h2>
              <div className="mt-5 space-y-3">
                {onlineUsers.map((user) => (
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
                ))}
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
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
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

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Ingresos y planes</h2>
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
                    <p className="font-bold text-emerald-300">{plan.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {revenueMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-black/20 p-4">
                  <p className="text-xs text-slate-400">{metric.label}</p>
                  <p className="mt-2 font-black">{metric.value}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Localidades</h2>
            <div className="mt-5 space-y-3">
              {locations.map((location) => (
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
              ))}
            </div>
          </article>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Solicitudes de demo</h2>
            <div className="mt-5 space-y-4">
              {demoRequests.map((demo) => (
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
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-black">Analítica de uso IA</h2>
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

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
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
            {freePlanClients.map((client) => {
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
            })}
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
            {managedDemos.map((demo) => (
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
            ))}
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
              {customerHealth.map((item) => (
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
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-black">Soporte y tickets</h2>
                <p className="mt-2 text-sm text-slate-400">
                  4 abiertos · 1 urgente · respuesta media 2h 15m
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {tickets.map((ticket) => (
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
              ))}
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
