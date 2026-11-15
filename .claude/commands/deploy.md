---
description: Verify, merge the current branch into main and publish it
---
Publish what is on the current branch. Follow this order and stop at any failure,
explaining to me what happened in the PM language (CLAUDE.md), in plain words. How this project publishes (host, online
check, secret variable names) is in AGENTS.md → Publishing; if that section is still
_TODO_, fill it in with me first.

## 1. Before starting
- Run `git status`. If there are uncommitted changes, show them to me and ask whether to
  include them (in a commit) or leave them out. Never discard them.
- Note the current branch. If you're already on `main` and there are no new commits to push,
  tell me and stop.
- Run `git fetch origin`. If `origin/main` has commits the branch doesn't have, bring them
  in with a merge (never rebase or force push) and resolve conflicts only if they are
  trivial; otherwise stop and ask me.

## 2. Verify
Run the full check from AGENTS.md → Commands (typecheck, lint, tests, build, whatever the
project has), in that order, and stop if anything fails (show me the error).

## 3. Check for secrets
Verify that no commit about to be pushed contains the value of any secret variable listed
in AGENTS.md → Publishing. Compare without ever printing the values (for example, write the
values from the local env file to a temporary file, count matches with
`git grep -c -F -f <temporary file>` over each commit in `git rev-list origin/main..HEAD`,
and delete the temporary file). If there is any match, stop and tell me without showing the value.

## 4. Publish
- If the branch isn't `main`: `git switch main`, `git merge --no-ff <branch>` with a message
  that summarizes what is being published, and push the branch too (`git push origin <branch>`).
- `git push origin main`. Never `--force`.
- Commits carry the Claude attribution the system indicates.

## 5. Confirm it's online
Wait in the background, without asking me, until the online check in AGENTS.md → Publishing
passes. Make sure you are seeing the NEW version, not the old one still serving (for example,
a URL that only exists in the new version). If it doesn't pass within a reasonable time
(about three times the usual publish time), tell me where to look in the host's logs and what
to look for.

## 6. Summary
End with a short summary: what was published (in product language, not code),
the `main` commit, the URL and whether anything is pending (for example, a new environment
variable that has to be set in the host, or a setting to change in a provider).
