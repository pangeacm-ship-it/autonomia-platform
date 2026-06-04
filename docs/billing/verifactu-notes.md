# Notas VERI*FACTU / AEAT

## Contexto

VERI*FACTU se refiere a los sistemas informáticos de facturación regulados por el Real Decreto 1007/2023, de 5 de diciembre. El objetivo es que los sistemas que soportan procesos de facturación cumplan requisitos de integridad, conservación, trazabilidad, legibilidad, accesibilidad e inalterabilidad.

La Agencia Tributaria distingue modalidades de cumplimiento, incluyendo la modalidad VERI*FACTU con remisión de registros de facturación a la Sede electrónica de la AEAT inmediatamente después de su producción.

## Implicaciones para AutonomIA

AutonomIA debe prepararse para:

- Registros de facturación trazables.
- Inalterabilidad de facturas emitidas.
- Conservación de facturas y registros durante el plazo legal aplicable.
- Código QR en factura cuando corresponda.
- Posible remisión de registros a AEAT según modalidad elegida.
- Facturas rectificativas para correcciones.
- No modificar facturas emitidas.
- Mantener archivo fiscal seguro.
- Registrar huella/hash cuando aplique.
- Integrarse con proveedor externo o sistema compatible si no se implementa internamente.

## Código QR

Las facturas generadas por sistemas sujetos a estos requisitos deben contemplar código QR cuando corresponda. El QR permite al receptor remitir o contrastar datos esenciales de la factura con la AEAT según la modalidad y normativa aplicable.

En AutonomIA, por ahora:

- No se genera QR real.
- Se reserva el campo `fiscal_qr_url` o equivalente.
- Se muestra solo referencia visual/simulada.

## Huella o hash

La arquitectura debe reservar campos para:

- Huella del registro de facturación.
- Encadenamiento o trazabilidad si aplica.
- Estado de envío fiscal.
- Fecha de generación del registro.
- Respuesta del proveedor o AEAT.

## Facturas rectificativas

Regla recomendada:

- Una factura emitida no se edita.
- Si hay error, se emite factura rectificativa.
- La factura rectificativa referencia la factura original.
- Debe conservarse el historial completo.

## Proveedor externo

Para reducir riesgo, se recomienda evaluar:

- Proveedor de facturación compatible con normativa española.
- Integración con VERI*FACTU/AEAT.
- Generación PDF fiscal.
- QR fiscal.
- Conservación y trazabilidad.

Stripe puede seguir siendo el proveedor de cobro, mientras el proveedor fiscal o una capa propia se encarga de la factura española.

## Decisiones pendientes

- Confirmar si AutonomIA estará obligada directamente al uso de SIF bajo RD 1007/2023 en su operativa concreta.
- Elegir modalidad de cumplimiento.
- Validar con asesoría fiscal.
- Decidir proveedor fiscal o implementación propia.
- Definir series de factura.
- Definir proceso de rectificativas.
- Definir conservación y descarga de PDFs.

## Referencias oficiales

- BOE: Real Decreto 1007/2023, de 5 de diciembre.
- Agencia Tributaria: Sistemas informáticos de facturación y VERI*FACTU.
- Agencia Tributaria: modalidades de cumplimiento de las obligaciones de los SIF.
- Agencia Tributaria: preguntas frecuentes sobre sistemas VERI*FACTU.
