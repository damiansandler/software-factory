# Sandler Factory

Prototipo **descartable** para entender el flujo de pagos de Colombia
(MuralPay, Coinbase, Bre-B). No es producción: solo credenciales de sandbox y
datos falsos.

Quien te dirige no es programador. Hablá en español, en lenguaje llano, y
explicá cada decisión importante en una o dos frases.

## Stack (ajustar si cambia)
- `backend/`: Node.js 22 + TypeScript. Contrato de la API en `backend/openapi.yaml`.
- `frontend/`: Next.js + React + TypeScript + Tailwind.
- Base de datos: Postgres (URL en la variable de entorno `DATABASE_URL`).
- Cada carpeta debe tener los scripts `npm run dev`, `npm test`, `npm run lint`
  y `npm run build`.

## Cómo se trabaja
1. `/spec`: entender qué construir y escribir `SPEC.md` (hasta que diga "Estado: aprobado").
2. `/build`: construir lo que dice `SPEC.md` sin interrupciones. Usa `TASKS.md`
   (plan) y `DECISIONS.md` (decisiones menores que tomó solo).
3. `/debug`: investigar un error hasta la causa raíz y arreglarlo ahí.
El subagente `refuter` revisa cada tarea intentando refutar los criterios.

## Contexto del negocio
- Antes de tocar una integración, leé `docs/proveedores/` (un archivo por proveedor).
- Para entender el producto y el flujo, leé `docs/negocio.md`.
- Si un documento y el código no coinciden, gana el código: avisame para corregir el documento.

## Reglas duras
- **Solo sandbox.** Nunca uses credenciales reales ni leas `.env`. Las variables
  van en `.env` (ignorado por git).
- **Contrato primero:** documentá el endpoint en `backend/openapi.yaml` antes de
  implementarlo; el frontend se construye contra ese contrato.
- **Secretos** solo por variables de entorno, a través de un único módulo de
  configuración. Nunca en código, tests ni logs.
- **Proveedores:** toda llamada HTTP a un proveedor pasa por un único wrapper con
  timeout y reintentos.
- **Idempotencia:** cada llamada que mueve plata lleva una clave de idempotencia;
  los webhooks y mensajes repetidos se descartan por id de evento. Las guardas
  contra doble envío no son negociables.
- **Webhooks:** verificá la firma antes de procesar nada. Sin firma válida, se descarta.
- **Montos:** enteros en la unidad mínima o un tipo decimal. Nunca números flotantes.
- **Registro:** guardá en `logs/` cada llamada a un proveedor y cada webhook
  recibido (request, respuesta y estado de la operación), sin secretos ni datos
  personales reales.
- **Estados:** toda operación tiene un estado explícito y transiciones válidas;
  un paso fallido se puede reintentar sin repetir los anteriores.

## Tests
- Test primero: cada criterio testeable de `SPEC.md` tiene un test que falla
  antes de escribir el código.
- Los tests no dependen de servicios externos: los proveedores se simulan con
  respuestas de ejemplo (fixtures).
- Tests asíncronos: esperá con polling hasta que se cumpla la condición; nunca
  una sola lectura ni esperas fijas.
- Nunca debilites, saltees o borres un test para ponerlo verde.

## Git
- Trabajá en una rama `build/<nombre>`; no hagas merge a `main` salvo que te lo pida.
- Commits en formato Conventional Commits (`feat:`, `fix:`, `test:`...), uno por
  paso lógico, con el test y su código juntos.
- Los comentarios explican el por qué, no el qué.
