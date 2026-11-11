// @vitest-environment node
import { readFile } from "node:fs/promises";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parse } from "yaml";
import { closedPortUrl, startFakeBackend, type FakeBackend } from "@/test/fake-backend";

let fake: FakeBackend | undefined;

afterEach(async () => {
  await fake?.close();
  fake = undefined;
  vi.unstubAllEnvs();
  vi.resetModules();
});

// La config se lee al importar el módulo, por eso se importa la ruta después
// de fijar BACKEND_URL.
async function loadRoute(backendUrl: string) {
  vi.stubEnv("BACKEND_URL", backendUrl);
  vi.resetModules();
  return import("./route");
}

describe("GET /api/health", () => {
  it("devuelve 200 y status ok cuando el backend está bien", async () => {
    fake = await startFakeBackend((_req, res) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
    });
    const { GET } = await loadRoute(fake.url);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toContain("no-store");
    expect(await res.json()).toEqual({ status: "ok" });
  });

  it("devuelve 503 con el motivo cuando el backend está apagado", async () => {
    const { GET } = await loadRoute(await closedPortUrl());
    const res = await GET();
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ status: "error", reason: "down" });
  });
});

describe("contrato frontend/openapi.yaml", () => {
  it("documenta /api/health con 200 ok y 503 con los tres motivos", async () => {
    const raw = await readFile(new URL("../../../../openapi.yaml", import.meta.url), "utf8");
    const spec = parse(raw);
    const responses = spec.paths["/api/health"].get.responses;
    expect(Object.keys(responses).sort()).toEqual(["200", "503"]);
    expect(spec.components.schemas.HealthOk.properties.status.const).toBe("ok");
    expect(spec.components.schemas.HealthError.properties.reason.enum).toEqual([
      "down",
      "timeout",
      "bad_response",
    ]);
  });
});
