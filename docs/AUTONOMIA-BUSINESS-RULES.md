# Reglas de negocio de AutonomIA

Este documento define las reglas maestras de negocio de AutonomIA antes de implementar Supabase, Stripe, autenticación real, IA real y facturación fiscal.

No modifica la aplicación, no conecta servicios externos y no sustituye una revisión fiscal o legal. Sirve como referencia para que el desarrollo futuro mantenga coherencia de producto, permisos, suscripciones y cumplimiento.

## 1. Visión general

AutonomIA es un SaaS modular para negocios locales que centraliza automatización, contenido, reseñas, leads, reservas, métricas y atención asistida por IA.

El producto se organiza en dos grandes áreas:

- **Dashboard cliente**: espacio operativo de cada empresa cliente.
- **Superadmin**: panel propietario para gestionar empresas, suscripciones, métricas, soporte y crecimiento de la plataforma.

AutonomIA debe funcionar como una plataforma multiempresa:

- Cada empresa tiene sus propios usuarios, módulos, datos operativos, conversaciones, leads, reservas, facturas y configuración.
- Los usuarios de una empresa no pueden acceder a datos de otra empresa.
- El propietario de AutonomIA, mediante rol `superadmin`, puede consultar y administrar la plataforma completa.

## 2. Roles

### `superadmin`

Propietario o equipo interno de AutonomIA.

Permisos:

- Ver todas las empresas.
- Ver todas las suscripciones.
- Ver uso de módulos e IA.
- Gestionar demos, tickets, incidencias y notas internas.
- Consultar métricas globales como MRR, ARR, churn, altas, bajas y renovaciones fallidas.
- Acceder al panel `/superadmin`.

### `company_admin`

Administrador de una empresa cliente.

Permisos:

- Gestionar usuarios de su empresa.
- Consultar facturación y suscripción.
- Activar o revisar módulos contratados.
- Configurar datos de empresa, horarios, marca, conexiones e IA.
- Acceder a todos los módulos incluidos en su plan.

### `marketing`

Usuario orientado a marketing y reputación.

Permisos:

- SocialIA.
- ReviewIA.
- Calendario IA.
- InsightIA.
- Google Business cuando esté activo para la empresa.

### `sales`

Usuario orientado a captación y conversión.

Permisos:

- LeadIA.
- WhatsAppIA.
- ReservaIA.
- Tareas comerciales.
- Seguimiento de leads y reservas.

### `support`

Usuario orientado a atención y soporte.

Permisos:

- WhatsAppIA.
- ReviewIA.
- Conversaciones asignadas.
- Respuestas y seguimiento operativo.

### `readonly`

Usuario de solo lectura.

Permisos:

- Ver informes, métricas y actividad.
- No crear, editar, borrar ni ejecutar automatizaciones.
- No modificar configuración, usuarios, facturación ni módulos.

## 3. Planes

### Gratuito

Precio:

- 0 euros al mes.

Límites:

- 1 usuario.
- 2 publicaciones semanales.
- Instagram + Facebook.
- Centro IA limitado.
- Desbloqueo semanal condicionado a acción promocional futura.
- Sin ReviewIA.
- Sin WhatsAppIA.
- Sin LeadIA.
- Sin ReservaIA.
- Sin InsightIA avanzado.

Enfoque:

- Plan futuro para probar AutonomIA con uso limitado antes de contratar.
- No debe sustituir al plan recomendado para piloto comercial.

Regla de desbloqueo semanal:

- Para renovar las 2 publicaciones gratuitas de la semana siguiente, el cliente debe publicar una **Publicación de apoyo semanal** de AutonomIA.
- AutonomIA ofrecerá 3 opciones de publicación promocional positiva.
- El cliente elegirá una opción y, al aprobarla/publicarla, se desbloquearán las 2 publicaciones propias de la siguiente semana.
- La publicación no debe mencionar condiciones internas, descuentos o gratuidad.
- Mensajes permitidos deben sonar positivos, por ejemplo:
  - "Desde que usamos AutonomIA gestionamos mejor nuestras redes."
  - "AutonomIA nos ayuda a mantener nuestro negocio activo online."
  - "La IA también puede ayudar a pequeños negocios a crecer."

Exención manual:

