// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import { closedPortUrl, startFakeBackend, type FakeBackend } from "@/test/fake-backend";
import { HEALTH_TIMEOUT_MS, checkBackendHealth } from "./health-proxy";

let fake: FakeBackend | undefined;

afterEach(async () => {
  await fake?.close();
  fake = undefined;
});

function json(status: number, body: unknown) {
  return (_req: unknown, res: import("node:http").ServerResponse) => {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  };
}

describe("checkBackendHealth", () => {
  it("criterio 1: backend responde ok → ok", async () => {
    fake = await startFakeBackend(json(200, { status: "ok" }));
    expect(await checkBackendHealth({ backendUrl: fake.url })).toEqual({ status: "ok" });
  });

  it("consulta la ruta /health del backend", async () => {
    let path: string | undefined;
    fake = await startFakeBackend((req, res) => {
      path = req.url;
      json(200, { status: "ok" })(req, res);
    });
    await checkBackendHealth({ backendUrl: fake.url });
    expect(path).toBe("/health");
  });

  it("criterio 2: backend apagado → error 'down'", async () => {
    const url = await closedPortUrl();
    expect(await checkBackendHealth({ backendUrl: url })).toEqual({
      status: "error",
      reason: "down",
    });
  });

  it("criterio 3: el tiempo máximo por defecto es 5 segundos", () => {
    expect(HEALTH_TIMEOUT_MS).toBe(5000);
  });

  it("criterio 3: backend que no contesta a tiempo → error 'timeout'", async () => {
    fake = await startFakeBackend(() => {
      /* nunca responde */
    });
    const started = Date.now();
    const result = await checkBackendHealth({ backendUrl: fake.url, timeoutMs: 150 });
    expect(result).toEqual({ status: "error", reason: "timeout" });
    // Corta cerca del límite: no se queda esperando para siempre.
    expect(Date.now() - started).toBeLessThan(2000);
  });

  it("criterio 3: backend que empieza a responder y se cuelga a la mitad → error 'timeout'", async () => {
    fake = await startFakeBackend((_req, res) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.write('{"status":');
      // Nunca termina el cuerpo.
    });
    const result = await checkBackendHealth({ backendUrl: fake.url, timeoutMs: 200 });
    expect(result).toEqual({ status: "error", reason: "timeout" });
  });

  it("criterio 4: una redirección a otro lugar que diga ok no cuenta como ok", async () => {
    const target = await startFakeBackend(json(200, { status: "ok" }));
    try {
      fake = await startFakeBackend((_req, res) => {
        res.writeHead(302, { location: `${target.url}/health` });
        res.end();
      });
      expect(await checkBackendHealth({ backendUrl: fake.url })).toEqual({
        status: "error",
        reason: "bad_response",
      });
    } finally {
      await target.close();
    }
  });

  it("criterio 3: una respuesta lenta pero dentro del límite por defecto es ok", async () => {
    fake = await startFakeBackend((req, res) => {
      setTimeout(() => json(200, { status: "ok" })(req, res), 300);
    });
    expect(await checkBackendHealth({ backendUrl: fake.url })).toEqual({ status: "ok" });
  });

  it.each([
    ["error 500", json(500, { status: "ok" })],
    ["200 con otro estado", json(200, { status: "degraded" })],
    ["200 con cuerpo vacío", json(200, {})],
    [
      "200 con texto que no es JSON",
      (_req: unknown, res: import("node:http").ServerResponse) => {
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("ok");
      },
    ],
    ["404", json(404, { error: "not_found" })],
  ])("criterio 4: %s → error 'bad_response'", async (_name, handler) => {
    fake = await startFakeBackend(handler);
    expect(await checkBackendHealth({ backendUrl: fake.url })).toEqual({
      status: "error",
      reason: "bad_response",
    });
  });
});
