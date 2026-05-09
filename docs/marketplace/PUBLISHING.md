# Publishing AI Starter Kit as Marketplace Plugin

Guide to share skills and agents on `skills.sh`, `aitmpl.com`, and platform registries.

## 1. Structure Requirements

Platforms look for specific folders. Keep structure standard:

### Claude Code (`.claude/`)
- `skills/`: Individual folders with `SKILL.md`.
- `agents/`: Markdown files with YAML frontmatter.
- `hooks/`: Bash scripts for lifecycle events.

### Gemini CLI (`.gemini/`)
- `skills/`: `SKILL.md` files.
- `gemini.md`: Global instructions.

### Codex CLI (`.codex/`)
- `commands/`: Custom command definitions.
- `agents/`: Agent logic.

## 2. Agent Metadata (Frontmatter)

Crucial for discovery. Each agent file must have:

```markdown
---
name: your-agent-name
description: Use when [conditions]. Examples: <example>...
model: inherit
color: blue
tools: ["Read", "Write", "Grep"]
---
```

## 3. Skill Definition (`SKILL.md`)

Standard format for all platforms:

```markdown
---
name: skill-name
description: Purpose of skill.
trigger: "keywords", "/command"
---

# Instructions
Tightly scoped technical guidance.
```

## 4. Multi-Model Portability

Starter Kit uses `AGENTS.md` as "Governance Contract". 
Ensure your plugin includes `AGENTS.md` at root to sync behavior across CLIs.

## 5. Publishing Steps

### Step 1: Validation
Run `scripts/init-ai.mjs` in a clean repo to verify template integrity.

### Step 2: GitHub Repository
1. Create new repo (e.g., `ai-plugin-my-awesome-tools`).
2. Copy `templates/` content to root.
3. Add `README.md` explaining installation via `init-ai`.

### Step 3: Register on Marketplaces

#### Skills.sh
- Submit GitHub URL.
- Ensure `SKILL.md` has clear triggers.

#### Aitmpl.com
- Add `aitmpl.json` (optional but recommended for metadata).
- Submit URL.

#### Claude Marketplace (Coming Soon)
- Follow standard `.claude/agents/` structure.
- Verify identifier regex: `^[a-z0-9-]{3,50}$`.

## 6. Distribution Script (`init-ai.mjs`)

Users can install your plugin via:
```bash
npx --yes github:your-username/your-plugin-repo/scripts/init-ai.mjs
```

## 7. Checklist
- [ ] Unique agent names (namespaced).
- [ ] 2-4 examples per agent description.
- [ ] No hardcoded secrets.
- [ ] `AGENTS.md` included.
- [ ] License (MIT recommended).
