# Specs

One folder per feature: `specs/NNN-short-name/` (three digits, next free number).

| File | Written by | What it holds |
|---|---|---|
| `spec.md` | `/spec` | Goal, flow, screens, business rules, edge cases, acceptance criteria, out of scope. Starts with "Status: approved" once the owner approves it. |
| `prototype/index.html` | `/spec` | Clickable prototype with fake data, when the feature has screens. |
| `tasks.md` | `/build` | The build plan: small tasks with micro-plans, marked ✅ or ⚠️. |
| `decisions.md` | `/build`, `/debug` | One line per minor ruling: "Ruling: what — why — cost if wrong". |
