# AI Agents Starter Kit — Working Agreement

This repository is a **harness** (execution environment) for AI agents. It defines contracts, rules, and tools to ensure that AI operates safely, predictably, and idiomatically.

---

## 📂 Documentation Index (`/docs`)

Refer to these documents to understand the inner workings and future of this kit:

- **[README-en.md](./docs/README-en.md)**: English version and international SEO targets.
- **superpowers/**: Advanced "superpowers" architecture and automations.
    - **plans/**:
        - [2026-04-13-init-ai-scaffold.md](./docs/superpowers/plans/2026-04-13-init-ai-scaffold.md): Implementation plan for the automated scaffold.
    - **specs/**:
        - [2026-04-13-init-ai-scaffold-design.md](./docs/superpowers/specs/2026-04-13-init-ai-scaffold-design.md): Technical spec for the `init-ai` generator.

---

## 📜 Agent Contract (Best Practices)

When operating in this repository, you must follow this operational contract:

### 1. Intent and Planning
- **Plan Mode**: For any task involving more than one file or complex logic, you **must** start in `Plan Mode`.
- **Empirical Verification**: Before fixing a bug, you must reproduce it with a script or test that fails.

### 2. Style and Conventions
- **Stack**: Node.js (TypeScript) and Python.
- **Commits**: Use the `semantic-commit` skill. Format: `[type]: [desc] : mm/dd/yy - hh:mm`.
- **Language**: Documentation, commits, and comments in **American English (EN-US)**. Code and variables in **English**.

### 3. "Never" Rules (Hard Guardrails)
- **NEVER** commit `.env` files or secrets.
- **NEVER** run commands against production without explicit human approval.
- **NEVER** ignore linter or typecheck failures when finishing a task.

---

## 🛠️ Skills and Subagents

| Name | Type | Main Function |
|---|---|---|
| `semantic-commit` | Skill | Generates semantic commit messages with timestamp. |
| `code-review` | Skill | Quality, security, and performance checklist. |
| `debug-workflow` | Skill | Scientific methodology: Reproduce -> Isolate -> Fix. |
| `llm-wiki` | Skill | Knowledge base on tokens, RAG, and agents. |
| `task-router` | Agent | Routes complex tasks to the ideal model (Opus/Sonnet/Haiku). |

---

## 🦾 Supported Models

- **Claude Code**: Recommended for complex execution and refactoring.
- **Gemini CLI**: Ideal for long context analysis (logs, extensive docs).
- **Codex CLI**: Fast executions and boilerplate generation.

---

## 🔐 Security Checklist
- [ ] Environment variables isolated in `.env`.
- [ ] Staged files reviewed (`git status`).
- [ ] Dangerous `Bash` commands manually confirmed.

---

*For questions or expansion, use the `llm-wiki` skill or visit [lemon.dev](https://lemon.dev).*