- El superadmin puede dejar clientes en Gratuito sin obligación promocional.
- La exención puede aplicarse por relación comercial, demo especial, cliente estratégico, campaña o decisión interna.
- Esta exención debe quedar registrada cuando exista Supabase real.

### Inicio

Precio:

- Normal: 100 euros al mes.
- Lanzamiento: 90 euros al mes.

Enfoque:

- Negocios pequeños que quieren empezar con presencia digital asistida por IA.
- Base mínima para centralizar actividad, calendario y algunas automatizaciones.

Límites:

- 1 usuario.

Incluye de forma recomendada:

- Dashboard cliente.
- Centro IA básico.
- SocialIA completo.

### Crecimiento

Precio:

- Normal: 150 euros al mes.
- Lanzamiento: 120 euros al mes.

Enfoque:

- Negocios que quieren captar más clientes, mejorar reputación y automatizar más procesos.

Límites:

- 2 usuarios.

Incluye de forma recomendada:

- Todo lo incluido en Inicio.
- Google Business.
- ReviewIA básico.
- InsightIA básico.

### Local IA

Precio:

- Normal: 300 euros al mes.
- Lanzamiento: 250 euros al mes.

Enfoque:

- Negocios locales que quieren una capa completa de automatización comercial, reputacional y operativa.

Límites:

- Hasta 5 usuarios.

Incluye de forma recomendada:

- Todo lo incluido en Crecimiento.
- Módulos principales.
- ReviewIA.
- LeadIA.
- WhatsAppIA.
- ReservaIA.
- Automatizaciones más avanzadas.
- Mayor prioridad de soporte.
- Más volumen de uso IA.

### Enterprise interno futuro

Precio:

- Oculto comercialmente.

Enfoque:

- Empresas con necesidades especiales, varias sedes, integraciones a medida, mayores volúmenes o soporte avanzado.

Límites:

- Usuarios personalizados o ilimitados según contrato.
- Módulos personalizados según propuesta.

Incluye según propuesta:

- Módulos premium.
- Multiubicación.
- Integraciones personalizadas.
- SLA o soporte prioritario.

Enterprise no debe mostrarse como plan comercial visible en la landing ni en
las pantallas de cliente. Se conserva solo como compatibilidad interna futura.

### Regla de precio lanzamiento

Los clientes que contraten durante el lanzamiento mantienen su precio
promocional mientras permanezcan en el mismo plan o suban a un plan superior.

Si bajan de modalidad, pierden el precio de lanzamiento y se aplica el precio
normal vigente.

### Alta autónoma desde landing

AutonomIA permite que un cliente cree una prueba gratuita desde `/onboarding`
sin aprobación manual previa del superadmin.

Reglas:

- El cliente introduce empresa, contacto, email, teléfono, ciudad, sector,
  objetivo, tono IA y contraseña.
- Se crea usuario Auth real con `force_password_change = false`.
- Se crea perfil, empresa, relación `company_admin`, suscripción Gratuita en
  trial y módulos iniciales.
- SocialIA queda activo.
- Los módulos recomendados por sector quedan en estado recomendado.
- El origen se registra como `landing` en `demo_requests` y `superadmin_notes`.
- El superadmin puede revisar después la actividad, cambiar plan, activar Acceso
  VIP, conceder demo ilimitada, suspender o archivar.

### Seguridad de datos demo y prueba

Los registros operativos de prueba deben poder distinguirse de los datos reales
antes de activar módulos reales.

Reglas:

- Los datos con `is_demo = true` no computan métricas reales.
- Los datos con `archived_at` informado no computan métricas reales.
- Los datos con `deleted_at` informado no computan métricas reales.
- Las métricas reales solo cuentan registros con `is_demo = false`,
  `archived_at is null` y `deleted_at is null`.
- Los datos archivados deben conservarse para revisión interna.
- Los datos eliminados lógicamente no deben mostrarse como actividad operativa.
- Está prohibido borrar de forma insegura facturas, pagos, `billing_events` o
  `fiscal_records`.

### SocialIA Fase 1A

SocialIA Fase 1A trabaja solo con publicaciones internas reales de AutonomIA.

Reglas:

- No conecta Meta.
- No conecta Facebook.
- No conecta Instagram.
- No conecta OpenAI.
- No publica fuera de AutonomIA.
- Permite crear, guardar, editar, aprobar, programar, cancelar y archivar
  publicaciones internas.
