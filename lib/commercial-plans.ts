export const founderOffer = {
  isActive: true,
  launchPrices: {
    inicio: "90€",
    crecimiento: "120€",
    localIa: "250€",
  },
};

export const commercialPlans = [
  {
    key: "gratuito",
    name: "Gratuito",
    label: "EMPIEZA",
    officialPrice: null,
    launchPrice: "0€",
    normalPrice: "0€",
    description:
      "Para probar AutonomIA con SocialIA limitado y presencia básica en redes.",
    features: [
      "1 usuario",
      "SocialIA limitado",
      "Calendario Inteligente básico",
      "Elena IA básica limitada",
      "2 publicaciones semanales",
    ],
  },
  {
    key: "inicio",
    name: "Inicio",
    label: "PLAN BASE",
    officialPrice: "100€",
    launchPrice: founderOffer.launchPrices.inicio,
    normalPrice: "100€",
    description:
      "Para autónomos y pequeños negocios que quieren publicar con constancia.",
    features: [
      "1 usuario",
      "SocialIA completo",
      "Instagram + Facebook",
      "Calendario Inteligente",
      "Elena IA básica",
      "Aprobación antes de publicar",
    ],
  },
  {
    key: "crecimiento",
    name: "Crecimiento",
    label: "MÁS POPULAR",
    officialPrice: "150€",
    launchPrice: founderOffer.launchPrices.crecimiento,
    normalPrice: "150€",
    description:
      "Para negocios que quieren captar más clientes y medir resultados.",
    features: [
      "2 usuarios",
      "Todo Inicio",
      "Google Business",
      "ReviewIA básico",
      "InsightIA básico",
    ],
    highlighted: true,
  },
  {
    key: "local-ia",
    name: "Local IA",
    label: "🏆 Experiencia AutonomIA Completa",
    officialPrice: "300€",
    launchPrice: founderOffer.launchPrices.localIa,
    normalPrice: "300€",
    description:
      "Para empresas que quieren automatizar marketing, reputación y atención.",
    features: [
      "Hasta 5 usuarios",
      "Todo Crecimiento",
      "WhatsApp Business + TikTok",
      "ReviewIA completo",
      "InsightIA completo",
      "Elena IA avanzada",
    ],
  },
];

export type CommercialPlanKey = (typeof commercialPlans)[number]["key"];

export function normalizeCommercialPlanKey(value: string | null | undefined) {
  const key = (value ?? "").toLowerCase().replace(/_/g, "-");

  if (key.includes("local") || key.includes("enterprise")) return "local-ia";
  if (key.includes("crecimiento")) return "crecimiento";
  if (key.includes("inicio")) return "inicio";
  if (key.includes("gratuito") || key.includes("free")) return "gratuito";

  return "crecimiento";
}

export function getCommercialPlan(value: string | null | undefined) {
  const key = normalizeCommercialPlanKey(value);

  return commercialPlans.find((plan) => plan.key === key) ?? commercialPlans[2];
}

export function getCommercialPrice(value: string | null | undefined) {
  const plan = getCommercialPlan(value);
  const hasLaunchPrice = founderOffer.isActive && Boolean(plan.officialPrice);

  return {
    plan,
    isFounderOfferActive: founderOffer.isActive,
    hasLaunchPrice,
    officialPrice: plan.officialPrice,
    normalPrice: plan.normalPrice,
    launchPrice: plan.launchPrice,
    visiblePrice: hasLaunchPrice ? plan.launchPrice : plan.normalPrice,
    monthlyLabel: `${hasLaunchPrice ? plan.launchPrice : plan.normalPrice}/mes`,
    officialMonthlyLabel: plan.officialPrice ? `${plan.officialPrice}/mes` : null,
    priceTypeLabel: hasLaunchPrice ? "Precio lanzamiento" : "Precio mensual",
  };
}

export const planComparisonRows = [
  { feature: "Facebook", gratuito: true, inicio: true, crecimiento: true, localIa: true },
  { feature: "Instagram", gratuito: true, inicio: true, crecimiento: true, localIa: true },
  { feature: "Calendario Inteligente", gratuito: "Básico", inicio: true, crecimiento: true, localIa: true },
  { feature: "Publicaciones programadas", gratuito: false, inicio: true, crecimiento: true, localIa: true },
  { feature: "Google Business", gratuito: false, inicio: false, crecimiento: true, localIa: true },
  { feature: "ReviewIA", gratuito: false, inicio: false, crecimiento: "Básico", localIa: true },
  { feature: "InsightIA", gratuito: false, inicio: false, crecimiento: "Básico", localIa: "Avanzado" },
  { feature: "WhatsApp Business", gratuito: false, inicio: false, crecimiento: false, localIa: true },
  { feature: "TikTok", gratuito: false, inicio: false, crecimiento: false, localIa: "Preparado" },
  { feature: "Elena IA básica", gratuito: "Limitada", inicio: true, crecimiento: true, localIa: true },
  { feature: "Elena IA avanzada", gratuito: false, inicio: false, crecimiento: false, localIa: true },
  { feature: "Usuarios incluidos", gratuito: "1", inicio: "1", crecimiento: "2", localIa: "Hasta 5" },
];

export const planGuide = [
  {
    plan: "Gratuito",
    title: "Quiero probar AutonomIA",
    description:
      "Ideal para validar la herramienta con publicaciones básicas semanales.",
  },
  {
    plan: "Inicio",
    title: "Autónomos y pequeños negocios",
    description:
      "La base para publicar con constancia con SocialIA completo.",
  },
  {
    plan: "Crecimiento",
    title: "Negocios que quieren captar más clientes",
    description:
      "Más visibilidad local con Google Business, ReviewIA e InsightIA básicos.",
  },
  {
    plan: "Local IA",
    title: "Empresas que quieren automatizar marketing y atención",
    description:
      "La experiencia completa para automatizar marketing, atención y análisis.",
  },
];
