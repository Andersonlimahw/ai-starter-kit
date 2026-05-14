---
name: skills-selector
description: >
  Multi-skill workflow composer. Activates ONLY for tasks that require
  combining multiple skills in sequence or resolving skill conflicts.
  Single-skill tasks: return [] — individual skills self-trigger via their own descriptions.
---

# Skills Selector — Workflow Composer

**Scope**: Compose multi-skill workflows. NOT a replacement for individual skill auto-triggers.

## When to Return `[]` (most common — correct behavior)

Return `[]` when:
- Task maps cleanly to ONE skill (user can trigger it directly)
- Conceptual question / explanation (base Claude suffices)
- Exploration / Q&A without action
- `smart-dispatch` alone handles it

Single-skill requests where individual auto-trigger is correct:
| User intent | Self-triggers |
|---|---|
| "commit", "cn", "save" | `semantic-commit` / `git-commit` |
| "review code", "audit" | `code-review` / `caveman-review` |
| "debug", "bug", "fix error" | `debug-workflow` / `diagnose` |
| "build UI", "design component" | `frontend-design` / `ui-ux-pro-max` |
| "write post", "copy", "blog" | `copywriting` / `lemon-blog-post` |
| "create PR" | `git-pr-create` |
| "write tests" | `tdd` |
| "build MCP tool" | `mcp-builder` |
| "create agent" | `Agent Development` |

## When to Activate (emit a plan)

Activate ONLY when the task is explicitly multi-phase or combines domains:

### Multi-Skill Workflow Patterns

| Pattern | Phase 1 | Phase 2 | Phase 3 |
|---|---|---|---|
| "find bug and commit the fix" | `debug-workflow` | `semantic-commit` | — |
| "fix bug and open PR" | `debug-workflow` | `git-pr-create` | — |
| "review and create PR" | `code-review` | `git-pr-create` | — |
| "implement feature and write tests" | `smart-dispatch` | `tdd` | — |
| "implement feature, test, and commit" | `smart-dispatch` | `tdd` | `semantic-commit` |
| "design UI and implement" | `frontend-design` | `smart-dispatch` | — |
| "build MCP and write docs" | `mcp-builder` | `copywriting` | — |
| "write post and publish" | `lemon-blog-post` | (publish flow) | — |
| "triage issues and plan" | `triage` | `to-prd` | — |
| "refactor and review" | `smart-dispatch` | `code-review` | — |
| "audit architecture and improve" | `improve-codebase-architecture` | `smart-dispatch` | — |
| "create changelog and PR" | `git-changelog` | `git-pr-create` | — |
| "diagnose perf and fix" | `diagnose` | `smart-dispatch` | — |
| "write skill and test" | `write-a-skill` | manual test | — |
| "prototype then build" | `prototype` | `smart-dispatch` | — |
| "spec then implement" | `to-prd` | `smart-dispatch` | — |
| "debug mobile release cert" | `mobile-fix-release-certificates` | `debug-workflow` | — |
| "create social + blog for feature" | `social-content` | `lemon-blog-post` | — |

## Conflict Rules (mutual exclusivity)

- Do NOT load `debug-workflow` + `code-review` simultaneously — pick one; load second after first completes.
- Do NOT load `frontend-design` + `ui-ux-pro-max` together — `ui-ux-pro-max` supersedes.
- Do NOT load `diagnose` + `debug-workflow` together — `diagnose` is for hard/perf bugs; `debug-workflow` for standard bugs.
- `smart-dispatch` is always available as base layer; do not count it as a "skill slot."

## Output Format

```
SKILLS PLAN:
Phase 1: <skill-name> — <why>
Phase 2: <skill-name> — <trigger condition>
Phase 3: (optional)

CONFLICT CHECK: <none | resolved: X supersedes Y>
```

If no multi-skill workflow detected:
```
SKILLS PLAN: []
Reason: single-skill task — <skill-name> self-triggers.
```
