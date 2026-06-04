# Preparación de integración Supabase

Este documento explica cómo conectar Supabase cuando AutonomIA pase de datos simulados a staging real.

La app ya incluye clientes, tipos base, helpers de roles, helpers de suscripción, placeholders de datos y middleware no bloqueante. Mientras no existan variables de entorno, todo debe seguir funcionando con mocks locales.

## Variables necesarias

Crear `.env.local` únicamente cuando exista el proyecto Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Reglas:

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` pueden usarse en cliente.
- `SUPABASE_SERVICE_ROLE_KEY` solo puede usarse en servidor.
- Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` en componentes cliente.
- No subir claves reales al repositorio.

## Crear proyecto Supabase

Pasos:

1. Crear proyecto Supabase en una cuenta controlada por AutonomIA.
2. Elegir región europea cuando proceda.
3. Guardar URL pública y anon key.
4. Guardar service role key solo para entorno servidor.
5. Configurar dominios permitidos de Auth.

## Ejecutar schema

Usar el archivo:

```bash
docs/supabase/schema.sql
```

Recomendación:

- Ejecutarlo primero en staging.
- Revisar que todas las tablas existen.
- Revisar índices.
- Revisar relaciones por `company_id`.

## Ejecutar seed

Usar el archivo:

```bash
docs/supabase/seed.sql
```

Recomendación:

- Usarlo solo en desarrollo o staging.
- No ejecutar datos demo en producción.

## Activar RLS

Usar como base:

```bash
docs/supabase/rls-policies.sql
```

Pasos:

1. Activar RLS tabla a tabla.
2. Probar acceso como `company_admin`.
3. Probar acceso como `marketing`, `sales`, `support` y `readonly`.
4. Probar acceso como `superadmin`.
5. Confirmar que una empresa no puede leer datos de otra.

## Generar tipos reales

Cuando el schema esté estable, generar tipos automáticos:

```bash
npx supabase gen types typescript --project-id PROJECT_ID > types/supabase-generated.ts
```

Después:

- Comparar con `types/database.ts`.
- Sustituir tipos manuales de forma gradual.
- Mantener `UserRole` y `SubscriptionStatus` como contratos de negocio si conviene.

## Conectar Auth

Orden recomendado:

1. Activar Supabase Auth.
2. Crear flujo de login real.
3. Crear perfil en `profiles`.
4. Relacionar usuario con empresa en `company_users`.
5. Resolver empresa actual desde sesión.
6. Proteger `/dashboard`.
7. Proteger `/superadmin`.

## Migrar páginas desde mocks a queries reales

No migrar todo a la vez.

Orden recomendado:

1. Empresa.
2. Usuarios.
3. Suscripción.
4. Módulos.
5. Tareas.
6. Notificaciones.
7. SocialIA básico.
8. Centro IA.
9. Superadmin.

Regla:

- Cada página debe seguir funcionando con fallback hasta que Supabase esté completamente probado.
- El acceso real debe validarse en servidor.
- No confiar solo en ocultar botones desde la interfaz.

## Archivos preparados en código

- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/admin.ts`
- `lib/auth/roles.ts`
- `lib/auth/subscription.ts`
- `lib/data/companies.ts`
- `lib/data/plans.ts`
- `lib/data/modules.ts`
- `lib/data/subscriptions.ts`
- `lib/data/profiles.ts`
- `types/database.ts`
- `middleware.ts`

## Siguiente paso recomendado

Crear proyecto Supabase en staging, ejecutar schema y seed, activar RLS con pruebas manuales y después conectar primero login + empresa actual.
