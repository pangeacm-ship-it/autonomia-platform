# Checklist de prueba de login real Supabase

Objetivo: comprobar localmente que AutonomIA resuelve sesión, perfil, empresa y rol con usuarios reales de Supabase.

## Usuarios esperados

- `superadmin@autonomia.app` debe entrar en `/superadmin`.
- `cliente@barlaplaza.com` debe entrar en `/dashboard`.

## 1. Variables locales

En `.env.local` deben existir estas variables con valores reales del proyecto staging:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

No pegues estas claves en chats, issues ni documentación pública.

Después de cambiar `.env.local`, reinicia el servidor local.

## 2. Authentication -> Users

En Supabase, revisa en Authentication -> Users:

- Existe `superadmin@autonomia.app`.
- Existe `cliente@barlaplaza.com`.
- Ambos usuarios tienen email confirmado si el proyecto lo exige.
- Ambos usuarios tienen contraseña válida.
- Copia el `User UID` de cada usuario para comprobar `profiles.auth_user_id`.

## 3. Tabla `profiles`

En `public.profiles`, cada usuario real debe tener una fila:

| email | auth_user_id | status |
| --- | --- | --- |
| `superadmin@autonomia.app` | UID real de Auth | `active` |
| `cliente@barlaplaza.com` | UID real de Auth | `active` |

Errores comunes:

- `auth_user_id` vacío: el login funciona, pero AutonomIA no puede resolver el perfil.
- Email distinto al de Auth: puede confundir la prueba, aunque la relación real depende de `auth_user_id`.
- Perfil duplicado: deja solo una fila activa por usuario.

## 4. Tabla `roles`

Debe existir al menos:

- `superadmin`
- `company_admin`
- `marketing`
- `sales`
- `support`
- `readonly`

La columna importante es `key`.

## 5. Tabla `company_users`

Para el superadmin:

| profile_id | company_id | role_id | status |
| --- | --- | --- | --- |
| perfil de `superadmin@autonomia.app` | `null` | rol `superadmin` | `active` |

Para el cliente:

| profile_id | company_id | role_id | status |
| --- | --- | --- | --- |
| perfil de `cliente@barlaplaza.com` | empresa Bar La Plaza | rol `company_admin` | `active` |

Errores comunes:

- `status` distinto de `active`.
- `role_id` apunta a un rol incorrecto.
- El cliente no tiene `company_id`.
- El superadmin no tiene el rol `superadmin`.

## 6. Tabla `companies`

Para `cliente@barlaplaza.com`, debe existir una empresa asociada:

- Nombre: `Bar La Plaza`.
- Estado recomendado para la prueba: `active`.
- El `id` debe coincidir con `company_users.company_id`.

## 7. Tabla `subscriptions`

Para Bar La Plaza debe existir una suscripción:

- `company_id`: empresa Bar La Plaza.
- `status`: `active` o `trial`.
- `plan_id`: plan existente.

La app todavía no bloquea el dashboard por suscripción, pero ya puede leerla en páginas como Suscripción y Módulos.

## 8. Prueba local

1. Arranca el servidor local.
2. Abre `/login`.
3. Entra con `superadmin@autonomia.app`.
4. Resultado esperado: redirección a `/superadmin`.
5. Cierra sesión.
6. Entra con `cliente@barlaplaza.com`.
7. Resultado esperado: redirección a `/dashboard`.
8. Revisa `/dashboard/empresa`, `/dashboard/modulos` y `/dashboard/suscripcion`.

## 9. Mensajes de error esperados

Si falta `profiles`:

> Login correcto, pero falta el perfil en Supabase. Revisa public.profiles y enlaza auth_user_id con este usuario.

Si falla RLS al leer `company_users` o `roles`:

> Login correcto, pero no se pudieron leer los roles. Revisa RLS en company_users y roles.

Si falta relación activa:

> Login correcto, pero falta una relación activa en company_users con un rol válido.

Si email o contraseña son incorrectos:

> No se pudo iniciar sesión. Revisa el email y la contraseña.

## 10. RLS mínimo esperado

No desactives RLS globalmente.

Las políticas deben permitir que un usuario autenticado:

- Lea su propia fila en `profiles`.
- Lea su propia fila activa en `company_users`.
- Lea el rol relacionado en `roles`.
- Lea su empresa si tiene `company_users.company_id`.
- Lea su suscripción si es `company_admin` o `superadmin`.

Si solo falla la lectura de roles, revisa especialmente:

- Policy de `company_users`.
- Policy de `roles`.
- Funciones `current_profile_id()`, `current_role_keys()` e `is_superadmin()`.

## 11. SQL de corrección para usuarios reales

Ejecuta este bloque en Supabase SQL Editor después de crear los usuarios en Authentication -> Users. Cambia solo si los emails o el slug de empresa son distintos.

