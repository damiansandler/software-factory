# Proveedores

Un archivo por proveedor (por ejemplo `muralpay.md`, `coinbase.md`, `bre-b.md`).
Cada uno debería responder:

- Para qué lo usamos en el flujo.
- Cómo se autentica y dónde está el sandbox.
- Endpoints que usamos, con ejemplos de request y respuesta.
- Webhooks: qué eventos manda y cómo se verifica la firma.
- Errores típicos y qué hacer con cada uno.
- Idempotencia: cómo acepta la clave y qué pasa si se repite.
- Cómo se simula en los tests (respuestas de ejemplo).

Nunca pongas credenciales ni datos personales reales en estos archivos.
