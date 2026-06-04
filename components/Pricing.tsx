import Link from "next/link";

const plans = [
  {
    name: "Gratuito",
    label: "EMPIEZA",
    officialPrice: null,
    launchPrice: "0€",
    description:
      "Para probar AutonomIA con SocialIA limitado y presencia básica en redes.",
    features: [
      "1 usuario",
      "Instagram + Facebook",
      "2 publicaciones semanales",
      "Publicación de apoyo semanal",
      "Centro IA limitado",
    ],
  },
  {
    name: "Inicio",
    label: "PLAN BASE",
    officialPrice: "89€",
    launchPrice: "79€",
    description:
      "Para negocios que quieren publicar con constancia sin complicarse.",
    features: [
      "1 usuario",
      "SocialIA completo",
      "Instagram + Facebook",
      "Calendario de publicaciones",
      "Aprobación antes de publicar",
      "Recordatorios básicos",
      "12 publicaciones mensuales",
    ],
  },
  {
    name: "Crecimiento",
    label: "MÁS POPULAR",
    officialPrice: "120€",
    launchPrice: "100€",
    description:
      "Para negocios que quieren mejorar su presencia local y medir resultados.",
    features: [
      "2 usuarios",
      "Todo Inicio",
      "Google Business",
      "ReviewIA básico",
      "Informes básicos",
      "Plan recomendado para negocios locales",
      "Seguimiento mensual",
    ],
    highlighted: true,
  },
  {
    name: "Local IA 360",
    label: "MÁS COMPLETO",
    officialPrice: "180€",
    launchPrice: "150€",
    description:
      "Para negocios que quieren delegar más marketing y reputación online.",
    features: [
      "Hasta 5 usuarios",
      "Todo Crecimiento",
      "Módulos principales",
      "ReviewIA + LeadIA + ReservaIA",
      "InsightIA avanzado",
      "Prioridad soporte",
      "Automatizaciones avanzadas",
    ],
  },
  {
    name: "Enterprise",
    label: "A MEDIDA",
    officialPrice: null,
    launchPrice: "Personalizado",
    description:
      "Para grupos, multiempresa o negocios con procesos e integraciones propias.",
    features: [
      "Usuarios personalizados",
      "Multiempresa",
      "Módulos a medida",
      "Soporte prioritario",
      "Propuesta personalizada",
    ],
    enterprise: true,
  },
];

export default function Pricing() {
  return (
    <section id="precios" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-300">
          Precios de lanzamiento
        </p>

        <h2 className="text-4xl font-black md:text-5xl">
          Elige tu plan.
          <br />
          Conserva tu precio para siempre.
        </h2>

        <p className="mt-5 text-lg leading-8 text-slate-400">
          Contrata durante el lanzamiento y mantén tu tarifa fundador mientras
          tu suscripción siga activa.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6 text-center">
        <h3 className="text-2xl font-black text-emerald-300">
          Oferta Fundadores
        </h3>

        <p className="mt-3 text-slate-300">
          Sin permanencia. Sin sorpresas. Sin subidas de precio mientras
          mantengas activa tu suscripción.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`relative rounded-[2rem] border p-7 ${
              plan.highlighted
                ? "border-violet-400/50 bg-gradient-to-b from-violet-500/20 to-white/[0.04] shadow-[0_0_60px_rgba(124,58,237,0.22)]"
                : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <div
              className={`mb-6 inline-flex rounded-full px-4 py-2 text-xs font-black ${
                plan.highlighted
                  ? "bg-violet-400 text-slate-950"
                  : "bg-white/10 text-slate-300"
              }`}
            >
              {plan.label}
            </div>

            <h3 className="text-3xl font-black">{plan.name}</h3>

            <p className="mt-4 min-h-20 text-sm leading-6 text-slate-400">
              {plan.description}
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
              {plan.officialPrice ? (
                <>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Precio oficial
                  </p>

                  <p className="mt-2 text-2xl font-black text-slate-500 line-through decoration-red-400 decoration-2">
                    {plan.officialPrice}/mes
                  </p>
                </>
              ) : null}

              <p
                className={`${
                  plan.officialPrice ? "mt-5" : ""
                } text-xs font-black uppercase tracking-[0.18em] text-emerald-300`}
              >
                {plan.enterprise ? "Precio" : "Precio lanzamiento"}
              </p>

              <div className="mt-1 flex items-end gap-2">
                <span
                  className={`${
                    plan.enterprise ? "text-4xl" : "text-6xl"
                  } font-black text-emerald-300`}
                >
                  {plan.launchPrice}
                </span>

                {!plan.enterprise ? (
                  <span className="pb-3 text-lg font-bold text-slate-400">
                    /mes
                  </span>
                ) : null}
              </div>

              <p className="mt-3 rounded-full bg-emerald-500/15 px-3 py-2 text-xs font-bold text-emerald-300">
                {plan.enterprise
                  ? "Multiempresa y personalizado"
                  : plan.name === "Gratuito"
                    ? "Sin pago mensual"
                    : "Tarifa fundador garantizada"}
              </p>
            </div>

            <ul className="mt-7 space-y-3 text-sm text-slate-300">
              {plan.features.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>

            <Link
              href="/onboarding"
              className={`mt-8 block w-full rounded-2xl px-6 py-4 text-center font-bold ${
                plan.highlighted
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 shadow-[0_0_35px_rgba(124,58,237,0.45)]"
                  : "border border-white/10 hover:bg-white/10"
              }`}
            >
              {plan.name === "Gratuito" ? "Empezar gratis" : "Solicitar demo"}
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-black">
          Añade módulos cuando los necesites
        </h3>

        <p className="mt-4 text-slate-400">
          ReviewIA · WhatsAppIA · ReservaIA · LeadIA · InsightIA · Google
          Business · TikTok & Shorts
        </p>
      </div>
    </section>
  );
}
