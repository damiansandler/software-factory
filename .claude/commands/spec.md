---
description: Understand what to build and write the feature spec (with a visual prototype if there are screens)
---
Talk to me in the owner language and at the owner profile (CLAUDE.md).

Read AGENTS.md, ARCHITECTURE.md, docs/business.md, docs/providers/ and the ADRs in docs/adr/.
If AGENTS.md still has _TODO_ sections that this feature needs (project, stack, commands),
fill them in with me first.

Create the feature folder `specs/NNN-short-name/`, where NNN is the next number after the
highest one in `specs/` (for example `003-export-to-csv`). Everything for this feature
lives there.

Interview me ONE question at a time, at the owner profile (CLAUDE.md), in this order:
1. The problem and who it is for (with concrete examples).
2. The flow, step by step.
3. The edge cases (an external service fails or is slow, a request or message arrives
   twice, the user abandons halfway, data changes between two steps).
4. Two or three solution directions with their trade-offs; I choose.
5. How we'll know it works.

If something depends on how an external provider behaves and it's not in docs/providers/,
tell me instead of assuming it.

If the feature has screens, before asking for my approval generate
`specs/NNN-short-name/prototype/index.html`: a single file, with fake data and no
backend, that shows every screen and every state (success, error, loading, empty) and lets
me click between them. Tell me how to open it in the browser and adjust it with my
comments until I like it.

Write `specs/NNN-short-name/spec.md`, in English, with: goal, flow, confirmed
screens (if any), business rules, edge cases, acceptance criteria (a numbered list of
verifiable things, written in product language: AC-01, AC-02…), out of scope and technical
notes. The IDs never change once approved; if a criterion is dropped, its ID is retired.

If a product or architecture decision I make here is durable (it will outlive this
feature: who pays, which provider, a limit, a security rule), propose an ADR for
docs/adr/ using docs/adr/template.md and link it from the spec.

If the requirements change after approval, edit the spec, show me what changed and wait for
a new approval.

Show me the spec and wait for my approval: "approved", or "aprobado" when the owner language
is Spanish. Nothing else counts as approval. Only then add the line "Status: approved" (always
in English) at the top of the spec. Don't build anything in this command.
