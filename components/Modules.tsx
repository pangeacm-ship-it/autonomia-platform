const modules = [
  {
    name: "SocialIA",
    type: "Módulo base",
    price: "Incluido",
    description:
      "Publicaciones para Instagram y Facebook preparadas desde AutonomIA, con aprobación antes de publicar.",
    features: [
      "Instagram + Facebook",
      "Gestión desde el panel",
      "Generación de publicaciones",
      "Aprobación previa",
    ],
    highlighted: true,
  },
  {
    name: "Google Business",
    type: "Extra",
    price: "+10€/mes",
    description:
      "Publicaciones y optimización básica de la ficha de Google Business.",
    features: ["Publicaciones Google", "Ficha del negocio", "Visibilidad local"],
  },
  {
    name: "ReviewIA",
    type: "Extra",
    price: "+19€/mes",
    description:
      "Respuestas inteligentes a reseñas para mejorar la reputación online.",
    features: ["Reseñas Google", "Respuestas IA", "Aprobación manual"],
  },
  {
    name: "WhatsAppIA",
    type: "Extra",
    price: "+29€/mes",
    description:
      "Atención automática al cliente por WhatsApp para dudas frecuentes.",
    features: ["Preguntas frecuentes", "Horarios", "Servicios", "Mensajes 24/7"],
  },
  {
    name: "ReservaIA",
    type: "Extra",
    price: "+19€/mes",
    description:
      "Gestión automática de reservas, confirmaciones y recordatorios.",
    features: ["Reservas", "Calendario", "Confirmaciones", "Recordatorios"],
  },
  {
    name: "LeadIA",
    type: "Extra",
    price: "+29€/mes",
    description:
      "Captación de clientes mediante formularios, auditorías y seguimiento.",
    features: ["Leads", "Auditorías", "Seguimiento", "Oportunidades"],
  },
  {
    name: "InsightIA",
    type: "Extra",
    price: "+15€/mes",
    description:
      "Informes automáticos para entender qué funciona y qué mejorar.",
    features: ["Informes", "Métricas", "Recomendaciones", "Resumen mensual"],
  },
  {
    name: "TikTok & Shorts",
    type: "Extra",
    price: "+25€/mes",
    description:
      "Contenido avanzado para TikTok y YouTube Shorts a partir de fotos, vídeos o ideas.",
    features: ["TikTok", "YouTube Shorts", "Ideas de vídeo", "Guiones cortos"],
  },
];

export default function Modules() {
  return (
    <section id="modulos" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-300">
          Plataforma modular
        </p>

        <h2 className="text-4xl font-black md:text-5xl">
          Empieza con SocialIA.
          <br />
          Añade solo lo que necesites.
        </h2>

        <p className="mt-5 text-lg leading-8 text-slate-400">
          Todos los clientes empiezan con el módulo base de publicaciones y
          calendario editorial. Después pueden activar módulos extra según las
          necesidades reales de su negocio.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => (
          <div
            key={module.name}
            className={`rounded-3xl border p-6 backdrop-blur transition hover:-translate-y-1 ${
              module.highlighted
                ? "border-violet-400/60 bg-gradient-to-b from-violet-500/20 to-white/[0.04] shadow-[0_0_45px_rgba(124,58,237,0.22)]"
                : "border-white/10 bg-white/[0.04] hover:bg-white/[0.07]"
            }`}
          >
            <div className="mb-5 flex items-center justify-between">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  module.highlighted
                    ? "bg-violet-400 text-slate-950"
                    : "bg-white/10 text-slate-300"
                }`}
              >
                {module.type}
              </span>

              <span className="text-sm font-bold text-slate-300">
                {module.price}
              </span>
            </div>

            <h3 className="text-2xl font-black">{module.name}</h3>

            <p className="mt-3 min-h-24 leading-7 text-slate-400">
              {module.description}
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              {module.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span className="text-violet-300">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
