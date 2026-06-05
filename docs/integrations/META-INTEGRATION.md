# Meta Integration para AutonomIA

Este documento prepara la futura conexión de AutonomIA con Facebook e Instagram mediante Meta. No activa publicación real ni OAuth en esta fase.

## Objetivo

Permitir que cada empresa conecte sus cuentas sociales reales para que SocialIA pueda mostrar estado de conexión y, en fases posteriores, publicar contenido aprobado.

## Requisitos para crear Meta App

- Crear una app en Meta for Developers.
- Configurar producto Facebook Login para empresas o flujo equivalente aprobado por Meta.
- Definir URL de redirección futura en `META_REDIRECT_URI`.
- Configurar dominio de AutonomIA en la app.
- Preparar política de privacidad y términos públicos.
- Validar que las cuentas de cliente usan Facebook Page e Instagram Business conectadas.

## Variables de entorno futuras

Estas variables deben existir solo cuando se active la integración real:

```env
META_APP_ID=
META_APP_SECRET=
META_REDIRECT_URI=
```

`META_APP_SECRET` nunca debe exponerse en cliente.

## Permisos futuros previstos

Los permisos exactos deben revisarse con la documentación vigente de Meta antes de producción. Permisos probables:

- `pages_show_list`
- `pages_read_engagement`
- `pages_manage_posts`
- `instagram_basic`
- `instagram_content_publish`
- `business_management` si el flujo lo requiere

Meta puede exigir revisión de app y justificación de uso para permisos avanzados.

## Flujo OAuth previsto

1. Cliente pulsa `Conectar Facebook` o `Conectar Instagram`.
2. AutonomIA genera una URL OAuth segura desde servidor.
3. Meta redirige a `META_REDIRECT_URI` con código temporal.
4. Servidor intercambia el código por tokens.
5. Servidor cifra y guarda tokens en `social_connections`.
6. AutonomIA sincroniza Facebook Pages disponibles.
7. Cliente elige la página y la cuenta Instagram Business vinculada.
8. SocialIA muestra estado `connected`.

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
- Cifrar tokens antes de guardarlos.
- Registrar `last_sync_at`.
- Marcar conexiones caducadas como `expired`.
- Usar RLS por empresa y acceso superadmin.

## Riesgos

- Revisión de permisos por Meta.
- Cambios en Graph API.
- Caducidad de tokens.
- Páginas sin Instagram Business asociado.
- Clientes con permisos incompletos sobre su Business Manager.
- Publicaciones rechazadas por políticas de Meta.

## Pendiente para publicar realmente

- Implementar OAuth real.
- Implementar cifrado de tokens.
- Implementar selección de Facebook Page.
- Implementar detección de Instagram Business Account.
- Implementar publicación desde servidor.
- Implementar logs de publicación y errores.
- Añadir aprobación final antes de enviar a redes.

## Estado actual

SocialIA Fase 2 solo prepara arquitectura, tabla, capa de datos y estado visual. No publica en Facebook, Instagram ni Meta.
