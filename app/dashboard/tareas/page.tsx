const tasks = [
  {
    title: "Aprobar publicación del menú del día",
    module: "SocialIA",
    priority: "Alta",
    status: "Pendiente",
    due: "Hoy · 10:00",
  },
  {
    title: "Responder reseña negativa",
    module: "ReviewIA",
    priority: "Alta",
    status: "Pendiente",
    due: "Hoy · 12:00",
  },
  {
    title: "Contactar lead de Instagram",
    module: "LeadIA",
    priority: "Media",
    status: "En seguimiento",
    due: "Mañana",
  },
  {
    title: "Confirmar reserva para grupo",
    module: "ReservaIA",
    priority: "Media",
    status: "Pendiente",
    due: "Viernes · 18:00",
  },
];

export default function TareasPage() {
  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-amber-600/20 via-violet-600/20 to-blue-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-amber-200">
          Tareas
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Centro de trabajo diario
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Revisa todas las acciones pendientes de AutonomIA en un único lugar:
          publicaciones, reseñas, leads, reservas y recomendaciones.
        </p>
      </div>

      <div className="mb-8 grid gap-5 md:grid-cols-4">
        <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
          <p className="text-sm text-amber-200">Pendientes</p>
          <h3 className="mt-2 text-4xl font-black">4</h3>
        </div>

        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
          <p className="text-sm text-red-200">Alta prioridad</p>
          <h3 className="mt-2 text-4xl font-black">2</h3>
        </div>

        <div className="rounded-3xl border border-sky-500/20 bg-sky-500/10 p-6">
          <p className="text-sm text-sky-200">En seguimiento</p>
          <h3 className="mt-2 text-4xl font-black">1</h3>
        </div>

        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-6">
          <p className="text-sm text-emerald-200">Completadas hoy</p>
          <h3 className="mt-2 text-4xl font-black">6</h3>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-black">Tareas pendientes</h2>
            <p className="mt-2 text-sm text-slate-400">
              Acciones recomendadas por la IA ordenadas por prioridad.
            </p>
          </div>

          <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-bold">
            Crear tarea
          </button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <article
              key={task.title}
              className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
            >
              <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-black">{task.title}</h3>

                    <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
                      {task.module}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-400">
                    Vencimiento: {task.due}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      task.priority === "Alta"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {task.priority}
                  </span>

                  <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-300">
                    {task.status}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-500/30">
                  Marcar completada
                </button>

                <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                  Ver módulo
                </button>

                <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                  Posponer
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}