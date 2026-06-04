export type BusinessSector = {
  key: string;
  name: string;
  description: string;
  compatibleModules: string[];
  socialContentTypes: string[];
  bookingLabel: string;
  leadLabel: string;
  terminology: {
    clientes: string;
    reservas: string;
    servicios: string;
  };
};

export const businessSectors: BusinessSector[] = [
  {
    key: "hosteleria",
    name: "Hostelería",
    description:
      "Bares, restaurantes y cafeterías que necesitan contenido diario, reservas, reseñas y presencia local.",
    compatibleModules: ["SocialIA", "Google Business", "ReviewIA", "ReservaIA", "InsightIA"],
    socialContentTypes: ["Menú del día", "Plato nuevo", "Promoción", "Evento", "Story rápida"],
    bookingLabel: "Reservas de mesa",
    leadLabel: "Consultas de grupo o eventos",
    terminology: {
      clientes: "clientes",
      reservas: "mesas",
      servicios: "carta",
    },
  },
  {
    key: "belleza",
    name: "Belleza",
    description:
      "Peluquerías, barberías y centros de estética que trabajan con citas, tratamientos, promociones y fidelización.",
    compatibleModules: ["SocialIA", "ReviewIA", "ReservaIA", "WhatsAppIA", "Calendario IA"],
    socialContentTypes: ["Antes y después", "Tratamiento", "Promoción", "Consejo", "Resultado"],
    bookingLabel: "Citas",
    leadLabel: "Solicitudes de tratamiento",
    terminology: {
      clientes: "clientas/clientes",
      reservas: "citas",
      servicios: "tratamientos",
    },
  },
  {
    key: "salud",
    name: "Salud",
    description:
      "Clínicas, fisioterapia, dental y bienestar con necesidad de citas, reputación, recordatorios y educación al paciente.",
    compatibleModules: ["ReviewIA", "ReservaIA", "WhatsAppIA", "LeadIA", "InsightIA"],
    socialContentTypes: ["Consejo de salud", "Tratamiento", "Equipo", "Caso de éxito", "Recordatorio"],
    bookingLabel: "Consultas",
    leadLabel: "Pacientes interesados",
    terminology: {
      clientes: "pacientes",
      reservas: "consultas",
      servicios: "tratamientos",
    },
  },
  {
    key: "profesionales",
    name: "Profesionales",
    description:
      "Abogados, asesorías y despachos que necesitan captar consultas, explicar servicios y generar confianza.",
    compatibleModules: ["SocialIA", "LeadIA", "ReviewIA", "Calendario IA", "InsightIA"],
    socialContentTypes: ["Consejo legal", "Caso de éxito", "Novedad normativa", "Servicio", "Pregunta frecuente"],
    bookingLabel: "Consultas",
    leadLabel: "Consultas comerciales",
    terminology: {
      clientes: "clientes",
      reservas: "consultas",
      servicios: "servicios jurídicos",
    },
  },
  {
    key: "comercio",
    name: "Comercio",
    description:
      "Tiendas locales que quieren comunicar novedades, promociones, disponibilidad de producto y campañas.",
    compatibleModules: ["SocialIA", "Google Business", "ReviewIA", "InsightIA", "WhatsAppIA"],
    socialContentTypes: ["Producto destacado", "Promoción", "Novedad", "Campaña", "Escaparate"],
    bookingLabel: "Solicitudes",
    leadLabel: "Clientes interesados",
    terminology: {
      clientes: "clientes",
      reservas: "solicitudes",
      servicios: "productos",
    },
  },
  {
    key: "inmobiliaria",
    name: "Inmobiliaria",
    description:
      "Agencias que gestionan visitas, captación de propietarios, anuncios, leads y seguimiento comercial.",
    compatibleModules: ["LeadIA", "SocialIA", "ReservaIA", "WhatsAppIA", "InsightIA"],
    socialContentTypes: ["Inmueble destacado", "Visita disponible", "Consejo comprador", "Zona", "Caso de éxito"],
    bookingLabel: "Visitas",
    leadLabel: "Leads inmobiliarios",
    terminology: {
      clientes: "clientes",
      reservas: "visitas",
      servicios: "inmuebles",
    },
  },
  {
    key: "automocion",
    name: "Automoción",
    description:
      "Talleres, concesionarios y servicios de vehículo con citas, presupuestos y comunicación recurrente.",
    compatibleModules: ["SocialIA", "LeadIA", "WhatsAppIA", "ReservaIA", "ReviewIA"],
    socialContentTypes: ["Vehículo destacado", "Mantenimiento", "Promoción", "Consejo", "Servicio"],
    bookingLabel: "Citas de taller",
    leadLabel: "Solicitudes de presupuesto",
    terminology: {
      clientes: "clientes",
      reservas: "citas",
      servicios: "servicios de vehículo",
    },
  },
  {
    key: "deporte",
    name: "Deporte",
    description:
      "Gimnasios, estudios y entrenadores que necesitan captar socios, clases, retos y comunidad.",
    compatibleModules: ["SocialIA", "LeadIA", "ReservaIA", "InsightIA", "WhatsAppIA"],
    socialContentTypes: ["Clase", "Reto", "Consejo fitness", "Promoción", "Historia de alumno"],
    bookingLabel: "Clases",
    leadLabel: "Socios potenciales",
    terminology: {
      clientes: "socios/clientes",
      reservas: "clases",
      servicios: "programas",
    },
  },
  {
    key: "formacion",
    name: "Formación",
    description:
      "Academias, centros y formadores con cursos, matrículas, sesiones informativas y seguimiento de alumnos.",
    compatibleModules: ["LeadIA", "SocialIA", "Calendario IA", "WhatsAppIA", "InsightIA"],
    socialContentTypes: ["Curso", "Consejo", "Caso de alumno", "Convocatoria", "Clase abierta"],
    bookingLabel: "Sesiones informativas",
    leadLabel: "Alumnos interesados",
    terminology: {
      clientes: "alumnos",
      reservas: "sesiones",
      servicios: "cursos",
    },
  },
  {
    key: "mascotas",
    name: "Mascotas",
    description:
      "Veterinarias, peluquerías caninas y tiendas de mascotas con citas, recordatorios y contenido cercano.",
    compatibleModules: ["SocialIA", "ReservaIA", "ReviewIA", "WhatsAppIA", "Calendario IA"],
    socialContentTypes: ["Consejo", "Antes y después", "Servicio", "Recordatorio", "Mascota destacada"],
    bookingLabel: "Citas",
    leadLabel: "Consultas de clientes",
    terminology: {
      clientes: "familias/clientes",
      reservas: "citas",
      servicios: "servicios para mascotas",
    },
  },
  {
    key: "turismo",
    name: "Turismo",
    description:
      "Alojamientos, experiencias y negocios turísticos que dependen de reservas, reseñas y visibilidad local.",
    compatibleModules: ["SocialIA", "ReviewIA", "ReservaIA", "Google Business", "InsightIA"],
    socialContentTypes: ["Experiencia", "Promoción", "Zona", "Temporada", "Reseña destacada"],
    bookingLabel: "Reservas",
    leadLabel: "Consultas de viajeros",
    terminology: {
      clientes: "huéspedes/clientes",
      reservas: "reservas",
      servicios: "experiencias",
    },
  },
  {
    key: "servicios_hogar",
    name: "Servicios del hogar",
    description:
      "Reformas, limpieza, climatización y mantenimiento con presupuestos, avisos y reputación local.",
    compatibleModules: ["LeadIA", "WhatsAppIA", "ReviewIA", "SocialIA", "InsightIA"],
    socialContentTypes: ["Antes y después", "Consejo", "Servicio", "Promoción", "Caso real"],
    bookingLabel: "Visitas técnicas",
    leadLabel: "Solicitudes de presupuesto",
    terminology: {
      clientes: "clientes",
      reservas: "visitas",
      servicios: "servicios del hogar",
    },
  },
  {
    key: "eventos",
    name: "Eventos",
    description:
      "Empresas de eventos, catering y celebraciones con solicitudes, disponibilidad, propuestas y contenido visual.",
    compatibleModules: ["LeadIA", "ReservaIA", "SocialIA", "WhatsAppIA", "Calendario IA"],
    socialContentTypes: ["Evento realizado", "Promoción", "Idea de evento", "Servicio", "Testimonio"],
    bookingLabel: "Fechas disponibles",
    leadLabel: "Solicitudes de evento",
    terminology: {
      clientes: "clientes",
      reservas: "fechas",
      servicios: "eventos",
    },
  },
  {
    key: "creativos",
    name: "Creativos",
    description:
      "Estudios, fotógrafos, diseñadores y creadores que venden portfolio, sesiones, proyectos y marca personal.",
    compatibleModules: ["SocialIA", "LeadIA", "Calendario IA", "InsightIA", "ReviewIA"],
    socialContentTypes: ["Proyecto", "Portfolio", "Proceso", "Testimonio", "Servicio"],
    bookingLabel: "Sesiones",
    leadLabel: "Solicitudes de proyecto",
    terminology: {
      clientes: "clientes",
      reservas: "sesiones",
      servicios: "proyectos",
    },
  },
  {
    key: "b2b",
    name: "B2B",
    description:
      "Empresas de servicios para otras empresas con captación consultiva, seguimiento comercial y contenidos de autoridad.",
    compatibleModules: ["LeadIA", "SocialIA", "InsightIA", "Calendario IA", "WhatsAppIA"],
    socialContentTypes: ["Caso de éxito", "Insight", "Servicio", "Guía", "Novedad"],
    bookingLabel: "Reuniones",
    leadLabel: "Oportunidades B2B",
    terminology: {
      clientes: "clientes",
      reservas: "reuniones",
      servicios: "soluciones",
    },
  },
];

export const defaultBusinessSector = businessSectors[0];
