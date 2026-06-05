# MVP final de AutonomIA

Este documento define qué debe estar incluido en la primera versión vendible de AutonomIA.

El objetivo del MVP no es tener todos los módulos reales, sino vender una primera versión estable, clara y útil para 2 o 3 negocios piloto. La prioridad es validar onboarding, valor percibido, uso básico de IA, precio, soporte y modelo SaaS recurrente.

No implica conectar Supabase, Stripe ni facturación real todavía. Es una definición de alcance.

## 1. MVP obligatorio para primeros clientes

La primera versión vendible debe incluir:

- Landing comercial.
- Login.
- Registro o alta de empresa.
- Dashboard cliente.
- Empresa.
- Usuarios.
- Suscripción.
- Facturación simulada o preparada.
- Centro IA básico.
- SocialIA básico.
- Configuración IA.
- Superadmin.
- Gestión de módulos.
- Notificaciones básicas.
- Tareas.

### Landing comercial

Debe explicar de forma clara:

- Qué es AutonomIA.
- Para quién es.
- Qué módulos tiene.
- Qué problema resuelve.
- Qué planes existen.
- Cómo solicitar demo o empezar.

### Login

Debe permitir acceso a usuarios registrados y preparar el flujo para Auth real.

### Registro o alta de empresa

Debe permitir crear o preparar el alta de una empresa cliente, aunque en la primera fase parte del proceso pueda ser asistido por el superadmin.

### Dashboard cliente

Debe ser la pantalla principal de la empresa cliente.

Debe mostrar:

- Resumen de actividad.
- Módulos activos.
- Tareas.
- Notificaciones.
- Señales básicas de uso.
- Accesos rápidos.

### Empresa

Debe permitir definir o visualizar:

- Nombre comercial.
- Sector.
- Localidad.
- Datos básicos.
- Horarios.
- Información de contacto.
- Preferencias operativas.

### Usuarios

Debe permitir visualizar usuarios, roles y permisos preparados para integración futura.

Límites de usuarios por plan:

- Gratuito: 1 usuario.
- Inicio: 1 usuario.
- Crecimiento: 2 usuarios.
- Local IA: hasta 5 usuarios.
- Enterprise queda oculto comercialmente y reservado para uso interno futuro.

Reglas del plan Gratuito:

- 0 euros al mes.
- 1 usuario.
- Instagram + Facebook.
- 2 publicaciones propias por semana.
- Centro IA limitado.
- Sin ReviewIA.
- Sin WhatsAppIA.
- Sin LeadIA.
- Sin ReservaIA.
- Sin InsightIA avanzado.

Desbloqueo semanal del plan Gratuito:

- Para renovar las 2 publicaciones gratuitas de la semana siguiente, el cliente debe publicar una Publicación de apoyo semanal.
- AutonomIA ofrecerá 3 opciones de publicación promocional positiva.
- Al aprobar o publicar una, se desbloquean las publicaciones de la próxima semana.
- No debe mencionarse que el cliente tiene condiciones internas, descuentos o gratuidad.
- El superadmin puede eximir manualmente a clientes concretos de esta condición y mantenerlos en Gratuito sin obligación promocional.

Roles mínimos:

- `company_admin`
- `marketing`
- `sales`
- `support`
- `readonly`

### Suscripción

Debe mostrar:

- Plan contratado.
- Estado de suscripción.
- Próxima renovación.
- Módulos incluidos.
- Estado de acceso.

Estados:

- `trial`
- `active`
- `past_due`
- `suspended`
- `canceled`

### Facturación simulada o preparada

Debe mostrar:

- Método de pago preparado.
- Último cobro correcto.
- Próxima renovación.
- Facturas emitidas simuladas o preparadas.
- Mensaje de preparación para cumplimiento fiscal.

No debe prometer facturación fiscal real hasta conectar proveedor definitivo.

### Centro IA básico

Debe servir como punto principal de interacción con la IA.

Incluye:

- Asistente básico.
- Sugerencias de tareas.
- Ideas de contenido.
- Resúmenes simples.
- Preparación para futuras conversaciones reales.

### SocialIA básico

Debe ser el primer módulo realista para vender el piloto.

Incluye:

- Ideas de publicaciones.
- Copys básicos.
- Planificación simple.
- Estados de publicación simulados o preparados.
- Enfoque en uso manual asistido por IA, no automatización completa.

### Configuración IA

Debe permitir definir:

- Tono de comunicación.
- Tipo de negocio.
- Público objetivo.
- Servicios principales.
- Preferencias de respuesta.

