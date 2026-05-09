---
name: tdd
description: >
  Quality phase. Enforces a strict Red-Green-Refactor loop. Trigger: "/tdd",
  "build this using TDD", "write tests first".
---

# TDD Skill

Follow the Red-Green-Refactor methodology for every feature or bug fix.

## The Loop

1. **RED**: Write a failing test that defines the expected behavior.
2. **GREEN**: Write the minimum code necessary to make the test pass.
3. **REFACTOR**: Clean up the code while keeping the test green.

## Rules

- **Never** write implementation code without a failing test first.
- **One Test at a Time**: Focus on the smallest unit of behavior.
- **Verification**: Run the test suite after every step.

## Benefits

- 100% test coverage for new logic.
- Documented behavior through tests.
- Prevents regressions from the start.
