import { createServer, type Server, type ServerResponse } from "node:http";

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

// La app se crea sin escuchar en ningún puerto para que los tests la levanten
// en un puerto libre y `server.ts` en el puerto configurado.
export function createApp(): Server {
  return createServer((req, res) => {
    const path = new URL(req.url ?? "/", "http://localhost").pathname;

    if (path === "/health") {
      if (req.method !== "GET") {
        res.setHeader("allow", "GET");
        return sendJson(res, 405, { error: "method_not_allowed" });
      }
      return sendJson(res, 200, { status: "ok" });
    }

    sendJson(res, 404, { error: "not_found" });
  });
}
