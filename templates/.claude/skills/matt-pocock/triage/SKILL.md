---
name: triage
description: >
  Maintenance phase. Organizes messy issues into actionable tasks using a
  state machine. Trigger: "/triage", "triage these issues", "organize the backlog".
---

# Triage Skill

Clean up and prioritize the issue backlog to make it ready for execution.

## The State Machine

For each issue, assign a status:
- **ICEBOX**: Not doing now.
- **NEEDS_INFO**: Question for the user.
- **READY**: Clear PRD and vertical slices exists.
- **BLOCKED**: Waiting for another task.

## Rules

- Review labels and descriptions for clarity.
- Ensure each issue has a concrete "Definition of Done".
- Prioritize based on project goals and technical dependencies.
