// Único módulo que lee variables de entorno (regla de CLAUDE.md): si mañana
// hay secretos, entran por acá y no se desparraman por el código.
export function loadConfig(env: NodeJS.ProcessEnv) {
  const raw = env.PORT;
  let port = 4000;
  if (raw !== undefined && raw !== "") {
    port = Number(raw);
    // Solo dígitos: Number() aceptaría "1e3" o "0x10" y escucharíamos en un
    // puerto que nadie espera. Mejor fallar al arrancar.
    if (!/^\d+$/.test(raw) || port < 1 || port > 65535) {
      throw new Error(`PORT inválido: ${raw}`);
    }
  }
  return { port } as const;
}

export const config = loadConfig(process.env);
