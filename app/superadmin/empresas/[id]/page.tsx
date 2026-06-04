import Link from "next/link";
import PasswordInput from "@/components/PasswordInput";
import {
  archiveCompanyFormAction,
  deleteCompanyPermanentlyFormAction,
  resetCompanyAdminAccessFormAction,
  getCompanyManagementDetail,
  suspendCompanyFormAction,
  updateCompanyFormAction,
  updateCompanyModulesFormAction,
  updateCompanyPlanFormAction,
  updateCompanyCommercialStatusFormAction,
  updateCompanyStatusFormAction,
} from "@/lib/data/company-management";
import { resolveCommercialAccess } from "@/lib/data/commercial-access";
import {
  convertDemoToCustomerFormAction,
  extendCompanyDemoFormAction,
  setCompanyDemoUnlimitedFormAction,
  suspendCompanyDemoFormAction,
} from "@/lib/data/superadmin-actions";
import type { Company } from "@/types/database";

type CompanyDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const companyStatuses: Array<{ value: Company["status"]; label: string }> = [
  { value: "trial", label: "Trial" },
  { value: "demo", label: "Demo" },
  { value: "active", label: "Activa" },
  { value: "past_due", label: "Renovación fallida" },
  { value: "suspended", label: "Suspendida" },
  { value: "canceled", label: "Cancelada" },
];

const commercialStatuses = [
  { value: "paying", label: "Cliente de pago" },
  { value: "vip", label: "Acceso VIP" },
  { value: "partner", label: "Partner" },
  { value: "beta", label: "Beta tester" },
  { value: "unlimited_demo", label: "Demo ilimitada" },
];

function statusClass(status: string) {
  if (status === "active") return "bg-emerald-500/20 text-emerald-300";
  if (status === "suspended" || status === "canceled") {
    return "bg-rose-500/20 text-rose-300";
  }
  if (status === "past_due") return "bg-amber-500/20 text-amber-300";
  return "bg-sky-500/20 text-sky-300";
}

