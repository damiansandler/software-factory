#!/usr/bin/env bash
# Hook Stop: mientras /build esté activo (existe .claude/.build-active),
# Claude no puede dar el trabajo por terminado con los tests en rojo.
# Exit 2 = bloquear: el mensaje de stderr vuelve a Claude y sigue trabajando.
# El comando de tests es del proyecto: vive solo en .claude/test-command (una línea).
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -f .claude/.build-active ] || exit 0

cmd=$(grep -v '^[[:space:]]*#' .claude/test-command 2>/dev/null | grep -v '^[[:space:]]*$' | head -n 1)
if [ -z "$cmd" ]; then
  echo "Falta .claude/test-command (el comando que corre los tests del proyecto). Crealo antes de terminar." >&2
  exit 2
fi

if ! out=$(bash -c "$cmd" 2>&1); then
  echo "Tests en rojo ($cmd). No termines todavía; arreglá la causa:" >&2
  echo "$out" | tail -n 30 >&2
  exit 2
fi
exit 0
