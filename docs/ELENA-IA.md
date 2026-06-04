# Elena IA

Elena IA es la asistente inteligente oficial de AutonomIA. Su objetivo es acompañar a visitantes, clientes y superadmin con respuestas claras, recomendaciones útiles y recordatorios accionables.

No sustituye decisiones del cliente ni ejecuta acciones críticas sin aprobación. En esta fase queda documentada y preparada, sin conexión real a OpenAI.

## 1. Elena Comercial

Elena Comercial ayuda a visitantes y negocios interesados antes de contratar.

Funciones previstas:

- Explicar qué es AutonomIA.
- Recomendar plan según sector y tamaño del negocio.
- Resolver dudas sobre precios, permanencia, demos y módulos.
- Guiar hacia `/onboarding`.
- Preparar solicitudes de demo para superadmin.

Ejemplos:

- "Tengo un restaurante, ¿qué plan me conviene?"
- "¿Hay permanencia?"
- "¿Qué módulos incluye Crecimiento?"
- "Quiero probar AutonomIA gratis."

## 2. Elena Cliente

Elena Cliente acompaña a usuarios dentro del dashboard.

Funciones previstas:

- Explicar módulos activos.
- Ayudar a crear publicaciones.
- Recordar tareas pendientes.
- Sugerir acciones según sector.
- Resumir actividad de SocialIA, ReviewIA, LeadIA, ReservaIA e InsightIA.

Ejemplos:

- "Prepara una publicación para este fin de semana."
- "¿Qué tareas tengo pendientes?"
- "Resume mis próximas reservas."
- "Dime qué puedo mejorar esta semana."

## 3. Elena Proactiva

Elena Proactiva detecta oportunidades y avisa antes de que el cliente tenga que preguntar.

Tipos de recordatorio:

- `publication_reminder`: publicación pendiente o recomendada.
- `review_reminder`: reseña sin responder.
- `reservation_reminder`: reserva o cita pendiente.
- `lead_followup`: lead sin seguimiento.
- `campaign_reminder`: campaña o promoción estacional.
- `billing_reminder`: renovación, tarjeta o suscripción.
- `seasonal_suggestion`: idea por temporada, evento o fecha comercial.

Reglas:

- No debe saturar al cliente.
- Debe priorizar acciones claras.
- Debe permitir revisar antes de ejecutar.
- Debe distinguir entre información, recomendación y acción urgente.

## 4. Elena Coach

Elena Coach ayuda al cliente a mejorar hábitos y resultados.

Funciones previstas:

- Revisar objetivos del negocio.
- Sugerir mejoras semanales.
- Detectar patrones de bajo rendimiento.
- Proponer campañas sencillas.
- Ayudar al cliente a usar mejor AutonomIA.

Ejemplos:

- "Esta semana conviene reforzar reseñas."
- "Tu calendario tiene pocos contenidos para sábado y domingo."
- "Hay leads sin seguimiento desde hace más de 48 horas."
- "Puedes activar ReservaIA para convertir más consultas."

## Casos de Uso por Sector

### Hostelería

- Proponer menús, promociones y publicaciones de fin de semana.
- Recordar responder reseñas recientes.
- Sugerir campañas para reservas.
- Detectar horarios con más oportunidad.

### Belleza

- Crear publicaciones de tratamientos, antes/después y promociones.
- Recordar citas y reservas.
- Sugerir campañas para huecos libres.
- Revisar reseñas y reputación.

### Clínicas

- Preparar contenido educativo.
- Recordar citas y seguimiento.
- Sugerir respuestas cuidadosas a reseñas.
- Detectar consultas pendientes.

### Profesionales

- Crear contenido de autoridad.
- Recordar leads o consultas sin respuesta.
- Organizar tareas comerciales.
- Sugerir campañas por servicio.

### Comercio

- Proponer publicaciones de producto.
- Recordar campañas estacionales.
- Detectar momentos para promociones.
- Sugerir contenido para fidelizar clientes.

### Inmobiliarias

- Preparar publicaciones de inmuebles.
- Recordar visitas pendientes.
- Seguir leads interesados.
- Sugerir campañas por zona.

### Automoción

- Crear contenido de vehículos, revisiones y ofertas.
- Recordar seguimientos comerciales.
- Detectar oportunidades por temporada.
- Sugerir campañas para taller o ventas.

### Formación

- Promocionar cursos y plazas disponibles.
- Recordar campañas de inscripción.
- Seguir leads interesados.
- Crear contenido educativo recurrente.

## Memoria de Elena

La tabla `elena_memory` debe preparar información útil por empresa y usuario.

Datos previstos:

- Objetivos del negocio.
- Preferencias de comunicación.
- Tono de marca.
- Publicaciones aprobadas o rechazadas.
- Problemas frecuentes.
- Acciones recomendadas.
- Sectores, módulos activos y prioridades.

Reglas:

- La memoria debe estar asociada a `company_id` y, cuando aplique, `profile_id`.
- Debe respetar permisos multiempresa.
- Debe poder desactivarse o revisarse en futuras fases.
- No debe guardar datos sensibles innecesarios.

## Roadmap

### Fase 1: FAQ inteligente

- Responder dudas frecuentes en landing y login.
- Explicar planes, módulos, demos y permanencia.
- Guiar a `/onboarding`.

### Fase 2: Memoria empresa

- Guardar objetivos, sector, tono y preferencias.
- Personalizar respuestas por empresa.
- Usar contexto de módulos activos.

### Fase 3: Notificaciones inteligentes

- Recordatorios de publicaciones, reseñas, leads, reservas y campañas.
- Avisos de facturación o suscripción cuando proceda.
- Priorización por impacto.

### Fase 4: Asistente comercial

- Recomendar plan.
- Preparar demos.
- Ayudar al superadmin a convertir oportunidades.
- Registrar intención comercial.

### Fase 5: Coach de negocio

- Resumen semanal.
- Objetivos por módulo.
- Sugerencias de crecimiento.
- Seguimiento de hábitos y resultados.

## Estado Actual

- UI flotante preparada.
- Sección Elena IA preparada en Centro IA con datos simulados.
- Migración base preparada.
- Sin conexión OpenAI.
- Sin automatizaciones reales.
- Sin notificaciones reales.
