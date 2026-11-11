import { createServer, type RequestListener, type Server } from "node:http";
import type { AddressInfo } from "node:net";

export type FakeBackend = { url: string; close: () => Promise<void> };

// Backend falso en un puerto libre: los tests del intermediario no dependen
// de que el backend real esté prendido (criterio 9).
export async function startFakeBackend(handler: RequestListener): Promise<FakeBackend> {
  const server: Server = createServer(handler);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}`,
    close: () =>
      new Promise<void>((resolve) => {
        // Corta conexiones colgadas (caso "tarda demasiado") para que close() no espere.
        server.closeAllConnections();
        server.close(() => resolve());
      }),
  };
}

// Un puerto que estuvo libre y ya se cerró: simula el backend apagado.
export async function closedPortUrl(): Promise<string> {
  const fake = await startFakeBackend(() => {});
  await fake.close();
  return fake.url;
}
