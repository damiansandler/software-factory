import "server-only";

// Único módulo que lee variables de entorno (regla de CLAUDE.md). Es solo de
// servidor: la dirección del backend nunca viaja al navegador.
export function loadConfig(env: Record<string, string | undefined>) {
  const raw = env.BACKEND_URL;
  if (raw === undefined || raw === "") {
    return { backendUrl: "http://localhost:4000" } as const;
  }
  // El mensaje no repite el valor: podría traer usuario y clave y terminar en un log.
  const invalid = new Error("BACKEND_URL inválida: debe ser http(s)://host[:puerto][/ruta]");
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw invalid;
  }
  if ((url.protocol !== "http:" && url.protocol !== "https:") || url.search || url.hash) {
    throw invalid;
  }
  // Se arma desde la URL ya interpretada y sin barra final, para que
  // `${backendUrl}/health` siempre sea una dirección bien formada.
  return { backendUrl: `${url.origin}${url.pathname.replace(/\/+$/, "")}` } as const;
}

export const config = loadConfig(process.env);
