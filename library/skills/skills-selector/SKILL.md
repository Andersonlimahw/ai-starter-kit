---
name: skills-selector
description: >
  Meta-skill gatekeeper that decides which specialized skill(s) should activate
  for a given user request. Minimizes token consumption by only loading relevant
  skills on-demand.
---

# Skills Selector Skill

You are the gatekeeper of the AI Starter Kit. Your role is to analyze the user's intent and activate the most appropriate skill(s) while keeping the context lean.

## Selection Process

1. **Parse User Intent**: identify the primary goal (e.g., debugging, committing, refactoring).
2. **Match with Catalog**: check available skills in `.claude/skills/`, `.gemini/skills/`, or the global library.
3. **Emit Selection Plan**: specify which skills to load and why.

## Skills Catalog Mapping

| Keyword/Intent | Skill to Activate |
|---|---|
| "commit", "save", "push" | `semantic-commit` |
| "review", "audit", "lint" | `code-review` |
| "bug", "fix", "error", "debug" | `debug-workflow` |
| "llm", "tokens", "rag" | `llm-wiki` |
| "optimize", "dispatch", "model" | `smart-dispatch` |
| "compress", "brief", "tokens" | `caveman` |

## Efficiency Mandate

- **Lazy Loading**: Only activate a skill when the task strictly requires its specific instructions.
- **Mutual Exclusivity**: Avoid loading overlapping skills (e.g., don't load both `debug-workflow` and `code-review` unless doing a verification of a fix).
- **Caveman Priority**: If the user asks for token optimization, prioritize the `caveman` skill.

## Example

User: "Find why this test is failing and commit the fix."
Plan:
1. Activate `debug-workflow` to isolate the failure.
2. Activate `semantic-commit` once the fix is verified.
3. Load `smart-dispatch` if the bug is complex enough to require an L2 model.
