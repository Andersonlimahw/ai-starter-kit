# Architecture

**Analysis Date:** 2026-04-14

## Pattern Overview

**Overall:** Scaffold Generator + Template Distribution Kit

This is not a traditional application with runtime layers. It is a developer tool with two distinct runtime modes:

1. **Scaffold Generator** (`scripts/init-ai.mjs`): Interactive CLI that copies template files into any target project.
2. **Template Library** (`templates/`): Static files representing the AI agent infrastructure that gets installed.

**Key Characteristics:**
- The codebase generates configuration for other projects, not for its own runtime operation
- Templates contain `{{PLACEHOLDER}}` tokens substituted at install time with project-specific values
- Multi-CLI support (Claude Code, Codex, Gemini, Copilot) is handled by conditional file selection, not runtime branching
- Examples (`examples/`) are self-contained demonstrators, not shared runtime code

## Layers

**CLI Entry Point:**
- Purpose: Interactive scaffolding session with the developer
- Location: `scripts/init-ai.mjs`
- Contains: `main()` function, `handleAddSkillMode()`, prompting via `@inquirer/prompts`
- Depends on: template files under `templates/`, `@inquirer/prompts`, `node:fs`, `node:path`
- Used by: developers running `npm run init-ai` or `node scripts/init-ai.mjs`

**Core Logic (exported pure functions):**
- Purpose: Reusable, testable operations for file selection, placeholder substitution, and writing
- Location: `scripts/init-ai.mjs` (exported functions)
- Contains:
  - `getTemplateFiles(clis)` — builds the list of files to install based on selected CLIs
  - `replacePlaceholders(content, vars)` — substitutes `{{KEY}}` tokens in file content
  - `writeFiles(files, vars, conflictStrategy, targetDir)` — writes or skips files with backup support
  - `detectCli(name)` — checks if a CLI binary is available on the system
  - `fetchExtraSkillsCatalog()` — fetches optional remote skill catalog from `https://skills.sh/api/catalog`
- Depends on: `node:fs`, `node:path`, `node:child_process`
- Used by: `main()` function and `tests/init-ai.test.mjs`

**Template Library:**
- Purpose: Source files copied into target projects
- Location: `templates/`
- Contains: Markdown agent definitions, JSON settings, shell hooks, symlink targets
- Depends on: nothing at runtime (static files)
- Used by: `writeFiles()` reads from this directory via `TEMPLATES_DIR` constant

**Setup Scripts (operational):**
- Purpose: Install AI CLIs and configure environment for kit users
- Location: `scripts/setup.sh`, `scripts/test_models.sh`, `scripts/hook-before-edit.sh`, `scripts/setup.py`
- Contains: Bash scripts for CLI installation and smoke testing
- Depends on: Shell environment, npm, curl

**Examples:**
- Purpose: Working demonstrations of agent patterns for each CLI
- Location: `examples/depurador-claude/`, `examples/gerador-codex/`
- Contains: Self-contained agent configs and sample code files
- Depends on: respective AI CLIs installed

## Data Flow

**Scaffold Installation Flow:**

1. Developer runs `node scripts/init-ai.mjs` in their target project directory
2. `main()` prompts for project name, description, language, stack, and which CLIs to support
3. `detectCli()` runs `which`/`where` for each known CLI and pre-checks checkboxes
4. `getTemplateFiles(selectedClis)` returns the flat list of `{ src, dest, symlink?, executable? }` objects
5. `getConflicts()` compares dest paths against existing files in `TARGET_DIR` (= `process.cwd()`)
6. Developer chooses conflict strategy: `skip`, `overwrite`, or `backup`
7. `writeFiles()` iterates files: reads each `src` from `TEMPLATES_DIR`, calls `replacePlaceholders()`, writes to `TARGET_DIR/dest`
8. Symlinks (e.g., `GEMINI.md -> AGENTS.md`) are created with `fs.symlinkSync()`
9. Optional: `fetchExtraSkillsCatalog()` hits `https://skills.sh/api/catalog` and surfaces additional skill URLs

**Add Skill Flow:**

1. Developer runs `node scripts/init-ai.mjs --add-skill`
2. `handleAddSkillMode()` fetches catalog (falls back to mock list on failure)
3. Developer selects skills via checkbox and chooses target CLI directory
4. Each selected skill is downloaded (or mocked) and written to `{CLI_PATH}/{skill.id}/SKILL.md`

