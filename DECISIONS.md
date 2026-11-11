# DECISIONS

- Ruling: se construye para Node 22 (como dicen CLAUDE.md y CI), aunque la Mac tiene Node 18.17; para construir y probar se usó una copia de Node 22 en una carpeta temporal, sin tocar el sistema — CLAUDE.md fija Node 22 y con 18.17 habría que usar versiones viejas de Next/ESLint/Vitest — costo si está mal: para correrlo localmente hay que instalar Node 22.
- Ruling: `/health` responde `200` con JSON `{"status":"ok"}` en vez de texto plano — JSON es más fácil de validar y extender — costo si está mal: bajo, se cambia en el contrato y en un solo chequeo.
- Ruling: backend con `node:http` puro, sin Express — es un único endpoint y no justifica una dependencia — costo si está mal: bajo, migrar cuando haya más rutas.
- Ruling: el tiempo máximo de 5 s se aplica en el intermediario `/api/health`, y el navegador tiene una red de seguridad de 8 s por si el intermediario mismo se cuelga — así el motivo "tardó demasiado" viene del servidor y la página nunca queda cargando para siempre — costo si está mal: en un caso raro el usuario esperaría hasta 8 s.
- Ruling: puertos 4000 (backend) y 3000 (frontend), configurables con `PORT` y `BACKEND_URL` — valores por defecto habituales — costo si está mal: nulo.
- Ruling: se usa Vitest 5 en vez de 4 — `npm install` de Vitest 4.1 falla con un error interno de npm ("Cannot read properties of null (reading 'edgesOut')") al resolver sus dependencias opcionales; la 5 instala bien y soporta Node 22 — costo si está mal: bajo, la API usada es la misma.
