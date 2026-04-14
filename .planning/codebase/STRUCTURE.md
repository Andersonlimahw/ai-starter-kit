# Codebase Structure

**Analysis Date:** 2026-04-14

## Directory Layout

```
ai-agents-starter-kit/
├── scripts/                    # Executable scripts (scaffold generator + setup)
│   ├── init-ai.mjs             # Primary scaffold generator (Node.js ESM)
│   ├── setup.sh                # Install AI CLIs, create .env
│   ├── hook-before-edit.sh     # ESLint hook run before agent edits
│   ├── test_models.sh          # Smoke test installed CLIs
│   └── setup.py                # Python environment setup
├── templates/                  # Source files copied by init-ai into target projects
│   ├── CLAUDE.md               # Claude Code entry file template (has {{}} placeholders)
│   ├── AGENTS.md               # Main agent index template (has {{}} placeholders)
│   ├── .claude/                # Claude Code config templates
│   │   ├── settings.json       # Claude settings
│   │   ├── SKILLS.md           # Skills index
│   │   ├── skills/             # Skill definitions (one subdir per skill)
│   │   │   ├── semantic-commit/SKILL.md
│   │   │   ├── code-review/SKILL.md
│   │   │   ├── debug-workflow/SKILL.md
│   │   │   └── llm-wiki/SKILL.md
│   │   ├── agents/             # Subagent definitions
│   │   │   ├── task-router.md
│   │   │   ├── code-reviewer.md
│   │   │   └── debugger.md
│   │   └── hooks/
│   │       └── git-setup.sh    # Hook installed in target projects
│   ├── .codex/                 # Codex CLI config templates
│   │   ├── settings.json
│   │   ├── agents/task-router.md
│   │   └── commands/project-commit.md
│   ├── .gemini/                # Gemini CLI config templates
│   │   └── skills/llm-wiki/SKILL.md
│   └── .agent/                 # GitHub Copilot CLI config templates
│       ├── skills/semantic-commit/SKILL.md
│       └── subagents/task-router.md
├── examples/                   # Self-contained runnable agent demonstrations
│   ├── depurador-claude/       # Claude Code debugging agent example
│   │   ├── CLAUDE.md
│   │   ├── AGENTS.md
│   │   └── sample_bug.py
│   └── gerador-codex/          # Codex code-generation agent example
│       ├── AGENTS.md
│       ├── codex-agent.ts      # TypeScript orchestration example
│       ├── simple_agent.py     # Python orchestration example
│       └── projects.json
├── tests/
│   └── init-ai.test.mjs        # Node.js built-in test runner tests for init-ai
├── docs/
│   └── superpowers/            # Planning documents
│       ├── plans/
│       └── specs/
├── .github/
│   └── workflows/
│       └── tests.yml           # CI: Node.js 20/22 + Python 3.10/3.12 matrix
├── .planning/                  # GSD planning documents (not shipped)
│   └── codebase/
├── package.json                # Node.js manifest (devDependencies only)
├── pyproject.toml              # Python manifest (pytest/black/flake8 config)
├── AGENTS.md                   # Live agent docs for this repo (used when running AI in this repo)
├── .env.example                # Environment variable template
├── plan.md                     # Full implementation plan (project artifact)
└── plan.checklist.md           # Checklist tracking plan.md progress
```

## Directory Purposes

**`scripts/`:**
- Purpose: Executable tooling for this kit
- Key files:
  - `scripts/init-ai.mjs` — the scaffold generator; exports `replacePlaceholders`, `getTemplateFiles`, `writeFiles`, `detectCli`, `fetchExtraSkillsCatalog`
  - `scripts/setup.sh` — one-time setup for new kit users
  - `scripts/hook-before-edit.sh` — example hook that runs ESLint before AI agent edits

**`templates/`:**
- Purpose: All files that `init-ai.mjs` installs into target projects
- Templates use `{{PROJECT_NAME}}`, `{{PROJECT_DESCRIPTION}}`, `{{LANGUAGE}}`, `{{STACK}}` placeholders
- Directory structure mirrors what will be created in the target project
- File selections are gated by CLI choice: base files always included, `.claude/` always included, others optional

**`templates/.claude/skills/{skill-name}/SKILL.md`:**
- Purpose: Skill definition files with YAML frontmatter and Markdown instructions
- Required frontmatter: `name`, `description`
- Pattern: One directory per skill, single `SKILL.md` inside

**`templates/.claude/agents/{agent-name}.md`:**
- Purpose: Subagent definitions with YAML frontmatter
- Required frontmatter: `name`, `description`, `model`, `color`
- Pattern: Flat files in `agents/` directory

**`examples/`:**
- Purpose: Demonstration agents for each supported CLI
- Each subdirectory is an independent project with its own `AGENTS.md` and `CLAUDE.md`
- `examples/depurador-claude/` — Python-based debug scenario for Claude Code
- `examples/gerador-codex/` — TypeScript + Python orchestration demo for Codex CLI

