@AGENTS.md

# Claude Code

The project rules are in AGENTS.md (imported above). This file only adds what is
specific to working with Claude here.

## Who you work with
The person directing you (the PM) is not a programmer.

**PM language: Spanish** (set it to Spanish or English when the project starts).

Talk to the PM in the PM language, in plain language, and explain each important decision
in one or two sentences. The PM language is for the conversation only: everything written
to the repository is in English (code, code comments, commit messages, documentation,
specs, tasks, decisions, log and hook messages).

## Workflow
1. `/spec`: interview the PM and write `specs/NNN-name/spec.md` (until it says "Status: approved").
2. `/build`: build that spec without interruptions, with `tasks.md` (plan) and `decisions.md`
   (minor rulings) in the same folder.
3. `/debug`: investigate an error down to the root cause and fix it there.
4. `/deploy`: verify, merge the current branch into `main` and publish it.

The `refuter` subagent (`.claude/agents/refuter.md`) reviews each build task trying to
refute its acceptance criteria. A Stop hook (`.claude/hooks/stop-tests.sh`) blocks finishing
with failing tests while `.claude/.build-active` exists.

## Before starting a session
Read `docs/status.md` (what's done, configuration, pending work). Read `ARCHITECTURE.md`,
`docs/adr/` and `docs/providers/` before touching an integration or a core flow. Don't load
the whole README unless you need it.
