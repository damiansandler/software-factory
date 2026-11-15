---
description: Build an approved feature spec end to end, without pauses
---
Talk to me in Spanish, in plain language. Write tasks.md, decisions.md and other docs in English.

## Before starting
- The feature is the folder I name, or else the highest-numbered folder in `specs/`.
  If its `spec.md` doesn't exist or doesn't say "Status: approved", stop and tell me.
- Read CLAUDE.md, AGENTS.md, ARCHITECTURE.md, the spec and whatever you need from docs/.
- Make sure `.claude/test-command` holds the project's test command (see AGENTS.md →
  Commands). If it's missing, create it.
- Create the `build/<short-name>` branch from main.
- Turn on the build marker: `touch .claude/.build-active`. While it exists, you
  can't finish with failing tests.

## 1. Plan
Write `tasks.md` in the feature folder: small tasks, in dependency order (contracts and
data first, then what uses them, then the screens). For each task, a micro-plan written
for someone without context: ordered steps, exact file paths, which spec criterion each
step covers and where its test lives. Continue without waiting for my ok.

## 2. For each task
1. First write the test for each testable criterion. Run it and confirm it
   fails for the right reason.
2. Implement the minimum to make it pass. Never weaken, skip or delete a test
   to make it pass. If you add new logic and the number of tests didn't grow,
   that logic isn't covered: mark it ⚠️, not ✅.
3. Run the tests and lint for what you touched.
4. Invoke the `refuter` subagent with the task and the feature folder. If the
   verdict is FIX, fix it and invoke it again (at most 5 rounds).
5. If it still fails after 5 rounds, apply the /debug protocol (root cause
   before moving on) and record the finding in `decisions.md`. If that doesn't
   get it moving either, leave the task marked ⚠️ with a report of where you
   got stuck and move on to the next task that doesn't depend on it.
6. One commit per task (Conventional Commits), with the test and its code together.

## 3. Rules during the build
Don't ask me anything. For minor doubts, decide and write one line in the
feature's `decisions.md`: "Ruling: what — why — cost if wrong". If a decision is
durable beyond this feature, also write an ADR in docs/adr/.
If a criterion can't be met as written, mark it ⚠️ with the reason. Never
reinterpret it silently.
Stop and ask me ONLY if:
1. the operation is irreversible or destructive,
2. it touches secrets, auth, permissions or money beyond what the spec asks for,
3. it would have an effect outside the branch (merge, push to main, the state
   of an environment),
4. the spec is so inconsistent that any path would be a guess.
Before stopping to ask me, remove the marker: `rm -f .claude/.build-active`.

## 4. When finished
1. Run the full check from AGENTS.md (tests, lint, build). All green.
2. Update README.md, ARCHITECTURE.md, docs/status.md, docs/providers/ and
   docs/runbooks/ if the feature changed what they describe.
3. Remove the marker: `rm -f .claude/.build-active`.
4. Push the branch: `git push -u origin <branch>`.
5. Give me a short summary: what was done, what is ⚠️, and "How to test it":
   the commands to start the app and the steps to verify each acceptance
   criterion.