**`tests/`:**
- Purpose: Automated tests for `scripts/init-ai.mjs`
- Uses Node.js built-in `node:test` runner (no external test framework)
- Single test file: `tests/init-ai.test.mjs`

**`.planning/codebase/`:**
- Purpose: GSD codebase analysis documents (this project's own use of AI planning)
- Not shipped to target projects via `init-ai`

## Key File Locations

**Entry Points:**
- `scripts/init-ai.mjs`: Scaffold generator main entry; `isMainModule()` guard at line 437
- `scripts/setup.sh`: One-time CLI installation script

**Configuration:**
- `package.json`: Node.js scripts, engines (`>=20`), devDependencies (`@inquirer/prompts`, `eslint`)
- `pyproject.toml`: Python project config, pytest settings (`testpaths = ["examples"]`), black/flake8 config
- `.env.example`: Template for required API keys

**Core Logic:**
- `scripts/init-ai.mjs`: All scaffold logic — `replacePlaceholders()`, `getTemplateFiles()`, `writeFiles()`, `detectCli()`, `fetchExtraSkillsCatalog()`

**Testing:**
- `tests/init-ai.test.mjs`: All unit tests for scaffold generator
- `.github/workflows/tests.yml`: CI definition

**Template Source of Truth:**
- `templates/AGENTS.md`: Master agent index template (placeholders + skill/agent table)
- `templates/CLAUDE.md`: Claude Code entry point template
- `templates/.claude/settings.json`: Claude settings installed in target projects

## Naming Conventions

**Files:**
- Scripts: `kebab-case.sh`, `kebab-case.mjs`, `kebab-case.py`
- Templates: `UPPER_CASE.md` for documentation files (`CLAUDE.md`, `AGENTS.md`, `SKILL.md`, `SKILLS.md`)
- Agent definitions: `kebab-case.md` in `agents/` dirs
- Test files: `{script-name}.test.mjs` co-located in `tests/`

**Directories:**
- Template CLI directories: dotfiles matching the CLI convention (`.claude/`, `.codex/`, `.gemini/`, `.agent/`)
- Skill directories: `kebab-case/` under `skills/`
- Example directories: `{purpose}-{cli}/` pattern (e.g., `depurador-claude/`, `gerador-codex/`)

**Variables/Functions:**
- Functions: `camelCase` (`replacePlaceholders`, `writeFiles`, `getTemplateFiles`)
- Constants: `SCREAMING_SNAKE_CASE` (`TEMPLATES_DIR`, `TARGET_DIR`, `BASE_FILES`, `CLAUDE_FILES`)
- Template placeholders: `{{SCREAMING_SNAKE_CASE}}` inside Markdown files

## Where to Add New Code

**New skill for Claude Code:**
- Template: `templates/.claude/skills/{skill-name}/SKILL.md`
- Register in: `CLAUDE_FILES` array in `scripts/init-ai.mjs` (lines 24-35)
- Update skills table in: `templates/AGENTS.md` and `templates/.claude/SKILLS.md`

**New agent for Claude Code:**
- Template: `templates/.claude/agents/{agent-name}.md`
- Register in: `CLAUDE_FILES` array in `scripts/init-ai.mjs`
- Update agents table in: `templates/AGENTS.md`

**New CLI support:**
- Add file list constant: e.g., `NEWCLI_FILES` in `scripts/init-ai.mjs` following the pattern of `CODEX_FILES`
- Add selection branch in: `getTemplateFiles()` function
- Add CLI detection in: `getDetectedClis()` function
- Add templates: create `templates/.newcli/` directory with appropriate structure
- Add prompt choice in: `checkbox` call inside `main()`
- Add CLI path in: `cliPaths` object inside `handleAddSkillMode()`

**New test:**
- File: `tests/init-ai.test.mjs`
- Import from: `../scripts/init-ai.mjs`
- Use `TMP_TEST_DIR` pattern for filesystem operations

**New example:**
- Directory: `examples/{purpose}-{cli}/`
- Must include: `AGENTS.md` with agent documentation
- Optionally: `CLAUDE.md` for Claude Code examples

**New setup script:**
- Location: `scripts/{purpose}.sh` or `scripts/{purpose}.py`
- Register in `package.json` scripts if it needs a `npm run` alias

## Special Directories

**`templates/`:**
- Purpose: Source of truth for all files installed by `init-ai`
- Generated: No (hand-authored)
- Committed: Yes

**`node_modules/`:**
- Purpose: npm dependencies (`@inquirer/prompts`, `eslint`)
- Generated: Yes (via `npm install`)
- Committed: No

**`.planning/`:**
- Purpose: GSD planning and analysis documents for this repo
- Generated: Yes (via GSD commands)
- Committed: Optional (project-specific decision)

**`.github/`:**
- Purpose: GitHub Actions CI workflows
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-04-14*
