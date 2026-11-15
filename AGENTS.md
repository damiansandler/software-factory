# AGENTS.md — <project name>

Instructions for any coding agent working in this repository. Humans: start with
[README.md](README.md).

> **Template.** Sections marked _TODO_ are filled in when the project starts (the first
> `/spec` is a good moment). Everything else is the Factory's way of working and applies as is.

## Project in one paragraph
_TODO: what the product is, who it is for, what environment it runs in (sandbox / test data
only, or real). Link ARCHITECTURE.md for how it works and docs/adr/ for why._

## Where things are
| What | Where |
|---|---|
| How the system works (main flows, data, integrations) | `ARCHITECTURE.md` |
| Durable product and architecture decisions | `docs/adr/` |
| Product, actors, business rules, glossary | `docs/business.md` |
| What's done, configuration, pending work | `docs/status.md` |
| One file per external provider or service | `docs/providers/` |
| What to do when something breaks | `docs/runbooks/` |
| Feature specs, build plans and build decisions | `specs/NNN-name/` (`spec.md`, `tasks.md`, `decisions.md`) |

## Stack
_TODO: languages, frameworks, database, test runner, and where code lives._

## Commands
_TODO: fill in the real commands._
- Start locally: `…`
- Tests: `…` · Lint: `…` · Build: `…`
- **Check** (everything that must pass before calling something done): `…`
- The test command used by the Stop hook goes, alone, in `.claude/test-command`.

## Publishing
_TODO: used by `/deploy`._
- **Where and how:** host, and what triggers a publish (for example, every push to `main`).
- **Online check:** the URLs (and expected status codes) that prove the new version is up,
  and how long a publish usually takes.
- **Secret variables:** the names of the environment variables whose values must never
  appear in a commit (the values live only in the local env file and in the host).
- **Where to look when it fails:** the host's logs screen.

## Hard rules
- **Test environments only** until the PM says otherwise. Never use real credentials or
  real personal data. Never read the env files that hold values (`.env`, `.env.local`…; the
  permission settings block them). Document every variable, without values, in `.env.example`.
- **Secrets** only through environment variables. Never in code, tests, logs or commits.
- **Contracts first:** if the project has an API or data contract, update it before
  implementing against it.
- **External services** are called through a single wrapper per provider with timeout,
  retries and logging (without secrets or personal data).
- **States:** every multi-step operation has an explicit state and valid transitions; a
  failed step can be retried without repeating the previous ones.
- **Never hide a failure:** no empty try/catch, no raised timeouts or retries to make an
  error go away. Find the cause (`/debug`).

## Tests
- Test first: every testable acceptance criterion has a test that fails before the code exists.
- Tests don't depend on external services: they are simulated with fixtures. Live checks
  against a real sandbox are kept apart and run only on demand.
- Async tests poll until the condition holds; never a single read or a fixed wait.
- Tests never touch the development data.
- Never weaken, skip or delete a test to make it pass.

## Domain rules
_TODO: add the rules of this product as they appear (limits, permissions, invariants).
One short paragraph per area._

## Known pitfalls
_TODO: add each surprise that cost time (a library quirk, a provider behaviour), with the fix._

## Known gaps with these rules
_TODO: rules not met yet, so they aren't flagged as new failures. Remove each one when it's fixed._

## Conventions
- Documentation in English. Code comments in Spanish, explaining the why, not the what.
- If a document and the code disagree, the code wins: fix the document.
- Git: work on a `build/<name>` branch; don't merge into `main` unless asked (`/deploy` does
  it). Conventional Commits (`feat:`, `fix:`, `docs:`…), one per logical step, with the test
  and its code together. Never force push.
