import { describe, expect, it } from "vitest";
import { loadConfig } from "./config.js";

describe("loadConfig", () => {
  it("usa el puerto 4000 por defecto", () => {
    expect(loadConfig({}).port).toBe(4000);
    expect(loadConfig({ PORT: "" }).port).toBe(4000);
  });

  it("respeta PORT cuando es válido", () => {
    expect(loadConfig({ PORT: "5050" }).port).toBe(5050);
  });

  it.each(["abc", "0", "70000", "40.5", "1e3", "0x10", " 80"])("rechaza PORT inválido: %s", (value) => {
    expect(() => loadConfig({ PORT: value })).toThrow(/PORT inválido/);
  });
});
