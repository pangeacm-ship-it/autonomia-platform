# Flujo de suscripción

## Estados

### `trial`

Periodo de prueba o evaluación. Debe definirse si AutonomIA lo usará o no.

Reglas recomendadas:

- Puede permitir acceso temporal.
- Debe tener fecha de inicio y fin.
- Si se exige tarjeta antes de activar, debe quedar registrado el método de pago.
- Al finalizar, pasa a `active` si el primer cobro se confirma.

### `active`

Suscripción operativa y con acceso permitido.

Reglas:

- El cliente tiene acceso al dashboard.
- La renovación mensual se ejecuta automáticamente.
- Se registra el último cobro correcto.
- Se informa de la próxima fecha de renovación.
- Se emite factura por cada periodo facturado.

### `past_due`

Suscripción con cobro fallido o pendiente de regularización.

Reglas:

- Se marca cuando falla una renovación automática.
- Debe mostrarse aviso visible al cliente.
- Puede mantenerse acceso limitado durante un periodo de gracia si se decide.
- Debe registrarse el intento de cobro fallido y la causa si el proveedor la ofrece.

### `suspended`

Suscripción suspendida por impago o incumplimiento.

Reglas:

- El cliente no debe tener acceso operativo a módulos.
- Puede permitirse acceso mínimo a facturación para actualizar tarjeta y pagar.
- Si actualiza tarjeta y se cobra correctamente, vuelve a `active`.

### `canceled`

Suscripción cancelada.

Reglas:

- Si cancela, mantiene acceso hasta el final del periodo ya pagado.
- Al terminar el periodo cancelado, se bloquea el acceso operativo.
- Las facturas emitidas se conservan y no se modifican.

## Reglas de negocio

- Sin pago correcto inicial no hay acceso operativo.
- La renovación es automática mensual.
- Si falla el cobro, la suscripción pasa a `past_due`.
- Si no se regulariza en el plazo definido, pasa a `suspended`.
- Si el cliente actualiza tarjeta y paga correctamente, vuelve a `active`.
- Si cancela, conserva acceso hasta el fin del periodo pagado.
- Al terminar el periodo cancelado, queda sin acceso.

## Eventos a registrar

- Suscripción creada.
- Pago inicial confirmado.
- Renovación programada.
- Renovación cobrada.
- Renovación fallida.
- Tarjeta actualizada.
- Suscripción suspendida.
- Suscripción reactivada.
- Suscripción cancelada.
- Fin de periodo cancelado.

## Campos recomendados de suscripción

- `company_id`
- `plan_id`
- `status`
- `current_period_start`
- `current_period_end`
- `cancel_at_period_end`
- `canceled_at`
- `suspended_at`
- `last_successful_payment_at`
- `next_billing_at`
- `payment_provider`
- `provider_subscription_id`
- `provider_customer_id`