### Superadmin

Debe permitir al propietario de AutonomIA revisar:

- Empresas.
- Demos.
- Clientes.
- Suscripciones.
- Uso de módulos.
- Soporte.
- Riesgo de suspensión.
- Métricas SaaS básicas.

### Gestión de módulos

Debe permitir mostrar:

- Módulos activos.
- Módulos recomendados.
- Módulos disponibles.
- Valor comercial de cada módulo.

### Notificaciones básicas

Debe incluir avisos simples:

- Tareas pendientes.
- Estado de suscripción.
- Recomendaciones IA.
- Actividad reciente.

### Tareas

Debe incluir una gestión básica de tareas:

- Título.
- Estado.
- Prioridad.
- Fecha.
- Relación con módulo cuando aplique.

## 2. Fuera del MVP inicial

Queda fuera del MVP inicial:

- WhatsAppIA real.
- ReviewIA real.
- LeadIA real.
- ReservaIA real.
- InsightIA avanzado.
- TikTok & Shorts.
- Google Business avanzado.
- VERI*FACTU real.
- Automatizaciones avanzadas.

Estos módulos pueden aparecer como preparados, recomendados, disponibles o futuros, pero no deben venderse como automatización real ya operativa si todavía no están conectados.

## 3. Primer flujo real

Flujo recomendado para el primer cliente:

1. Cliente solicita demo.
2. Superadmin revisa la demo.
3. Se crea empresa.
4. Se elige plan.
5. Cliente paga.
6. Se crea `company_admin`.
7. Cliente entra al dashboard.
8. Configura empresa.
9. Configura tono IA.
10. Usa SocialIA básico.

Regla principal:

Sin cobro inicial correcto no hay acceso operativo, salvo que se active una campaña `trial` de forma explícita.

## 4. MVP técnico

El MVP técnico debe incluir:

- Supabase Auth.
- RLS multiempresa.
- `companies`.
- `profiles`.
- `company_users`.
- `plans`.
- `subscriptions`.
- `modules`.
- `company_modules`.
- `company_ai_settings`.
- `posts`.
- `tasks`.
- `notifications`.
- `usage_events`.

### Supabase Auth

Debe gestionar:

- Login.
- Sesión.
- Usuario autenticado.
- Relación con perfil interno.

### RLS multiempresa

Debe garantizar:

- Cada empresa ve solo sus datos.
- El superadmin puede ver todo.
- El usuario cliente no puede consultar otra empresa.
- Los permisos dependen de `company_users`.

### Tablas mínimas

`companies`:

- Empresas cliente.

`profiles`:

- Datos propios de usuarios vinculados a Auth.

`company_users`:

- Relación usuario-empresa-rol.

`plans`:

- Planes comerciales.

`subscriptions`:

- Estado de suscripción y periodo.

`modules`:

- Catálogo de módulos.

`company_modules`:

- Módulos activos por empresa.

`company_ai_settings`:

- Tono, preferencias y configuración IA por empresa.

`posts`:

- Contenido SocialIA.

`tasks`:

- Tareas operativas.

`notifications`:

- Avisos internos.

`usage_events`:

- Eventos de uso para métricas.

## 5. MVP de pagos

El MVP de pagos debe empezar en modo test.

Debe incluir:

- Stripe Checkout en test.
- Stripe Customer.
- Stripe Subscription.
- Webhooks mínimos.

Webhooks necesarios:

- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Estados internos:

- `trial`
- `active`
- `past_due`
- `suspended`
- `canceled`

### Flujo de pago mínimo

1. Cliente selecciona plan.
2. Se crea sesión de Checkout.
3. Cliente paga con tarjeta.
4. Stripe confirma pago.
5. Webhook actualiza Supabase.
6. Se crea o activa suscripción.
7. Se permite acceso al dashboard.

### Fallo de pago

1. Stripe emite `invoice.payment_failed`.
2. La suscripción pasa a `past_due`.
3. Se muestra aviso al cliente.
4. Si no regulariza, pasa a `suspended`.
5. `suspended` bloquea acceso operativo.

## 6. Regla de acceso

Reglas obligatorias:

- Sin cobro inicial correcto no hay acceso.
- `active` tiene acceso.
- `past_due` tiene aviso.
- `suspended` no tiene acceso operativo.
- `canceled` pierde acceso al acabar el periodo pagado.

Acceso por estado:

- `trial`: acceso según campaña.
- `active`: acceso completo según plan y rol.
- `past_due`: acceso con aviso visible.
- `suspended`: solo regularización, facturación mínima o soporte.
- `canceled`: sin acceso operativo tras fin del periodo.

