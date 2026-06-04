# Auditoría técnica pre-Supabase de AutonomIA

Fecha: 2026-06-03

Objetivo: revisar el estado técnico de AutonomIA antes de conectar Supabase, Stripe y datos reales.

Alcance revisado:

- Estructura de carpetas.
- Componentes y páginas.
- Imports y rutas.
- Mocks y tipos.
- Responsive y scroll.
- Rendimiento.
- Preparación Supabase.
- Preparación Stripe.
- Documentación técnica, legal y fiscal existente.

## Resumen ejecutivo

AutonomIA está en buen estado como maqueta funcional avanzada. La landing, onboarding, dashboard cliente, superadmin y documentación técnica están ya preparados para pasar a una fase de integración real.

El proyecto compila correctamente, no presenta bloqueo en generación estática y mantiene un diseño coherente. La mayor parte del riesgo actual no está en la UI, sino en el salto de datos simulados a datos reales: Auth, RLS, roles, suscripciones, facturación y sincronización de tipos con el esquema Supabase.

La recomendación principal es no seguir creando muchas pantallas nuevas hasta cerrar el contrato de datos: Supabase Auth, perfiles, empresa activa, roles, módulos, suscripción y bloqueo de acceso.

## Estado actual del proyecto

### Estructura general

La estructura es clara y separada:

- `app/`: rutas Next.js App Router.
- `components/`: componentes de landing, dashboard y Centro IA.
- `components/centroia/`: componentes específicos del Centro IA.
- `lib/`: helpers de negocio, Supabase, auth y datos.
- `types/`: tipos TypeScript de base.
- `docs/`: documentación técnica, legal, fiscal, billing, roadmap y Supabase.
- `supabase/migrations/`: migraciones SQL preparadas para proyecto real.
- `supabase/seed.sql`: datos demo para entorno Supabase.
- `public/`: logos y assets ligeros.

### Rutas principales detectadas

Rutas públicas:

- `/`
- `/login`
- `/registro`
- `/onboarding`
- `/onboarding/modulos`
- `/onboarding/facturacion`
- `/billing-required`

Dashboard cliente:

- `/dashboard`
- `/dashboard/centro-ia`
- `/dashboard/socialia`
- `/dashboard/google-business`
- `/dashboard/reviewia`
- `/dashboard/tiktok-shorts`
- `/dashboard/leadia`
- `/dashboard/whatsappia`
- `/dashboard/reservaia`
- `/dashboard/insightia`
- `/dashboard/calendario`
- `/dashboard/tareas`
- `/dashboard/notificaciones`
- `/dashboard/empresa`
- `/dashboard/usuarios`
- `/dashboard/conexiones`
- `/dashboard/suscripcion`
- `/dashboard/facturacion`
- `/dashboard/configuracion`
- `/dashboard/configuracion-ia`
- `/dashboard/cuenta`
- `/dashboard/legal`

Panel propietario:

- `/superadmin`

## Clasificación de hallazgos

## Crítico

### C1. El control real de acceso todavía no existe

Estado: esperado antes de Supabase, pero crítico para producción.

Actualmente `proxy.ts` detecta `/dashboard` y `/superadmin`, pero deja pasar si Supabase no está configurado. También mantiene TODOs para sesión, rol y suscripción.

Impacto:

- Cualquier usuario puede abrir `/dashboard` o `/superadmin` en la maqueta.
- No hay bloqueo real por suscripción.
- No hay separación real entre empresa cliente y propietario.

Recomendación:

- Implementar Supabase Auth antes de cualquier piloto con datos reales.
- Activar lectura de sesión en `proxy.ts`.
- Redirigir usuarios sin sesión a `/login`.
- Redirigir suscripciones no activas a `/billing-required`.
- Bloquear `/superadmin` salvo rol `superadmin`.

### C2. RLS preparada, pero no probada con usuarios reales

Estado: preparada documentalmente.

Existen migraciones en `supabase/migrations`, incluyendo `006_rls_policies.sql`, pero todavía no se han ejecutado ni probado contra usuarios reales de Supabase Auth.

Impacto:

- Riesgo de fuga multiempresa si se conectan queries sin pruebas de aislamiento.
- Riesgo de roles mal interpretados en módulos.

Recomendación:

- Crear proyecto Supabase de pruebas.
- Ejecutar migraciones y seed.
- Crear usuarios reales de Auth.
- Vincular `profiles.auth_user_id`.
- Probar cada rol: `superadmin`, `company_admin`, `marketing`, `sales`, `support`, `readonly`.
- Probar que una empresa no puede leer datos de otra.

### C3. Los tipos TypeScript no están sincronizados con el esquema final de migraciones

Archivo afectado:

- `types/database.ts`

El archivo de tipos actual cubre solo tablas core básicas: `companies`, `profiles`, `company_users`, `plans`, `subscriptions`, `modules`, `company_modules`.

