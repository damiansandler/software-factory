# TASKS: Esqueleto de verificación del circuito

Orden de contrato: primero el backend y su contrato, después el frontend.
Leyenda: ⬜ pendiente · ✅ hecha y cubierta por tests · ⚠️ con problemas (ver nota)

Convenciones comunes:
- Node 22. Backend en el puerto 4000 y frontend en el 3000.
- Respuesta de salud acordada: `200` con JSON `{"status":"ok"}`.
- Tests con Vitest. Las esperas asíncronas usan polling (`waitFor` / `findBy*`),
  nunca esperas fijas.

---

## T1 ✅ Backend: contrato y endpoint `/health`
Cubre: criterio 7, y criterio 8 en la parte del backend.

1. Crear `backend/package.json` con los scripts `dev` (tsx watch), `test`
   (vitest run), `lint` (eslint) y `build` (tsc), más `backend/tsconfig.json`
   y `backend/eslint.config.mjs`.
2. **Contrato primero:** escribir `backend/openapi.yaml` con `GET /health`, que
   responde `200` y `{"status":"ok"}`.
3. Escribir el test `backend/src/app.test.ts`:
   - `GET /health` devuelve 200 y `{"status":"ok"}`.
   - Una ruta desconocida devuelve 404, para que el backend no responda "ok" a cualquier cosa.
   - `backend/openapi.yaml` declara `/health` con la respuesta `status: ok`.
   El test levanta la app en un puerto libre y elegido al azar.
4. Correr el test y confirmar que falla porque `src/app.ts` no existe.
5. Implementar `backend/src/config.ts`, el único lugar que lee variables de
   entorno (`PORT`, por defecto 4000), además de `backend/src/app.ts` (crea el
   servidor) y `backend/src/server.ts` (lo arranca).
6. Correr `npm test`, `npm run lint` y `npm run build` en `backend/`.

## T2 ✅ Frontend: intermediario `/api/health`
Cubre: criterios 2, 3 y 4 (del lado del servidor), y el criterio 9.

1. Crear el proyecto Next.js en `frontend/` (App Router, TypeScript, Tailwind)
   con los scripts `dev`, `test`, `lint` y `build`.
2. Escribir el test `frontend/src/lib/health-proxy.test.ts`. Usa un backend
   falso local (un servidor `node:http` en un puerto libre), no el backend real:
   - el backend responde `{"status":"ok"}` → `{"status":"ok"}`;
   - el backend está apagado (puerto cerrado) → `{"status":"error","reason":"down"}`;
   - el backend tarda más que el tiempo máximo → `{"status":"error","reason":"timeout"}`;
   - el backend responde 500 o un cuerpo distinto de ok → `{"status":"error","reason":"bad_response"}`;
   - el tiempo máximo por defecto es de 5000 ms.
3. Correr el test y confirmar que falla porque el módulo no existe.
4. Implementar `frontend/src/config.ts` (único lector de `BACKEND_URL`, por
   defecto `http://localhost:4000`), `frontend/src/lib/health-proxy.ts`
   (consulta con tiempo máximo y clasifica el resultado) y
   `frontend/src/app/api/health/route.ts` (expone `GET /api/health`).
5. Correr `npm test` y `npm run lint` en `frontend/`.

## T3 ✅ Frontend: pantalla con los tres estados y "Volver a probar"
Cubre: criterios 1, 2, 3, 4, 5 y 6 (lo que ve el usuario).

1. Escribir el test `frontend/src/components/HealthStatus.test.tsx`, que simula
   `fetch` hacia `/api/health`:
   - al montar muestra "Consultando al backend…" y el botón desactivado;
   - con respuesta ok muestra "ok";
   - con `down`, `timeout` o `bad_response` muestra "No se pudo conectar con el
     backend" y el motivo que corresponde;
   - si `/api/health` no contesta, la pantalla igual termina en error (red de seguridad);
   - primero error y, al apretar "Volver a probar", "ok", sin recargar la página;
   - durante una consulta en curso el botón está desactivado y los clics no
     disparan otra consulta.
2. Correr el test y confirmar que falla porque el componente no existe.
3. Implementar `frontend/src/components/HealthStatus.tsx` (componente de
   cliente) y usarlo en `frontend/src/app/page.tsx`, con los textos y colores
   del prototipo.
4. Correr `npm test`, `npm run lint` y `npm run build` en `frontend/`.

## T4 ⬜ Verificación final y "Cómo probarlo"
Cubre: criterio 8 completo.

1. Agregar `.env.example` en `backend/` y `frontend/`, sin secretos.
2. Agregar en `README.md` cómo levantar y probar el circuito.
3. Correr lint, tests y build en las dos carpetas.
4. Levantar los dos servidores y probar el circuito real con `curl`
   (prendido, apagado y prendido de nuevo).