**State Management:**
- No persistent state. Each run is stateless.
- `TARGET_DIR` = `process.cwd()` at import time; tests override by passing `targetDir` argument to `writeFiles()`
- Conflict detection is purely filesystem-based via `fs.lstatSync()`

## Key Abstractions

**File Descriptor Object:**
- Purpose: Represents a single file to be installed
- Pattern: `{ src: string, dest: string, symlink?: string, executable?: boolean }`
- `src` is relative to `TEMPLATES_DIR`; `dest` is relative to `TARGET_DIR`
- `symlink` replaces `src` — the dest becomes a symlink pointing to `symlink` value
- Examples: used in `BASE_FILES`, `CLAUDE_FILES`, `CODEX_FILES`, `GEMINI_FILES`, `COPILOT_FILES` arrays in `scripts/init-ai.mjs`

**Placeholder Substitution:**
- Purpose: Template personalization at install time
- Pattern: `{{KEY}}` tokens in template files replaced by `replacePlaceholders(content, vars)`
- Active variables: `PROJECT_NAME`, `PROJECT_DESCRIPTION`, `LANGUAGE`, `STACK`
- Applied to all regular files; symlinks are not processed

**Conflict Strategy:**
- Purpose: Determines behavior when destination file already exists
- Values: `'skip'` (default, safest), `'overwrite'` (replace), `'backup'` (rename to `.bak` then write)
- Implemented in `writeFiles()` via `backupPathFor()` for unique `.bak`/`.bak.N` filenames

**Skill:**
- Purpose: A unit of agent capability — a Markdown file with frontmatter defining `name`, `description`, and the instructions
- Location pattern: `{cli-dir}/skills/{skill-name}/SKILL.md`
- Frontmatter fields: `name`, `description` (and optionally `model`, `color` for agents)
- Examples: `templates/.claude/skills/semantic-commit/SKILL.md`, `templates/.claude/skills/llm-wiki/SKILL.md`

**Agent:**
- Purpose: A subagent definition with routing/behavioral instructions
- Location pattern: `{cli-dir}/agents/{agent-name}.md`
- Uses same YAML frontmatter as skills but always includes `model` field
- Examples: `templates/.claude/agents/task-router.md`, `templates/.claude/agents/debugger.md`

## Entry Points

**Primary Entry Point — Scaffold Generator:**
- Location: `scripts/init-ai.mjs` (guarded by `isMainModule()` check)
- Triggers: `npm run init-ai` or `node scripts/init-ai.mjs [--add-skill]`
- Responsibilities: Full interactive session — prompts, file selection, conflict resolution, writing

**Setup Entry Point:**
- Location: `scripts/setup.sh`
- Triggers: `npm run setup` or `bash scripts/setup.sh`
- Responsibilities: Install AI CLI binaries, create `.env` from `.env.example`

**Smoke Test Entry Point:**
- Location: `scripts/test_models.sh`
- Triggers: `npm run test:smoke`
- Responsibilities: Verify installed CLIs respond

## Error Handling

**Strategy:** Fail fast for missing dependencies; graceful degradation for optional network calls.

**Patterns:**
- `loadPrompts()` wraps `@inquirer/prompts` import in try/catch and throws a user-facing message if missing
- `fetchExtraSkillsCatalog()` catches all errors and returns `null`; callers fall back to mock data or skip
- `detectCli()` wraps `execSync` in try/catch and returns `false` on failure
- `main()` is called with `.catch()` in `isMainModule()` guard — prints `error.message` and exits with code 1
- `writeFiles()` does not throw on individual file failures; filesystem errors bubble up unhandled

## Cross-Cutting Concerns

**Logging:** `console.log` / `console.error` directly in `main()` and `handleAddSkillMode()`. No logging library.

**Validation:** No schema validation on user inputs. `projectName` and `description` accept any string from prompts.

**Authentication:** None. The scaffold generator itself requires no credentials. Installed templates reference env vars (`CLAUDE_API_KEY`, `OPENAI_API_KEY`, etc.) that users configure.

**Placeholder resolution:** Applied universally to all non-symlink files via `replacePlaceholders()`. Missing vars produce empty strings (`String(undefined ?? '')` = `''`).

---

*Architecture analysis: 2026-04-14*
