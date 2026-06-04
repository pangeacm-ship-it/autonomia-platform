import AccessDeniedCard from "@/components/AccessDeniedCard";
import { getDashboardRouteAccess } from "@/lib/auth/access-control";
import { getCurrentCompany } from "@/lib/data/companies";
import { getCompanyUsers } from "@/lib/data/company-users";
import { getPlans } from "@/lib/data/plans";
import { getCurrentSubscription } from "@/lib/data/subscriptions";
import type { UserRole } from "@/types/database";

type UserStatus = "Activo" | "Pendiente";

type User = {
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  lastAccess: string;
};

const fallbackSummary = [
  { label: "Usuarios activos", value: "0", detail: "Sin usuarios registrados" },
  { label: "Invitaciones pendientes", value: "0", detail: "Sin invitaciones" },
  { label: "Administradores", value: "0", detail: "Pendiente de alta" },
  { label: "Roles configurados", value: "5", detail: "Permisos definidos" },
];

const fallbackUsers: User[] = [];

const roles = [
  {
    name: "Admin",
    access: "Acceso completo",
    color: "text-emerald-300",
  },
  {
    name: "Marketing",
    access: "SocialIA, ReviewIA, Calendario",
    color: "text-violet-300",
  },
  {
    name: "Comercial",
    access: "LeadIA, WhatsAppIA, ReservaIA",
    color: "text-sky-300",
  },
  {
    name: "Soporte",
    access: "WhatsAppIA, ReviewIA",
    color: "text-amber-300",
  },
  {
    name: "Solo lectura",
    access: "Informes y métricas",
    color: "text-slate-300",
  },
];

