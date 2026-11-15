---
description: Investigate an error down to the root cause and fix it there
---
Talk to me in the PM language (CLAUDE.md), in plain language.

I'll give you a symptom (an error, a stack trace, a failing test, a screenshot or something
that doesn't behave the way its spec in specs/ says). Follow this order:

1. Gather evidence first: the exact error, the logs, the state of the data involved.
   Also read docs/providers/ if an external service is involved, and docs/runbooks/ in
   case the symptom is already known.
2. Reproduce it. If you can't reproduce it, tell me so: that's already a finding.
3. Isolate a minimal failing case.
4. Name the cause in one sentence, with file:line evidence. Distinguish where
   the error SHOWS UP from where it ORIGINATES (the symptom may be on a screen and the
   cause on the server, or in how a provider responded). If your explanation contains
   "probably" or "somehow", keep isolating.
5. First write a test that fails because of that cause, then fix the cause.
   The regression test is criterion 1 of every fix.
6. Blast radius: look for the same pattern elsewhere before calling the fix
   done, and run all the tests.
7. If you learned something about a provider or a recurring failure, write it down in
   docs/providers/ or docs/runbooks/.

Never patch the symptom: don't raise timeouts, don't add retries to hide a
failure, don't loosen asserts and don't swallow errors with empty try/catch.

If after two full passes you can't find the cause, don't make one up: give me
a "stuck" report with what you reproduced, what you ruled out, your best
hypothesis and what evidence is missing. That is worth more than a speculative fix.
