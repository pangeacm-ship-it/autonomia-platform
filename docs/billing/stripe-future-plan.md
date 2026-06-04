# Plan futuro Stripe

## Objetivo

Usar Stripe para cobros recurrentes por tarjeta, gestión de métodos de pago, renovaciones automáticas y webhooks de estado. La emisión fiscal española debe coordinarse con una capa propia o proveedor compatible.

## Lo que Stripe cubrirá

- Alta de cliente de pago.
- Método de pago por tarjeta.
- Suscripciones mensuales.
- Intentos de cobro.
- Renovaciones automáticas.
- Eventos de pago correcto.
- Eventos de pago fallido.
- Actualización de tarjeta.
- Cancelación al final del periodo.

## Lo que no debe asumirse automáticamente

- Cumplimiento completo VERI*FACTU.
- QR fiscal español.
- Factura fiscal española adaptada a todos los requisitos.
- Rectificativas fiscales españolas.
- Remisión o preparación de registros ante AEAT.

## Webhooks recomendados

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`
- `payment_method.attached`
- `customer.updated`

## Flujo inicial propuesto

1. Cliente elige plan.
2. Se crea checkout/session de Stripe.
3. Si el pago inicial se confirma, se crea/activa suscripción.
4. AutonomIA marca la empresa como `active`.
5. Se registra el cobro.
6. Se genera factura fiscal propia o mediante proveedor compatible.
7. En cada renovación mensual, Stripe intenta el cobro.
8. Si el cobro falla, la suscripción pasa a `past_due`.
9. Si no se regulariza, pasa a `suspended`.
10. Si se actualiza tarjeta y se cobra, vuelve a `active`.

## Datos a guardar

En `companies` o tabla relacionada:

- `stripe_customer_id`

En `subscriptions`:

- `stripe_subscription_id`
- `status`
- `current_period_start`
- `current_period_end`
- `cancel_at_period_end`
- `last_successful_payment_at`
- `next_billing_at`

En `payments`:

- `stripe_payment_intent_id`
- `stripe_invoice_id`
- `status`
- `amount`
- `currency`
- `paid_at`
- `failure_reason`

En `invoices`:

- `stripe_invoice_id`
- `internal_invoice_number`
- `fiscal_pdf_url`
- `fiscal_submission_status`
- `fiscal_hash`
- `fiscal_qr_url`

## Seguridad

- Nunca exponer claves secretas en cliente.
- Validar firma de webhooks.
- Usar idempotencia para evitar duplicados.
- Separar estado de pago y estado fiscal.
- Bloquear acceso operativo si la suscripción está suspendida.

## Implementación recomendada por fases

1. Diseñar tablas y estados.
2. Crear Stripe en modo test.
3. Implementar checkout test.
4. Implementar webhooks test.
5. Crear facturas internas simuladas.
6. Elegir proveedor fiscal/VERI*FACTU.
7. Integrar factura fiscal real.
8. Pasar a producción con asesoría fiscal.
