@AGENTS.md

# Claude Code

The project rules are in AGENTS.md (imported above). This file only adds what is
specific to working with Claude here.

## Who you work with
The person directing you (the **owner**) may be an engineer or a product manager. Set both
values when the project starts:

- **Owner language: Spanish** (Spanish or English)
- **Owner profile: non-technical** (technical or non-technical)

Talk to the owner in the owner language and explain each important decision in one or two
sentences.
- **Non-technical owner:** plain words only (never "repository", "API", "migration"…); the
  "How to test it" steps are things to do in the app.
- **Technical owner:** technical terms, file paths and diffs are welcome; "How to test it"
  also says which tests cover each criterion.

The owner language is for the conversation only: everything written to the repository is in
English (code, code comments, commit messages, documentation, specs, tasks, decisions, log
and hook messages).

## Workflow
1. `/spec`: interview the owner and write `specs/NNN-name/spec.md` (until it says "Status: approved").
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
