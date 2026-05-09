# AI Agents Starter Kit — Working Agreement

This repository is a **harness** (execution environment) for AI agents. It defines contracts, rules, and tools to ensure that AI operates safely, predictably, and idiomatically.

---

## 📂 Documentation Index (`/docs`)

Comprehensive guide to AI development workflows:

### 🚀 Getting Started
- **[README-en.md](./docs/README-en.md)**: Main entry point and feature overview.
- **[Marketplace Publishing](./docs/marketplace/PUBLISHING.md)**: How to share your skills and agents.

### 🧠 Superpowers & Automation
- **Advanced Architecture**:
    - [2026-04-13-init-ai-scaffold-design.md](./docs/superpowers/specs/2026-04-13-init-ai-scaffold-design.md): The core logic of the `init-ai` generator.
- **Implementation Plans**:
    - [2026-04-13-init-ai-scaffold.md](./docs/superpowers/plans/2026-04-13-init-ai-scaffold.md): Detailed task breakdown for scaffold development.

---

## 💰 Token Optimization & DX

Maximize performance while minimizing costs with these essential tools:

| Tool | Purpose | Source/Command |
|---|---|---|
| **RTK (Rust Token Killer)** | Proxy and filter shell output to save 60-90% tokens. | [github.com/rtk-ai/rtk](https://github.com/rtk-ai/rtk) |
| **Caveman Mode** | Ultra-terse communication mode for CLI agents. | `activate_skill caveman` |
| **Matt Pocock Skills** | Engineering discipline: Grill Me, TDD, PRDs, Issues. | [mattpocock/skills](https://github.com/mattpocock/skills) |
| **Karpathy Skills** | LLM fundamental concepts and best practices. | [andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) |

> **Pro Tip:** Configure `rtk` as a global proxy for your CLI to automatically optimize every interaction.

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
| `skills-selector` | Meta-Skill | Gatekeeper that activates only relevant skills to save context. |
| `smart-dispatch` | Skill | Routes tasks to the optimal model/provider (L1/L2/L3). |
| `semantic-commit` | Skill | Generates semantic commit messages with timestamp. |
| `code-review` | Skill | Quality, security, and performance checklist. |
| `debug-workflow` | Skill | Scientific methodology: Reproduce -> Isolate -> Fix. |
| `llm-wiki` | Skill | Knowledge base on tokens, RAG, and agents. |
| `grill-me` | Skill | Intensive interview to resolve design ambiguities. |
| `tdd` | Skill | Strict Red-Green-Refactor loop. |
| `diagnose` | Skill | Scientific debugging loop. |
| `to-prd` | Skill | Generate Product Requirements Document. |
| `to-issues` | Skill | Break PRD into vertical task slices. |
| `task-router` | Agent | Orchestrator for complex, multi-domain requests. |

---

## 🧠 Reasoning & Thinking Models

To get the most out of this kit, align your model selection with the task nature:

- **Thinking/Reasoning (L2/L3)**: Use **Gemini 2.0 Flash (Thinking Mode)** or **Claude 3.5 Sonnet** for complex debugging and architectural decisions. These models "think" before they act, reducing errors in complex logic.
- **Speed & Utility (L1)**: Use **GPT-4o-mini** or **Haiku** for boilerplate, small refactors, and unit tests.

### ⚙️ Ideal Setup Guide

#### **Beginner (The Explorer)**
- Focus on `depurador-claude` and `gerador-codex` examples.
- Use `skills-selector` to let the agent guide you.
- Always use `Plan Mode` to understand the agent's logic.

#### **Intermediate (The Implementer)**
- Customize `templates/` for your specific stack.
- Start using `smart-dispatch` to optimize costs.
- Integrate `rtk` to clean up your CLI history.

#### **Advanced (The Architect)**
- Build custom agents in `.claude/agents/` for specialized domains (e.g., Security Auditor, Performance Guru).
- Use `OpenCode` with local models (Ollama) for sensitive internal logic.
- Contribute new skills to the `library/skills/` folder.

---

## 🦾 Supported Models

- **Claude Code**: Recommended for complex execution and refactoring.
- **Gemini CLI**: Ideal for long context analysis (logs, extensive docs).
- **Codex CLI**: Fast executions and boilerplate generation.
- **OpenCode**: Multi-provider CLI for vendor independence and local models.

---

## 🔐 Security Checklist
- [ ] Environment variables isolated in `.env`.
- [ ] Staged files reviewed (`git status`).
- [ ] Dangerous `Bash` commands manually confirmed.

---

*For questions or expansion, use the `llm-wiki` skill or visit [lemon.dev](https://lemon.dev).*
