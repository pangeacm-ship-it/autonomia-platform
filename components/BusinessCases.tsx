const businessCases = [
  {
    title: "Bar y restaurante",
    problem: "Publicar menús, promociones y responder reseñas lleva tiempo cada semana.",
    result: "SocialIA y ReviewIA preparan contenido y respuestas para aprobar en minutos.",
  },
  {
    title: "Centro de estética",
    problem: "Las reservas, recordatorios y preguntas frecuentes saturan WhatsApp.",
    result: "ReservaIA y WhatsAppIA ayudan a ordenar citas y mensajes repetitivos.",
  },
  {
    title: "Comercio local",
    problem: "Cuesta mantener presencia en redes y convertir consultas en oportunidades.",
    result: "Google Business, SocialIA y LeadIA convierten actividad diaria en captación.",
  },
];

export default function BusinessCases() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-300">
          Casos de uso
        </p>

        <h2 className="text-4xl font-black md:text-5xl">
          Una plataforma para negocios que no tienen tiempo que perder.
        </h2>

        <p className="mt-5 text-lg leading-8 text-slate-400">
          AutonomIA está pensada para convertir tareas digitales repetitivas en
          acciones listas para revisar, aprobar y publicar.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {businessCases.map((item) => (
          <article
            key={item.title}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-violet-400/40 hover:bg-white/[0.07]"
          >
            <h3 className="text-2xl font-black">{item.title}</h3>

            <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-slate-500">
              Problema
            </p>

            <p className="mt-3 leading-7 text-slate-400">{item.problem}</p>

            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-violet-300">
              Resultado
            </p>

            <p className="mt-3 leading-7 text-slate-300">{item.result}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