El bloqueo de acceso debe validarse en servidor, no solo en la interfaz.

## 7. Qué se puede vender

Plan recomendado para piloto:

**Crecimiento lanzamiento por 120 euros al mes.**

Regla de lanzamiento:

- El cliente mantiene el precio de lanzamiento mientras permanezca en el mismo
  plan o suba a un plan superior.
- Si baja de modalidad, pierde el precio de lanzamiento y se aplica el precio
  normal vigente.

## Onboarding de demo

La primera versión vendible debe permitir crear una prueba gratuita desde la
landing sin aprobación manual previa del superadmin.

Datos mínimos de la solicitud:

- Datos de empresa.
- Nombre de contacto.
- Email.
- Teléfono.
- Sector elegido.
- Objetivo principal.
- Tono IA.
- Módulos recomendados según sector.
- Contraseña creada por el cliente.

Si el cliente selecciona `Otro` como objetivo, debe poder describir qué necesita
en un campo libre.

Flujo esperado:

1. El cliente llega desde la landing.
2. Completa onboarding.
3. Crea su cuenta con email y contraseña.
4. AutonomIA crea usuario Auth, perfil, empresa, relación `company_admin`,
   suscripción Gratuita en trial y módulos iniciales.
5. SocialIA queda activo.
6. Los módulos recomendados por sector quedan como recomendados.
7. Se registra el origen `landing` en `demo_requests` y `superadmin_notes`.
8. El cliente entra directamente al dashboard.

El superadmin no aprueba la entrada inicial. Puede intervenir después para
cambiar plan, activar Acceso VIP, conceder demo ilimitada, suspender, archivar o
convertir a pago.

## Política de datos demo

Antes de activar módulos reales, AutonomIA debe separar los datos de prueba de
la actividad real.

Las tablas operativas deben contemplar:

- `is_demo`
- `archived_at`
- `deleted_at`

Las métricas del MVP solo deben contar datos reales operativos:

- `is_demo = false`
- `archived_at is null`
- `deleted_at is null`

Los datos demo, archivados o eliminados lógicamente no deben afectar a métricas
de uso IA, publicaciones, leads, reservas, reseñas, actividad ni módulos usados.

No se deben borrar registros fiscales, facturas, pagos ni eventos de facturación
desde herramientas de limpieza demo.

## SocialIA Fase 1A

SocialIA Fase 1A permite gestionar publicaciones internas reales dentro de
AutonomIA sin conectar Meta, Facebook, Instagram ni OpenAI.

Incluye:

- Crear publicaciones internas.
- Guardar borradores.
- Enviar a aprobación.
- Editar publicaciones.
- Aprobar publicaciones.
- Programar fecha dentro de AutonomIA.
- Cancelar publicaciones.
- Archivar publicaciones.
- Marcar publicaciones como demo/prueba cuando proceda.
- Generar un ejemplo temporal que solo rellena el formulario y no se guarda.
- Contador del plan Gratuito con 2 publicaciones reales semanales.

Estados previstos:

- `draft`
- `pending_approval`
- `approved`
- `scheduled`
- `published_simulated`
- `canceled`
- `archived`

Las publicaciones programadas no se publican en redes reales todavía. La futura
integración con Meta deberá respetar aprobación, permisos y límites del plan.
Las métricas solo cuentan publicaciones reales operativas: `is_demo = false`,
`archived_at is null` y `deleted_at is null`.

## SocialIA Fase 1B

SocialIA Fase 1B añade calendario editorial completo para organizar contenido
antes de conectar redes reales.

Incluye:

- Vista mensual del calendario editorial.
- Vista semanal de lunes a domingo.
- Navegación por mes o semana con Anterior y Siguiente.
- Panel de próximas publicaciones: hoy, mañana y esta semana.
- Visualización de publicaciones `draft`, `pending_approval`, `scheduled` y
  `published_simulated`.
- Distintivo `Demo` para publicaciones de prueba.
- Reprogramación manual editando la fecha programada desde la tarjeta.
- Calendario visible aunque el plan Gratuito alcance el límite semanal.

Las publicaciones demo se muestran para revisión, pero no cuentan en
estadísticas reales. Esta fase todavía no publica en Instagram, Facebook, Meta
ni otras redes.

Motivo:

