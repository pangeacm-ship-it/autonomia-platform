const notifications = [
  {
    type: "SocialIA",
    title: "Nueva publicación pendiente",
    description:
      "La IA ha generado una publicación para Instagram y Facebook.",
    time: "Hace 5 min",
    color: "violet",
  },
  {
    type: "ReviewIA",
    title: "Nueva reseña recibida",
    description:
      "Se ha recibido una nueva reseña de 5 estrellas en Google.",
    time: "Hace 18 min",
    color: "emerald",
  },
  {
    type: "LeadIA",
    title: "Nuevo cliente potencial",
    description:
      "Se ha detectado un posible cliente interesado desde Instagram.",
    time: "Hace 40 min",
    color: "sky",
  },
  {
    type: "ReservaIA",
    title: "Nueva solicitud de reserva",
    description:
      "Un cliente ha solicitado información para una reserva.",
    time: "Hace 1 hora",
    color: "amber",
  },
  {
    type: "InsightIA",
    title: "Recomendación IA",
    description:
      "Tus publicaciones del viernes generan más interacción que el resto.",
    time: "Hace 2 horas",
    color: "cyan",
  },
  {
    type: "Google Business",
    title: "Ficha optimizable",
    description:
      "La IA recomienda añadir fotografías recientes del negocio.",
    time: "Hoy",
    color: "green",
  },
];

export default function NotificacionesPage() {
  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-violet-600/20 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
          Centro de Notificaciones
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Todo lo que ocurre en AutonomIA
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Consulta en un único lugar las acciones generadas por la IA,
          oportunidades detectadas, reseñas, publicaciones y alertas
          importantes.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Pendientes</p>
          <h3 className="mt-2 text-4xl font-black">7</h3>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Nuevas hoy</p>
          <h3 className="mt-2 text-4xl font-black">12</h3>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Leads detectados</p>
          <h3 className="mt-2 text-4xl font-black">4</h3>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-slate-400">Reservas nuevas</p>
          <h3 className="mt-2 text-4xl font-black">2</h3>
        </div>
      </div>

      <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black">
            Actividad reciente
          </h2>

          <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
            Marcar todo como leído
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((item) => (
            <article
              key={`${item.type}-${item.title}`}
              className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        item.color === "violet"
                          ? "bg-violet-500/20 text-violet-300"
                          : item.color === "emerald"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : item.color === "sky"
                              ? "bg-sky-500/20 text-sky-300"
                              : item.color === "amber"
                                ? "bg-amber-500/20 text-amber-300"
                                : item.color === "cyan"
                                  ? "bg-cyan-500/20 text-cyan-300"
                                  : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {item.type}
                    </span>

                    <h3 className="font-black">
                      {item.title}
                    </h3>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {item.description}
                  </p>
                </div>

                <span className="text-sm text-slate-500">
                  {item.time}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}