import { getCurrentCompany } from "@/lib/data/companies";
import { getCompanySocialConnections } from "@/lib/data/social-connections";
import type { SocialConnectionStatus } from "@/types/database";

const staticConnections = [
  {
    name: "Google Business",
    status: "Conectado",
    description: "Reseñas, publicaciones locales y visibilidad en Google Maps.",
    lastSync: "Hace 12 minutos",
    permissions: ["Leer reseñas", "Publicar novedades", "Actualizar ficha"],
    action: "Revisar conexión",
  },
  {
    name: "WhatsApp Business",
    status: "Pendiente",
    description: "Atención automática, captación de leads y reservas.",
    lastSync: "Sin sincronizar",
    permissions: ["Responder mensajes", "Detectar reservas", "Crear leads"],
    action: "Conectar WhatsApp",
    warning:
      "Antes de migrar a WhatsApp Business, realiza una copia de seguridad completa.",
  },
  {
    name: "TikTok",
    status: "No conectado",
    description: "Publicación y planificación de vídeos cortos.",
    lastSync: "Sin sincronizar",
    permissions: ["Publicar vídeos", "Leer métricas", "Gestionar borradores"],
    action: "Conectar TikTok",
  },
  {
    name: "Web / Landing",
    status: "Activo",
    description: "Captación de demos, formularios y solicitudes comerciales.",
    lastSync: "Hace 3 minutos",
    permissions: ["Recibir formularios", "Crear leads", "Notificar al equipo"],
    action: "Ver formularios",
  },
];

function statusLabel(status: SocialConnectionStatus | string) {
  const labels: Record<string, string> = {
    connecting: "Conectando",
    connected: "Conectado",
    disconnected: "No conectado",
    error: "Error",
    expired: "Caducado",
    needs_review: "Requiere revisión",
  };

  return labels[status] ?? status;
}

function formatLastSync(value: string | null) {
  if (!value) return "Sin sincronizar";

  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function ConexionesPage() {
  const company = await getCurrentCompany();
  const socialConnections = await getCompanySocialConnections(company.id);
  const facebookConnection = socialConnections.find(
    (connection) => connection.platform === "facebook",
  );
  const instagramConnection = socialConnections.find(
    (connection) => connection.platform === "instagram",
  );
  const metaOAuthHref = `/api/integrations/meta/start?companyId=${company.id}`;
  const metaConnections = [
    {
      name: "Facebook",
      icon: "f",
      status: statusLabel(facebookConnection?.status ?? "disconnected"),
      description:
        "Página de Facebook preparada para futuras publicaciones aprobadas desde SocialIA.",
      lastSync: formatLastSync(facebookConnection?.last_sync_at ?? null),
      permissions: ["Página de Facebook", "Publicaciones aprobadas", "Métricas futuras"],
      action:
        facebookConnection?.status === "connected"
          ? "Revisar conexión"
          : "Conectar Facebook",
      oauthHref: `${metaOAuthHref}&platform=facebook`,
      notice: "OAuth real preparado. La conexión quedará en revisión antes de publicar.",
    },
    {
      name: "Instagram",
      icon: "◎",
      status: statusLabel(instagramConnection?.status ?? "disconnected"),
      description:
        "Instagram Business preparado para futuras publicaciones SocialIA.",
      lastSync: formatLastSync(instagramConnection?.last_sync_at ?? null),
      permissions: ["Instagram Business", "Publicaciones aprobadas", "Métricas futuras"],
      action:
        instagramConnection?.status === "connected"
          ? "Revisar conexión"
          : "Conectar Instagram",
      oauthHref: `${metaOAuthHref}&platform=instagram`,
      notice: "OAuth real preparado. La conexión quedará en revisión antes de publicar.",
    },
  ];
  const connections = [...metaConnections, ...staticConnections];
  const connectedCount = connections.filter(
    (connection) => connection.status === "Conectado" || connection.status === "Activo",
  ).length;
  const pendingCount = connections.filter(
    (connection) => connection.status === "Pendiente" || connection.status === "Requiere revisión",
  ).length;
  const disconnectedCount = connections.filter(
    (connection) => connection.status === "No conectado" || connection.status === "Caducado",
  ).length;

  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Conexiones
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Canales conectados a AutonomIA
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Gestiona integraciones, permisos y sincronización de redes sociales,
          Google Business, WhatsApp y formularios web.
        </p>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
          <p className="text-sm text-emerald-200">Conectadas</p>
          <h3 className="mt-2 text-4xl font-black">{connectedCount}</h3>
        </div>

        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
          <p className="text-sm text-amber-200">Pendientes</p>
          <h3 className="mt-2 text-4xl font-black">{pendingCount}</h3>
        </div>

        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
          <p className="text-sm text-red-200">Sin conectar</p>
          <h3 className="mt-2 text-4xl font-black">{disconnectedCount}</h3>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {connections.map((connection) => (
          <article
            key={connection.name}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
          >
            <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <div className="flex items-center gap-3">
                  {"icon" in connection && connection.icon ? (
                    <span className="flex size-10 items-center justify-center rounded-2xl bg-white text-lg font-black text-blue-700 shadow-[0_12px_28px_rgba(15,23,42,0.12)]">
                      {connection.icon}
                    </span>
                  ) : null}
                  <h2 className="text-2xl font-black">{connection.name}</h2>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {connection.description}
                </p>

                <p className="mt-3 text-xs font-bold text-slate-500">
                  Última sincronización: {connection.lastSync}
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-xs font-bold ${
                  connection.status === "Conectado" ||
                  connection.status === "Activo"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : connection.status === "Pendiente" ||
                        connection.status === "Conectando" ||
                        connection.status === "Requiere revisión"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-red-500/20 text-red-300"
                }`}
              >
                {connection.status}
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b1024] p-5">
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-sky-300">
                Permisos
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {connection.permissions.map((permission) => (
                  <li key={permission}>✓ {permission}</li>
                ))}
              </ul>
            </div>

            {"warning" in connection && connection.warning ? (
              <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
                <p className="text-sm leading-6 text-amber-100">
                  <span className="font-black">Aviso:</span>{" "}
                  {connection.warning}
                </p>
              </div>
            ) : null}

            {"notice" in connection && connection.notice ? (
              <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm leading-6 text-blue-900">
                  {connection.notice}
                </p>
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              {"oauthHref" in connection && connection.oauthHref ? (
                <a
                  href={connection.oauthHref}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-bold text-white hover:opacity-90"
                >
                  {"icon" in connection && connection.icon ? (
                    <span className="flex size-6 items-center justify-center rounded-full bg-white/15 text-sm">
                      {connection.icon}
                    </span>
                  ) : null}
                  {connection.action}
                </a>
              ) : (
                <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-bold hover:opacity-90">
                  {connection.action}
                </button>
              )}

              <button className="rounded-2xl border border-white/10 px-6 py-3 text-sm font-bold hover:bg-white/10">
                Ver detalles
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
