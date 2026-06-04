type Message = {
  role: "user" | "assistant";
  text: string;
};

export const conversations = [
  {
    id: "instagram-week",
    title: "Ideas para Instagram",
    time: "Hoy",
    module: "SocialIA",
  },
  {
    id: "promo-menu",
    title: "Promoción menú del día",
    time: "Ayer",
    module: "SocialIA",
  },
  {
    id: "review-negative",
    title: "Respuesta a reseña negativa",
    time: "Hace 2 días",
    module: "ReviewIA",
  },
  {
    id: "leads-campaign",
    title: "Campaña para captar clientes",
    time: "Hace 4 días",
    module: "LeadIA",
  },
];

export const initialMessages: Message[] = [
  {
    role: "assistant",
    text: "Hola. Soy el Centro IA de AutonomIA. Puedo ayudarte a crear publicaciones, campañas, respuestas a reseñas, ideas para captar clientes, recordatorios y análisis del negocio.",
  },
  {
    role: "user",
    text: "Necesito ideas para publicar esta semana en Instagram.",
  },
  {
    role: "assistant",
    text: "Perfecto. Para tu negocio te propongo 3 acciones: publicar una novedad de la semana, mostrar el ambiente del local y lanzar una promoción de fin de semana. También prepararía una story rápida el viernes por la tarde.",
  },
];

export const quickPrompts = [
  "Crear una publicación para Instagram",
  "Preparar promoción semanal",
  "Responder reseña negativa",
  "Generar ideas para captar clientes",
  "Crear campaña para Google Business",
  "Analizar rendimiento del mes",
  "Preparar story para hoy",
  "Crear recordatorio de publicación",
];

export const pendingActions = [
  {
    title: "Publicación Instagram",
    module: "SocialIA",
    status: "Pendiente",
  },
  {
    title: "Respuesta a reseña",
    module: "ReviewIA",
    status: "Pendiente",
  },
  {
    title: "Seguimiento de lead",
    module: "LeadIA",
    status: "Sugerido",
  },
];

export const businessInsights = [
  "Esta semana solo hay 1 publicación programada.",
  "Hay 4 contactos interesados sin seguimiento.",
  "Las reseñas recientes tienen una media de 4,6 estrellas.",
  "Las publicaciones con fotos reales suelen generar más interacción.",
];

export const modules = [
  "SocialIA",
  "ReviewIA",
  "WhatsAppIA",
  "LeadIA",
  "ReservaIA",
  "InsightIA",
];
