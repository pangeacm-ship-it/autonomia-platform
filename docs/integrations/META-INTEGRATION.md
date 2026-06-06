# Meta Integration para AutonomIA

Este documento prepara la conexión de AutonomIA con Facebook e Instagram mediante Meta. La Fase 3A añade la base OAuth real, pero todavía no activa publicación real en redes.

## Objetivo

Permitir que cada empresa conecte sus cuentas sociales reales para que SocialIA pueda mostrar estado de conexión y, en fases posteriores, publicar contenido aprobado.

## Requisitos para crear Meta App

- Crear una app en Meta for Developers.
- Configurar producto Facebook Login para empresas o flujo equivalente aprobado por Meta.
- Definir URL de redirección en `META_REDIRECT_URI`.
- Configurar dominio de AutonomIA en la app.
- Preparar política de privacidad y términos públicos.
- Validar que las cuentas de cliente usan Facebook Page e Instagram Business conectadas.

## Configuración Redirect URI

En desarrollo o staging, la URL configurada en Meta debe coincidir exactamente con:

```text
https://TU-DOMINIO/api/integrations/meta/callback
```

El mismo valor debe guardarse en `META_REDIRECT_URI`. Si Meta recibe una URL distinta, rechazará el intercambio del código OAuth.

## Variables de entorno futuras

Estas variables deben existir solo cuando se active la integración real:

```env
NEXT_PUBLIC_META_APP_ID=
META_APP_ID=
META_APP_SECRET=
META_REDIRECT_URI=
```

`META_APP_SECRET` nunca debe exponerse en cliente. `NEXT_PUBLIC_META_APP_ID` solo permite identificar la app en superficies públicas si hiciera falta; el flujo OAuth actual usa rutas de servidor.

## Permisos futuros previstos

Los permisos exactos deben revisarse con la documentación vigente de Meta antes de producción. Para la base OAuth se preparan permisos mínimos de lectura:

- `pages_show_list`
- `pages_read_engagement`
- `instagram_basic`

Permisos probables para publicación futura:

- `pages_manage_posts`
- `instagram_content_publish`
- `business_management` si el flujo lo requiere

Meta puede exigir revisión de app y justificación de uso para permisos avanzados.

## Flujo OAuth previsto

1. Cliente pulsa `Conectar Facebook` o `Conectar Instagram`.
2. AutonomIA llama a `/api/integrations/meta/start?companyId=...&platform=facebook` o `/api/integrations/meta/start?companyId=...&platform=instagram`.
3. El servidor valida sesión y acceso a la empresa.
4. El servidor genera `state` seguro y lo guarda en cookie `httpOnly`.
5. AutonomIA redirige a Meta.
6. Meta redirige a `/api/integrations/meta/callback` con `code` y `state`.
7. El servidor valida `state`, sesión y empresa.
8. El servidor intercambia el código por token sin exponerlo al cliente.
9. En esta fase, AutonomIA registra Facebook e Instagram en `social_connections` con estado `needs_review`.

Flujo completo pendiente:

1. AutonomIA sincroniza Facebook Pages disponibles.
2. Cliente elige la página y la cuenta Instagram Business vinculada.
3. Servidor cifra y guarda tokens en `social_connections`.
4. SocialIA muestra estado `connected`.

## Rutas implementadas en Fase 3A

- `app/api/integrations/meta/start/route.ts`
- `app/api/integrations/meta/callback/route.ts`

`/start`:

- Recibe `companyId`.
- Recibe `platform=facebook` o `platform=instagram` para identificar desde qué tarjeta se inició el flujo.
- Valida sesión real.
- Valida que el usuario pertenece a la empresa o es `superadmin`.
- Permite `company_admin` y `marketing`.
- Genera URL OAuth con `state`.
- Redirige a Meta.

`/callback`:

- Recibe `code` y `state`.
- Valida cookie `httpOnly` de estado.
- Intercambia el código por token en servidor.
- No envía tokens al cliente.
- Guarda conexión como `needs_review`.

## Flujo OAuth previsto completo

1. Cliente pulsa una acción separada: `Conectar Facebook` o `Conectar Instagram`.
2. AutonomIA genera una URL OAuth segura desde servidor.
3. Meta redirige a `META_REDIRECT_URI` con código temporal.
4. Servidor intercambia el código por tokens.
5. Servidor cifra y guarda tokens en `social_connections`.
6. AutonomIA sincroniza Facebook Pages disponibles.
7. Cliente elige la página y la cuenta Instagram Business vinculada.
8. SocialIA muestra estado `connected`.

## UX por red social

Visualmente AutonomIA muestra acciones separadas:

- Facebook: `Conectar Facebook`.
- Instagram Business: `Conectar Instagram`.

Técnicamente Meta puede requerir un flujo conjunto porque Instagram Business depende de una Facebook Page conectada. Por eso ambos botones pueden compartir el endpoint interno OAuth, pero envían el parámetro `platform` para preparar la selección y el diagnóstico por red en fases posteriores.

## Facebook Page

La conexión debe guardar:

- `account_name`
- `account_id`
- `page_id`
- `scopes`
- `token_expires_at`
- `status`

## Instagram Business

La conexión debe guardar:

- `account_name`
- `account_id`
- `instagram_business_account_id`
- Facebook Page asociada si aplica
- `scopes`
- `token_expires_at`
- `status`

## Seguridad

- No guardar tokens en cliente.
- No exponer `META_APP_SECRET`.
- Usar `state` OAuth obligatorio.
- Guardar `state` en cookie `httpOnly` y con expiración corta.
- Cifrar tokens antes de guardarlos.
- Registrar `last_sync_at`.
- Marcar conexiones caducadas como `expired`.
- Usar RLS por empresa y acceso superadmin.
- No guardar tokens en `localStorage` ni enviarlos a componentes cliente.

## Riesgos

- Revisión de permisos por Meta.
- Cambios en Graph API.
- Caducidad de tokens.
- Páginas sin Instagram Business asociado.
- Clientes con permisos incompletos sobre su Business Manager.
- Publicaciones rechazadas por políticas de Meta.

## Pendiente para publicar realmente

- Implementar cifrado de tokens.
- Implementar selección de Facebook Page.
- Implementar detección de Instagram Business Account.
- Implementar publicación desde servidor.
- Implementar logs de publicación y errores.
- Añadir aprobación final antes de enviar a redes.

## Estado actual

SocialIA Fase 3A prepara rutas OAuth reales, validación de sesión, `state` seguro y registro `needs_review` en `social_connections`. No publica en Facebook, Instagram ni Meta.