- El modo "Generar ejemplo" solo rellena el formulario y no guarda registros.
- Las publicaciones demo o archivadas no computan como métricas reales.
- Las métricas reales solo cuentan publicaciones con `is_demo = false`,
  `archived_at is null` y `deleted_at is null`.
- El plan Gratuito permite 2 publicaciones reales por semana; al alcanzar el
  límite se bloquea la creación de nuevas publicaciones reales, pero no la
  visualización de publicaciones existentes.

La publicación real en redes deberá implementarse en una fase posterior con
permisos explícitos, auditoría y control de errores.

### SocialIA Fase 1B

SocialIA Fase 1B añade un calendario editorial real para que el cliente organice
su contenido antes de conectar redes.

Reglas:

- Vista mensual y semanal de publicaciones internas.
- Panel de próximas publicaciones: hoy, mañana y esta semana.
- Las publicaciones demo se muestran con distintivo `Demo`.
- Las publicaciones demo no cuentan en estadísticas reales.
- Las publicaciones archivadas o eliminadas lógicamente no aparecen en el
  calendario operativo.
- Se permite reprogramar editando la fecha desde la tarjeta.
- No hay drag & drop todavía.
- No conecta Meta, Facebook, Instagram ni OpenAI.
- No publica fuera de AutonomIA.

El calendario sigue visible aunque el plan Gratuito alcance el límite semanal de
2 publicaciones reales.
- Configuración avanzada.

## 4. Módulos

### Base

Módulos que pueden formar parte de la experiencia mínima del cliente:

- **Calendario IA**: planificación de actividad, eventos, tareas y agenda operativa.
- **Google Business**: presencia local, publicaciones y datos asociados a ficha de negocio.
- **InsightIA**: métricas, señales, actividad y análisis de negocio.
- **SocialIA**: generación y planificación de contenido social.

### Recomendados

Módulos recomendados para mejorar conversión, reputación y operación diaria:

- **ReviewIA**: gestión de reseñas, respuestas y reputación.
- **LeadIA**: captación, seguimiento y priorización de oportunidades.
- **ReservaIA**: gestión de reservas y conversión de consultas.

### Premium

Módulos con mayor valor operativo o mayor coste externo:

- **WhatsAppIA**: atención, conversaciones, leads y reservas mediante WhatsApp.
- **TikTok & Shorts**: creación y planificación de contenido corto.
- **YouTube Shorts**: contenido corto orientado a vídeo y visibilidad.

### Futuros

Los módulos futuros deben evaluarse antes de activarse:

- Coste IA.
- Coste API externa.
- Permisos necesarios.
- Riesgo de soporte.
- Valor comercial por plan.

## 5. Suscripciones

Estados definitivos:

- `trial`
- `active`
- `past_due`
- `suspended`
- `canceled`

Reglas:

- Sin cobro inicial correcto no hay acceso operativo.
- La renovación es mensual y automática.
- Si falla el cobro, la suscripción pasa a `past_due`.
- El periodo de gracia recomendado es de 7 días.
- Durante el periodo de gracia, el cliente debe recibir avisos claros para actualizar tarjeta o regularizar el pago.
- Si no regulariza en 7 días, la suscripción pasa a `suspended`.
- `suspended` bloquea el acceso operativo a la app.
- Si el cliente actualiza el método de pago y el cobro se completa, la suscripción vuelve a `active`.
- Si cancela, mantiene acceso hasta el final del periodo pagado.
- Cuando termina el periodo pagado de una suscripción cancelada, queda `canceled` y sin acceso operativo.

No deben existir:

- Cobros manuales como flujo principal.
- Facturas pendientes manuales como flujo SaaS ordinario.
- Acceso operativo para suscripciones suspendidas.

## 6. Acceso a la app

### `active`

Acceso completo según plan, módulos contratados y rol del usuario.

### `trial`

Acceso limitado o completo según campaña comercial. Debe estar definido por fecha de finalización, plan asociado y límites de uso.

### `past_due`

Acceso con avisos visibles. El usuario debe entender que el pago ha fallado y que debe actualizar su tarjeta o regularizar el cobro.

### `suspended`

Acceso operativo bloqueado. Solo debe permitirse una pantalla o flujo de regularización de pago, datos básicos de cuenta y soporte.

### `canceled`

