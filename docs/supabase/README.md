# Supabase para AutonomIA

Esta carpeta define una propuesta inicial de base de datos Supabase/Postgres para AutonomIA. No conecta la aplicación, no añade claves, no modifica `.env` y no instala dependencias. Su objetivo es dejar preparado el diseño técnico antes de activar o pagar Supabase.

## Objetivo del esquema

AutonomIA es un SaaS multiempresa con dos áreas separadas:

- Dashboard cliente en `/dashboard`, donde cada empresa gestiona módulos, usuarios, actividad, tareas y datos operativos.
- Panel propietario en `/superadmin`, donde el dueño de AutonomIA puede controlar clientes, ingresos, demos, soporte, uso de módulos y crecimiento.

El esquema propone tablas en `public` para modelar empresas, perfiles, roles, módulos, suscripciones, actividad, operaciones de IA, facturación y soporte. La autenticación futura debería usar Supabase Auth, con perfiles propios en `public.profiles` referenciando `auth.users`.

## Enfoque multiempresa

La separación por empresa se basa en `company_id`. Las tablas que contienen datos de cliente incluyen `company_id` y deben protegerse con Row Level Security para que cada usuario acceda solo a la empresa a la que pertenece.

Las tablas globales, como `plans`, `modules`, `demo_requests` o ciertos datos de superadmin, se tratan como datos de plataforma. El acceso a estas tablas debe estar restringido principalmente al rol `superadmin`.

## Separación entre superadmin y empresas cliente

Los usuarios propietarios de AutonomIA tendrán rol `superadmin`. Este rol debe poder:

- Ver todas las empresas.
- Revisar suscripciones, pagos, facturas y demos.
- Auditar actividad y uso de módulos.
- Gestionar tickets y notas internas.

Los usuarios de empresas cliente se vinculan mediante `company_users`. Sus permisos dependen de su rol dentro de esa empresa y de los módulos activos.

## Roles previstos

- `superadmin`: control global de la plataforma.
- `company_admin`: administración de usuarios, módulos, facturación y configuración de su empresa.
- `marketing`: acceso a SocialIA, ReviewIA, Calendario IA e InsightIA.
- `sales`: acceso a LeadIA, WhatsAppIA y ReservaIA.
- `support`: acceso a WhatsAppIA y ReviewIA.
- `readonly`: lectura de informes, métricas y actividad.

## Módulos cubiertos

- SocialIA
- ReviewIA
- WhatsAppIA
- LeadIA
- ReservaIA
- InsightIA
- Google Business
- Calendario IA
- TikTok & Shorts

## Conexión en fases futuras

1. Crear proyecto Supabase.
2. Ejecutar `schema.sql`.
3. Ejecutar `seed.sql` en entorno de pruebas.
4. Revisar y activar RLS usando `rls-policies.sql`.
5. Conectar Next.js con variables de entorno.
6. Implementar Auth y roles.
7. Sustituir arrays locales por consultas Supabase.
8. Conectar OpenAI, automatizaciones y procesos reales.

## Notas importantes

- Esta propuesta usa `gen_random_uuid()`, por lo que debe estar habilitada la extensión `pgcrypto`.
- Las políticas RLS son un borrador técnico y deben probarse con usuarios reales antes de producción.
- No se recomienda acceder directamente a `auth.users` desde el cliente. Para datos públicos de usuario se usa `public.profiles`.
