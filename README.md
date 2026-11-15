# softwarefactory

A way of working with coding agents (Claude Code) in which a PM who doesn't program directs
the work. Agents interview, write the spec, build with tests first, attack their own work,
debug to the root cause and publish. The person decides what to build and whether it's right.

It holds no product, no stack and no provider: each project fills those in.

## Why it exists
- **Ideas get lost before they're built.** They live in chats and in someone's head, never
  written down well enough to build from.
- **Agents moved the bottleneck.** Writing code, tests and docs is no longer the slow part.
  The hard parts are deciding *what* to build and proving it works.
- **So people decide and check, and agents do the writing.** Every idea is written down once,
  with acceptance criteria, and those same criteria carry it all the way to production.

## The loop at a glance
Agents work between the gates. A person decides at each gate.

```mermaid
flowchart LR
    subgraph PLAN
        spec["/spec<br/>interview + prototype<br/>→ spec.md"]
        g1{{"Gate 1 · PM<br/>says 'approved'"}}
    end
    subgraph BUILD
        build["/build<br/>plan, failing tests,<br/>code, refuter"]
        g2{{"Gate 2 · PM<br/>tries 'How to test it'"}}
    end
    subgraph SHIP
        g3{{"Gate 3 · PM<br/>asks for /deploy"}}
        deploy["/deploy<br/>check, secret scan,<br/>merge, online check"]
    end
    spec --> g1 --> build --> g2 --> g3 --> deploy
    debug["/debug · the fire alarm<br/>root cause + regression test"]
    debug -.-> build

    classDef agent fill:#5ec4a0,stroke:#2f8f6c,color:#0b2a20
    classDef gate fill:#1f2a5c,stroke:#1f2a5c,color:#ffffff
    class spec,build,deploy,debug agent
    class g1,g2,g3 gate
```

Green: agents do the work. Dark blue: a person decides. `/debug` can be called from
anywhere; its fix goes back through the build with a regression test.

| Gate | Who | What passes it |
|---|---|---|
| 1 · Spec | PM | Says "approved" on `spec.md`. No agent builds from a spec without it. |
| 2 · Try it | PM | Follows the "How to test it" steps `/build` hands over, one per acceptance criterion. |
| 3 · Publish | PM | Asks for `/deploy`. Nothing reaches `main` or production otherwise. |

## Who does what
| | Does | Never does |
|---|---|---|
| **PM** | Brings problems, picks between options, approves specs, tries the result, decides when to publish. Talks in plain language, in Spanish or English. | Needs to know what a repo, an API or a migration is. |
| **Agents** | Write the spec, the prototype, the plan, the tests, the code and the docs. Verify every criterion and attack their own work before showing it. Log every judgment call. | Build an unapproved spec, merge into `main` or publish on their own, set priorities, or hide a failure. |

## One contract, end to end
The acceptance criteria written in `/spec` are never rewritten along the way:

1. `/spec` writes them in product language and the PM approves them.
2. `/build` turns each one into a test that fails first, then writes the code that makes it pass.
3. The `refuter` sub-agent tries to prove each one is NOT met.
4. The PM tries the same list in "How to test it".
5. When something breaks later, `/debug` adds a regression test so it can't come back.

No translation between steps means nothing drifts.

## `/spec` in practice
A conversation, not a form: one question at a time, and the PM never hears a technical word.
An illustrative example:

> **PM:** /spec I want customers to be able to download their orders.
>
> **Agent:** Before anything else, the problem: who needs the download, and what do they do
> with it afterwards?
>
> **PM:** Our accountant. She copies everything into a spreadsheet every month.
>
> **Agent:** Then the goal is to save her that copying. Three ways: (a) a spreadsheet file with
> the month's orders, (b) an automatic email on the 1st of every month, (c) a direct
> connection to her accounting software. (a) is the fastest to have; (c) saves her the most
> work but depends on which software she uses. Which one is closest?
>
> **PM:** (a).
>
> **Agent:** Two edge cases, then I'll draft the spec: orders that were refunded, do they go
> in the file? And if a month has thousands of orders, is it fine for the download to take a
> few seconds?

A few minutes later: `specs/004-download-orders/spec.md` with the problem, the flow, the
rules, the edge cases and the acceptance criteria, plus a clickable prototype, waiting for
"approved".

## `/debug`: the fire alarm
Anything breaks, anywhere: give it the symptom (an error, a screenshot, "it does X instead of Y").

1. **Reproduce:** make it fail on demand. Not being able to is already a finding.
2. **Isolate:** shrink it to the smallest failing case, ideally a failing test.
3. **Name the cause:** one sentence, with the exact line as evidence, even when the cause is in
   a different part of the system than the symptom.
4. **Fix and guard:** fix the cause, add a regression test, and look for the same bug elsewhere.

What it refuses to do: patch the symptom (longer timeouts, more retries, looser checks), guess,
or fix one place when the same bug lives in several.

## The principles underneath
- **People own the gates.** Every consequential decision (approve, accept, publish) is a person's.
- **Verification is adversarial.** Work is attacked before it's trusted: first by the
  `refuter`, then by the PM trying it.
- **Tests before code.** Every criterion becomes a failing test first. A green suite that
  didn't grow with new behavior is a warning, not a pass.
- **Judgment calls never stall a build.** Minor ones are decided and logged in `decisions.md`;
  the build only stops for irreversible actions, security-sensitive changes, anything beyond
  its branch, or a broken spec.
- **Traceable end to end.** One folder per feature (`specs/NNN-name/`) holds the spec, the
  prototype, the plan and the decisions; the branch and the commits carry the same name.
- **The repository is the source of truth.** If a document and the code disagree, the code
  wins and the document is fixed.
- **The process is versioned.** Improving the way of working is a change to this repository,
  not a message someone has to remember.

## What's inside
| Piece | File | What it does |
|---|---|---|
| Rules for the agent | `CLAUDE.md`, `AGENTS.md` | How to talk to the PM (in the PM language, plain words), the workflow, the hard rules. `AGENTS.md` is a template with _TODO_ sections for the project. |
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
2. Set the **PM language** in `CLAUDE.md` (Spanish or English).
3. Open Claude Code there and run `/spec` with the first feature. It fills in the _TODO_
   sections of `AGENTS.md` (project, stack, commands) with you as part of the interview.
4. Put the project's test command in `.claude/test-command` (the first `/build` does it if
   you don't), and add the stack's ignores to `.gitignore`.
5. Before the first `/deploy`, fill in **Publishing** in `AGENTS.md`: host, online check and
   the names of the secret variables.

## Conventions
- The agent talks to the PM in the **PM language** set in `CLAUDE.md` (Spanish or English).
- Everything written to the repository is in English: code, code comments, commits,
  documentation, specs.
- One folder per feature in `specs/`, one file per durable decision in `docs/adr/`.