function formatDate(date: string | null | undefined) {
  if (!date) return "Sin fecha";

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function CompanyDetailPage({
  params,
  searchParams,
}: CompanyDetailPageProps) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const actionMessage = typeof query.message === "string" ? query.message : null;
  const actionFeedback = typeof query.action === "string" ? query.action : null;
  const detail = await getCompanyManagementDetail(id);

  if (!detail) {
    return (
      <main className="min-h-screen bg-[#050816] px-6 py-12 text-white">
        <section className="mx-auto max-w-2xl rounded-[2rem] border border-rose-400/20 bg-rose-500/10 p-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-rose-200">
            Acceso denegado
          </p>
          <h1 className="mt-4 text-3xl font-black">Empresa no disponible</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            No se pudo cargar la empresa o la sesión actual no tiene permisos
            de superadmin.
          </p>
          <Link
            href="/superadmin"
            className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950"
          >
            Volver a Superadmin
          </Link>
        </section>
      </main>
    );
  }

  const activeModuleIds = new Set(
    detail.companyModules
      .filter((companyModule) => companyModule.status === "active")
      .map((companyModule) => companyModule.module_id),
  );
  const currentPlanId = detail.subscription?.plan_id ?? "";
  const currentPlan = detail.plans.find((plan) => plan.id === currentPlanId);
  const commercialAccess = resolveCommercialAccess({
    company: detail.company,
    subscription: detail.subscription,
    plan: currentPlan,
    notes: detail.notes,
  });

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="mx-auto max-w-[1500px] px-5 py-6 sm:px-6 lg:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/superadmin"
            className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"
          >
            Volver a Superadmin
          </Link>
          <span
            className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] ${statusClass(
              detail.company.status,
            )}`}
          >
            {detail.company.status}
          </span>
        </div>

        {actionMessage ? (
          <div
            className={`mb-6 rounded-[2rem] border p-4 text-sm font-bold ${
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

        <header className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-6 lg:p-8">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-200">
            Edición de empresa
          </p>
          <h1 className="mt-4 text-3xl font-black sm:text-5xl">
            {detail.company.name}
          </h1>
          <p className="mt-4 max-w-4xl text-slate-300">
            Gestiona datos comerciales, plan, módulos, demo y acceso inicial
            del administrador.
          </p>
        </header>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">Datos de empresa</h2>
            <form action={updateCompanyFormAction} className="mt-5 grid gap-4 md:grid-cols-2">
              <input name="companyId" type="hidden" value={detail.company.id} />
              <input
                name="adminProfileId"
                type="hidden"
                value={detail.adminProfile?.id ?? ""}
              />
              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Nombre empresa
                <input
                  name="name"
                  defaultValue={detail.company.name}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 outline-none"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Sector
                <select
                  name="sectorId"
                  defaultValue={detail.company.sector_id ?? ""}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 outline-none"
                >
                  <option value="">Sin sector</option>
                  {detail.sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Ciudad
                <input
                  name="city"
                  defaultValue={detail.company.city ?? ""}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 outline-none"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Teléfono contacto
                <input
                  name="adminPhone"
                  defaultValue={detail.adminProfile?.phone ?? ""}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 outline-none"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Administrador
                <input
                  name="ownerName"
                  defaultValue={detail.company.owner_name ?? detail.adminProfile?.full_name ?? ""}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 outline-none"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-200">
                Email administrador
                <input
                  name="ownerEmail"
                  type="email"
                  defaultValue={detail.company.owner_email ?? detail.adminProfile?.email ?? ""}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 outline-none"
                />
              </label>
              <button className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 md:col-span-2">
                Guardar cambios
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-black">Plan y suscripción</h2>
              <p className="mt-3 text-sm text-slate-400">
                Estado actual: {detail.subscription?.status ?? "sin suscripción"} ·
                próximo fin: {formatDate(detail.subscription?.current_period_end)}
              </p>
              <form action={updateCompanyPlanFormAction} className="mt-5 grid gap-3">
                <input name="companyId" type="hidden" value={detail.company.id} />
                <select
                  name="planId"
                  defaultValue={currentPlanId}
                  className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 outline-none"
                >
                  {detail.plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
                <button className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-black hover:bg-white/10">
                  Cambiar plan
                </button>
              </form>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-black">Estado empresa</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {companyStatuses.map((status) => (
                  <form key={status.value} action={updateCompanyStatusFormAction}>
                    <input name="companyId" type="hidden" value={detail.company.id} />
                    <input name="status" type="hidden" value={status.value} />
                    <button className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold hover:bg-white/10">
                      {status.label}
                    </button>
                  </form>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-violet-400/20 bg-violet-500/10 p-6">
              <h2 className="text-2xl font-black">Estado comercial</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Estado actual: {commercialAccess.label}. Los accesos VIP,
                partner, beta y demo ilimitada no computan ingresos.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {commercialStatuses.map((status) => (
                  <form
                    key={status.value}
                    action={updateCompanyCommercialStatusFormAction}
                  >
                    <input name="companyId" type="hidden" value={detail.company.id} />
                    <input
                      name="commercialStatus"
                      type="hidden"
                      value={status.value}
                    />
                    <button
                      className={`rounded-xl border px-3 py-2 text-xs font-bold hover:bg-white/10 ${
                        commercialAccess.kind === status.value
                          ? "border-violet-300/40 bg-violet-400/20 text-violet-100"
                          : "border-white/10"
                      }`}
                    >
                      {status.label}
                    </button>
                  </form>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Módulos activos</h2>
          <form action={updateCompanyModulesFormAction} className="mt-5 grid gap-4">
            <input name="companyId" type="hidden" value={detail.company.id} />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {detail.modules.map((module) => (
                <label
                  key={module.id}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 text-sm font-bold text-slate-200"
                >
                  <input
                    name="moduleIds"
                    type="checkbox"
                    value={module.id}
                    defaultChecked={activeModuleIds.has(module.id)}
                    className="h-4 w-4 accent-violet-400"
                  />
                  {module.name}
                </label>
              ))}
            </div>
            <button className="w-fit rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950">
              Guardar módulos
            </button>
          </form>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-2">
          <article className="rounded-[2rem] border border-violet-400/20 bg-violet-500/10 p-6">
            <h2 className="text-2xl font-black">Demo y conversión</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              <form action={extendCompanyDemoFormAction}>
                <input name="companyId" type="hidden" value={detail.company.id} />
                <input name="days" type="hidden" value="7" />
                <button className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold hover:bg-white/10">
                  Extender 7 días
                </button>
              </form>
              <form action={extendCompanyDemoFormAction}>
                <input name="companyId" type="hidden" value={detail.company.id} />
                <input name="days" type="hidden" value="30" />
                <button className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold hover:bg-white/10">
                  Extender 30 días
                </button>
              </form>
              <form action={setCompanyDemoUnlimitedFormAction}>
                <input name="companyId" type="hidden" value={detail.company.id} />
                <button className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold hover:bg-white/10">
                  Demo sin límite
                </button>
              </form>
              <form action={convertDemoToCustomerFormAction}>
                <input name="companyId" type="hidden" value={detail.company.id} />
                <input name="planId" type="hidden" value={currentPlanId} />
                <button className="rounded-xl bg-emerald-500/20 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30">
                  Convertir en cliente
                </button>
              </form>
              <form action={suspendCompanyDemoFormAction}>
                <input name="companyId" type="hidden" value={detail.company.id} />
                <button className="rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20">
                  Suspender demo
                </button>
              </form>
            </div>
          </article>

          <article className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6">
            <h2 className="text-2xl font-black">Acceso administrador</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {detail.adminProfile?.auth_user_id
                ? "El administrador tiene usuario Auth vinculado."
                : "El administrador todavía no tiene usuario Auth vinculado."}
            </p>
            <form action={resetCompanyAdminAccessFormAction} className="mt-5 grid gap-3">
              <input name="companyId" type="hidden" value={detail.company.id} />
              <input
                name="profileId"
                type="hidden"
                value={detail.adminProfile?.id ?? ""}
              />
              <input
                name="adminEmail"
                type="hidden"
                value={detail.adminProfile?.email ?? detail.company.owner_email ?? ""}
              />
              <input
                name="adminName"
                type="hidden"
                value={detail.adminProfile?.full_name ?? detail.company.owner_name ?? ""}
              />
              <PasswordInput
                name="temporaryPassword"
                className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-3 outline-none"
                placeholder="Nueva contraseña temporal"
              />
              <label className="flex items-center gap-3 text-sm font-bold text-slate-200">
                <input name="sendInvitation" type="checkbox" className="h-4 w-4 accent-cyan-400" />
                Enviar invitación si no se usa contraseña temporal
              </label>
              <button className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950">
                Resetear acceso / generar invitación
              </button>
            </form>
          </article>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Notas superadmin</h2>
          <div className="mt-5 space-y-3">
            {detail.notes.length ? (
              detail.notes.map((note) => (
                <article key={note.id} className="rounded-2xl border border-white/10 bg-[#0b1024] p-4">
                  <p className="text-sm leading-6 text-slate-300">{note.note}</p>
                  <p className="mt-2 text-xs text-slate-500">{formatDate(note.created_at)}</p>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-400">Sin notas internas todavía.</p>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-rose-400/20 bg-rose-500/10 p-6">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-rose-200">
                Zona de baja
              </p>
              <h2 className="mt-3 text-3xl font-black">Gestionar cliente no interesado</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300">
                Archivar es la opción recomendada cuando un cliente ya no está
                interesado. Suspender bloquea acceso sin borrar datos. Eliminar
                definitivamente solo está permitido si no existe facturación ni
                trazabilidad fiscal asociada.
              </p>
            </div>
            <span className="w-fit rounded-full bg-rose-500/20 px-4 py-2 text-xs font-black text-rose-200">
              Acciones sensibles
            </span>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <article className="rounded-[2rem] border border-white/10 bg-[#0b1024] p-5">
              <h3 className="text-xl font-black">Archivar cliente</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Recomendado si el cliente no sigue. Cancela la suscripción
                interna, inactiva usuarios y conserva datos.
              </p>
              <form action={archiveCompanyFormAction} className="mt-5">
                <input name="companyId" type="hidden" value={detail.company.id} />
                <button className="rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950">
                  Archivar cliente
                </button>
              </form>
            </article>

            <article className="rounded-[2rem] border border-white/10 bg-[#0b1024] p-5">
              <h3 className="text-xl font-black">Suspender acceso</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Bloquea el acceso operativo sin eliminar datos ni cancelar
                documentación interna.
              </p>
              <form action={suspendCompanyFormAction} className="mt-5">
                <input name="companyId" type="hidden" value={detail.company.id} />
                <button className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-5 py-3 text-sm font-black text-amber-200">
                  Suspender acceso
                </button>
              </form>
            </article>

            <article className="rounded-[2rem] border border-rose-400/30 bg-rose-500/10 p-5">
              <h3 className="text-xl font-black">Eliminar definitivamente</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Solo si no hay facturas, pagos, eventos de cobro ni registros
                fiscales. Escribe ELIMINAR para confirmar.
              </p>
              <form action={deleteCompanyPermanentlyFormAction} className="mt-5 grid gap-3">
                <input name="companyId" type="hidden" value={detail.company.id} />
                <input
                  name="deleteConfirmation"
                  className="rounded-2xl border border-rose-400/20 bg-[#0b1024] px-4 py-3 text-white outline-none"
                  placeholder="ELIMINAR"
                />
                <button className="rounded-2xl bg-rose-500/20 px-5 py-3 text-sm font-black text-rose-200 hover:bg-rose-500/30">
                  Eliminar definitivamente
                </button>
              </form>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
