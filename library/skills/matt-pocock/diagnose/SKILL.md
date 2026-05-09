---
name: diagnose
description: >
  Debugging phase. Guided loop for hard bugs: reproduce, minimize, hypothesize,
  instrument, fix. Trigger: "/diagnose", "diagnose this bug", "debug this".
---

# Diagnose Skill

Apply the scientific method to squash complex bugs.

## The Guided Loop

1. **Reproduce**: Create a minimal script or test that fails 100% of the time.
2. **Minimize**: Strip away unrelated code until only the bug remains.
3. **Hypothesize**: Formulate a theory on *why* it's happening.
4. **Instrument**: Add logs or debugger breakpoints to prove the hypothesis.
5. **Fix**: Apply the surgical fix and verify with the reproduction script.

## Rules

- Do not guess. Prove the root cause before fixing.
- Document the findings in a `DEBUG.md` or as a comment.
- Ensure the fix doesn't break existing tests.
