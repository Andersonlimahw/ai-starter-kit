# {{PROJECT_NAME}} — AI Agents Index

{{PROJECT_DESCRIPTION}}

## Stack
**Language:** {{LANGUAGE}} | **Frameworks:** {{STACK}}

---

## Available Skills

| Skill | Description | Trigger |
|---|---|---|
| `semantic-commit` | Semantic commit workflow with timestamp | "commit", "cn", "do commit" |
| `code-review` | Generic code review checklist | "review", "review", "verify code" |
| `debug-workflow` | Scientific debugging methodology | "debug", "bug", "error", "investigate" |
| `llm-wiki` | Fundamental LLM concepts as context | "llm", "model", "prompt", "token" |

## Available Subagents

| Agent | Model | Function |
|---|---|---|
| `task-router` | sonnet | Routes subtasks to the correct model/specialist |
| `code-reviewer` | sonnet | Review focused on bugs and quality |
| `debugger` | opus | Scientific bug investigation |

---

## Project architecture

> Add your project-specific architecture rules here.
> Example: layer patterns, naming conventions, constraints.

---

## References

- LLM Wiki (Karpathy): https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- External skills: https://skills.sh
- AI Templates: https://www.aitmpl.com/skills
