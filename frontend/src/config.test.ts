// @vitest-environment node
import { describe, expect, it } from "vitest";
import { loadConfig } from "./config";

describe("loadConfig", () => {
  it("apunta al backend local por defecto", () => {
    expect(loadConfig({}).backendUrl).toBe("http://localhost:4000");
    expect(loadConfig({ BACKEND_URL: "" }).backendUrl).toBe("http://localhost:4000");
  });

  it("respeta BACKEND_URL y le quita la barra final", () => {
    expect(loadConfig({ BACKEND_URL: "http://127.0.0.1:5050/" }).backendUrl).toBe(
      "http://127.0.0.1:5050",
    );
  });

  it("arma bien la dirección aunque BACKEND_URL tenga ruta base", () => {
    expect(loadConfig({ BACKEND_URL: "http://host:4000/api/" }).backendUrl).toBe(
      "http://host:4000/api",
    );
  });

  it("no repite credenciales de BACKEND_URL en el mensaje de error", () => {
    expect(() => loadConfig({ BACKEND_URL: "ftp://usuario:clave@host" })).toThrow(
      /^(?!.*clave).*BACKEND_URL inválida/,
    );
  });

  it("rechaza BACKEND_URL con parámetros o fragmento", () => {
    expect(() => loadConfig({ BACKEND_URL: "http://host:4000/?x=1" })).toThrow(/BACKEND_URL inválida/);
    expect(() => loadConfig({ BACKEND_URL: "http://host:4000/#a" })).toThrow(/BACKEND_URL inválida/);
  });

  it.each(["no-es-url", "ftp://host"])("rechaza BACKEND_URL inválida: %s", (value) => {
    expect(() => loadConfig({ BACKEND_URL: value })).toThrow(/BACKEND_URL inválida/);
  });
});
