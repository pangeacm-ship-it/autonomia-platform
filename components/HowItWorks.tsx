const steps = [
  {
    number: "01",
    title: "Envía una foto, audio o mensaje",
    description:
      "El negocio puede mandar contenido por WhatsApp: una foto de un plato, una promoción, una reseña o una consulta de cliente.",
  },
  {
    number: "02",
    title: "AutonomIA genera la mejor acción",
    description:
      "La IA prepara publicaciones, respuestas, mensajes, reservas o informes según el módulo contratado.",
  },
  {
    number: "03",
    title: "Aprueba o automatiza",
    description:
      "El cliente puede revisar antes de publicar o dejar que AutonomIA trabaje en automático según su configuración.",
  },
  {
    number: "04",
    title: "El negocio gana tiempo",
    description:
      "Menos tareas repetitivas, más presencia digital y mejor atención al cliente sin contratar más personal.",
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-300">
          Cómo funciona
        </p>

        <h2 className="text-4xl font-black md:text-5xl">
          De WhatsApp a resultados.
        </h2>

        <p className="mt-5 text-lg leading-8 text-slate-400">
          AutonomIA está pensada para que el dueño del negocio no tenga que
          aprender herramientas complicadas.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
          >
            <p className="bg-gradient-to-r from-sky-300 to-violet-400 bg-clip-text text-5xl font-black text-transparent">
              {step.number}
            </p>

            <h3 className="mt-6 text-xl font-black">{step.title}</h3>

            <p className="mt-4 leading-7 text-slate-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}