function formatDate(date: string | null) {
  if (!date) {
    return "Invitación enviada";
  }

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getRoleLabel(role: UserRole | string | null | undefined) {
  const labels: Record<string, string> = {
    superadmin: "Superadmin",
    company_admin: "Admin",
    marketing: "Marketing",
    sales: "Comercial",
    support: "Soporte",
    readonly: "Solo lectura",
  };

  return role ? labels[role] ?? role : "Sin rol";
}

function getUserLimit(planKey: string | null | undefined) {
  if (planKey === "gratuito" || planKey === "inicio") return 1;
  if (planKey === "crecimiento") return 2;
  if (planKey === "local_ia_360") return 5;
  return 2;
}

function getLimitLabel(limit: number) {
  return Number.isFinite(limit) ? String(limit) : "Personalizado";
}

function statusClass(status: UserStatus) {
  if (status === "Activo") {
    return "bg-emerald-500/20 text-emerald-300";
  }

  return "bg-amber-500/20 text-amber-300";
}

export default async function UsuariosPage() {
  const access = await getDashboardRouteAccess("/dashboard/usuarios");

  if (!access.allowed) {
    return (
      <AccessDeniedCard
        title="Usuarios avanzados no disponibles en tu plan"
        reason={access.reason ?? "La gestión de usuarios requiere ampliar el plan."}
        planName={access.plan?.name}
      />
    );
  }

  const [company, plans] = await Promise.all([getCurrentCompany(), getPlans()]);
  const [companyUsers, subscription] = await Promise.all([
    getCompanyUsers(company.id),
    getCurrentSubscription(company.id),
  ]);
  const currentPlan = plans.find((plan) => plan.id === subscription?.plan_id);
  const userLimit = getUserLimit(currentPlan?.key);
  const activeUsers = companyUsers.filter((user) => user.status === "active");
  const invitedUsers = companyUsers.filter((user) => user.status === "invited");
  const users: User[] = companyUsers.length
    ? companyUsers.map((user) => ({
        name: user.profile?.full_name ?? user.profile?.email ?? "Usuario sin nombre",
        email: user.profile?.email ?? "email-pendiente@autonomia.app",
        role: getRoleLabel(user.role?.key),
        status: user.status === "active" ? "Activo" : "Pendiente",
        lastAccess: formatDate(user.last_access_at),
      }))
    : fallbackUsers;
  const summary = [
    {
      label: "Usuarios activos",
      value: String(activeUsers.length),
      detail: `Límite ${currentPlan?.name ?? "Crecimiento"} ${activeUsers.length}/${getLimitLabel(userLimit)}`,
    },
    {
      label: "Invitaciones pendientes",
      value: String(invitedUsers.length),
      detail: "Esperando aceptación",
    },
    {
      label: "Administradores",
      value: String(companyUsers.filter((user) => user.role?.key === "company_admin").length),
      detail: "Acceso completo",
    },
    fallbackSummary[3],
  ];
  const planLimitText = `${currentPlan?.name ?? "Crecimiento"} · ${
    activeUsers.length
  }/${getLimitLabel(userLimit)} usuarios activos`;
  const limitWarning =
    Number.isFinite(userLimit) && activeUsers.length >= userLimit
      ? `El plan ${currentPlan?.name ?? "Crecimiento"} permite ${userLimit} usuarios activos. Las nuevas invitaciones quedan pendientes hasta ampliar plan o liberar un asiento.`
      : `El plan ${currentPlan?.name ?? "Crecimiento"} permite ${getLimitLabel(userLimit)} usuarios activos.`;
  const displayedInvitations = invitedUsers.map((user) => ({
        email: user.profile?.email ?? "email-pendiente@autonomia.app",
        role: getRoleLabel(user.role?.key),
        invitedAt: formatDate(user.invited_at),
      }));

  return (
    <section className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-6 lg:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Equipo
        </p>

        <div className="mt-5 flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <h1 className="text-3xl font-black sm:text-4xl">Usuarios y permisos</h1>

            <p className="mt-4 max-w-3xl text-slate-300">
              Gestiona quién puede acceder a AutonomIA y qué puede hacer cada
              persona.
            </p>
          </div>

          <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)] hover:opacity-90">
            Invitar usuario
          </button>
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

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black">Usuarios de la empresa</h2>

                <p className="mt-2 text-sm text-slate-400">
                  Controla accesos, roles y estado de invitaciones del equipo.
                </p>
              </div>

              <span className="w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-black text-slate-300">
                Plan {planLimitText}
              </span>
            </div>

            <div className="mb-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-50">
              {limitWarning}
            </div>

            <div className="space-y-4">
              {users.length ? users.map((user) => (
                <article
                  key={user.email}
                  className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
                >
                  <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-black">{user.name}</h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                            user.status,
                          )}`}
                        >
                          {user.status}
                        </span>
                      </div>

                      <p className="mt-2 break-words text-sm text-slate-400">
                        {user.email}
                      </p>
                    </div>

                    <div className="grid gap-4 text-sm md:grid-cols-2 xl:w-[420px]">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                          Rol
                        </p>
                        <p className="mt-2 font-bold text-slate-200">
                          {user.role}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                          Último acceso
                        </p>
                        <p className="mt-2 font-bold text-slate-200">
                          {user.lastAccess}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                        Editar
                      </button>

                      <button
                        className={`rounded-xl px-4 py-2 text-sm font-bold ${
                          user.status === "Pendiente"
                            ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                            : "bg-red-500/10 text-red-300 hover:bg-red-500/20"
                        }`}
                      >
                        {user.status === "Pendiente"
                          ? "Reenviar invitación"
                          : "Desactivar"}
                      </button>
                    </div>
                  </div>
                </article>
              )) : (
                <div className="rounded-3xl border border-white/10 bg-[#0b1024] p-6 text-sm leading-6 text-slate-300">
                  No hay usuarios registrados todavía para esta empresa.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-amber-400/20 bg-amber-500/10 p-6">
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-black">Invitaciones pendientes</h2>

                <p className="mt-2 text-sm text-slate-300">
                  Usuarios invitados que todavía no han completado el acceso.
                </p>
              </div>

              <span className="w-fit rounded-full bg-amber-500/20 px-4 py-2 text-xs font-black text-amber-300">
                {displayedInvitations.length} pendientes
              </span>
            </div>

            <div className="space-y-4">
              {displayedInvitations.length ? displayedInvitations.map((invitation) => (
                <article
                  key={invitation.email}
                  className="rounded-3xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <p className="break-words font-bold text-amber-50">
                        {invitation.email}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        {invitation.role} · Invitado el {invitation.invitedAt}
                      </p>
                    </div>

                    <button className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950 hover:bg-slate-200">
                      Reenviar
                    </button>
                  </div>
                </article>
              )) : (
                <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-sm leading-6 text-slate-300">
                  No hay invitaciones pendientes.
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Roles y permisos</h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Cada rol define qué módulos puede consultar o gestionar una
              persona dentro de AutonomIA.
            </p>

            <div className="mt-6 space-y-4">
              {roles.map((role) => (
                <article
                  key={role.name}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className={`font-black ${role.color}`}>
                        {role.name}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {role.access}
                      </p>
                    </div>

                    <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Rol
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-violet-400/30 bg-violet-500/10 p-6">
            <h2 className="text-xl font-black">Preparado para Supabase</h2>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              Esta pantalla usa datos simulados. La estructura está preparada
              para sustituirlos por usuarios, invitaciones y roles reales cuando
              se conecte la base de datos.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-xl font-black">Límites por plan</h2>

            <div className="mt-4 space-y-3 text-sm text-slate-300">
              {[
                "Gratuito · 1 usuario",
                "Inicio · 1 usuario",
                "Crecimiento · 2 usuarios",
                "Local IA · hasta 5 usuarios",
              ].map((limit) => (
                <p key={limit}>✓ {limit}</p>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
