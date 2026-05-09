---
name: to-prd
description: >
  Documentation phase. Synthesizes the current conversation into a formal
  Product Requirements Document (PRD). Trigger: "/to-prd", "create PRD",
  "write a PRD for this".
---

# To PRD Skill

Convert the current context and agreed-upon decisions into a structured PRD.

## PRD Structure

1. **Summary**: One-paragraph overview of the goal.
2. **Problem Statement**: Why are we doing this?
3. **Goals**: What does success look like?
4. **Out of Scope**: What are we NOT doing?
5. **Technical Design**: High-level architectural decisions.
6. **User Stories / Requirements**: Concrete functional requirements.

## Rules

- Use the exact terminology agreed upon during the "Grill" phase.
- File the PRD in the `docs/` folder or as a GitHub issue.
- Keep it technical and concise.
