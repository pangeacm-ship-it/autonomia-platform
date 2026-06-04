# Roadmap técnico de AutonomIA

Este documento define el orden recomendado para pasar AutonomIA de maqueta funcional a SaaS real con datos, autenticación, pagos, facturación fiscal, IA e integraciones externas.

No implica conexión real con Supabase, Stripe, OpenAI ni proveedores fiscales. Es una guía técnica previa a implementación.

## 1. Estado actual del proyecto

AutonomIA ya cuenta con una base funcional estable:

- Landing estable.
- Dashboard cliente en `/dashboard`.
- Panel propietario/superadmin en `/superadmin`.
- Página de módulos profesional.
- Página de usuarios y permisos simulada.
- Documentación inicial de Supabase en `docs/supabase`.
- Documentación inicial de billing en `docs/billing`.
- Preparación de integración Supabase en código con clientes, helpers, tipos, middleware no bloqueante y fallback mock.
- Build OK.
- Lint OK.
- TypeScript OK.
- Módulos simulados con datos locales.

El proyecto todavía no tiene:

- Supabase real.
- Auth real.
- RLS real.
- Stripe real.
- Facturación fiscal real.
- Conexión OpenAI real.
- Integraciones Meta, Google o WhatsApp reales.

## 2. Arquitectura futura

Arquitectura recomendada:

- **Next.js**: aplicación web, dashboard cliente, superadmin y rutas server/client.
- **Supabase Postgres**: base de datos multiempresa.
- **Supabase Auth**: autenticación de usuarios.
- **Supabase RLS**: aislamiento por empresa y permisos por rol.
- **Stripe**: suscripciones mensuales, tarjeta, renovaciones y webhooks.
- **Proveedor fiscal compatible con VERI*FACTU**: emisión fiscal española, PDF, QR, huella, conservación y rectificativas.
- **OpenAI**: Centro IA, generación de contenido, análisis, respuestas y automatizaciones.
- **APIs Meta / Google / WhatsApp**: publicaciones, reseñas, mensajería y presencia local.

Principio arquitectónico:

- Stripe gestiona cobro.
- Supabase gestiona datos y permisos.
- El proveedor fiscal gestiona cumplimiento de factura española.
- OpenAI y APIs externas ejecutan automatizaciones.
- Next.js orquesta la experiencia de usuario.

## 3. Fase 1: Supabase

Objetivo: crear la base real multiempresa.

Pasos:

1. Crear proyecto Supabase.
2. Revisar `docs/supabase/schema.sql`.
3. Ejecutar schema en entorno de desarrollo.
4. Ejecutar `docs/supabase/seed.sql`.
5. Revisar datos demo.
6. Activar RLS con `docs/supabase/rls-policies.sql`.
7. Crear roles base.
8. Migrar arrays locales a tablas.

Tablas prioritarias:

- `companies`
- `profiles`
- `company_users`
- `roles`
- `plans`
- `subscriptions`
- `modules`
- `company_modules`

Después migrar:

- `tasks`
- `notifications`
- `activities`
- `ai_conversations`
- `ai_messages`
- `posts`
- `reviews`
- `leads`
- `reservations`
- `calendar_events`
- `usage_events`

## 4. Fase 2: Auth y roles

Objetivo: que cada persona entre con su usuario y vea solo lo que debe.

Roles:

- `superadmin`: acceso global a plataforma, empresas, facturación, soporte, demos y métricas.
- `company_admin`: administración de una empresa, usuarios, módulos, suscripción, facturación y configuración.
- `marketing`: SocialIA, ReviewIA, Calendario IA, InsightIA y Google Business.
- `sales`: LeadIA, WhatsAppIA y ReservaIA.
- `support`: WhatsAppIA y ReviewIA.
- `readonly`: lectura de informes, métricas y actividad.

Reglas:

- Un usuario puede pertenecer a una o varias empresas mediante `company_users`.
- Los datos de empresa se filtran por `company_id`.
- El superadmin puede ver todo.
- Los usuarios cliente no pueden leer datos de otras empresas.
- `readonly` no debe escribir datos operativos.
- `company_admin` puede invitar/desactivar usuarios de su empresa.

## 5. Fase 3: Modelo SaaS

Estados de suscripción:

- `trial`
- `active`
- `past_due`
- `suspended`
- `canceled`

Reglas:

- Sin cobro inicial correcto no hay acceso.
- La renovación es automática mensual.
- Si falla el cobro, la suscripción pasa a `past_due`.
- En `past_due`, se notifica al cliente y se aplica un periodo de regularización.
- Si no regulariza, pasa a `suspended`.
- En `suspended`, no hay acceso operativo a módulos.
- Si actualiza tarjeta y se cobra correctamente, vuelve a `active`.
- Si cancela, mantiene acceso hasta fin del periodo pagado.
- Al terminar el periodo cancelado, pierde acceso.

Acceso recomendado:

- `active`: acceso completo.
- `trial`: acceso si se habilita prueba.
- `past_due`: acceso limitado o aviso persistente.
- `suspended`: acceso solo a facturación/regularización.
- `canceled`: acceso hasta `current_period_end`.

## 6. Fase 4: Stripe

Objetivo: activar cobro recurrente por tarjeta.

Objetos Stripe necesarios:

- `customers`
- `subscriptions`
- `invoices`
- `payment_methods`
- `payment_intents`
- `checkout_sessions`
- `webhooks`