- Precio suficiente para validar disposición de pago.
- Más vendible que un plan demasiado básico.
- Permite incluir 2 usuarios, SocialIA básico, Google Business, ReviewIA básico, informes básicos, Centro IA, dashboard, configuración, tareas y soporte inicial.
- Reduce la presión de prometer automatizaciones avanzadas desde el primer día.

Mensaje comercial recomendado:

AutonomIA ayuda al negocio local a organizar su presencia digital, generar contenido con IA, centralizar tareas y preparar automatizaciones futuras sin tener que construir todo desde cero.

## 8. Objetivo del piloto

Objetivos:

- Trabajar con 2 o 3 negocios reales.
- Validar SocialIA básico.
- Validar Centro IA.
- Validar onboarding.
- Validar precio.
- Validar soporte.

Métricas recomendadas:

- Tiempo hasta primer acceso.
- Tiempo hasta primera configuración IA.
- Número de publicaciones generadas.
- Uso semanal del dashboard.
- Preguntas frecuentes del cliente.
- Fricciones de onboarding.
- Incidencias de soporte.
- Valor percibido por el cliente.
- Probabilidad de renovación.

## 9. Checklist antes de cobrar

Antes de cobrar a un cliente real:

- Build OK.
- Lint OK.
- Auth OK.
- RLS OK.
- Stripe test OK.
- Superadmin ve clientes.
- Cliente ve solo su empresa.
- Suscripción bloquea acceso si no está activa.
- Política de privacidad.
- Condiciones de contratación.
- Aviso fiscal o facturación pendiente de proveedor definitivo.

Checklist adicional recomendado:

- Flujo de cancelación definido.
- Emails transaccionales mínimos.
- Soporte definido.
- Copia de seguridad definida.
- Revisión legal básica.
- Revisión fiscal básica.
- Coste estimado de OpenAI por cliente.

## 10. Roadmap después del MVP

Orden recomendado después del MVP:

1. ReviewIA.
2. WhatsAppIA.
3. LeadIA.
4. ReservaIA.
5. InsightIA avanzado.
6. VERI*FACTU real.
7. Producción.

### ReviewIA

Objetivo:

- Gestionar reseñas y respuestas asistidas.

### WhatsAppIA

Objetivo:

- Convertir conversaciones en leads, tareas o reservas.

### LeadIA

Objetivo:

- Captar, clasificar y priorizar oportunidades.

### ReservaIA

Objetivo:

- Gestionar solicitudes y reservas.

### InsightIA avanzado

Objetivo:

- Unificar métricas, uso, señales de negocio y recomendaciones.

### VERI*FACTU real

Objetivo:

- Conectar proveedor fiscal compatible y dejar facturación preparada para producción en España.

### Producción

Objetivo:

- Lanzar con dominio, entorno estable, backups, logs, soporte, privacidad, términos y monitorización.

## Recomendación final

El MVP debe vender una promesa concreta y cumplible:

AutonomIA como asistente SaaS para negocios locales que organiza el trabajo, ayuda a crear contenido, centraliza tareas y prepara el crecimiento hacia automatizaciones reales.

El primer piloto no debe intentar activar todos los módulos. Debe demostrar que el cliente entiende el producto, paga por él, lo usa semanalmente y percibe valor suficiente para renovar.

## Actualización operativa: Superadmin

Para el MVP, el Superadmin queda preparado para gestionar demos y módulos desde Supabase sin conectar Stripe ni facturación real.

Acciones de demo incluidas:

- Extender demo 7 días.
- Extender demo 30 días.
- Marcar demo sin límite.
- Suspender demo.
- Convertir demo en cliente.
- Eximir publicación promocional semanal.

Acciones de módulos incluidas:

- Marcar módulo como activo.
- Marcar módulo como recomendado.
- Marcar módulo como disponible.
- Marcar módulo como bloqueado.

Reglas:

- Solo una sesión real con rol `superadmin` puede ejecutar estas acciones.
- En modo demo las acciones quedan bloqueadas.
- La conversión demo a cliente activa la empresa y prepara/actualiza una suscripción interna, pero no realiza cobros.
- La exención promocional se registra como nota interna hasta que exista un campo dedicado.
- El desbloqueo manual de módulos actúa sobre `company_modules`.

### Alta manual de empresas

El MVP incluye preparación para crear empresas reales desde Superadmin sin conectar todavía Stripe.

El alta manual crea:

- Empresa.
- Perfil del administrador inicial.
- Usuario Auth si se define contraseña temporal.
- Relación `company_admin`.
- Suscripción interna en estado `trial`.
- Módulos iniciales activos.
- Nota interna de trazabilidad.