Las migraciones ya incluyen muchas más tablas:

- settings.
- operations.
- billing.
- fiscal records.
- platform.
- usage events.

Además hay diferencias de nombres:

- En tipos aparece `Company.sector`, pero la migración usa `industry` y `sector_id`.
- En tipos aparece `Plan.slug`, pero la migración usa `plans.key`.
- En tipos aparece `CompanyUser.role`, pero la migración usa `role_id`.
- En tipos `Company.status` no incluye `trial` ni `past_due`, mientras la migración sí contempla estados SaaS.

Impacto:

- Cuando se conecte Supabase real, habrá errores o mapeos manuales innecesarios.
- Riesgo de queries tipadas incorrectamente.

Recomendación:

- Cuando se cree Supabase real, generar tipos desde el esquema real.
- Sustituir o ampliar `types/database.ts` con tipos generados.
- Alinear naming entre app, mocks y migraciones antes de conectar páginas.

## Importante

### I1. La app todavía usa datos simulados de forma extensa

Archivos y zonas:

- `lib/data/mock.ts`
- páginas de dashboard.
- páginas de módulos.
- `app/superadmin/page.tsx`
- `components/centroia/data.ts`

Estado actual:

- La UI es funcional visualmente.
- Los datos están hardcodeados o en arrays locales.
- Existen helpers en `lib/data/*` con fallback a mocks, pero la mayoría de páginas aún no consumen esos helpers.

Impacto:

- Al conectar Supabase, habrá que migrar página por página.
- Riesgo de duplicar modelos entre arrays locales y tablas reales.

Recomendación:

- Priorizar una primera capa de datos para:
  - empresa actual.
  - perfil actual.
  - suscripción.
  - módulos activos.
  - plan.
  - notificaciones/tareas.
- Cambiar primero `/dashboard`, `/dashboard/empresa`, `/dashboard/modulos`, `/dashboard/suscripcion`, `/dashboard/facturacion`.
- Mantener fallback mock mientras no haya sesión.

### I2. El modelo SaaS está documentado, pero no aplicado todavía en runtime

Documentación existente:

- `docs/AUTONOMIA-BUSINESS-RULES.md`
- `docs/AUTONOMIA-MVP.md`
- `docs/ROADMAP-TECNICO.md`
- `docs/billing/*`
- `docs/legal/CONDICIONES-CONTRATACION.md`

Estados definidos:

- `trial`
- `active`
- `past_due`
- `suspended`
- `canceled`

Impacto:

- La app muestra la intención correcta, pero no bloquea acceso por estado.
- El usuario puede navegar aunque la suscripción esté simulada como no válida.

Recomendación:

- Crear una función central `canAccessDashboard(subscriptionStatus)`.
- Aplicarla en `proxy.ts` cuando Supabase esté conectado.
- Añadir pantalla clara para `past_due` y `suspended`.

### I3. Preparación Stripe correcta a nivel documental, pendiente de contrato técnico

Estado:

- Hay documentación en `docs/billing`.
- Las migraciones incluyen campos futuros de Stripe:
  - `stripe_customer_id`
  - `stripe_subscription_id`
  - `stripe_invoice_id`
  - `provider_payment_intent_id`
  - `billing_events`

Pendiente:

- No existe todavía módulo `lib/stripe`.
- No existe tabla/handler real de webhooks.
- No existe modo test conectado.

Recomendación:

