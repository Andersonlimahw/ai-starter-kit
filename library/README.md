# AI Starter Kit Library

This folder contains reusable skills and components that can be shared across different projects.

## 🛠️ Available Skills

| Skill | Description |
|---|---|
| **[smart-dispatch](./skills/smart-dispatch/SKILL.md)** | Advanced model routing logic based on complexity and cost. |
| **[skills-selector](./skills/skills-selector/SKILL.md)** | Meta-skill for efficient context management. |
| **[jest-pro](./skills/jest-pro/SKILL.md)** | Expert-level Jest testing guidance. |

## 🚀 How to Use

To add a skill to your project:

1. Copy the desired skill folder to your `.claude/skills/` or `.gemini/skills/` directory.
2. Update your `AGENTS.md` or `CLAUDE.md` to reference the new skill.
3. (Optional) Use `scripts/init-ai.mjs --add-skill` to interactively install community skills.

## 🤝 Contributing

We welcome new skills! Please follow the `SKILL.md` template and include clear triggers and instructions.
