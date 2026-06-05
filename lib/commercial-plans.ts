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
      "Instagram + Facebook",
      "2 publicaciones semanales",
      "Publicación de apoyo semanal",
      "Centro IA limitado",
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
      "Calendario SocialIA",
      "Aprobación antes de publicar",
      "Recordatorios básicos",
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
      "Seguimiento mensual",
    ],
    highlighted: true,
  },
  {
    key: "local-ia",
    name: "Local IA",
    label: "MÁS COMPLETO",
    officialPrice: "300€",
    launchPrice: founderOffer.launchPrices.localIa,
    normalPrice: "300€",
    description:
      "Para empresas que quieren automatizar marketing, reputación y atención.",
    features: [
      "Hasta 5 usuarios",
      "Todo Crecimiento",
      "Módulos principales",
      "InsightIA avanzado",
      "Prioridad soporte",
      "Automatizaciones preparadas",
    ],
  },
];

export const planComparisonRows = [
  { feature: "Facebook", gratuito: true, inicio: true, crecimiento: true, localIa: true },
  { feature: "Instagram", gratuito: true, inicio: true, crecimiento: true, localIa: true },
  { feature: "Calendario SocialIA", gratuito: false, inicio: true, crecimiento: true, localIa: true },
  { feature: "Publicaciones programadas", gratuito: false, inicio: true, crecimiento: true, localIa: true },
  { feature: "Google Business", gratuito: false, inicio: false, crecimiento: true, localIa: true },
  { feature: "ReviewIA", gratuito: false, inicio: false, crecimiento: "Básico", localIa: true },
  { feature: "InsightIA", gratuito: false, inicio: false, crecimiento: "Básico", localIa: "Avanzado" },
  { feature: "WhatsApp Business", gratuito: false, inicio: false, crecimiento: false, localIa: true },
  { feature: "TikTok", gratuito: false, inicio: false, crecimiento: false, localIa: "Preparado" },
  { feature: "Elena IA básica", gratuito: true, inicio: true, crecimiento: true, localIa: true },
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
      "Para publicar con constancia y ordenar el contenido social del negocio.",
  },
  {
    plan: "Crecimiento",
    title: "Negocios que quieren captar más clientes",
    description:
      "Añade Google Business, ReviewIA básico e informes para mejorar presencia local.",
  },
  {
    plan: "Local IA",
    title: "Empresas que quieren automatizar marketing y atención",
    description:
      "Reúne los módulos principales y prepara una operación más completa.",
  },
];