Tipos de demo:

- Normal.
- Comercial.
- VIP.
- Partner.

Regla de demos especiales:

Las demos VIP y Partner se tratan comercialmente como demos sin límite. Mientras no exista un campo específico en la base, se registran como empresa `demo` y se añade la marca interna correspondiente en `superadmin_notes`.

Pendiente para la siguiente fase:

- Conectar plantilla de email transaccional definitiva.
- Conectar el paso posterior de pago con Stripe.

### Edición de empresa desde Superadmin

El MVP incluye una página de detalle por empresa:

- `/superadmin/empresas/[id]`

Permite:

- Editar datos básicos.
- Cambiar sector.
- Cambiar plan.
- Cambiar estado de empresa.
- Activar o desactivar módulos.
- Resetear acceso del administrador con contraseña temporal.
- Generar invitación si Supabase Auth/email está disponible.
- Revisar notas internas.

El teléfono de empresa queda provisionalmente asociado al perfil administrador hasta ampliar el esquema de datos.

### Bloqueo por plan y suscripción

El MVP debe aplicar control real de acceso antes de vender a clientes piloto.

Reglas incluidas:

- `trial` y `active` permiten acceso según plan.
- `past_due` permite acceso con aviso visible.
- `suspended` bloquea acceso operativo y deja entrar solo a suscripción/facturación.
- `canceled` queda bloqueado salvo futura regla de periodo pagado vigente.

Protección por plan:

- Gratuito: dashboard, SocialIA limitado, empresa, suscripción y facturación.
- Inicio: SocialIA completo y gestión básica.
- Crecimiento: SocialIA, Google Business, ReviewIA básico, InsightIA básico y usuarios.
- Local IA: módulos principales.
- Enterprise: oculto comercialmente y reservado para compatibilidad interna futura.

Las páginas no incluidas en el plan deben mostrar una tarjeta de acceso limitado con enlace a planes y solicitud de ampliación.

### Baja de cliente desde Superadmin

El MVP debe permitir gestionar clientes que dejan de estar interesados sin comprometer datos fiscales ni trazabilidad.

Acciones:

- Archivar cliente: opción recomendada.
- Suspender acceso: bloquea la cuenta sin borrar datos.
- Eliminar definitivamente: solo si no hay facturas, pagos, eventos de cobro ni registros fiscales.

Reglas:

- La baja debe ejecutarse solo por `superadmin`.
- La eliminación definitiva debe exigir confirmación visual.
- Si hay datos protegidos, la eliminación se bloquea y se recomienda archivar.
- Las facturas y registros fiscales no deben borrarse desde la app.

Migración necesaria:

- `supabase/migrations/007_company_offboarding.sql`

### Métricas económicas reales

El MVP debe evitar que demos o pruebas internas aparezcan como ingresos.

Solo cuentan para ingresos reales:

- Empresas `active` facturables.
- Empresas `past_due` facturables.

No cuentan para ingresos:

- Demos.
- Trial gratuito.
- Demos ilimitadas.
- Clientes VIP.
- Partners.
- Beta testers.
- Pruebas internas.
- Empresas exentas de pago.
- Empresas suspendidas, canceladas o archivadas.

Reglas para Superadmin:

- MRR, ARR, ARPU, ingresos mensuales y renovaciones previstas solo usan clientes facturables.
- Las empresas en prueba deben verse en métricas separadas.
- Mientras no exista una columna específica de exención, las marcas se pueden leer desde `superadmin_notes`.
- El panel debe mostrar claramente `Ingresos reales` y `Empresas en prueba`.

### Acceso VIP y valor económico visible

El MVP debe permitir que AutonomIA conceda acceso profesional sin coste a clientes estratégicos.

Casos:

- Acceso VIP.
- Demo ilimitada.
- Partner.
- Beta tester.
- Acceso promocional.

Reglas:

- No genera ingresos.
- No genera facturación.
- No suma MRR ni ARR.
- El cliente debe ver el precio oficial real del plan.
- No debe parecer una versión gratuita básica.

Experiencia cliente:

- En dashboard, suscripción y módulos debe mostrarse un distintivo de acceso VIP.
- Para Crecimiento debe mostrarse precio oficial 150€/mes tachado.
- Para Local IA debe mostrarse precio oficial 300€/mes tachado.
- El texto debe transmitir privilegio, colaboración y confianza.

Texto base:

`Actualmente disfrutas de acceso VIP concedido por AutonomIA. Mantienes acceso completo sin coste mientras esta condición permanezca activa.`
