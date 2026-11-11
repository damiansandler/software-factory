// Tipos compartidos entre el intermediario (servidor) y la pantalla (navegador).
export type HealthErrorReason = "down" | "timeout" | "bad_response";

export type HealthResult = { status: "ok" } | { status: "error"; reason: HealthErrorReason };
