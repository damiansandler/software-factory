import type { HealthResult } from "./health-types";

// Acordado en SPEC.md: pasado este tiempo damos el backend por caído.
export const HEALTH_TIMEOUT_MS = 5000;

// Por nombre y no por clase: según el entorno, DOMException puede venir de otro "realm".
function isTimeout(err: unknown): boolean {
  return (err as { name?: unknown } | null)?.name === "TimeoutError";
}

type Options = { backendUrl: string; timeoutMs?: number };

export async function checkBackendHealth({
  backendUrl,
  timeoutMs = HEALTH_TIMEOUT_MS,
}: Options): Promise<HealthResult> {
  let res: Response;
  try {
    res = await fetch(`${backendUrl}/health`, {
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
      // Una redirección no es "ok": el backend debe responder él mismo (criterio 4).
      redirect: "manual",
    });
  } catch (err) {
    if (isTimeout(err)) return { status: "error", reason: "timeout" };
    // Conexión rechazada, host inexistente, etc.: para el usuario es "no responde".
    return { status: "error", reason: "down" };
  }

  // Solo es verde si el backend dice exactamente ok: cualquier otra respuesta,
  // aunque llegue, es un error (criterio 4).
  if (res.status !== 200) return { status: "error", reason: "bad_response" };
  try {
    const body: unknown = await res.json();
    if (
      typeof body === "object" &&
      body !== null &&
      (body as { status?: unknown }).status === "ok"
    ) {
      return { status: "ok" };
    }
  } catch (err) {
    // El cuerpo puede cortarse por el mismo límite de tiempo mientras se lee.
    if (isTimeout(err)) return { status: "error", reason: "timeout" };
  }
  return { status: "error", reason: "bad_response" };
}
