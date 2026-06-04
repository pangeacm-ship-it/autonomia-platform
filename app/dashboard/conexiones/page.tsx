const connections = [
  {
    name: "Instagram",
    status: "Conectado",
    description: "Publicación automática y aprobación previa desde SocialIA.",
    lastSync: "Hace 8 minutos",
    permissions: ["Publicar contenido", "Leer métricas", "Gestionar stories"],
    action: "Revisar conexión",
  },
  {
    name: "Facebook",
    status: "Conectado",
    description: "Publicación en la página del negocio y campañas locales.",
    lastSync: "Hace 8 minutos",
    permissions: ["Publicar en página", "Leer interacción", "Gestionar contenido"],
    action: "Revisar conexión",
  },
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

export default function ConexionesPage() {
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
          <h3 className="mt-2 text-4xl font-black">4</h3>
        </div>

        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
          <p className="text-sm text-amber-200">Pendientes</p>
          <h3 className="mt-2 text-4xl font-black">1</h3>
        </div>

        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
          <p className="text-sm text-red-200">Sin conectar</p>
          <h3 className="mt-2 text-4xl font-black">1</h3>
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
                <h2 className="text-2xl font-black">{connection.name}</h2>

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
                    : connection.status === "Pendiente"
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

            {connection.warning && (
              <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
                <p className="text-sm leading-6 text-amber-100">
                  <span className="font-black">Aviso:</span>{" "}
                  {connection.warning}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-bold hover:opacity-90">
                {connection.action}
              </button>

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