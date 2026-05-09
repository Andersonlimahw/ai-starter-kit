# Distributing as a Marketplace Plugin 🚀

This guide explains how to package and distribute your AI Starter Kit configurations, skills, and agents as a plugin on various AI marketplaces (e.g., `skills.sh`, `aitmpl.com`, or official platform registries).

---

## 1. Unified Plugin Structure

Marketplaces expect a standardized folder structure. The AI Starter Kit is already pre-configured for this:

- **`.claude/`**: Specific to Claude Code.
  - `skills/`: Individual folders with `SKILL.md`.
  - `agents/`: Custom subagent definitions.
- **`.gemini/`**: Specific to Gemini CLI.
  - `skills/`: Gemini-compatible skill files.
- **`.codex/`**: Specific to Codex CLI.
  - `commands/`: Custom command definitions.
- **`library/skills/`**: Source folder for cross-platform skills.

---

## 2. Required Metadata (Frontmatter)

To be discoverable, every agent and skill **must** have a YAML frontmatter header.

### For Skills (`SKILL.md`):
```markdown
---
name: your-skill-name
description: A short, clear description of what the skill does.
trigger: ["/command", "keyword1", "keyword2"]
---
```

### For Agents (`agent-name.md`):
```markdown
---
name: architect-pro
description: Expert system architect for React/Node.js.
model: sonnet
tools: ["read_file", "grep_search", "run_shell_command"]
---
```

---

## 3. Marketplace Specifics

### **Skills.sh**
1. Host your project on GitHub.
2. Ensure your `SKILL.md` files follow the standard format.
3. Submit your repository URL to [skills.sh/submit](https://skills.sh).
4. The marketplace will index your skills and make them installable via `npx skills add your-repo`.

### **Claude Code Marketplace (Coming Soon)**
1. Ensure your `.claude/` folder contains high-quality `agents/` and `skills/`.
2. Follow naming conventions: `[namespace]/[name]` (e.g., `lemondev/smart-dispatch`).
3. Keep individual skill files under 100 lines of prose to save context.

### **Gemini Extension Hub**
1. Package your `.gemini/` folder as a standard extension.
2. Focus on utilizing Gemini's long-context window (e.g., architecture auditing).

---

## 4. One-Click Installation (The Scaffold Way)

The most effective way to distribute your "plugin" today is via the `init-ai` scaffold. Users can pull your configuration into any repo:

```bash
# Users can run this in their project root:
npx --yes github:your-username/your-starter-kit-fork/scripts/init-ai.mjs
```

---

## 5. Distribution Checklist

- [ ] **Anonymize**: Ensure no `.env` or hardcoded keys are present in templates.
- [ ] **Surgical Edits**: Ensure skills use `replace` or `write_file` surgically to avoid breaking user code.
- [ ] **Validation**: Run `npm test` to ensure your scaffold logic is sound.
- [ ] **README**: Include a "How to Install" section in your repository's root.

---

## 🤝 Community & Support

- Submit your best agents to [aitmpl.com](https://aitmpl.com).
- Join the discussion at [lemon.dev](https://lemon.dev).
