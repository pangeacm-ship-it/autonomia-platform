import Link from "next/link";
import { getCurrentProfileContext } from "@/lib/data/profiles";
import { CuentaForm } from "./CuentaForm";

function formatLastAccess(dateStr: string | null) {
  if (!dateStr) return "Sin registro";

  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 2) return "Ahora mismo";
  if (minutes < 60) return `Hace ${minutes} minutos`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `Hace ${hours} horas`;

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export default async function CuentaPage() {
  const profileContext = await getCurrentProfileContext();
  const { profile, memberships, primaryRole } = profileContext;
  const lastAccess = memberships[0]?.last_access_at ?? null;

  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Cuenta
        </p>

        <h1 className="mt-4 text-4xl font-black">Perfil personal</h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Gestiona tus datos personales y seguridad.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <h2 className="mb-6 text-2xl font-black">Datos personales</h2>

          <CuentaForm
            profileId={profile.id}
            fullName={profile.full_name ?? ""}
            email={profile.email}
            phone={profile.phone ?? ""}
          />
        </div>

        <aside className="space-y-6">
          {/* Info de cuenta */}
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">Tu cuenta</h3>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Email</span>
                <span className="font-bold text-slate-200 truncate max-w-[180px]">{profile.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Rol</span>
                <span className="font-bold text-violet-300 capitalize">{primaryRole ?? "usuario"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Estado</span>
                <span className={`font-bold ${profile.status === "active" ? "text-emerald-300" : "text-amber-300"}`}>
                  {profile.status === "active" ? "Activo" : profile.status}
                </span>
              </div>

              {lastAccess ? (
                <div className="flex justify-between">
                  <span className="text-slate-400">Último acceso</span>
                  <span className="font-bold text-slate-200">{formatLastAccess(lastAccess)}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Seguridad */}
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">Seguridad</h3>

            <p className="mt-3 text-sm text-slate-400">
              Cambia tu contraseña si crees que puede estar comprometida.
            </p>

            <Link
              href="/change-password"
              className="mt-5 block rounded-xl border border-white/10 px-4 py-3 text-center font-bold hover:bg-white/10"
            >
              Cambiar contraseña
            </Link>
          </div>

          {/* Empresas vinculadas */}
          {memberships.length > 0 ? (
            <div className="rounded-[2rem] border border-violet-400/20 bg-violet-500/10 p-6">
              <h3 className="text-xl font-black text-violet-200">Empresas vinculadas</h3>

              <div className="mt-4 space-y-3">
                {memberships.map((m) => (
                  <div key={m.id} className="rounded-2xl border border-white/10 bg-[#0b1024] p-4">
                    <p className="text-sm font-bold">{m.company_id ?? "Empresa"}</p>
                    <p className="mt-1 text-xs text-violet-300 capitalize">{m.role?.key ?? "usuario"}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
