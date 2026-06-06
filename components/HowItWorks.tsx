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
      "La IA prepara publicaciones, respuestas, mensajes, reservas o informes según las herramientas incluidas en tu plan.",
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
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-600">
          Cómo funciona
        </p>

        <h2 className="text-4xl font-black text-slate-950 md:text-5xl">
          De una idea a un calendario organizado.
        </h2>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          AutonomIA está pensada para que el dueño del negocio no tenga que
          aprender herramientas complicadas.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(30,41,59,0.06)]"
          >
            <p className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-5xl font-black text-transparent">
              {step.number}
            </p>

            <h3 className="mt-6 text-xl font-black text-slate-950">
              {step.title}
            </h3>

            <p className="mt-4 leading-7 text-slate-600">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
