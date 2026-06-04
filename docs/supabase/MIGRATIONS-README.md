# Supabase migrations para AutonomIA

Esta carpeta deja AutonomIA preparada para crear un proyecto Supabase real sin conectar todavía la app, sin claves y sin tocar Stripe.

## Orden de ejecución

Ejecutar las migraciones en este orden:

1. `supabase/migrations/001_initial_core.sql`
2. `supabase/migrations/002_settings.sql`
3. `supabase/migrations/003_operations.sql`
4. `supabase/migrations/004_billing.sql`
5. `supabase/migrations/005_platform.sql`
6. `supabase/migrations/006_rls_policies.sql`
7. `supabase/seed.sql`

## Crear proyecto Supabase

1. Crear el proyecto desde Supabase.
2. Guardar URL, anon key y service role key solo cuando vayamos a conectar la app.
3. No añadir claves a `.env.local` hasta la fase de integración.
4. Revisar que la extensión `pgcrypto` queda activa.

## Ejecutar migraciones

Opciones recomendadas:

- SQL Editor de Supabase: pegar y ejecutar cada archivo en orden.
- Supabase CLI en una fase posterior: enlazar el proyecto y ejecutar las migraciones desde la carpeta `supabase/migrations`.

Después de ejecutar las migraciones, revisar en Table Editor que existen las tablas core, settings, operations, billing y platform.

## Ejecutar seed

Ejecutar `supabase/seed.sql` después de las migraciones.

El seed crea:

- Planes: Inicio, Crecimiento, Local IA 360, Enterprise.
- Módulos principales de AutonomIA.
- Sectores empresariales prioritarios.
- Empresas demo: Bar La Plaza, Clínica Nova y Beauty Studio.
- Perfiles demo documentados sin crear usuarios de Auth.
- Suscripciones demo.
- Módulos activos y recomendados.
- Solicitudes demo, tickets y eventos de uso.

## Activar y probar RLS

La migración `006_rls_policies.sql` ya activa RLS y crea políticas iniciales.

Pruebas mínimas antes de producción:

- Superadmin debe ver empresas, demos, suscripciones, uso, facturación y notas internas.
- `company_admin` debe ver y gestionar solo su empresa.
- `marketing` debe acceder a SocialIA, ReviewIA, Calendario, InsightIA y Google Business.
- `sales` debe acceder a LeadIA, WhatsAppIA y ReservaIA.
- `support` debe acceder a WhatsAppIA y ReviewIA.
- `readonly` debe leer métricas e informes sin escribir.
- Una empresa no debe poder leer datos de otra empresa.

## Cómo probar superadmin y company_admin

1. Crear usuarios reales en Supabase Auth.
2. Copiar cada `auth.users.id`.
3. Actualizar `public.profiles.auth_user_id` para enlazarlo con el perfil demo.
4. Iniciar sesión con cada usuario y probar consultas desde la app o desde políticas simuladas en Supabase.

Perfiles demo preparados:

- `superadmin@autonomia.local`
- `juanma@barlaplaza.com`
- `marketing@barlaplaza.com`
- `ventas@barlaplaza.com`
- `soporte@barlaplaza.com`
- `admin@clinicanova.com`
- `hola@beautystudio.com`

## Qué falta antes de producción

- Revisar RLS con usuarios reales y pruebas de aislamiento multiempresa.
- Definir proveedor fiscal compatible con VERI*FACTU.
- Conectar Stripe en modo test y mapear webhooks.
- Crear generación real de facturas PDF.
- Definir almacenamiento seguro de documentos fiscales.
- Añadir backups, monitorización y auditoría.
- Revisar el modelo con asesoría fiscal y legal antes de cobrar en producción.
