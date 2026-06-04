# Plan de implementación Supabase

## Fase 1: Crear proyecto Supabase

- Crear un proyecto Supabase para AutonomIA.
- Elegir región cercana al mercado principal.
- Configurar entornos separados para desarrollo, staging y producción cuando sea posible.
- Guardar claves y URLs solo en variables de entorno, nunca en el repositorio.

## Fase 2: Ejecutar schema

- Ejecutar `docs/supabase/schema.sql` en el SQL editor o mediante migraciones.
- Validar que las tablas, índices y claves foráneas se crean correctamente.
- Revisar enums implícitos basados en `text` antes de convertirlos a tipos Postgres si hiciera falta.

## Fase 3: Ejecutar seed

- Ejecutar `docs/supabase/seed.sql` solo en desarrollo o staging.
- Confirmar que los planes, módulos, empresas demo y datos simulados aparecen correctamente.
- No usar datos seed en producción salvo que sean catálogos reales como planes o módulos.

## Fase 4: Activar RLS

- Revisar `docs/supabase/rls-policies.sql`.
- Activar Row Level Security tabla por tabla.
- Probar cada rol con usuarios reales o usuarios de test.
- Añadir tests manuales para confirmar que un usuario no puede leer datos de otra empresa.

## Fase 5: Conectar Next.js

- Instalar cliente de Supabase cuando se decida activar la integración.
- Crear variables en `.env.local`.
- Crear helpers de cliente/servidor siguiendo el App Router de Next.js.
- Mantener separación entre consultas del dashboard cliente y del superadmin.

## Fase 6: Auth y roles

- Activar Supabase Auth.
- Crear `profiles` al registrar o invitar usuarios.
- Vincular usuarios a empresas mediante `company_users`.
- Resolver permisos a partir de `company_users.role_id` y `roles.key`.

## Fase 7: Reemplazar arrays locales por queries

- Reemplazar primero datos de bajo riesgo: módulos, planes, empresas demo.
- Continuar con dashboard cliente: tareas, notificaciones, conversaciones y actividad.
- Después migrar superadmin: ingresos, pagos, demos, tickets y uso.
- Mantener componentes visuales ya existentes y cambiar solo la fuente de datos.

## Fase 8: Conectar OpenAI y automatizaciones

- Guardar conversaciones en `ai_conversations` y `ai_messages`.
- Registrar acciones en `usage_events` y `activities`.
- Crear trabajos o edge functions para respuestas, publicaciones, reservas y análisis.
- Auditar consumo de IA por empresa y módulo.

## Recomendaciones de seguridad

- No exponer claves service role en cliente.
- Usar RLS en todas las tablas con datos sensibles.
- Mantener `company_id` como frontera principal de datos.
- Usar `profiles` en `public` para metadatos de usuario y no leer `auth.users` desde el cliente.
