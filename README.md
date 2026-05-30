# AI Agents Starter Kit 🤖

> **Free AI Agents Starter Kit – Claude Code (Anthropic), Codex (OpenAI), Gemini (Google) & Copilot**  
> Accelerate development with AI agents – multi-model support, 5-minute setup, ready-to-use examples.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-%3E%3D3.10-blue)](https://python.org)
[![PRO Version](https://img.shields.io/badge/PRO-lemon.dev%2Fpro--agents-orange)](https://lemon.dev.br)

---

## 🦾 What is this Kit?

The **AI Agents Starter Kit** is a cross-platform repository (Node.js + Python) with everything a developer needs to start using **code agents with multiple AI models**:

- **Claude Code** (Anthropic)
- **Codex CLI** (OpenAI)
- **Gemini CLI** (Google)
- **GitHub Copilot CLI**
- **OpenCode** (multi-model)

---

## 🚀 Features

- ✅ **5-minute quickstart** for each platform
- ✅ **Agent and sub-agent** examples
- ✅ Pre-defined **Skills**: debug, code generation, refactoring
- ✅ Customizable **Hooks** before/after actions
- ✅ **Memory** via MCP (Model Context Protocol)
- ✅ **LLM-Wiki**: Automatic search and context storage
- ✅ **Token Optimization**: Built-in support for **RTK** and **Caveman Mode**
- ✅ **Engineering Skills**: Integrated Matt Pocock's skills (TDD, Grill Me, PRDs)
- ✅ **Automatic setup** scripts (`bash scripts/setup.sh`)

- ✅ CI/CD with GitHub Actions
- ✅ Model and CLI comparison
- ✅ Security checklist

---

## ⚡ Quickstart

```bash
# 1. Clone the repository
git clone https://github.com/lemondev/ai-agents-starter-kit.git
cd ai-agents-starter-kit

# 2. Automatic setup (installs all CLIs)
bash scripts/setup.sh

# 3. Configure your keys
cp .env.example .env
# Edit .env with your API keys

# 4. Run an example agent
cd examples/debugger-claude && claude
```

---

## Init AI — Scaffold for any repository

The `init-ai` script generates the AI agents infrastructure in any existing repository.

```bash
# In your project directory:
node /path/to/ai-starter-kit/scripts/init-ai.mjs

# To add community skills:
node /path/to/ai-starter-kit/scripts/init-ai.mjs --add-skill
```

The script:
1. Asks for project name, stack, and language
2. Detects installed CLIs and suggests Claude Code as default
3. Generates `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.claude/skills/`, `.claude/agents/`, and more
4. Offers additional skills from [skills.sh](https://skills.sh) and [aitmpl.com](https://www.aitmpl.com/skills)

Skills included by default: `semantic-commit`, `code-review`, `debug-workflow`, `llm-wiki`

**`prompt-pipeline` plugin** (`library/plugins/prompt-pipeline/`): bundles `senior-prompt-engineer` → `skills-selector` → `smart-dispatch` as a stage 0→1→2 orchestration layer sharing an `EXEC-MAP v1` contract (intent classified once, consumed by the routers). Run with `/prompt-pipeline [request]`. See [AGENTS.md](./AGENTS.md#%EF%B8%8F-skills-and-subagents) and [Plugin Distribution](./docs/marketplace/PLUGIN-DISTRIBUTION.md).

---

## 📦 CLI Installation

| CLI | Installation |
|-----|-----------|
| Claude Code | `curl -fsSL https://claude.ai/install.sh \| bash` |
| Codex CLI | `npm install -g @openai/codex` |
| Gemini CLI | `npm install -g @google/gemini-cli` |
| Copilot CLI | `npm install -g @github/copilot` |
| OpenCode | `npm install -g opencode-ai` |

---

## 🏗️ Project Structure

```
ai-agents-starter-kit/
├── AGENTS.md                    # Main documentation (EN-US)
├── README.md                    # This file
├── .env.example                 # Environment variables (example)
├── package.json                 # Node.js config
├── pyproject.toml               # Python config
├── LICENSE                      # MIT
├── scripts/
│   ├── setup.sh                 # Cross-CLI setup (Bash)
│   ├── init-ai.mjs              # AI scaffold generator
│   ├── test_models.sh           # Smoke tests
│   ├── setup.py                 # Python setup
│   └── hook-before-edit.sh      # Lint hook before edits
├── examples/
│   ├── debugger-claude/        # "Debugger" Agent (Claude Code)
│   ├── gerator-codex/           # "Code Generator" Agent (Codex)
│   ├── explorer-gemini/       # Long context analysis (Gemini)
│   └── multi-model-opencode/    # LLM Portability (OpenCode)
├── docs/
│   └── README-en.md             # English version (SEO)
└── .github/
    └── workflows/
        └── tests.yml            # CI Pipeline
```

---

## 🔐 Security

- Never commit the `.env` file
- Use `.env.example` as a template
- Manually confirm critical agent actions
- See `AGENTS.md` for a complete security checklist

---

## 📖 Documentation

- [AGENTS.md](./AGENTS.md) – Complete documentation in English
- [docs/README-en.md](./docs/README-en.md) – English documentation
- [lemon.dev.br](https://lemon.dev.br/) – My personal website

---

## 📄 License

MIT © [lemon.dev.br](https://lemon.dev.br)
