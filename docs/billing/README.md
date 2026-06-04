# Facturación SaaS AutonomIA

Esta carpeta prepara la estructura conceptual de facturación para AutonomIA. No implementa cobros reales, no conecta Stripe, no conecta Supabase, no añade claves y no modifica `.env`.

## Objetivo

AutonomIA será un SaaS de suscripción mensual con pago por tarjeta, renovación automática y acceso condicionado al estado de la suscripción.

El objetivo de esta documentación es dejar claro:

- Cómo funcionará el ciclo de suscripción.
- Qué datos mínimos debe guardar cada factura.
- Qué precauciones deben tomarse para normativa española, AEAT y VERI*FACTU.
- Cómo preparar la integración futura con Stripe, Supabase y un proveedor compatible de facturación.

## Alcance actual

Incluido:

- Documentación técnica.
- Reglas de negocio simuladas.
- Campos recomendados para facturas y suscripciones.
- Notas de preparación para VERI*FACTU.
- Plan futuro de integración Stripe.

No incluido:

- Cobros reales.
- Webhooks reales.
- Facturas reales.
- Conexión con AEAT.
- Generación real de PDF fiscal.
- Código QR fiscal real.
- Integración Supabase.

## Estados principales

- `trial`
- `active`
- `past_due`
- `suspended`
- `canceled`

## Principio de acceso

Un cliente solo debe acceder al dashboard si su suscripción está en estado válido. Para la versión inicial:

- `active`: acceso permitido.
- `trial`: acceso permitido solo si se decide usar prueba controlada.
- `past_due`: acceso limitado o aviso de regularización.
- `suspended`: sin acceso operativo.
- `canceled`: acceso hasta fin de periodo pagado; después, sin acceso.

## Fuentes oficiales revisadas

- Real Decreto 1007/2023, de 5 de diciembre, publicado en BOE.
- Agencia Tributaria, apartado de Sistemas Informáticos de Facturación y VERI*FACTU.
- Agencia Tributaria, preguntas frecuentes y modalidades de cumplimiento VERI*FACTU.

Esta documentación no sustituye asesoramiento fiscal profesional. Antes de emitir facturas reales se debe validar con asesoría fiscal o proveedor certificado/compatible.
