const modules = [
  {
    name: "SocialIA",
    icon: "📱",
    description:
      "Genera publicaciones automáticamente para redes sociales adaptadas a tu negocio.",
    features: [
      "Instagram y Facebook",
      "Calendario de publicaciones",
      "Ideas automáticas",
      "Aprobación antes de publicar",
      "Recordatorios inteligentes",
    ],
  },
  {
    name: "ReviewIA",
    icon: "⭐",
    description:
      "Gestiona y responde reseñas de Google de forma rápida y profesional.",
    features: [
      "Respuestas sugeridas por IA",
      "Detección de reseñas negativas",
      "Seguimiento de reputación",
      "Ahorro de tiempo",
    ],
  },
  {
    name: "WhatsAppIA",
    icon: "💬",
    description:
      "Automatiza conversaciones frecuentes y mejora la atención al cliente.",
    features: [
      "Respuestas automáticas",
      "Preguntas frecuentes",
      "Información de horarios",
      "Captación de clientes",
    ],
  },
  {
    name: "ReservaIA",
    icon: "📅",
    description:
      "Gestiona solicitudes y reservas desde diferentes canales.",
    features: [
      "Reservas online",
      "Confirmaciones automáticas",
      "Recordatorios",
      "Menos cancelaciones",
    ],
  },
  {
    name: "LeadIA",
    icon: "🎯",
    description:
      "Captura oportunidades de venta y organiza los contactos interesados.",
    features: [
      "Formularios inteligentes",
      "Seguimiento de contactos",
      "Clasificación automática",
      "Más oportunidades",
    ],
  },
  {
    name: "InsightIA",
    icon: "📊",
    description:
      "Analiza resultados y propone mejoras para el negocio.",
    features: [
      "Informes automáticos",
      "Recomendaciones IA",
      "Seguimiento mensual",
      "Datos fáciles de entender",
    ],
  },
  {
    name: "Google Business",
    icon: "📍",
    description:
      "Mantén actualizada tu ficha de Google y mejora tu visibilidad local.",
    features: [
      "Publicaciones en Google",
      "Actualización de información",
      "Más presencia local",
      "Mejor posicionamiento",
    ],
  },
  {
    name: "TikTok & Shorts",
    icon: "🎬",
    description:
      "Genera ideas y contenidos adaptados a vídeo corto.",
    features: [
      "Ideas para vídeos",
      "Contenido viral",
      "Mayor alcance",
      "Más visibilidad",
    ],
  },
];

export default function ModuleDetails() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-300">
          Módulos
        </p>

        <h2 className="text-4xl font-black md:text-5xl">
          Construye tu propio AutonomIA
        </h2>

        <p className="mt-5 text-lg leading-8 text-slate-400">
          Empieza con el plan que necesites y añade nuevas capacidades cuando tu
          negocio crezca.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <article
            key={module.name}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 transition-all hover:border-violet-500/40 hover:bg-white/[0.06]"
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-3xl">
              {module.icon}
            </div>

            <h3 className="text-2xl font-black">{module.name}</h3>

            <p className="mt-4 min-h-24 text-sm leading-6 text-slate-400">
              {module.description}
            </p>

            <ul className="mt-5 space-y-2">
              {module.features.map((feature) => (
                <li
                  key={feature}
                  className="text-sm text-slate-300"
                >
                  ✓ {feature}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}