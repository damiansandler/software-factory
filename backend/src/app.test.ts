import { readFile } from "node:fs/promises";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { parse } from "yaml";
import { createApp } from "./app.js";

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  server = createApp();
  // Puerto 0 = el sistema elige uno libre, así el test no choca con `npm run dev`.
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});

describe("GET /health (criterio 7)", () => {
  it('responde 200 con {"status":"ok"} en JSON', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/^application\/json/);
    expect(await res.json()).toEqual({ status: "ok" });
  });

  it("no responde ok a rutas desconocidas", async () => {
    const res = await fetch(`${baseUrl}/no-existe`);
    expect(res.status).toBe(404);
  });

  it("no responde ok a métodos distintos de GET", async () => {
    const res = await fetch(`${baseUrl}/health`, { method: "POST" });
    expect(res.status).toBe(405);
  });
});

describe("contrato openapi.yaml (criterio 7)", () => {
  it("documenta GET /health con la respuesta status: ok", async () => {
    const raw = await readFile(new URL("../openapi.yaml", import.meta.url), "utf8");
    const spec = parse(raw);
    const ok = spec.paths["/health"].get.responses["200"];
    const schemaRef: string = ok.content["application/json"].schema.$ref;
    const schemaName = schemaRef.split("/").pop() as string;
    expect(spec.components.schemas[schemaName].properties.status.const).toBe("ok");
  });

  it("documenta el 405 que devuelve /health ante otros métodos", async () => {
    const raw = await readFile(new URL("../openapi.yaml", import.meta.url), "utf8");
    expect(parse(raw).paths["/health"].get.responses).toHaveProperty("405");
  });
});
