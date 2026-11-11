#!/usr/bin/env bash
# Hook Stop: mientras /build esté activo (existe .claude/.build-active),
# Claude no puede dar el trabajo por terminado con los tests en rojo.
# Exit 2 = bloquear: el mensaje de stderr vuelve a Claude y sigue trabajando.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -f .claude/.build-active ] || exit 0

fail=0
for dir in backend frontend; do
  if [ -f "$dir/package.json" ] && grep -q '"test"' "$dir/package.json"; then
    if ! out=$(cd "$dir" && npm test --silent 2>&1); then
      echo "Tests en rojo en $dir/. No termines todavía; arreglá la causa:" >&2
      echo "$out" | tail -n 30 >&2
      fail=1
    fi
  fi
done

[ "$fail" -eq 1 ] && exit 2
exit 0
