const actions = [
  {
    title: "Publicación para Instagram",
    module: "SocialIA",
    type: "Contenido generado",
    status: "Pendiente de aprobación",
    preview:
      "Hoy en Bar La Plaza te esperamos con nuestro menú casero del día, preparado con productos frescos y mucho sabor. Reserva tu mesa y disfruta de comida de verdad.",
    date: "Sugerido para hoy · 13:30",
  },
  {
    title: "Respuesta a reseña positiva",
    module: "ReviewIA",
    type: "Respuesta sugerida",
    status: "Lista para revisar",
    preview:
      "Muchas gracias por tu reseña. Nos alegra saber que disfrutaste de la comida y del trato recibido. Te esperamos pronto de nuevo.",
    date: "Detectada hace 2 horas",
  },
  {
    title: "Seguimiento de cliente interesado",
    module: "LeadIA",
    type: "Acción comercial",
    status: "Sugerida",
    preview:
      "Contactar con Laura para ofrecer disponibilidad para grupos y cerrar una reserva esta semana.",
    date: "Lead captado desde Instagram",
  },
];

export default function ActionCards() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-6">
        <h3 className="text-xl font-black">Acciones generadas por IA</h3>

        <p className="mt-2 text-sm text-slate-400">
          Revisa, edita, aprueba o programa las acciones preparadas por
          AutonomIA.
        </p>
      </div>

      <div className="space-y-4">
        {actions.map((action) => (
          <article
            key={action.title}
            className="rounded-3xl border border-white/10 bg-[#0b1024] p-5"
          >
            <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h4 className="text-lg font-black">{action.title}</h4>

                  <span className="rounded-full bg-violet-500/20 px-3 py-1 text-[10px] font-black text-violet-300">
                    {action.module}
                  </span>
                </div>

                <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  {action.type}
                </p>
              </div>

              <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-black text-amber-300">
                {action.status}
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm leading-6 text-slate-300">
                {action.preview}
              </p>
            </div>

            <p className="mt-3 text-xs text-slate-500">{action.date}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-500/30">
                Aprobar
              </button>

              <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                Editar
              </button>

              <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                Programar
              </button>

              <button className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-500/20">
                Descartar
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}