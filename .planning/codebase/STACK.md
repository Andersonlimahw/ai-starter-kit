# Technology Stack

**Analysis Date:** 2026-04-14

## Languages

**Primary:**
- JavaScript (ESM / `.mjs`) - Core tooling: scaffold generator (`scripts/init-ai.mjs`), test suite (`tests/init-ai.test.mjs`)
- Bash - Setup, smoke-test, and hook scripts (`scripts/setup.sh`, `scripts/test_models.sh`, `scripts/hook-before-edit.sh`, `templates/.claude/hooks/git-setup.sh`)

**Secondary:**
- TypeScript - Example agent code (`examples/gerador-codex/codex-agent.ts`)
- Python 3 - Example agents and setup utilities (`examples/gerador-codex/simple_agent.py`, `examples/depurador-claude/sample_bug.py`, `scripts/setup.py`)

## Runtime

**Environment:**
- Node.js >= 20 (enforced via `engines.node` in `package.json`)
- Python >= 3.10 (enforced in `scripts/setup.py` and `pyproject.toml`)

**Package Manager:**
- npm (Node.js)
- pip / setuptools >= 68 (Python)
- Lockfile: `package-lock.json` present (npm); no `requirements.txt` — Python deps are dev-only

## Frameworks

**Core:**
- None — the project is a CLI scaffold generator and example collection; no application framework is used

**Testing:**
- `node:test` (built-in Node.js test runner) >= Node 20 - JavaScript unit tests (`tests/init-ai.test.mjs`)
- `pytest` >= 8.0 - Python test runner (configured in `pyproject.toml`, test path `examples/`)

**Build/Dev:**
- ESLint >= 9.0 - JavaScript/TypeScript linting (`.js`, `.ts`, `.mjs`)
- Flake8 >= 7.0 - Python linting (max line length 88)
- Black >= 24.0 - Python code formatting (line length 88, targets py310–py312)

## Key Dependencies

**Critical:**
- `@inquirer/prompts` ^7.0.0 - Interactive CLI prompts for the `init-ai` scaffold wizard (`scripts/init-ai.mjs`); dynamically imported via `loadPrompts()` so missing package gives a clear error message

**Infrastructure:**
- Node.js built-ins only: `node:fs`, `node:path`, `node:child_process`, `node:url`, `node:test`, `node:assert` — no third-party runtime dependencies beyond `@inquirer/prompts`

## Configuration

**Environment:**
- Variables defined in `.env.example`: `CLAUDE_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `GITHUB_TOKEN`, `LOG_LEVEL`, `API_TIMEOUT`, `ENABLE_MEMORY`, `MEMORY_FILE`
- `.env` file is loaded at runtime by `scripts/test_models.sh` via `source .env`; never committed

**Build:**
- `package.json` - npm scripts, engine constraints, devDependencies
- `pyproject.toml` - Python build backend, dev extras, pytest config, black/flake8 settings
- No transpilation or bundling step — ESM `.mjs` files run directly with Node.js

## Platform Requirements

**Development:**
- Node.js >= 20
- Python >= 3.10
- npm (bundled with Node.js)
- pip

**Production:**
- Not applicable — this is a developer toolkit (no server deployment). The scaffold generator (`init-ai`) runs locally in the user's project directory via `npx` or `node scripts/init-ai.mjs`.

---

*Stack analysis: 2026-04-14*