Sin acceso operativo una vez finalizado el periodo pagado. La cuenta puede conservar datos según política interna, obligaciones legales y condiciones de contratación.

## 7. Superadmin

El superadmin debe poder ver:

- Clientes activos.
- Clientes suspendidos.
- Clientes cancelados.
- Usuarios registrados.
- Usuarios online.
- Últimas conexiones.
- MRR.
- ARR.
- Churn.
- Altas y bajas.
- Módulos más usados.
- Localidades de clientes.
- Demos solicitadas.
- Tickets de soporte.
- Uso de IA.
- Renovaciones fallidas.
- Tarjetas caducadas.
- Clientes en riesgo.

El superadmin no debe depender de conceptos de cobro manual. La plataforma debe hablar en términos de SaaS recurrente:

- Renovaciones fallidas.
- Suscripciones suspendidas.
- Riesgo de cancelación.
- Tarjetas caducadas.
- Próximos cobros.
- Último cobro correcto.

## 8. Cliente empresa

El cliente empresa debe poder ver:

- Dashboard.
- Centro IA.
- Módulos activos.
- Empresa.
- Usuarios.
- Tareas.
- Notificaciones.
- Facturación.
- Suscripción.
- Configuración IA.
- Conexiones.

El contenido visible dependerá de:

- Estado de suscripción.
- Plan contratado.
- Módulos activos.
- Rol del usuario.
- Permisos de empresa.

## 9. Facturación

Reglas:

- El pago se realiza por tarjeta.
- La renovación es automática.
- Las facturas se emiten después de cobro correcto.
- No existen facturas pendientes manuales en el flujo SaaS normal.
- No existen cobros manuales en el flujo SaaS normal.
- Stripe gestionará el cobro.
- Una capa fiscal separada gestionará el cumplimiento español.
- Las facturas emitidas no se modifican.
- Cuando proceda corregir una factura emitida, se usará factura rectificativa.

Cada factura debe guardar, como mínimo:

- Número de factura.
- Serie.
- Fecha de emisión.
- Fecha de operación cuando aplique.
- Emisor.
- Receptor.
- NIF/CIF.
- Base imponible.
- IVA.
- Total.
- Estado.
- Método de pago.
- Periodo facturado.
- Plan contratado.
- Enlace PDF.
- Referencia externa de Stripe cuando aplique.
- Estado fiscal o de cumplimiento.

## 10. VERI*FACTU y cumplimiento fiscal

AutonomIA debe prepararse para cumplimiento fiscal español, incluyendo los requisitos aplicables a sistemas informáticos de facturación y VERI*FACTU cuando corresponda.

Debe documentar y preparar:

- QR fiscal futuro.
- PDF fiscal.
- Serie y número.
- Base imponible.
- IVA.
- Total.
- Emisor.
- Receptor.
- Trazabilidad.
- Conservación documental.
- Hash o huella futura.
- Registros fiscales.
- Facturas rectificativas.
- Separación entre pago, factura y registro fiscal.

Reglas:

- `payments` registra cobros y estados de pago.
- `invoices` registra facturas internas emitidas.
- `fiscal_records` debe registrar la capa fiscal, huella, QR, estado de envío, proveedor fiscal y trazabilidad.
- No modificar facturas emitidas.
- Conservar documentos y registros durante el plazo legal aplicable.
- Revisar el sistema con asesoría fiscal antes de producción.

## 11. Stripe futuro

Objetos Stripe necesarios:

- `customers`
- `subscriptions`
- `invoices`
- `payment_methods`
- `payment_intents`
- `checkout_sessions`
- `webhooks`

