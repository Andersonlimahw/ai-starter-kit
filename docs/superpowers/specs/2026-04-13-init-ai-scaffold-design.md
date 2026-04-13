# Design Spec: init-ai — AI Agent Scaffold Generator

**Data:** 2026-04-13  
**Status:** Aprovado

---

## Objetivo

Criar um script `scripts/init-ai.mjs` que, ao ser executado em qualquer repositório alvo, gera uma infraestrutura completa de AI agents: arquivos de configuração (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`), estrutura de pastas por CLI (`.claude/`, `.codex/`, `.gemini/`, `.agent/`), skills genéricas embutidas e subagents prontos para customização.

O script é agnóstico de framework e tecnologia — funciona em qualquer projeto (Node, Python, Go, etc.).

---

## Escopo

### Inclui

- Script interativo Node.js (`init-ai.mjs`) com `@inquirer/prompts`
- Diretório `templates/` com todos os arquivos fonte (Markdown + JSON)
- 4 skills genéricas embutidas: `semantic-commit`, `code-review`, `debug-workflow`, `llm-wiki`
- 3 subagents embutidos: `task-router`, `code-reviewer`, `debugger`
- Suporte a 4 CLIs: Claude Code (padrão), Codex, Gemini, Copilot
- Fetch opcional de skills externas (skills.sh / aitmpl.com) ao final
- Substituição de placeholders com dados do onboarding

### Não inclui

- Instalação de CLIs (responsabilidade do `setup.sh` existente)
- Modificação do `package.json` do repo alvo
- Commit automático dos arquivos gerados
- Sobrescrita de `.env`

---

## Arquitetura

### Estrutura de arquivos no ai-starter-kit

```
ai-starter-kit/
├── scripts/
│   └── init-ai.mjs                  ← script principal
├── templates/
│   ├── CLAUDE.md
│   ├── AGENTS.md
│   ├── GEMINI.md                    ← será symlink no destino
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
└── package.json                     ← adiciona @inquirer/prompts como devDep
```

### Arquivos gerados no repo alvo

Cópia dos templates acima com placeholders substituídos. Apenas as pastas dos CLIs selecionados pelo dev são criadas.

---

## Fluxo do script

### Etapa 1 — Coleta de contexto

Perguntas sequenciais com `@inquirer/prompts`:

| Campo | Tipo | Placeholder no template |
|---|---|---|
| Nome do projeto | `input` | `{{PROJECT_NAME}}` |
| Descrição curta | `input` | `{{PROJECT_DESCRIPTION}}` |
| Linguagem principal | `select` | `{{LANGUAGE}}` |
| Stack/frameworks | `input` (opcional) | `{{STACK}}` |
| Idioma dos arquivos | `select` (PT/EN) | `{{LOCALE}}` |

### Etapa 2 — Seleção de CLIs

`checkbox` com detecção automática de CLIs instalados. Claude Code pré-marcado por padrão.

```
? Quais AI CLIs você usa?
  ❯ ◉ Claude Code  [recomendado]
    ◯ OpenAI Codex CLI
    ◯ Gemini CLI
    ◯ GitHub Copilot CLI
```

### Etapa 3 — Skills extras (opcional)

```
? Deseja instalar skills adicionais do skills.sh/aitmpl.com?
  ❯ Não, usar apenas o bundle padrão
    Sim, mostrar catálogo disponível
```

Se sim: fetch do catálogo via HTTPS, exibe checkboxes, baixa arquivos selecionados para `.claude/skills/`.

Se offline: aviso e continua com bundle local.

### Etapa 4 — Confirmação e escrita

Resume os arquivos a serem criados, pede confirmação. Opções para conflitos:
- Pular existentes (padrão)
- Sobrescrever tudo
- Fazer backup (`.bak`) e sobrescrever

---

## Templates — Conteúdo

### CLAUDE.md

```markdown
# {{PROJECT_NAME}} — Claude Code Entry

Regras e contexto centralizados em AGENTS.md.

## Lembrete rápido
- Commits: use `cn "mensagem"` (semantic-commit skill)
- Code review: use a skill `code-review`
- Debug: use a skill `debug-workflow`
- Stack: {{STACK}}
```

### AGENTS.md

Documento principal com seções:
- Visão geral do projeto
- Skills disponíveis (tabela)
- Subagents disponíveis (tabela)
- Referências (llm-wiki, skills.sh, aitmpl.com)
- Placeholder para regras de arquitetura

### Skill `llm-wiki`

Conceitos fundamentais do LLM Wiki (Karpathy) embutidos como contexto de sistema. Não faz fetch em runtime — o conteúdo está no arquivo. Inclui links para:
- https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- https://skills.sh
- https://www.aitmpl.com/skills

---

## Skills embutidas

| Skill | Descrição | Trigger |
|---|---|---|
| `semantic-commit` | Workflow de commit semântico com timestamp | "commit", "cn" |
| `code-review` | Checklist genérico de revisão de código | "review", "revisar" |
| `debug-workflow` | Metodologia científica de debugging | "debug", "bug" |
| `llm-wiki` | Conceitos fundamentais de LLMs como contexto | "llm", "modelo", "prompt" |

## Subagents embutidos

| Agent | Modelo | Função |
|---|---|---|
| `task-router` | sonnet | Roteia subtarefas para o modelo/specialist correto |
| `code-reviewer` | sonnet | Revisão focada em bugs e qualidade |
| `debugger` | opus | Investigação científica de bugs |

---

## Segurança e idempotência

- Detecção de conflitos antes de gravar com 3 opções de resolução
- Padrão: pular arquivos existentes (nunca destrói trabalho existente)
- Rodar duas vezes não corrompe nada
- Falha de rede não bloqueia — bundle local como fallback
- Nunca toca em `.env`, `package.json` do alvo, ou faz commit

---

## Dependências adicionadas ao ai-starter-kit

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

## Como usar (no repo alvo)

```bash
# Opção 1: via npx (sem clonar o starter kit)
npx --yes github:lemondev/ai-starter-kit/scripts/init-ai.mjs

# Opção 2: clone local
git clone https://github.com/lemondev/ai-starter-kit.git
cd meu-projeto
node ../ai-starter-kit/scripts/init-ai.mjs

# Opção 3: npm script (se o starter kit estiver como devDep)
npm run init-ai
```

---

## Fora do escopo (não implementar)

- Instalação de CLIs (já coberto por `setup.sh`)
- CI/CD automático no repo alvo
- Integração com MCP servers
- Versionamento de templates
- UI web para o onboarding
