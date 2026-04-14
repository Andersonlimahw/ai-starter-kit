# AI Agents Starter Kit 🤖

> **Free AI Agents Starter Kit – Claude Code (Anthropic), Codex (OpenAI), Gemini (Google) & Copilot**  
> Acelere o desenvolvimento com agentes de IA – suporte multi-modelo, configuração em 5 minutos, exemplos prontos.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-%3E%3D3.10-blue)](https://python.org)
[![PRO Version](https://img.shields.io/badge/PRO-lemon.dev%2Fpro--agents-orange)](https://lemon.dev/pro-agents)

---

## 🦾 O que é este Kit?

O **AI Agents Starter Kit** é um repositório cross-platform (Node.js + Python) com tudo que um desenvolvedor precisa para começar a usar **agentes de código com múltiplos modelos de IA**:

- **Claude Code** (Anthropic)
- **Codex CLI** (OpenAI)
- **Gemini CLI** (Google)
- **GitHub Copilot CLI**
- **OpenClaude** (multi-modelo)

---

## 🚀 Funcionalidades

- ✅ Quickstart de **5 minutos** para cada plataforma
- ✅ Exemplos de **agentes e sub-agentes**
- ✅ **Skills** (habilidades) pré-definidas: debug, geração de código, refatoração
- ✅ **Hooks** customizáveis antes/depois de ações
- ✅ **Memória** via MCP (Model Context Protocol)
- ✅ **LLM-Wiki**: busca automática e armazenamento de contexto
- ✅ Scripts de setup automático (`bash scripts/setup.sh`)
- ✅ CI/CD com GitHub Actions
- ✅ Comparação de modelos e CLIs
- ✅ Checklist de segurança

---

## ⚡ Quickstart

```bash
# 1. Clone o repositório
git clone https://github.com/lemondev/ai-agents-starter-kit.git
cd ai-agents-starter-kit

# 2. Setup automático (instala todos os CLIs)
bash scripts/setup.sh

# 3. Configure suas chaves
cp .env.example .env
# Edite .env com suas chaves de API

# 4. Rode um agente de exemplo
cd examples/depurador-claude && claude
```

---

## Init AI — Scaffold para qualquer repositório

O script `init-ai` gera a infraestrutura de AI agents em qualquer repositório existente.

```bash
# No diretório do seu projeto:
node /path/to/ai-starter-kit/scripts/init-ai.mjs

# Para adicionar skills da comunidade:
node /path/to/ai-starter-kit/scripts/init-ai.mjs --add-skill
```

O script:
1. Pergunta nome, stack e linguagem do projeto
2. Detecta CLIs instalados e sugere Claude Code como padrão
3. Gera `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.claude/skills/`, `.claude/agents/` e mais
4. Oferece skills adicionais do [skills.sh](https://skills.sh) e [aitmpl.com](https://www.aitmpl.com/skills)

Skills incluídas por padrão: `semantic-commit`, `code-review`, `debug-workflow`, `llm-wiki`

---

## 📦 Instalação dos CLIs

| CLI | Instalação |
|-----|-----------|
| Claude Code | `curl -fsSL https://claude.ai/install.sh \| bash` |
| Codex CLI | `npm install -g @openai/codex` |
| Gemini CLI | `npm install -g @google/gemini-cli` |
| Copilot CLI | `npm install -g @github/copilot` |
| OpenClaude | `npm install -g @gitlawb/openclaude` |

---

## 🏗️ Estrutura do Projeto

```
ai-agents-starter-kit/
├── AGENTS.md                    # Documentação principal (pt-BR)
├── README.md                    # Este arquivo
├── .env.example                 # Variáveis de ambiente (exemplo)
├── package.json                 # Config Node.js
├── pyproject.toml               # Config Python
├── LICENSE                      # MIT
├── scripts/
│   ├── setup.sh                 # Setup cross-CLI (Bash)
│   ├── init-ai.mjs              # Gerador de scaffold para IA
│   ├── test_models.sh           # Smoke tests
│   ├── setup.py                 # Setup Python
│   └── hook-before-edit.sh      # Hook de lint antes de edições
├── examples/
│   ├── depurador-claude/        # Agente "Depurador" (Claude Code)
│   ├── gerador-codex/           # Agente "Gerador de Código" (Codex)
│   ├── explorador-gemini/       # Análise de contexto longo (Gemini)
│   └── multi-modelo-openclaude/ # Portabilidade entre LLMs (OpenClaude)
├── docs/
│   └── README-en.md             # Versão em inglês (SEO)
└── .github/
    └── workflows/
        └── tests.yml            # CI Pipeline
```

---

## 🔐 Segurança

- Nunca commite o arquivo `.env`
- Use `.env.example` como template
- Confirme ações críticas dos agentes manualmente
- Veja `AGENTS.md` para checklist completo de segurança

---

## 🆙 Versão PRO

A versão gratuita inclui os starter templates e agentes básicos.

A versão **PRO** oferece:
- 🤖 Agentes avançados (CI/CD, monitoramento, segurança)
- 🔌 Plugins Premium (Sentry, Datadog)
- 🚀 Acesso antecipado a novos modelos
- 💬 Suporte prioritário

> **[👉 Atualize para PRO em lemon.dev/pro-agents](https://lemon.dev/pro-agents)**

---

## 📖 Documentação

- [AGENTS.md](./AGENTS.md) – Documentação completa em português
- [docs/README-en.md](./docs/README-en.md) – English documentation
- [lemon.dev/pro-agents](https://lemon.dev/pro-agents) – Versão PRO e newsletter

---

## 📄 Licença

MIT © [lemon.dev](https://lemon.dev)
