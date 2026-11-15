# Sandler Software Factory

A way of working with coding agents (Claude Code) where a PM who doesn't program directs the
work: the agent interviews, writes the spec, builds with tests first, gets reviewed by a
skeptical sub-agent, debugs to the root cause and publishes. It holds no product, no stack and
no provider: those are filled in by each project.

## What's inside
| Piece | File | What it does |
|---|---|---|
| Rules for the agent | `CLAUDE.md`, `AGENTS.md` | How to talk to the PM (Spanish, plain language), the workflow, the hard rules. `AGENTS.md` is a template with _TODO_ sections for the project. |
| `/spec` | `.claude/commands/spec.md` | Interviews the PM one question at a time, builds a clickable prototype if there are screens, and writes `specs/NNN-name/spec.md` until the PM approves it. |
| `/build` | `.claude/commands/build.md` | Builds an approved spec without pauses: plan in `tasks.md`, test first, one commit per task, minor rulings in `decisions.md`. |
| `/debug` | `.claude/commands/debug.md` | From a symptom to the root cause, with a regression test; never patches the symptom. |
| `/deploy` | `.claude/commands/deploy.md` | Runs the full check, scans the commits for secrets, merges into `main`, pushes and waits until the new version is online. |
| `refuter` | `.claude/agents/refuter.md` | Sub-agent that tries to prove each task does NOT meet its criteria or breaks a hard rule. |
| Tests hook | `.claude/hooks/stop-tests.sh`, `.claude/test-command` | While `/build` runs, the agent can't finish with failing tests. |
| Permissions | `.claude/settings.json` | Blocks reading env files with secrets, force pushes and `rm -rf`. |
| Documentation skeleton | `ARCHITECTURE.md`, `docs/`, `specs/` | Where each kind of knowledge lives: ADRs, providers, runbooks, status, business, specs. |

## Starting a new project with it
1. Copy everything in this repository (including `.claude/`) into the new project's root.
2. Open Claude Code there and run `/spec` with the first feature. It fills in the _TODO_
   sections of `AGENTS.md` (project, stack, commands) with you as part of the interview.
3. Put the project's test command in `.claude/test-command` (the first `/build` does it if
   you don't), and add the stack's ignores to `.gitignore`.
4. Before the first `/deploy`, fill in **Publishing** in `AGENTS.md`: host, online check and
   the names of the secret variables.

## The loop
`/spec` → (PM says "aprobado") → `/build` → PM tries it → `/deploy`. Errors at any point → `/debug`.

## Conventions
- The agent talks to the PM in Spanish; documentation, specs and code are in English
  (code comments in Spanish, explaining the why).
- One folder per feature in `specs/`, one file per durable decision in `docs/adr/`.
- If a document and the code disagree, the code wins and the document is fixed.
