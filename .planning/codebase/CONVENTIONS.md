# Coding Conventions

**Analysis Date:** 2026-04-14

## Naming Patterns

**Files:**
- `.mjs` extension for ESM Node.js scripts (e.g., `scripts/init-ai.mjs`, `tests/init-ai.test.mjs`)
- `.ts` for TypeScript examples (e.g., `examples/gerador-codex/codex-agent.ts`)
- `.py` for Python scripts and examples (e.g., `scripts/setup.py`, `examples/depurador-claude/sample_bug.py`)
- `.sh` for Bash automation scripts (e.g., `scripts/setup.sh`, `scripts/test_models.sh`)
- Kebab-case for script and directory names (`init-ai.mjs`, `hook-before-edit.sh`, `test_models.sh`)
- Screaming-snake-case for constant arrays (`BASE_FILES`, `CLAUDE_FILES`, `CODEX_FILES`, `TEMPLATES_DIR`)

**Functions:**
- camelCase for JavaScript/TypeScript functions: `replacePlaceholders`, `getTemplateFiles`, `writeFiles`, `detectCli`, `loadPrompts`
- snake_case for Python functions: `calcular_media`, `buscar_usuario`, `processar_pedidos`, `run`, `main`
- Verb-noun pattern preferred: `writeFiles`, `getTemplateFiles`, `detectCli`, `fetchExtraSkillsCatalog`

**Variables:**
- camelCase in JavaScript/TypeScript: `destPath`, `srcPath`, `conflictStrategy`, `selectedClis`
- snake_case in Python: `result`, `target_file`, `version_flag`
- SCREAMING_SNAKE_CASE for module-level constants in JS: `TEMPLATES_DIR`, `TARGET_DIR`, `BASE_FILES`

**Types (TypeScript):**
- PascalCase interfaces: `AgentResult`
- Inline type annotations on function parameters and return types

## Code Style

**Formatting (JavaScript/TypeScript):**
- ESLint enforced via `eslint ^9.0.0` (devDependency)
- Lint command: `eslint . --ext .js,.ts,.mjs --ignore-pattern node_modules`
- 2-space indentation (observed throughout `scripts/init-ai.mjs`)
- Single quotes for strings in JavaScript
- Trailing commas present in multi-line arrays/objects

**Formatting (Python):**
- Black formatter configured: `line-length = 88`, `target-version = ["py310", "py311", "py312"]`
- Flake8 linter: `max-line-length = 88`, excludes `.git`, `__pycache__`, `.env`
- Docstrings on all public functions in Python

**Formatting (Bash):**
- `set -euo pipefail` (setup.sh) or `set -uo pipefail` (test_models.sh) at top of scripts
- Named helper functions for output: `ok()`, `fail()`, `warn()`, `info()`, `warning()`
- Section delimiters using `# ── Section name ──────` style comments

## Import Organization

**JavaScript/TypeScript Order:**
1. Node built-in modules with `node:` prefix: `import fs from 'node:fs'`, `import path from 'node:path'`
2. Third-party packages: `import { execSync } from 'child_process'` (TypeScript example uses bare specifier)
3. Local modules: `import { replacePlaceholders, getTemplateFiles, writeFiles } from '../scripts/init-ai.mjs'`

**Path Aliases:**
- No path aliases configured. All local imports use relative paths.

**Python:**
- Standard library imports at module top
- Inline imports inside functions avoided (seen in example bug code as intentional anti-pattern)

## Error Handling

**JavaScript Patterns:**
- `try/catch` with typed error access: `const err = error as Error` (TypeScript)
- Error object inspection with type guards: `error && typeof error === 'object' && 'message' in error`
- Async errors propagated via `.catch()` at entry points: `main().catch((error) => { console.error('\nErro:', error.message); process.exit(1); })`
- Functions that can fail gracefully return `null` rather than throwing: `fetchExtraSkillsCatalog` returns `null` on failure
- `detectCli` returns boolean (swallows errors): `try { execSync(...); return true; } catch { return false; }`
- Dynamic imports wrapped in try/catch with descriptive messages: `loadPrompts()`

**Python Patterns:**
- `subprocess.run(cmd, check=False)` followed by manual return code check
- `sys.exit(returncode)` for fatal errors
- No bare `except:` — either specific exceptions or omitted in Bash context

**Bash Patterns:**
- `command -v <tool> >/dev/null 2>&1 || { echo "..."; exit 1; }` for dependency checks
- Helper functions (`ok`, `fail`, `warn`) track pass/fail counters for summary output

## Logging

**JavaScript:**
- `console.log()` for user-facing output with visual markers (emojis and prefixes like `[Memória]`)
- `console.error()` only for fatal errors in catch handlers
- No structured logging library used

**Python:**
- `print()` with Unicode symbols for status: `✔`, `✗`, `ℹ`, `→`, `═`
- No logging module used

**Bash:**
- Color-coded output via ANSI escape codes and helper functions (`ok`, `fail`, `warn`, `info`)

## Comments

**When to Comment:**
- Module-level JSDoc block at top of each script file describing purpose and usage
- Section dividers using `// ── Section name ──────` pattern in long functions
- Inline comments for non-obvious logic
- Portuguese-language comments and user messages throughout (project targets Portuguese-speaking users)

**JSDoc/TSDoc:**
- JSDoc `/** ... */` blocks on exported functions in TypeScript examples
- Not used on internal helper functions in `.mjs` scripts

## Function Design

**Size:** Functions are small and focused. `main()` is the longest function but delegates to helpers.

**Parameters:**
- Default parameter values preferred over overloading: `writeFiles(files, vars, conflictStrategy = 'skip', targetDir = TARGET_DIR)`
- Options objects not used; positional parameters with defaults

**Return Values:**
- Functions that produce side effects AND report results return plain objects: `{ written, skipped }` from `writeFiles`
- Boolean returns for detection/check functions: `detectCli`, `pathExists`
- `null` for optional/failed fetch results: `fetchExtraSkillsCatalog`

## Module Design

**Exports:**
- Named exports for all testable/reusable functions: `export function replacePlaceholders`, `export function getTemplateFiles`, `export function writeFiles`, `export function detectCli`, `export async function fetchExtraSkillsCatalog`, `export async function main`
- Entry point guard: `if (isMainModule()) { main()... }` pattern prevents execution on import

**Barrel Files:**
- Not used. Imports reference source files directly.

**ESM:**
- All JavaScript uses ES Modules (`.mjs` extension, `import`/`export` syntax, `import.meta.url`)
- `__dirname` emulated via `fileURLToPath(import.meta.url)` + `path.dirname`

---

*Convention analysis: 2026-04-14*
