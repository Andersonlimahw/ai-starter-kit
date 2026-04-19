# Design Spec: init-ai — AI Agent Scaffold Generator

**Date:** 2026-04-13  
**Status:** Approved

---

## Objective

Create a `scripts/init-ai.mjs` script that, when executed in any target repository, generates a complete AI agents infrastructure: configuration files (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`), CLI folder structure (`.claude/`, `.codex/`, `.gemini/`, `.agent/`), built-in generic skills, and subagents ready for customization.

The script is framework and technology agnostic — works in any project (Node, Python, Go, etc.).

---

## Scope

### Includes

- Interactive Node.js script (`init-ai.mjs`) with `@inquirer/prompts`
- `templates/` directory with all source files (Markdown + JSON)
- 4 built-in generic skills: `semantic-commit`, `code-review`, `debug-workflow`, `llm-wiki`
- 3 built-in subagents: `task-router`, `code-reviewer`, `debugger`
- Support for 4 CLIs: Claude Code (default), Codex, Gemini, Copilot
- Optional fetch of external skills (skills.sh / aitmpl.com) at the end
- Placeholder substitution with onboarding data

### Does not include

- CLI installation (responsibility of the existing `setup.sh`)
- Modification of the target repo's `package.json`
- Automatic commit of generated files
- Overwriting `.env`

---

## Architecture

### File structure in ai-starter-kit

```
ai-starter-kit/
├── scripts/
│   └── init-ai.mjs                  ← main script
├── templates/
│   ├── CLAUDE.md
│   ├── AGENTS.md
│   ├── GEMINI.md                    ← will be a symlink at the destination
│   ├── .claude/
│   │   ├── settings.json
│   │   ├── SKILLS.md
│   │   ├── skills/
│   │   │   ├── semantic-commit/SKILL.md
│   │   │   ├── code-review/SKILL.md
│   │   │   ├── debug-workflow/SKILL.md
│   │   │   └── llm-wiki/SKILL.md
│   │   ├── hooks/
│   │   │   └── git-setup.sh
│   │   └── agents/
│   │       ├── task-router.md
│   │       ├── code-reviewer.md
│   │       └── debugger.md
│   ├── .codex/
│   │   ├── settings.json
│   │   ├── commands/
│   │   │   └── project-commit.md
│   │   └── agents/
│   ├── .gemini/
│   │   └── skills/
│   └── .agent/
│       ├── skills/
│       └── subagents/
└── package.json                     ← adds @inquirer/prompts as devDep
```

### Files generated in the target repo

Copy of the templates above with replaced placeholders. Only the CLI folders selected by the dev are created.

---

## Script Flow

### Step 1 — Context Collection

Sequential questions with `@inquirer/prompts`:

| Field | Type | Placeholder in template |
|---|---|---|
| Project Name | `input` | `{{PROJECT_NAME}}` |
| Short description | `input` | `{{PROJECT_DESCRIPTION}}` |
| Main language | `select` | `{{LANGUAGE}}` |
| Stack/frameworks | `input` (optional) | `{{STACK}}` |
| File language | `select` (PT/EN) | `{{LOCALE}}` |

### Step 2 — CLI Selection

`checkbox` with automatic detection of installed CLIs. Claude Code pre-checked by default.

```
? Which AI CLIs do you use?
  ❯ ◉ Claude Code  [recommended]
    ◯ OpenAI Codex CLI
    ◯ Gemini CLI
    ◯ GitHub Copilot CLI
```

### Step 3 — Extra Skills (optional)

```
? Do you want to install additional skills from skills.sh/aitmpl.com?
  ❯ No, use only the default bundle
    Yes, show available catalog
```

If yes: fetch the catalog via HTTPS, display checkboxes, download selected files to `.claude/skills/`.

If offline: warning and continues with local bundle.

### Step 4 — Confirmation and writing

Summarizes files to be created, asks for confirmation. Options for conflicts:
- Skip existing (default)
- Overwrite everything
- Backup (`.bak`) and overwrite

---

## Templates — Content

### CLAUDE.md

```markdown
# {{PROJECT_NAME}} — Claude Code Entry

Rules and context centralized in AGENTS.md.

## Quick reminder
- Commits: use `cn "message"` (semantic-commit skill)
- Code review: use the `code-review` skill
- Debug: use the `debug-workflow` skill
- Stack: {{STACK}}
```

### AGENTS.md

Main document with sections:
- Project overview
- Available skills (table)
- Available subagents (table)
- References (llm-wiki, skills.sh, aitmpl.com)
- Placeholder for architecture rules

### Skill `llm-wiki`

Fundamental LLM Wiki (Karpathy) concepts built-in as system context. Does not fetch at runtime — the content is in the file. Includes links to:
- https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- https://skills.sh
- https://www.aitmpl.com/skills

---

## Built-in Skills

| Skill | Description | Trigger |
|---|---|---|
| `semantic-commit` | Semantic commit workflow with timestamp | "commit", "cn" |
| `code-review` | Generic code review checklist | "review", "review" |
| `debug-workflow` | Scientific debugging methodology | "debug", "bug" |
| `llm-wiki` | Fundamental LLM concepts as context | "llm", "model", "prompt" |

## Built-in Subagents

| Agent | Model | Function |
|---|---|---|
| `task-router` | sonnet | Routes subtasks to the correct model/specialist |
| `code-reviewer` | sonnet | Review focused on bugs and quality |
| `debugger` | opus | Scientific bug investigation |

---

## Security and Idempotency

- Conflict detection before writing with 3 resolution options
- Default: skip existing files (never destroys existing work)
- Running twice doesn't corrupt anything
- Network failure doesn't block — local bundle as fallback
- Never touches `.env`, target's `package.json`, or commits

---

## Dependencies added to ai-starter-kit

```json
{
  "devDependencies": {
    "@inquirer/prompts": "^7.0.0"
  },
  "scripts": {
    "init-ai": "node scripts/init-ai.mjs"
  }
}
```

---

## How to use (in target repo)

```bash
# Option 1: via npx (without cloning the starter kit)
npx --yes github:lemondev/ai-starter-kit/scripts/init-ai.mjs

# Option 2: local clone
git clone https://github.com/lemondev/ai-starter-kit.git
cd meu-projeto
node ../ai-starter-kit/scripts/init-ai.mjs

# Option 3: npm script (if the starter kit is a devDep)
npm run init-ai
```

---

## Out of scope (do not implement)

- CLI installation (already covered by `setup.sh`)
- Automatic CI/CD in the target repo
- Integration with MCP servers
- Template versioning
- Web UI for onboarding
