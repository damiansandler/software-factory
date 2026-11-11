"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { HealthErrorReason, HealthResult } from "@/lib/health-types";

// El intermediario ya corta a los 5 s; esto es solo por si el intermediario
// mismo se cuelga, para que la pantalla nunca quede cargando para siempre.
export const SAFETY_TIMEOUT_MS = 8000;

type ViewState = { kind: "loading" } | { kind: "ok" } | { kind: "error"; reason: HealthErrorReason };

const ERROR_DETAILS: Record<HealthErrorReason, string> = {
  down: "El backend no responde. ¿Está prendido?",
  timeout: "El backend tardó más de 5 segundos.",
  bad_response: "El backend respondió algo inesperado.",
};

const REASONS = Object.keys(ERROR_DETAILS) as HealthErrorReason[];

function interpret(httpStatus: number, body: unknown): HealthResult {
  const b = body as { status?: unknown; reason?: unknown } | null;
  // Según frontend/openapi.yaml, "ok" llega siempre con 200: exigimos ambas cosas.
  if (httpStatus === 200 && b?.status === "ok") return { status: "ok" };
  if (b?.status === "error" && REASONS.includes(b.reason as HealthErrorReason)) {
    return { status: "error", reason: b.reason as HealthErrorReason };
  }
  // Cualquier otra cosa es una respuesta rara: nunca se muestra como ok.
  return { status: "error", reason: "bad_response" };
}

// Por nombre y no por clase: según el entorno, DOMException puede venir de otro "realm".
function isTimeout(err: unknown): boolean {
  return (err as { name?: unknown } | null)?.name === "TimeoutError";
}

async function fetchHealth(safetyTimeoutMs: number): Promise<HealthResult> {
  try {
    const res = await fetch("/api/health", {
      cache: "no-store",
      signal: AbortSignal.timeout(safetyTimeoutMs),
    });
    let body: unknown = null;
    try {
      body = await res.json();
    } catch (err) {
      // El corte puede llegar mientras se lee el cuerpo: sigue siendo "tardó".
      if (isTimeout(err)) throw err;
    }
    return interpret(res.status, body);
  } catch (err) {
    if (isTimeout(err)) return { status: "error", reason: "timeout" };
    return { status: "error", reason: "down" };
  }
}

export default function HealthStatus({ safetyTimeoutMs = SAFETY_TIMEOUT_MS }: { safetyTimeoutMs?: number }) {
  const [state, setState] = useState<ViewState>({ kind: "loading" });
  // Guarda contra consultas superpuestas, independiente de que el botón esté desactivado.
  const inFlight = useRef(false);

  const check = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setState({ kind: "loading" });
    const result = await fetchHealth(safetyTimeoutMs);
    inFlight.current = false;
    setState(result.status === "ok" ? { kind: "ok" } : { kind: "error", reason: result.reason });
  }, [safetyTimeoutMs]);

  useEffect(() => {
    // La consulta inicial es un efecto externo (red): se dispara al montar.
    void check();
  }, [check]);

  const loading = state.kind === "loading";

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
      <h1 className="mb-6 text-xl font-semibold">Estado del backend</h1>

      <div
        role="status"
        aria-live="polite"
        data-state={state.kind}
        className={
          // Tamaño y grosor van solo por estado: si se combinan clases que
          // compiten, Tailwind decide por orden en el CSS y no por intención.
          "flex min-h-[72px] items-center justify-center gap-3 rounded-[10px] p-5 " +
          (state.kind === "loading"
            ? "bg-gray-100 text-lg font-medium text-gray-600"
            : state.kind === "ok"
              ? "bg-emerald-50 text-lg font-semibold text-emerald-700"
              : "bg-red-50 text-base font-semibold text-red-700")
        }
      >
        {state.kind === "loading" && (
          <>
            <span
              aria-hidden
              className="h-[18px] w-[18px] animate-spin rounded-full border-[3px] border-gray-300 border-t-gray-500"
            />
            Consultando al backend…
          </>
        )}
        {state.kind === "ok" && (
          <>
            <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-full bg-emerald-500" />
            ok
          </>
        )}
        {state.kind === "error" && (
          <>
            <span aria-hidden className="h-3.5 w-3.5 shrink-0 rounded-full bg-red-500" />
            No se pudo conectar con el backend
          </>
        )}
      </div>

      <p className="mt-2.5 min-h-[18px] text-[13px] text-gray-500">
        {state.kind === "ok" && "El backend respondió correctamente."}
        {state.kind === "error" && ERROR_DETAILS[state.reason]}
      </p>

      <button
        type="button"
        onClick={() => void check()}
        disabled={loading}
        className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-[15px] text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        Volver a probar
      </button>
    </div>
  );
}
