import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import HealthStatus from "./HealthStatus";

// Simula /api/health: el componente no depende del intermediario ni del backend real.
function respond(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    }),
  );
}

function mockFetch(...responses: Array<() => Promise<Response>>) {
  const fn = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    void input;
    void init;
    const next = responses.shift();
    if (!next) throw new Error("fetch llamado más veces de lo esperado");
    return next();
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

function deferred() {
  let resolve!: (r: Response) => void;
  const promise = new Promise<Response>((r) => (resolve = r));
  return { promise, resolve };
}

const retryButton = () => screen.getByRole("button", { name: "Volver a probar" });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("HealthStatus", () => {
  it("al cargar consulta /api/health y muestra 'Consultando…' con el botón desactivado", async () => {
    const pending = deferred();
    const fetchMock = mockFetch(() => pending.promise);
    render(<HealthStatus />);

    expect(screen.getByText("Consultando al backend…")).toBeInTheDocument();
    expect(retryButton()).toBeDisabled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toBe("/api/health");

    pending.resolve(new Response(JSON.stringify({ status: "ok" }), { status: 200 }));
    expect(await screen.findByText("ok")).toBeInTheDocument();
  });

  it("criterio 1: backend ok → muestra 'ok' en verde y habilita el botón", async () => {
    mockFetch(() => respond({ status: "ok" }));
    render(<HealthStatus />);

    const ok = await screen.findByText("ok");
    expect(screen.getByRole("status")).toHaveAttribute("data-state", "ok");
    expect(ok.closest("[data-state]")).toHaveClass("bg-emerald-50");
    expect(screen.getByText("El backend respondió correctamente.")).toBeInTheDocument();
    expect(retryButton()).toBeEnabled();
  });

  it.each([
    ["criterio 2", "down", "El backend no responde. ¿Está prendido?"],
    ["criterio 3", "timeout", "El backend tardó más de 5 segundos."],
    ["criterio 4", "bad_response", "El backend respondió algo inesperado."],
  ])("%s: motivo '%s' → error en rojo con su explicación", async (_c, reason, detail) => {
    mockFetch(() => respond({ status: "error", reason }, 503));
    render(<HealthStatus />);

    expect(await screen.findByText("No se pudo conectar con el backend")).toBeInTheDocument();
    expect(screen.getByText(detail)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute("data-state", "error");
    expect(screen.getByRole("status")).toHaveClass("bg-red-50");
    expect(screen.queryByText("ok")).not.toBeInTheDocument();
    expect(retryButton()).toBeEnabled();
  });

  it("criterio 4: una respuesta rara del intermediario nunca se muestra como ok", async () => {
    mockFetch(() => respond({ algo: "raro" }, 200));
    render(<HealthStatus />);

    expect(await screen.findByText("El backend respondió algo inesperado.")).toBeInTheDocument();
    expect(screen.queryByText("ok")).not.toBeInTheDocument();
  });

  it("criterio 4: 'ok' con un código distinto de 200 no se muestra como ok", async () => {
    mockFetch(() => respond({ status: "ok" }, 503));
    render(<HealthStatus />);

    expect(await screen.findByText("El backend respondió algo inesperado.")).toBeInTheDocument();
    expect(screen.queryByText("ok")).not.toBeInTheDocument();
  });

  it("criterio 3: si el tiempo se agota mientras se lee la respuesta, es 'tardó'", async () => {
    const timeoutError = Object.assign(new Error("signal timed out"), { name: "TimeoutError" });
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          status: 200,
          ok: true,
          json: () => Promise.reject(timeoutError),
        } as unknown as Response),
      ),
    );
    render(<HealthStatus />);

    expect(await screen.findByText("El backend tardó más de 5 segundos.")).toBeInTheDocument();
  });

  it("estilos como el prototipo: cada estado tiene un solo tamaño y grosor de letra", async () => {
    const pending = deferred();
    mockFetch(() => pending.promise, () => respond({ status: "error", reason: "down" }, 503));
    const user = userEvent.setup();
    render(<HealthStatus />);

    const box = screen.getByRole("status");
    expect(box).toHaveClass("font-medium");
    expect(box).not.toHaveClass("font-semibold");

    pending.resolve(new Response(JSON.stringify({ status: "ok" }), { status: 200 }));
    await screen.findByText("ok");
    expect(box).toHaveClass("text-lg", "font-semibold");

    await user.click(retryButton());
    await screen.findByText("No se pudo conectar con el backend");
    expect(box).toHaveClass("text-base");
    expect(box).not.toHaveClass("text-lg");
  });

  it("criterio 2: si no se puede llegar a /api/health, muestra error y no queda cargando", async () => {
    mockFetch(() => Promise.reject(new TypeError("Failed to fetch")));
    render(<HealthStatus />);

    expect(await screen.findByText("El backend no responde. ¿Está prendido?")).toBeInTheDocument();
  });

  it("criterio 3: red de seguridad — si /api/health nunca contesta, termina en error 'tardó'", async () => {
    // Un fetch que solo termina si se aborta, como uno colgado de verdad.
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_input: RequestInfo | URL, init?: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
          }),
      ),
    );
    render(<HealthStatus safetyTimeoutMs={100} />);

    expect(
      await screen.findByText("El backend tardó más de 5 segundos.", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
  });

  it("criterio 5: de rojo a verde con 'Volver a probar', sin recargar la página", async () => {
    const fetchMock = mockFetch(
      () => respond({ status: "error", reason: "down" }, 503),
      () => respond({ status: "ok" }),
    );
    const user = userEvent.setup();
    render(<HealthStatus />);
    // Marca en la página: si se recargara, desaparecería.
    (window as unknown as { __sinRecarga: boolean }).__sinRecarga = true;

    await screen.findByText("No se pudo conectar con el backend");
    await user.click(retryButton());

    expect(await screen.findByText("ok")).toBeInTheDocument();
    expect(screen.queryByText("No se pudo conectar con el backend")).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect((window as unknown as { __sinRecarga?: boolean }).__sinRecarga).toBe(true);
  });

  it("criterio 6: mientras consulta, el botón está desactivado y los clics no disparan otra consulta", async () => {
    const second = deferred();
    const fetchMock = mockFetch(
      () => respond({ status: "error", reason: "down" }, 503),
      () => second.promise,
    );
    const user = userEvent.setup();
    render(<HealthStatus />);
    await screen.findByText("No se pudo conectar con el backend");

    await user.click(retryButton());
    await waitFor(() => expect(retryButton()).toBeDisabled());
    expect(screen.getByText("Consultando al backend…")).toBeInTheDocument();

    await user.click(retryButton());
    await user.click(retryButton());
    expect(fetchMock).toHaveBeenCalledTimes(2);

    second.resolve(new Response(JSON.stringify({ status: "ok" }), { status: 200 }));
    expect(await screen.findByText("ok")).toBeInTheDocument();
    expect(retryButton()).toBeEnabled();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
