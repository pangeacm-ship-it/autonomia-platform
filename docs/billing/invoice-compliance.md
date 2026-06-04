# Cumplimiento de facturación

## Objetivo

Definir los datos que AutonomIA deberá guardar por cada factura emitida cuando se active la facturación real.

## Datos mínimos recomendados por factura

Cada factura debe guardar:

- Número de factura.
- Serie de factura.
- Fecha de emisión.
- Fecha de devengo si aplica.
- Emisor.
- NIF/CIF del emisor.
- Dirección fiscal del emisor.
- Receptor.
- NIF/CIF del receptor.
- Dirección fiscal del receptor.
- Concepto.
- Periodo facturado.
- Plan contratado.
- Base imponible.
- Tipo de IVA.
- Cuota de IVA.
- Total.
- Moneda.
- Estado de factura: `draft`, `issued`, `paid`, `void`, `rectified`.
- Método de pago.
- Último cobro correcto asociado.
- Referencia externa Stripe si aplica.
- Enlace PDF.
- Estado de envío/cumplimiento fiscal.
- Hash o huella futura si aplica.
- Código QR futuro si aplica.
- Identificador de factura rectificada si aplica.

## Estados recomendados

- `draft`: borrador interno, no emitido.
- `issued`: emitida y registrada.
- `paid`: cobrada.
- `void`: anulada antes de emisión o no válida fiscalmente según proceso definido.
- `rectified`: corregida mediante factura rectificativa.

## Reglas importantes

- No modificar facturas ya emitidas.
- Para corregir una factura emitida, crear una factura rectificativa.
- Conservar facturas durante el plazo legal aplicable.
- Guardar trazabilidad de emisión, cobro, descarga y cumplimiento.
- Separar el estado de pago del estado fiscal.

## PDF de factura

El PDF futuro debería incluir:

- Datos completos de emisor y receptor.
- Número y serie.
- Fecha.
- Concepto y periodo.
- Base imponible, IVA y total.
- Método de pago.
- Código QR fiscal cuando corresponda.
- Texto o identificador VERI*FACTU cuando corresponda.

## Relación con Stripe

Stripe puede gestionar cobros, intentos de pago, tarjetas y webhooks, pero no debe asumirse que resuelve por sí solo todos los requisitos fiscales españoles/VERI*FACTU.

Se recomienda:

- Usar Stripe para cobro y suscripción.
- Usar una capa propia o proveedor fiscal compatible para emisión fiscal española.
- Guardar referencias cruzadas entre factura interna, factura/PDF fiscal y eventos Stripe.

## Campos futuros de base de datos

Campos recomendados para tabla `invoices`:

- `invoice_number`
- `series`
- `issued_at`
- `issuer_name`
- `issuer_tax_id`
- `issuer_address`
- `receiver_name`
- `receiver_tax_id`
- `receiver_address`
- `tax_base_cents`
- `vat_rate`
- `vat_amount_cents`
- `total_amount_cents`
- `currency`
- `status`
- `payment_method`
- `billing_period_start`
- `billing_period_end`
- `plan_name`
- `pdf_url`
- `fiscal_hash`
- `fiscal_qr_url`
- `stripe_invoice_id`
- `stripe_payment_intent_id`
- `fiscal_submission_status`
- `rectifies_invoice_id`