```sql
-- 1. Enlazar perfiles con usuarios reales de Supabase Auth.
update public.profiles p
set
  auth_user_id = u.id,
  status = 'active',
  updated_at = now()
from auth.users u
where lower(u.email) = 'superadmin@autonomia.app'
  and lower(p.email) in ('superadmin@autonomia.app', 'superadmin@autonomia.local');

update public.profiles p
set
  auth_user_id = u.id,
  status = 'active',
  updated_at = now()
from auth.users u
where lower(u.email) = 'cliente@barlaplaza.com'
  and lower(p.email) in ('cliente@barlaplaza.com', 'juanma@barlaplaza.com');

-- 2. Asegurar perfil superadmin si no existía.
insert into public.profiles (auth_user_id, full_name, email, status)
select u.id, 'Superadmin AutonomIA', lower(u.email), 'active'
from auth.users u
where lower(u.email) = 'superadmin@autonomia.app'
on conflict (email) do update set
  auth_user_id = excluded.auth_user_id,
  status = 'active',
  updated_at = now();

-- 3. Asegurar perfil cliente si no existía.
insert into public.profiles (auth_user_id, full_name, email, status)
select u.id, 'Cliente Bar La Plaza', lower(u.email), 'active'
from auth.users u
where lower(u.email) = 'cliente@barlaplaza.com'
on conflict (email) do update set
  auth_user_id = excluded.auth_user_id,
  status = 'active',
  updated_at = now();

-- 4. Dar rol superadmin al perfil propietario.
insert into public.company_users (company_id, profile_id, role_id, status, invited_at, last_access_at)
select null, p.id, r.id, 'active', now(), now()
from public.profiles p
join public.roles r on r.key = 'superadmin'
where lower(p.email) = 'superadmin@autonomia.app'
  and not exists (
    select 1
    from public.company_users cu
    where cu.company_id is null
      and cu.profile_id = p.id
      and cu.role_id = r.id
  );

update public.company_users cu
set status = 'active', updated_at = now()
from public.profiles p, public.roles r
where cu.company_id is null
  and cu.profile_id = p.id
  and cu.role_id = r.id
  and lower(p.email) = 'superadmin@autonomia.app'
  and r.key = 'superadmin';

-- 5. Dar rol company_admin al cliente de Bar La Plaza.
insert into public.company_users (company_id, profile_id, role_id, status, invited_at, last_access_at)
select c.id, p.id, r.id, 'active', now(), now()
from public.companies c
join public.profiles p on lower(p.email) = 'cliente@barlaplaza.com'
join public.roles r on r.key = 'company_admin'
where c.slug = 'bar-la-plaza'
on conflict (company_id, profile_id, role_id) do update set
  status = 'active',
  updated_at = now();
```

## 12. SQL definitivo solo para `superadmin@autonomia.app`

Este es el bloque mínimo para corregir la redirección del superadmin. Requisitos previos: el usuario `superadmin@autonomia.app` ya existe en Authentication -> Users y el rol `superadmin` existe en `public.roles`.

```sql
-- Asegura que existe el rol esperado.
insert into public.roles (key, name, description, is_platform_role)
values (
  'superadmin',
  'Superadmin',
  'Acceso completo al panel propietario de AutonomIA.',
  true
)
on conflict (key) do update set
  name = excluded.name,
  description = excluded.description,
  is_platform_role = true,
  updated_at = now();

-- Si venías del seed antiguo, migra el email .local al email real .app.
update public.profiles
set
  email = 'superadmin@autonomia.app',
  status = 'active',
  updated_at = now()
where lower(email) = 'superadmin@autonomia.local'
  and not exists (
    select 1
    from public.profiles existing
    where lower(existing.email) = 'superadmin@autonomia.app'
  );

-- Crea o corrige el perfil público enlazado al usuario real de Auth.
insert into public.profiles (auth_user_id, full_name, email, status)
select
  u.id,
  'Superadmin AutonomIA',
  lower(u.email),
  'active'
from auth.users u
where lower(u.email) = 'superadmin@autonomia.app'
on conflict (email) do update set
  auth_user_id = excluded.auth_user_id,
  full_name = excluded.full_name,
  status = 'active',
  updated_at = now();

-- Asegura una relación activa company_users -> roles(superadmin).
insert into public.company_users (
  company_id,
  profile_id,
  role_id,
  status,
  invited_at,
  last_access_at
)
select
  null,
  p.id,
  r.id,
  'active',
  now(),
  now()
from public.profiles p
join public.roles r on r.key = 'superadmin'
where lower(p.email) = 'superadmin@autonomia.app'
  and not exists (
    select 1
    from public.company_users cu
    where cu.company_id is null
      and cu.profile_id = p.id
      and cu.role_id = r.id
  );

-- Reactiva la relación si ya existía.
update public.company_users cu
set
  status = 'active',
  updated_at = now()
from public.profiles p
join public.roles r on r.key = 'superadmin'
where cu.company_id is null
  and cu.profile_id = p.id
  and cu.role_id = r.id
  and lower(p.email) = 'superadmin@autonomia.app';

-- Comprobación final: debe devolver una fila con role_key = superadmin.
select
  p.email,
  p.auth_user_id,
  cu.status as membership_status,
  r.key as role_key
from public.profiles p
join public.company_users cu on cu.profile_id = p.id
join public.roles r on r.id = cu.role_id
where lower(p.email) = 'superadmin@autonomia.app';
```
