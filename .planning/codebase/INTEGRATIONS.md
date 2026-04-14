# External Integrations

**Analysis Date:** 2026-04-14

## APIs & External Services

**AI / LLM CLI Tools (installed and invoked as subprocesses):**
- **Claude Code** (Anthropic) - Primary AI coding agent; detected via `which claude`; configured via `CLAUDE_API_KEY`
  - SDK/Client: `claude` CLI binary (installed via `curl -fsSL https://claude.ai/install.sh | bash`)
  - Auth: `CLAUDE_API_KEY` env var
  - Context files: `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, `.claude/skills/`, `.claude/agents/`

- **Codex CLI** (OpenAI) - Code generation agent; detected via `which codex`
  - SDK/Client: `@openai/codex` npm global package; invoked via `codex run` in example agents
  - Auth: `OPENAI_API_KEY` env var
  - Context files: `.codex/settings.json`, `.codex/commands/`, `.codex/agents/`
  - Default model: `o4-mini` (configured in `templates/.codex/settings.json`)

- **Gemini CLI** (Google) - AI agent; detected via `which gemini`
  - SDK/Client: `@google/gemini-cli` npm global package
  - Auth: `GEMINI_API_KEY` env var
  - Context files: `.gemini/skills/`, `GEMINI.md` (symlink to `AGENTS.md`)

- **GitHub Copilot CLI** - AI agent; detected via `which copilot` or `which gh-copilot`
  - SDK/Client: `@github/copilot` npm global package
  - Auth: `GITHUB_TOKEN` env var
  - Context files: `.agent/skills/`, `.agent/subagents/`

- **OpenClaude** (multi-model) - Additional CLI installed by `scripts/setup.sh`
  - SDK/Client: `@gitlawb/openclaude` npm global package
  - Auth: Not explicitly mapped to an env var in `.env.example`

**Community Skills Catalog (optional HTTP fetch):**
- `https://skills.sh/api/catalog` - Fetched at runtime by `fetchExtraSkillsCatalog()` in `scripts/init-ai.mjs` with a 5-second timeout; failure is non-fatal (falls back to mock/offline catalog)
- Reference catalogs also mentioned: `https://www.aitmpl.com/skills`, `https://skills.sh`

## Data Storage

**Databases:**
- None — no database is used

**File Storage:**
- Local filesystem only
  - Scaffold output: written to the target project's working directory (`process.cwd()`)
  - Memory log: `./memory_log.json` — JSONL append-only file used by example agents (`examples/gerador-codex/codex-agent.ts`, `examples/gerador-codex/simple_agent.py`) to persist agent task results; path is configurable via `MEMORY_FILE` env var

**Caching:**
- None

## Authentication & Identity

**Auth Provider:**
- No centralized auth provider — authentication is entirely API-key-based per LLM provider
- Keys are stored in `.env` (gitignored) and loaded via `source .env` in shell scripts
- Required keys: `CLAUDE_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `GITHUB_TOKEN`

## Monitoring & Observability

**Error Tracking:**
- None — no external error tracking service

**Logs:**
- `LOG_LEVEL` env var accepted (`debug | info | warn | error`); not yet wired to a structured logger in the JS code (console-based logging only)
- Agent results appended to `./memory_log.json` (configurable via `MEMORY_FILE`)

## CI/CD & Deployment

**Hosting:**
- No server hosting — this is a local developer toolkit
- Published to GitHub: `https://github.com/lemondev/ai-agents-starter-kit.git`

**CI Pipeline:**
- Mentioned in `docs/README-en.md` as a feature ("CI/CD with GitHub Actions") but no `.github/workflows/` directory is present in the repository

## Environment Configuration

**Required env vars (from `.env.example`):**
- `CLAUDE_API_KEY` - Anthropic API key for Claude Code
- `OPENAI_API_KEY` - OpenAI API key for Codex CLI
- `GEMINI_API_KEY` - Google API key for Gemini CLI
- `GITHUB_TOKEN` - GitHub token for Copilot CLI

**Optional env vars:**
- `LOG_LEVEL` - Logging verbosity (default: `info`)
- `API_TIMEOUT` - API call timeout in seconds (default: `60`)
- `ENABLE_MEMORY` - Enable persistent memory log (default: `true`)
- `MEMORY_FILE` - Path to memory log file (default: `./memory_log.json`)

**Secrets location:**
- `.env` file at project root (gitignored); created by copying `.env.example`

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None — the only outbound HTTP call is the optional catalog fetch to `https://skills.sh/api/catalog` performed by `fetchExtraSkillsCatalog()` in `scripts/init-ai.mjs`

---

*Integration audit: 2026-04-14*