Eventos recomendados:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_method.attached`

Relación con Supabase:

- `companies.stripe_customer_id`
- `subscriptions.stripe_subscription_id`
- `payments.stripe_payment_intent_id`
- `payments.stripe_invoice_id`
- `invoices.stripe_invoice_id`
- `billing_events.event_type`
- `billing_events.payload`

Regla clave:

Stripe debe gestionar cobros y renovación, pero no debe asumirse que cubre por sí solo todo el cumplimiento fiscal español.

## 7. Fase 5: Facturación fiscal española

Objetivo: emitir y conservar facturas correctamente en España.

Debe prepararse para:

- Facturas emitidas.
- PDF fiscal.
- Código QR cuando corresponda.
- Serie y número de factura.
- Fecha de emisión.
- Fecha de operación/devengo.
- Emisor.
- Receptor.
- NIF/CIF de ambas partes.
- Base imponible.
- IVA.
- Total.
- Método/referencia de pago.
- Conservación documental.
- Facturas rectificativas.
- Trazabilidad.
- Huella/hash futura.
- Estado de envío/cumplimiento fiscal.
- Proveedor compatible con VERI*FACTU.

Reglas:

- No modificar facturas emitidas.
- Corregir mediante factura rectificativa.
- Conservar factura, PDF y registros durante el plazo legal aplicable.
- Separar estado de pago y estado fiscal.
- Guardar referencias cruzadas entre Stripe, factura interna y factura fiscal.

Antes de producción:

- Revisar con asesoría fiscal.
- Elegir proveedor fiscal o solución compatible.
- Confirmar requisitos concretos aplicables a AutonomIA.

## 8. Fase 6: Integraciones IA

Objetivo: convertir los módulos simulados en módulos reales.

Integraciones IA:

- OpenAI para Centro IA.
- SocialIA real: generación de publicaciones, calendarios y aprobaciones.
- ReviewIA real: propuesta de respuestas a reseñas.
- LeadIA real: detección, clasificación y seguimiento de oportunidades.
- ReservaIA real: gestión de solicitudes, confirmaciones y recordatorios.
- InsightIA real: informes, métricas y recomendaciones.
- WhatsAppIA real: respuestas, derivaciones, leads y reservas.

Tablas clave:

- `ai_conversations`
- `ai_messages`
- `activities`
- `tasks`
- `usage_events`
- `posts`
- `reviews`
- `leads`
- `reservations`

## 9. Fase 7: Integraciones externas

Objetivo: conectar AutonomIA con canales reales.

APIs previstas:

- Meta.
- Instagram.
- Facebook.
- Google Business.
- WhatsApp Business API.
- Email transaccional.
- Almacenamiento de PDFs.

Riesgos:

- Límites de API.
- Revisión de permisos.
- Costes por conversación WhatsApp.
- Cambios de políticas Meta/Google.
- Errores de conexión de cuentas de clientes.

Recomendación:

- Conectar primero Google Business y SocialIA.
- Después ReviewIA.
- Después WhatsAppIA y ReservaIA.
- Mantener logs de conexión y errores.

## 10. Fase 8: Producción

Objetivo: lanzar de forma segura.

Preparación:

- Vercel.
- Dominio.
- Variables de entorno.
- Backups Supabase.
- Logs de aplicación.
- Monitorización.
- Alertas de errores.
- Políticas de privacidad.
- Términos de contratación.
- Contrato encargado tratamiento si aplica.
- Seguridad de acceso.
- Plan de soporte.

Checklist:

- Build producción OK.
- RLS probado.
- Webhooks Stripe probados.
- Facturación fiscal validada.
- Backups activos.
- Logs y alertas activos.
- Datos legales publicados.
- Piloto con clientes reales controlados.

## 11. Prioridad recomendada

Orden exacto:

1. Elegir proveedor fiscal/VERI*FACTU.
2. Crear Supabase.
3. Implementar Auth + roles.
4. Migrar empresas/usuarios/planes/módulos.
5. Conectar Stripe.
6. Conectar facturación fiscal.
7. Conectar OpenAI.
8. Conectar APIs externas.
9. Piloto con 2-3 clientes.
10. Lanzamiento.

Motivo:

La facturación fiscal condiciona cómo se guardan facturas, pagos, PDFs, hashes y rectificativas. Elegir tarde el proveedor puede obligar a rehacer datos críticos.

## 12. Riesgos

### Cumplimiento fiscal

Riesgo alto si se emiten facturas reales sin proveedor o validación fiscal.

### Protección de datos

AutonomIA tratará datos de clientes, usuarios, leads, conversaciones y posiblemente reseñas. Requiere políticas claras y control de acceso.

### Acceso multiempresa

Una fuga entre empresas sería crítica. RLS debe probarse con cuidado.

### RLS mal configurado

Puede bloquear usuarios legítimos o exponer datos de terceros.

### Dependencia de APIs externas

Meta, Google, WhatsApp y Stripe pueden cambiar límites, permisos o costes.

### Costes OpenAI/WhatsApp/Stripe

Debe medirse consumo por empresa y módulo desde el principio.

### Soporte a clientes

WhatsAppIA, conexiones y facturación generarán incidencias. Hace falta flujo de soporte.

## 13. Próximas decisiones pendientes

- Proveedor fiscal/VERI*FACTU.
- Cuenta Supabase.
- Cuenta Vercel.
- Cuenta Stripe.
- Dominio.
- Política de precios final.
- Contrato/condiciones.
- Política de privacidad.
- Onboarding clientes.
- Periodo de gracia para `past_due`.
- Si habrá `trial` o solo pago inicial obligatorio.
- Primeros 2-3 clientes piloto.

## Recomendación final

AutonomIA debe avanzar en este orden: fiscalidad, datos, auth, pagos, IA e integraciones. El producto visual ya está suficientemente preparado para empezar la fase técnica real, pero no conviene activar cobros hasta tener decididos proveedor fiscal, modelo de suscripción y control de acceso por estado.
