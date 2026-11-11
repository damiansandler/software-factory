# sandler-softwarefactory

Prototipo para entender el flujo de pagos de Colombia. Por ahora es solo un
esqueleto que comprueba que el backend y el frontend se comunican.

## Requisitos
- **Node 22 o superior** (`node -v`). Si tenés otra versión, instalala, por
  ejemplo con `brew install node@22` o con nvm (`nvm install 22`).

## Levantarlo
En dos terminales distintas:

```sh
# Terminal 1: backend (http://localhost:4000)
cd backend && npm install && npm run dev

# Terminal 2: frontend (http://localhost:3000)
cd frontend && npm install && npm run dev
```

Abrí http://localhost:3000. Tiene que aparecer **"ok"** en verde.

Las direcciones se pueden cambiar con variables de entorno (ver `.env.example`
en cada carpeta): `PORT` en el backend y `BACKEND_URL` en el frontend.

## Comandos de cada carpeta
`npm run dev`, `npm test`, `npm run lint` y `npm run build`.

## Contratos
- Backend: `backend/openapi.yaml` (`GET /health`).
- Frontend: `frontend/openapi.yaml` (`GET /api/health`, el intermediario que
  usa la pantalla).