Eventos necesarios:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`
- `payment_method.attached`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

Reglas:

- Stripe no debe ser la única fuente de verdad fiscal.
- Los webhooks deben actualizar Supabase de forma idempotente.
- Cada evento importante debe guardarse en `billing_events`.
- El acceso a la app debe depender del estado interno de la suscripción sincronizado desde Stripe.

## 12. Supabase futuro

Tablas clave:

- `companies`
- `profiles`
- `company_users`
- `plans`
- `subscriptions`
- `modules`
- `company_modules`
- `company_ai_settings`
- `posts`
- `reviews`
- `leads`
- `reservations`
- `tasks`
- `notifications`
- `invoices`
- `payments`
- `billing_events`
- `fiscal_records`
- `demo_requests`
- `support_tickets`
- `usage_events`

Reglas:

- Supabase será la fuente principal de datos operativos.
- Auth se gestionará con usuarios autenticados.
- RLS debe estar activado en tablas con datos sensibles o multiempresa.
- Las tablas públicas propias deben referenciar usuarios de `auth.users` cuando haga falta guardar datos de perfil o empresa.

## 13. Reglas multiempresa

Reglas obligatorias:

- Cada empresa solo ve sus datos.
- Superadmin puede ver todo.
- RLS es obligatorio.
- `company_id` es obligatorio en datos operativos de empresa.
- No se deben mezclar datos entre empresas.
- Las consultas del dashboard cliente deben filtrar por empresa.
- Los roles se aplican por pertenencia a empresa.
- Un usuario no debe heredar permisos globales por error.

## 14. Onboarding

Flujo recomendado:

1. Solicitud demo.
2. Contacto comercial.
3. Elección de plan.
4. Pago inicial.
5. Creación de empresa.
6. Creación de usuario administrador.
7. Configuración de empresa.
8. Conexión de canales.
9. Configuración IA.
10. Activación de módulos.

El acceso operativo solo debe activarse cuando el cobro inicial se haya completado correctamente, salvo campañas `trial` explícitas.

## 15. Baja y cancelación

Reglas:

- El cliente puede cancelar su suscripción.
- Mantiene acceso hasta el fin del periodo pagado.
- Para evitar la siguiente renovación, debe cancelar antes de la fecha de renovación mensual.
- No se renueva el siguiente periodo.
- Después pasa a estado `canceled`.
- Tras `canceled`, no tiene acceso operativo.
- Los datos se conservan según política definida, obligaciones legales y condiciones del servicio.

Debe evitarse borrar datos de forma inmediata sin una política clara de retención, exportación y cumplimiento.

## 15.1 Confianza comercial y cargos

Reglas comerciales:

- No debe haber costes ocultos.
- No debe haber permanencia general en planes estándar.
- La suscripción es mensual.
- Los módulos, límites y precios deben estar claros antes de contratar.
- Si hay un cargo por error atribuible a AutonomIA, debe revisarse y devolverse si corresponde.
- Si el problema viene de una actuación, configuración o falta de cancelación del cliente, AutonomIA debe intentar ofrecer una solución razonable.

Este mensaje debe aparecer de forma clara en la landing, especialmente cerca de la zona de precios.

## 16. Seguridad

Reglas:

- No guardar claves en cliente.
- No exponer claves privadas en el navegador.
- Roles estrictos.
- RLS activo.
- Logs de acciones críticas.
- Backups.
- Auditoría.
- Control de acceso al superadmin.
- Revisión de webhooks.
- Separación entre datos de cliente y datos de plataforma.
- Revisión de permisos antes de activar integraciones externas.

## 17. Responsive

Regla general:

Todas las pantallas deben funcionar en móvil, tablet y PC.

Prioridades:

- El panel cliente debe priorizar móvil y uso diario.
- El superadmin debe funcionar en móvil, pero optimizarse para tablet y PC.
- Las tablas deben adaptarse a tarjetas o listas en móvil.
- Los botones principales deben ser claros y accesibles.
- El scroll debe ser estable y no bloquear navegación.

## 18. Qué no hacer

No hacer:

- No mezclar Stripe con fiscalidad.
- No emitir facturas reales desde arrays locales.
- No permitir acceso operativo a usuarios con suscripción `suspended`.
- No modificar facturas emitidas.
- No mezclar empresas.
- No conectar APIs sin permisos correctos.
- No subir a producción sin revisión fiscal y legal.
- No usar datos simulados como fuente real.
- No activar cobros reales sin webhooks probados.
- No depender solo del frontend para bloquear acceso.

## 19. Roadmap resumido

Orden recomendado:

1. Documentación final.
2. Supabase.
3. Auth y roles.
4. Stripe en modo test.
5. Billing real.
6. Proveedor fiscal.
7. OpenAI.
8. Integraciones externas.
9. Piloto con clientes.
10. Producción.

Antes del lanzamiento comercial:

- Elegir proveedor fiscal compatible con VERI*FACTU.
- Revisar condiciones legales.
- Definir política de privacidad.
- Definir términos de contratación.
- Probar renovaciones, fallos de cobro, cancelaciones y suspensión.
- Probar aislamiento multiempresa.
- Probar costes de IA y APIs externas.

## 20. Gestión operativa desde Superadmin

El Superadmin puede gestionar demos y módulos de empresas desde el panel propietario cuando exista una sesión real con rol `superadmin`.

Acciones previstas sobre demos:

- Extender una demo 7 días.
- Extender una demo 30 días.
- Marcar una demo como sin límite.
- Suspender una demo.
- Convertir una demo en cliente.
- Eximir a una empresa de la publicación promocional semanal.

Estados comerciales de demo:

- `demo_active`
- `trial`
- `unlimited`
- `expired`
- `converted`
- `suspended`

Nota técnica:

Mientras el esquema real no incluya campos dedicados para caducidad de demo, demo sin límite o exención promocional, estas decisiones pueden registrarse como notas internas en `superadmin_notes`. El estado compatible de `companies` debe mantenerse dentro de los valores aceptados por la base actual.

Gestión de módulos por empresa:

- `active`: módulo activo para la empresa.
- `recommended`: módulo recomendado comercialmente.
- `available`: módulo disponible, pero no activo.
- `locked`: módulo bloqueado visualmente.

Nota técnica:

En la base actual `company_modules.status` acepta `active`, `recommended`, `available` y `disabled`. Por compatibilidad, el estado visual `locked` debe guardarse como `disabled` hasta que se amplíe el esquema.

Reglas de seguridad:

- Solo `superadmin` puede ejecutar acciones reales.
- No se debe exponer `SUPABASE_SERVICE_ROLE_KEY` en cliente.
- Las acciones deben ejecutarse en servidor.
- En modo demo, las acciones reales deben quedar desactivadas.
- Toda acción crítica debe dejar rastro interno para auditoría futura.

## 21. Alta manual de empresas

El Superadmin puede crear empresas manualmente desde la plataforma para gestionar altas comerciales, pilotos y demos.

Datos mínimos del alta:

- Nombre de empresa.
- Sector.
- Plan asignado.
- Nombre del administrador inicial.
- Email del administrador inicial.
- Tipo de demo.
- Duración de demo.
- Módulos iniciales.

Tipos de alta:

- Demo normal: empresa en periodo `trial`.
- Demo comercial: empresa en periodo `trial`.
- Demo VIP: empresa demo sin límite comercial.
- Demo Partner: empresa demo sin límite comercial.

Nota técnica:

El esquema actual de `companies.status` no acepta literalmente `unlimited`. Por compatibilidad, las demos VIP y Partner deben guardarse como empresa `demo` y dejar la trazabilidad `unlimited` en `superadmin_notes`.

Creación del administrador inicial:

- Si el perfil ya existe por email, se reutiliza.
- Si no existe, se crea un perfil en estado `invited`.
- Se crea relación en `company_users` con rol `company_admin`.
- Si se define contraseña temporal, se crea usuario real de Supabase Auth desde servidor.
- Si se marca enviar invitación, se intenta generar invitación con Supabase Auth.
- Si no se configura email real todavía, el superadmin debe comunicar la contraseña temporal al cliente por un canal seguro.
- El indicador de forzar cambio de contraseña queda registrado como metadato del usuario Auth para conectarlo en una fase posterior.

Tablas afectadas:

- `companies`
- `profiles`
- `company_users`
- `subscriptions`
- `company_modules`
- `superadmin_notes`

Edición desde Superadmin:

- Cada empresa puede abrirse desde `/superadmin/empresas/[id]`.
- El superadmin puede editar datos básicos, sector, ciudad, contacto, plan, estado, módulos y acceso del administrador.
- El teléfono de empresa se gestiona provisionalmente como teléfono del perfil administrador hasta añadir un campo específico de empresa.
- Las acciones críticas deben generar nota interna en `superadmin_notes`.

Reglas de seguridad:

- Solo una sesión real `superadmin` puede crear empresas.
- El alta debe ejecutarse en servidor.
- La clave service role no debe exponerse al cliente.
- En modo demo no se deben ejecutar escrituras reales.
- Si el alta falla a mitad, debe limpiarse la empresa creada para evitar datos incompletos.

## 22. Control real de acceso por plan y suscripción

El acceso operativo debe depender de dos factores:

- Estado de suscripción.
- Plan contratado.

Estados de suscripción:

- `trial`: acceso permitido según plan asignado.
- `active`: acceso permitido según plan asignado.
- `past_due`: acceso permitido con aviso visible de renovación fallida.
- `suspended`: acceso operativo bloqueado.
- `canceled`: acceso operativo bloqueado salvo futura regla de periodo pagado vigente.

Rutas permitidas con `suspended` o `canceled`:

- `/dashboard/facturacion`
- `/dashboard/suscripcion`
- `/billing-required`

Reglas por plan:

- Gratuito: dashboard, SocialIA limitado, empresa, suscripción y facturación.
- Inicio: SocialIA completo, calendario, empresa, suscripción, facturación y módulos.
- Crecimiento: SocialIA, Google Business, ReviewIA básico, InsightIA básico y usuarios.
- Local IA: módulos principales.
- Enterprise: oculto comercialmente y reservado para uso interno futuro.

Límites de usuarios:

- Gratuito: 1 usuario.
- Inicio: 1 usuario.
- Crecimiento: 2 usuarios.
- Local IA: 5 usuarios.

Reglas de experiencia:

- Si el plan no permite una página, debe mostrarse una tarjeta de acceso limitado con CTA a planes.
- Si la suscripción está `past_due`, debe mostrarse aviso superior.
- Si la suscripción está `suspended`, debe redirigirse a pantalla de facturación requerida.
- No se debe bloquear agresivamente si no hay Supabase o si la app está en modo demo.

## 23. Política de baja de clientes

Cuando un cliente ya no está interesado, el Superadmin debe priorizar acciones reversibles y seguras.

Opciones:

- Archivar cliente.
- Suspender acceso.
- Eliminar definitivamente.

Archivar cliente:

- Es la opción recomendada por defecto.
- Cambia `companies.status` a `archived`.
- Cancela la suscripción interna si procede.
- Marca usuarios de empresa como `inactive`.
- Conserva datos operativos, notas y trazabilidad.
- Registra nota interna en `superadmin_notes`.

Suspender cliente:

- Cambia `companies.status` a `suspended`.
- Cambia `subscriptions.status` a `suspended`.
- Bloquea acceso operativo sin eliminar datos.
- Registra nota interna.

Eliminar definitivamente:

- Solo puede ejecutarlo un `superadmin`.
- Debe comprobar antes si existen datos fiscales o de cobro.
- No debe borrar `invoices`, `payments`, `billing_events` ni `fiscal_records`.
- Si existen datos protegidos, debe bloquearse la eliminación y recomendar archivar.
- Si no existen datos protegidos, puede borrar la empresa y datos dependientes no fiscales según las reglas de cascada del esquema.

Conservación fiscal y documental:

- Las facturas emitidas, pagos, eventos de cobro y registros fiscales deben conservarse según normativa aplicable.
- No deben eliminarse datos fiscales por comodidad operativa.
- La eliminación definitiva debe reservarse para demos o altas sin facturación ni obligaciones documentales.

Nota técnica:

El estado `archived` y el estado de usuario `inactive` requieren la migración `007_company_offboarding.sql` para ampliar las restricciones actuales de Supabase.

## 24. Métricas económicas y empresas excluidas de ingresos

Las métricas económicas del Superadmin deben reflejar únicamente ingresos reales.

Empresa facturable:

- Empresa con estado `active`.
- Empresa con estado `past_due`, porque sigue representando una renovación real pendiente de resolver.

Empresa no facturable:

- `demo`.
- `trial` gratuito.
- Demo ilimitada.
- Demo VIP.
- Demo Partner.
- Beta tester.
- Prueba interna.
- Empresa exenta de pago.
- Empresa suspendida, cancelada o archivada.

Reglas de cálculo:

- MRR, ARR, ingresos mensuales, ingresos anuales, ARPU y renovaciones previstas solo deben incluir empresas facturables.
- Las demos ilimitadas, VIP, Partner, beta testers y pruebas internas deben quedar excluidas aunque tengan un plan asignado.
- Si todavía no existe una columna específica para marcar exenciones, la exclusión puede detectarse desde `superadmin_notes`.
- Las notas internas válidas para exclusión incluyen marcas como `demo_unlimited`, `company_created:vip`, `company_created:partner`, `beta`, `tester`, `interna`, `exento de pago` o equivalentes.

Métricas comerciales separadas:

- Clientes de pago.
- Clientes demo.
- Clientes VIP.
- Clientes Partner.
- Clientes beta.
- Clientes suspendidos.
- Demos ilimitadas.
- Porcentaje de clientes de pago.

El Superadmin debe separar visualmente `Ingresos reales` de `Empresas en prueba` para no confundir tracción comercial con facturación real.

## 25. Acceso VIP gratuito y valor percibido

AutonomIA puede conceder acceso completo sin coste a determinados clientes por decisión comercial.

Casos incluidos:

- Demo ilimitada.
- Acceso VIP.
- Partner.
- Beta tester.
- Acceso promocional.
- Empresa exenta de pago.

Reglas económicas:

- No computa ingresos.
- No computa MRR.
- No computa ARR.
- No genera facturación mientras la condición permanezca activa.

Reglas de experiencia cliente:

- No debe mostrarse como plan gratuito básico.
- No debe usarse el texto `cliente gratuito` ni `demo básica`.
- El cliente debe ver el valor económico real del plan.
- Debe mostrarse el precio oficial tachado y el distintivo `Acceso VIP`.

Ejemplos visuales:

- Plan Crecimiento · precio oficial 150€/mes tachado · Acceso VIP activo.
- Plan Local IA · precio oficial 300€/mes tachado · Acceso VIP activo.

Texto recomendado:

`Actualmente disfrutas de acceso VIP concedido por AutonomIA. Mantienes acceso completo sin coste mientras esta condición permanezca activa.`

Gestión desde Superadmin:

- La ficha de empresa debe permitir marcar `Cliente de pago`, `Acceso VIP`, `Partner`, `Beta tester` o `Demo ilimitada`.
- Mientras no exista una columna específica, el estado comercial puede registrarse en `superadmin_notes`.
- La última marca comercial debe prevalecer sobre marcas anteriores.

## 26. Calendario Inteligente como planificación central

AutonomIA debe usar un calendario central para evitar duplicidad entre módulos.

Reglas:

- SocialIA es el lugar donde se crean, editan, aprueban y programan publicaciones.
- Calendario Inteligente es el lugar donde se consulta la planificación global.
- El calendario central debe mostrar publicaciones SocialIA, recomendaciones Elena IA, tareas, reservas/citas y eventos importantes.
- Las recomendaciones Elena IA son sugerencias hasta conectar OpenAI.
- Las reservas/citas y eventos no conectados todavía pueden mostrarse como simulación visual.

Filtros previstos:

- Todo.
- Instagram.
- Facebook.
- Google Business.
- WhatsApp.
- TikTok.
- Reservas/Citas.
- Elena IA.
- Tareas.
- Demo.

Reglas de exclusión:

- No mostrar publicaciones con `deleted_at`.
- No mostrar publicaciones con `archived_at`.
- Las publicaciones demo se identifican con badge `Demo`.
- Los datos demo no computan métricas reales.

## 27. SocialIA Fase 3A y OAuth Meta

SocialIA Fase 3A prepara la base OAuth real con Meta para Facebook e Instagram Business.

Reglas:

- No se publica todavía en redes reales.
- No se conecta OpenAI.
- No se guardan tokens en cliente.
- No se añaden claves Meta al código.
- `META_APP_SECRET` solo puede usarse en servidor.
- El flujo OAuth debe usar `state` obligatorio.
- El `state` se guarda en cookie `httpOnly` con expiración corta.
- Los tokens futuros deberán guardarse cifrados en servidor.
- Cada empresa tendrá sus propias conexiones en `social_connections`.
- La Fase 3A registra la conexión como `needs_review` hasta completar selección de página y cifrado de tokens.

Estados de conexión:

- `connected`: cuenta conectada.
- `disconnected`: cuenta no conectada.
- `expired`: token caducado.
- `needs_review`: requiere revisión o permisos incompletos.

Pantallas afectadas:

- SocialIA muestra estado Facebook e Instagram.
- Conexiones muestra tarjetas Facebook e Instagram.
- Ambas pantallas enlazan a `/api/integrations/meta/start`.

Pendiente:

- Revisión de permisos de Meta.
- Selección de Facebook Page.
- Selección de Instagram Business.
- Cifrado y conservación segura de tokens.
- Publicación real desde servidor con aprobación previa.
