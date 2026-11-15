#!/usr/bin/env bash
# Stop hook: while /build is active (.claude/.build-active exists), Claude can't
# call the work done with failing tests.
# Exit 2 = block: the stderr message goes back to Claude and it keeps working.
# The test command belongs to the project: it lives only in .claude/test-command (one line).
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -f .claude/.build-active ] || exit 0

cmd=$(grep -v '^[[:space:]]*#' .claude/test-command 2>/dev/null | grep -v '^[[:space:]]*$' | head -n 1)
if [ -z "$cmd" ]; then
  echo ".claude/test-command is missing (the command that runs the project's tests). Create it before finishing." >&2
  exit 2
fi

if ! out=$(bash -c "$cmd" 2>&1); then
  echo "Tests are failing ($cmd). Don't finish yet; fix the cause:" >&2
  echo "$out" | tail -n 30 >&2
  exit 2
fi
exit 0
