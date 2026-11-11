Estado: aprobado

# SPEC: Esqueleto de verificación del circuito

## Objetivo
Comprobar que el backend y el frontend están bien armados y se comunican entre
sí, antes de construir cualquier funcionalidad real. El usuario es quien dirige
el proyecto, que lo prueba en su propia Mac abriendo una página en el navegador.

No hay lógica de negocio, ni base de datos, ni proveedores.

## Flujo
1. Se prenden el backend y el frontend, cada uno con `npm run dev`.
2. El usuario abre la página del frontend en el navegador.
3. Al cargar, la página consulta si el backend está vivo. Lo hace a través del
   propio frontend (`/api/health`), que le pasa el pedido al `/health` del
   backend. La dirección del backend se configura por variable de entorno.
4. La página muestra uno de tres estados:
   - **Cargando**: "Consultando al backend…", con el botón desactivado.
   - **Éxito**: indicador verde con "ok".
   - **Error**: indicador rojo con "No se pudo conectar con el backend" y una
     línea con el motivo (apagado, tardó demasiado o respuesta inesperada).
5. El botón "Volver a probar" repite la consulta sin recargar la página.

## Pantallas confirmadas
Una sola pantalla con tres estados, tal como se ve en `prototype/index.html`
(aprobado). La barra negra del prototipo es solo para navegarlo y no forma
parte de la pantalla real.

## Criterios de aceptación
1. Con backend y frontend prendidos, la página muestra "ok" en verde.
2. Con el backend apagado, la página muestra el error en rojo con el motivo
   "no responde", y no se queda cargando para siempre.
3. Si el backend tarda más de 5 segundos en responder, la página deja de
   esperar y muestra el error con el motivo "tardó demasiado".
4. Si el backend responde algo distinto de "ok" (por ejemplo un error interno),
   la página muestra el error con el motivo "respuesta inesperada", no verde.
5. Si el backend estaba apagado y se prende, al apretar "Volver a probar" la
   página pasa de rojo a verde sin recargarse.
6. Mientras hay una consulta en curso, el botón "Volver a probar" está
   desactivado y no se puede disparar otra consulta.
7. El endpoint `/health` del backend responde "ok" y está documentado en
   `backend/openapi.yaml` antes de implementarse.
8. Tanto `backend/` como `frontend/` tienen `npm run dev`, `npm test`,
   `npm run lint` y `npm run build`, y todos terminan sin errores.
9. Los tests no dependen de que el otro lado esté prendido: el frontend se
   prueba simulando las respuestas del backend.

## Fuera de alcance
- Lógica de negocio, pagos y proveedores (MuralPay, Coinbase, Bre-B).
- Base de datos.
- Login o usuarios.
- Publicarlo en internet o configurar tests automáticos en GitHub.
- Diseño final: la pantalla es solo de verificación.
