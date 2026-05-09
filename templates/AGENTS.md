# {{PROJECT_NAME}} — AI Agents Index

{{PROJECT_DESCRIPTION}}

## Stack
**Language:** {{LANGUAGE}} | **Frameworks:** {{STACK}}

---

## 💰 Token Optimization & DX

Maximize performance while minimizing costs:

| Tool | Purpose | Source/Command |
|---|---|---|
| **RTK (Rust Token Killer)** | Proxy and filter shell output to save 60-90% tokens. | [github.com/rtk-ai/rtk](https://github.com/rtk-ai/rtk) |
| **Caveman Mode** | Ultra-terse communication mode for CLI agents. | `activate_skill caveman` |
| **Matt Pocock Skills** | Engineering discipline: Grill Me, TDD, PRDs, Issues. | [mattpocock/skills](https://github.com/mattpocock/skills) |
| **Karpathy Skills** | LLM fundamental concepts and best practices. | [Karpathy Gist](https://github.com/forrestchang/andrej-karpathy-skills) |

---

## 🛠️ Available Skills

| Skill | Description | Trigger |
|---|---|---|
| `skills-selector` | Meta-skill to activate relevant skills only | "plan", "how to", "help" |
| `smart-dispatch` | Routes tasks to L1/L2/L3 models | "implement", "fix", "create" |
| `semantic-commit` | Semantic commit workflow with timestamp | "commit", "cn", "do commit" |
| `code-review` | Generic code review checklist | "review", "audit", "verify code" |
| `debug-workflow` | Scientific debugging methodology | "debug", "bug", "investigate" |
| `llm-wiki` | Fundamental LLM concepts as context | "llm", "model", "token" |
| `grill-me` | Intensive interview to resolve design ambiguities | "/grill-me", "grill" |
| `tdd` | Strict Red-Green-Refactor loop | "/tdd", "test first" |
| `diagnose` | Scientific debugging loop | "/diagnose", "debug" |
| `to-prd` | Generate Product Requirements Document | "/to-prd", "prd" |
| `to-issues` | Break PRD into vertical task slices | "/to-issues", "tasks" |

## 🦾 Available Subagents

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