- No conectar Stripe antes de cerrar Supabase Auth + empresa + suscripción.
- Definir webhooks mínimos:
  - `checkout.session.completed`
  - `invoice.paid`
  - `invoice.payment_failed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- Guardar eventos crudos en `billing_events` antes de mutar estado.

### I4. Muchas acciones internas son botones visuales

Ejemplos:

- Guardar cambios.
- Generar informes.
- Aprobar publicaciones.
- Conectar WhatsApp.
- Exportar informe.
- Reenviar invitación.
- Cambiar método de pago.

Estado:

- Es correcto para maqueta.
- No debe confundirse con funcionalidad real.

Impacto:

- En piloto, puede generar expectativa de funcionalidad no implementada.

Recomendación:

- Antes de piloto, marcar acciones no disponibles como "Próximamente" o conectar solo las acciones MVP.
- Priorizar acciones reales:
  - login.
  - onboarding.
  - empresa.
  - usuarios.
  - módulos.
  - suscripción.
  - SocialIA básico.
  - tareas/notificaciones básicas.

### I5. Superadmin está muy avanzado visualmente, pero todo es estático

Ruta:

- `/superadmin`

Fortalezas:

- Se entiende como panel propietario.
- Contiene clientes, demos, ingresos, uso, alertas y módulos.
- Usa vocabulario SaaS correcto: MRR, ARR, churn, renovaciones fallidas, suscripciones suspendidas.

Riesgo:

- Sin Supabase no hay control real de demos, clientes ni suscripciones.

Recomendación:

- Después de Auth, conectar primero:
  - `companies`
  - `subscriptions`
  - `demo_requests`
  - `usage_events`
  - `support_tickets`

## Recomendado

### R1. Consolidar nombres de módulos

Hay variaciones entre app, mocks y migraciones:

- `google-business` en rutas.
- `google_business` en SQL.
- `calendario` en mocks.
- `calendario_ia` en SQL.

Impacto:

- No es crítico ahora.
- Puede complicar queries, rutas y permisos por módulo.

Recomendación:

- Mantener rutas con guion para URLs.
- Mantener keys SQL con snake_case.
- Crear un mapa central:
  - `moduleKey`.
  - `route`.
  - `label`.
  - `requiredRole`.

### R2. Usar helpers de datos antes de conectar páginas directamente a Supabase

Ya existen:

- `lib/data/companies.ts`
- `lib/data/modules.ts`
- `lib/data/plans.ts`
- `lib/data/profiles.ts`
- `lib/data/subscriptions.ts`

Recomendación:

- Ampliar esta capa en vez de hacer queries dentro de cada página.
- Mantener fallback mock.
- Usar funciones tipo:
  - `getCurrentCompany()`
  - `getCurrentProfile()`
  - `getCurrentSubscription()`
  - `getCompanyModules(companyId)`
  - `getDashboardSummary(companyId)`

### R3. Generar tipos reales de Supabase al crear el proyecto

Recomendación:

- Usar los tipos generados por Supabase CLI cuando exista el proyecto.
- Mantener `types/database.ts` como contrato temporal solo hasta la integración real.

### R4. Añadir estados vacíos y loading cuando haya datos reales

Ahora muchas páginas muestran datos simulados siempre.

Cuando Supabase esté conectado, harán falta:

- estado sin empresa.
- estado sin módulos activos.
- estado sin tareas.
- estado sin facturas.
- estado con error de conexión.
- estado de carga.

### R5. Revisar responsive con navegador real antes de piloto

Estado técnico:

- Hay buena base responsive con `sm`, `md`, `lg`, `xl`.
- Dashboard usa scroll interno y sidebar móvil horizontal.
- `app/globals.css` oculta overflow horizontal global.

Riesgo:

- Algunas páginas densas pueden necesitar prueba real en móvil:
  - `/dashboard/calendario`
  - `/dashboard/socialia`
  - `/dashboard/facturacion`
  - `/superadmin`

Recomendación:

- Revisar manualmente en 390px, 768px, 1440px.
- Confirmar botones grandes, grids de 7 columnas y tarjetas de superadmin.

### R6. Preparar una matriz de permisos por pantalla

La RLS cubre roles generales, pero falta una matriz UI:

- Qué ve marketing.
- Qué ve sales.
- Qué ve support.
- Qué ve readonly.
- Qué puede editar cada rol.

Recomendación:

- Crear `docs/PERMISOS-ROLES.md` o ampliar documentación Supabase.
- Usar la matriz para ocultar acciones en UI, no solo para bloquear en base de datos.

## Opcional

### O1. Eliminar assets estándar no usados de Next/Vercel

En `public/` siguen existiendo:

- `file.svg`
- `globe.svg`
- `next.svg`
- `vercel.svg`
- `window.svg`

Impacto:

- Muy bajo.
- No afecta build ni rendimiento real de páginas si no se importan.

Recomendación:

- Eliminarlos solo cuando se haga limpieza final.

### O2. Crear una página pública legal enlazada desde Footer

Ahora existe documentación legal en `docs/legal` y una ruta interna `/dashboard/legal`.

Opcionalmente se podría crear:

- `/legal`
- `/privacidad`
- `/cookies`
- `/condiciones`

No es urgente antes de Supabase, pero será necesario antes de producción comercial.

### O3. Crear tests mínimos de reglas de negocio

No hay suite de tests automatizados.

Opcional antes de Supabase, recomendable después:

- tests de `canAccessDashboard`.
- tests de roles.
- tests de mapeo de módulos.
- tests de estados de suscripción.

### O4. Añadir scripts SQL de verificación

Se podría crear un documento con queries de comprobación tras ejecutar seed:

- contar empresas.
- comprobar módulos activos.
- probar roles.
- probar políticas.

## Preparación Supabase

Estado positivo:

- Existen migraciones ordenadas en `supabase/migrations`.
- Existe `supabase/seed.sql`.
- Existe documentación en `docs/supabase/MIGRATIONS-README.md`.
- Existen clientes Supabase en:
  - `lib/supabase/server.ts`
  - `lib/supabase/client.ts`
  - `lib/supabase/admin.ts`
- La app no rompe si Supabase no está configurado.
- Hay fallback mock.

Pendiente principal:

- Ejecutar migraciones en proyecto real.
- Generar tipos reales.
- Enlazar Auth con `profiles.auth_user_id`.
- Probar RLS.
- Conectar `proxy.ts`.
- Sustituir mocks gradualmente.

Orden recomendado:

1. Crear Supabase de desarrollo.
2. Ejecutar migraciones.
3. Ejecutar seed.
4. Crear usuarios Auth demo.
5. Vincular `profiles.auth_user_id`.
6. Probar RLS por rol.
7. Actualizar tipos.
8. Conectar login.
9. Conectar empresa actual.
10. Conectar suscripción y módulos.

## Preparación Stripe

Estado positivo:

- El modelo SaaS está definido.
- Las migraciones contemplan Stripe futuro.
- Documentación de billing y legal está creada.
- La UI de facturación ya muestra renovación automática, método de pago, facturas emitidas y preparación fiscal.

Pendiente:

- Elegir cuenta Stripe.
- Crear productos/precios.
- Implementar Checkout en test.
- Implementar webhook.
- Guardar eventos en `billing_events`.
- Actualizar `subscriptions` desde webhooks, no desde cliente.
- Conectar facturación fiscal o proveedor compatible con VERI*FACTU.

Orden recomendado:

1. Supabase Auth y compañías.
2. Supabase subscriptions.
3. Stripe Checkout test.
4. Webhooks.
5. Bloqueo por estado.
6. Facturas y fiscalidad.

## Rendimiento

Estado:

- Build de producción genera 34 rutas estáticas sin bloqueo.
- Landing no usa librerías pesadas.
- No hay dependencias frontend adicionales innecesarias.
- Assets públicos son ligeros.
- Logos principales están optimizados.

Riesgos:

- Muchas páginas son estáticas y densas, pero al conectar datos podrían aumentar costes si se hacen demasiadas queries por página.
- Centro IA y módulos operativos necesitarán paginación o límites cuando haya datos reales.

Recomendación:

- Centralizar queries por página.
- Evitar pedir datos de todos los módulos si una página solo usa uno.
- Añadir paginación en conversaciones, leads, reviews, posts y usage events.

## Responsive y scroll

Estado:

- Dashboard layout usa `h-dvh`, `overflow-hidden` y sección de contenido con `overflow-y-auto`.
- Sidebar desktop tiene scroll propio.
- Navegación móvil del dashboard usa scroll horizontal.
- Landing y páginas principales usan grids responsive.
- `globals.css` evita overflow horizontal global.

Puntos a vigilar:

- Calendario en móvil.
- Grids densos de superadmin.
- Fichas con muchos botones en módulos operativos.
- Formularios largos en empresa/facturación.

## Imports y arquitectura

Estado:

- Imports limpios según lint.
- Componentes de landing separados.
- Centro IA separado en subcomponentes.
- Dashboard layout separado del sidebar cliente.
- Supabase encapsulado en `lib/supabase`.
- Datos mock encapsulados parcialmente en `lib/data`.

Recomendación:

- Evitar que futuras páginas importen directamente Supabase si puede pasar por `lib/data`.
- Crear un mapa central de rutas del dashboard para no duplicar navegación.
- Crear un mapa central de módulos para rutas, labels y permisos.

## Conclusión

AutonomIA está lista para iniciar una integración Supabase controlada. No se detectan bloqueos técnicos de build, estructura o responsive que impidan avanzar.

El riesgo real está en conectar datos sin cerrar antes:

- Auth.
- RLS.
- tipos generados.
- roles.
- empresa activa.
- suscripción.
- módulos activos.
- bloqueo por pago.

Recomendación final: avanzar con Supabase en una rama o fase controlada, empezando por Auth + empresa + suscripción + módulos, y no por automatizaciones complejas.

## Checklist recomendado antes de conectar Supabase

- [ ] Crear proyecto Supabase de desarrollo.
- [ ] Ejecutar `001_initial_core.sql`.
- [ ] Ejecutar `002_settings.sql`.
- [ ] Ejecutar `003_operations.sql`.
- [ ] Ejecutar `004_billing.sql`.
- [ ] Ejecutar `005_platform.sql`.
- [ ] Ejecutar `006_rls_policies.sql`.
- [ ] Ejecutar `supabase/seed.sql`.
- [ ] Crear usuarios reales de prueba.
- [ ] Vincular `profiles.auth_user_id`.
- [ ] Probar RLS.
- [ ] Generar tipos reales.
- [ ] Ajustar `types/database.ts`.
- [ ] Conectar `proxy.ts`.
- [ ] Conectar login.
- [ ] Conectar dashboard inicial.
- [ ] Conectar suscripción y bloqueo de acceso.
