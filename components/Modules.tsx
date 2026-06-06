const planTools = [
  {
    name: "Gratuito",
    label: "Para empezar",
    description: "Prueba la base de AutonomIA y organiza tus primeras acciones.",
    tools: ["SocialIA básico", "Calendario básico", "Elena IA básica limitada"],
  },
  {
    name: "Inicio",
    label: "Todo lo anterior +",
    description: "Trabaja tu contenido con más constancia y organización.",
    tools: ["SocialIA completo", "Calendario Inteligente", "Elena IA básica"],
  },
  {
    name: "Crecimiento",
    label: "Todo lo anterior +",
    description: "Aumenta tu visibilidad local y entiende mejor los resultados.",
    tools: ["Google Business", "ReviewIA básico", "InsightIA básico"],
    highlighted: true,
  },
  {
    name: "🏆 Local IA",
    label: "Experiencia AutonomIA Completa",
    description: "Automatiza marketing, atención y análisis desde un mismo lugar.",
    tools: [
      "WhatsApp Business",
      "TikTok & Shorts",
      "ReviewIA e InsightIA completos",
      "Elena IA avanzada",
    ],
    complete: true,
  },
];

export default function Modules() {
  return (
    <section id="modulos" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-600">
          Planes y herramientas
        </p>

        <h2 className="text-4xl font-black text-slate-950 md:text-5xl">
          Cada plan desbloquea
          <br />
          nuevas herramientas.
        </h2>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          Empieza con la base que necesitas y actualiza tu plan cuando quieras
          más visibilidad, automatización o capacidad de atención.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {planTools.map((plan, index) => (
          <article
            key={plan.name}
            className={`relative flex h-full flex-col rounded-[2rem] border p-6 ${
              plan.complete
                ? "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-violet-50 shadow-[0_28px_80px_rgba(37,99,235,0.14)]"
                : plan.highlighted
                  ? "border-violet-200 bg-violet-50 shadow-[0_22px_60px_rgba(109,40,217,0.10)]"
                  : "border-slate-200 bg-white shadow-[0_18px_50px_rgba(30,41,59,0.06)]"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Paso {index + 1}
              </span>
              {plan.highlighted ? (
                <span className="rounded-full bg-violet-600 px-3 py-2 text-[10px] font-black uppercase text-white">
                  Más popular
                </span>
              ) : null}
            </div>

            <h3 className="mt-6 text-2xl font-black text-slate-950">
              {plan.name}
            </h3>
            <p className="mt-3 text-sm font-black text-violet-700">{plan.label}</p>
            <p className="mt-4 min-h-[84px] text-sm leading-6 text-slate-600">
              {plan.description}
            </p>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                Herramientas incluidas
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {plan.tools.map((tool) => (
                  <li key={tool} className="flex gap-2">
                    <span className="font-black text-emerald-600">✓</span>
                    <span>{tool}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
