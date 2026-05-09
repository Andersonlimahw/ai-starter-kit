---
name: to-issues
description: >
  Execution planning phase. Breaks a PRD or complex plan into "vertical slices"
  (tasks). Trigger: "/to-issues", "create issues", "break this down into tasks".
---

# To Issues Skill

Break a feature into small, independently shippable tasks that cut through the whole stack.

## The Strategy: Vertical Slicing

- **Avoid Layer Slicing**: Don't create an issue for "Database", then "API", then "UI".
- **Prefer Feature Slicing**: Create an issue for "User can see list", then "User can delete item".
- **Self-Contained**: Each issue should be a "tracer bullet" that delivers measurable value.

## Output

For each issue:
- **Title**: Action-oriented (e.g., "Implement JWT validation")
- **Description**: What needs to be done and how to verify it.
- **Dependencies**: Which issues must be done first.

## Rules

- No issue should take more than 1-2 hours for an agent to complete.
- Ensure each task has a clear "Definition of Done".
