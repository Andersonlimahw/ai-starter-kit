# init-ai Scaffold Generator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar o script `scripts/init-ai.mjs` e os templates em `templates/` para gerar infraestrutura completa de AI agents em qualquer repositório alvo.

**Architecture:** Script Node.js interativo (`@inquirer/prompts`) que lê templates de `templates/`, coleta contexto do projeto via onboarding, detecta CLIs instalados, substitui placeholders e grava os arquivos no repo alvo. Templates são arquivos Markdown/JSON com placeholders `{{KEY}}`.

**Tech Stack:** Node.js >=20, `@inquirer/prompts ^7`, `node:fs`, `node:path`, `node:child_process`

---

## Mapa de arquivos

### Criar (novos)
| Arquivo | Responsabilidade |
|---|---|
| `scripts/init-ai.mjs` | Script principal — onboarding, detecção de CLIs, cópia de templates |
| `templates/CLAUDE.md` | Template do entry point para Claude Code |
| `templates/AGENTS.md` | Template do índice principal de AI agents |
| `templates/.claude/settings.json` | Config de projeto para Claude Code |
| `templates/.claude/SKILLS.md` | Índice de skills do projeto |
| `templates/.claude/skills/semantic-commit/SKILL.md` | Skill de commit semântico |
| `templates/.claude/skills/code-review/SKILL.md` | Skill de revisão de código |
| `templates/.claude/skills/debug-workflow/SKILL.md` | Skill de debugging sistemático |
| `templates/.claude/skills/llm-wiki/SKILL.md` | Skill com conceitos LLM (Karpathy) |
| `templates/.claude/hooks/git-setup.sh` | Hook de git (pre-commit, post-merge) |
| `templates/.claude/agents/task-router.md` | Subagent roteador de tarefas |
| `templates/.claude/agents/code-reviewer.md` | Subagent revisor de código |
| `templates/.claude/agents/debugger.md` | Subagent debugger |
| `templates/.codex/settings.json` | Config para Codex CLI |
| `templates/.codex/commands/project-commit.md` | Comando de commit para Codex |
| `templates/.codex/agents/task-router.md` | Task router para Codex |
| `templates/.gemini/skills/llm-wiki/SKILL.md` | LLM wiki skill para Gemini CLI |
| `templates/.agent/skills/semantic-commit/SKILL.md` | Commit skill para Copilot/outros |
| `templates/.agent/subagents/task-router.md` | Task router para Copilot/outros |
| `tests/init-ai.test.mjs` | Testes unitários das funções utilitárias |

### Modificar (existentes)
| Arquivo | O que muda |
|---|---|
| `package.json` | Adicionar `@inquirer/prompts` devDep + script `init-ai` |

---

## Task 1: Setup — package.json e estrutura de diretórios

**Files:**
- Modify: `package.json`
- Create: `templates/` (diretório raiz dos templates)
- Create: `tests/init-ai.test.mjs`

- [ ] **Step 1: Adicionar devDep e script ao package.json**

Editar `package.json`:

```json
{
  "name": "ai-agents-starter-kit",
  "version": "1.0.0",
  "description": "Free AI Agents Starter Kit – Claude Code, Codex, Gemini & Copilot CLI",
  "keywords": [
    "ai", "agents", "claude-code", "codex", "gemini", "copilot", "llm", "mcp", "starter-kit"
  ],
  "homepage": "https://lemon.dev/pro-agents",
  "repository": {
    "type": "git",
    "url": "https://github.com/lemondev/ai-agents-starter-kit.git"
  },
  "license": "MIT",
  "engines": { "node": ">=20" },
  "scripts": {
    "setup": "bash scripts/setup.sh",
    "init-ai": "node scripts/init-ai.mjs",
    "test": "node --test tests/**/*.test.mjs examples/**/*.test.js 2>/dev/null || echo 'No tests found'",
    "test:smoke": "bash scripts/test_models.sh",
    "lint": "eslint . --ext .js,.ts,.mjs --ignore-pattern node_modules"
  },
  "devDependencies": {
    "@inquirer/prompts": "^7.0.0",
    "eslint": "^9.0.0"
  }
}
```

- [ ] **Step 2: Instalar dependência**

```bash
cd /Users/andersonlimadev/Projects/IA/ai-starter-kit
npm install
```

Saída esperada: `added N packages` sem erros.

- [ ] **Step 3: Criar diretórios de templates**

```bash
mkdir -p templates/.claude/skills/semantic-commit
mkdir -p templates/.claude/skills/code-review
mkdir -p templates/.claude/skills/debug-workflow
mkdir -p templates/.claude/skills/llm-wiki
mkdir -p templates/.claude/hooks
mkdir -p templates/.claude/agents
mkdir -p templates/.codex/commands
mkdir -p templates/.codex/agents
mkdir -p templates/.gemini/skills/llm-wiki
mkdir -p templates/.agent/skills/semantic-commit
mkdir -p templates/.agent/subagents
mkdir -p tests
```

- [ ] **Step 4: Escrever teste unitário das funções utilitárias**

Criar `tests/init-ai.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';

// Extraímos as funções puras para testar isoladamente
// (init-ai.mjs exporta replacePlaceholders e getTemplateFiles)
import { replacePlaceholders, getTemplateFiles } from '../scripts/init-ai.mjs';

test('replacePlaceholders substitui todas as ocorrências', () => {
  const template = 'Projeto: {{PROJECT_NAME}} — stack: {{STACK}} ({{PROJECT_NAME}})';
  const vars = { PROJECT_NAME: 'meu-app', STACK: 'Next.js' };
  const result = replacePlaceholders(template, vars);
  assert.equal(result, 'Projeto: meu-app — stack: Next.js (meu-app)');
});

test('replacePlaceholders não altera texto sem placeholders', () => {
  const template = 'Texto sem placeholders.';
  const result = replacePlaceholders(template, { FOO: 'bar' });
  assert.equal(result, 'Texto sem placeholders.');
});

test('getTemplateFiles sempre inclui claude quando selecionado', () => {
  const files = getTemplateFiles(['claude']);
  const dests = files.map(f => f.dest);
  assert.ok(dests.includes('CLAUDE.md'));
  assert.ok(dests.includes('AGENTS.md'));
  assert.ok(dests.includes('.claude/settings.json'));
  assert.ok(dests.includes('.claude/skills/semantic-commit/SKILL.md'));
});

test('getTemplateFiles inclui codex quando selecionado', () => {
  const files = getTemplateFiles(['claude', 'codex']);
  const dests = files.map(f => f.dest);
  assert.ok(dests.includes('.codex/settings.json'));
  assert.ok(dests.includes('.codex/commands/project-commit.md'));
});

test('getTemplateFiles não inclui codex quando não selecionado', () => {
  const files = getTemplateFiles(['claude']);
  const dests = files.map(f => f.dest);
  assert.ok(!dests.includes('.codex/settings.json'));
});

test('getTemplateFiles inclui gemini quando selecionado', () => {
  const files = getTemplateFiles(['claude', 'gemini']);
  const dests = files.map(f => f.dest);
  assert.ok(dests.includes('.gemini/skills/llm-wiki/SKILL.md'));
});

test('getTemplateFiles inclui GEMINI.md como symlink', () => {
  const files = getTemplateFiles(['claude']);
  const symlink = files.find(f => f.dest === 'GEMINI.md');
  assert.ok(symlink);
  assert.equal(symlink.symlink, 'AGENTS.md');
});
```

- [ ] **Step 5: Rodar testes (esperar falha — script ainda não existe)**

```bash
cd /Users/andersonlimadev/Projects/IA/ai-starter-kit
node --test tests/init-ai.test.mjs 2>&1 | head -20
```

Saída esperada: erro de import `Cannot find module '../scripts/init-ai.mjs'` — confirma que o teste está correto e esperando o script.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tests/init-ai.test.mjs
git commit -m "$(cat <<'EOF'
feat: setup init-ai com @inquirer/prompts e testes unitários : 13/04/26

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Templates raiz — CLAUDE.md e AGENTS.md

**Files:**
- Create: `templates/CLAUDE.md`
- Create: `templates/AGENTS.md`

- [ ] **Step 1: Criar templates/CLAUDE.md**

```markdown
# {{PROJECT_NAME}} — Claude Code Entry

Regras e contexto centralizados em AGENTS.md.

## Lembrete rápido
- Commits: use `cn "mensagem"` (semantic-commit skill)
- Code review: use a skill `code-review`
- Debug: use a skill `debug-workflow`
- Stack: {{STACK}}
- Idioma: {{LANGUAGE}}

## Fonte da verdade
Leia **[AGENTS.md](./AGENTS.md)** para o índice completo de diretrizes.
```

- [ ] **Step 2: Criar templates/AGENTS.md**

```markdown
# {{PROJECT_NAME}} — AI Agents Index

{{PROJECT_DESCRIPTION}}

## Stack
**Linguagem:** {{LANGUAGE}} | **Frameworks:** {{STACK}}

---

## Skills disponíveis

| Skill | Descrição | Trigger |
|---|---|---|
| `semantic-commit` | Workflow de commit semântico com timestamp | "commit", "cn", "fazer commit" |
| `code-review` | Checklist genérico de revisão de código | "review", "revisar", "verificar código" |
| `debug-workflow` | Metodologia científica de debugging | "debug", "bug", "erro", "investigar" |
| `llm-wiki` | Conceitos fundamentais de LLMs como contexto | "llm", "modelo", "prompt", "token" |

## Subagents disponíveis

| Agent | Modelo | Função |
|---|---|---|
| `task-router` | sonnet | Roteia subtarefas para o modelo/specialist correto |
| `code-reviewer` | sonnet | Revisão focada em bugs e qualidade |
| `debugger` | opus | Investigação científica de bugs |

---

## Arquitetura do projeto

> Adicione aqui as regras de arquitetura específicas do seu projeto.
> Exemplo: padrões de camadas, convenções de nomenclatura, restrições.

---

## Referências

- LLM Wiki (Karpathy): https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- Skills externas: https://skills.sh
- Templates AI: https://www.aitmpl.com/skills
```

- [ ] **Step 3: Commit**

```bash
git add templates/CLAUDE.md templates/AGENTS.md
git commit -m "$(cat <<'EOF'
feat: templates CLAUDE.md e AGENTS.md com placeholders : 13/04/26

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Skills templates (.claude/skills/)

**Files:**
- Create: `templates/.claude/settings.json`
- Create: `templates/.claude/SKILLS.md`
- Create: `templates/.claude/skills/semantic-commit/SKILL.md`
- Create: `templates/.claude/skills/code-review/SKILL.md`
- Create: `templates/.claude/skills/debug-workflow/SKILL.md`
- Create: `templates/.claude/skills/llm-wiki/SKILL.md`

- [ ] **Step 1: Criar templates/.claude/settings.json**

```json
{
  "projectContext": {
    "name": "{{PROJECT_NAME}}",
    "description": "{{PROJECT_DESCRIPTION}}",
    "stack": "{{STACK}}",
    "language": "{{LANGUAGE}}"
  },
  "commands": {
    "lint": "npm run lint",
    "test": "npm test",
    "build": "npm run build",
    "typecheck": "npm run typecheck"
  },
  "restrictions": [
    "Never commit .env files or secrets",
    "Never hardcode API keys in source code",
    "Always validate inputs at system boundaries"
  ],
  "autoContext": {
    "always": ["AGENTS.md", "CLAUDE.md"]
  }
}
```

- [ ] **Step 2: Criar templates/.claude/SKILLS.md**

```markdown
# Skills Index — {{PROJECT_NAME}}

Skills disponíveis neste projeto:

| Skill | Arquivo | Trigger |
|---|---|---|
| `semantic-commit` | `.claude/skills/semantic-commit/SKILL.md` | "commit", "cn" |
| `code-review` | `.claude/skills/code-review/SKILL.md` | "review", "revisar" |
| `debug-workflow` | `.claude/skills/debug-workflow/SKILL.md` | "debug", "bug" |
| `llm-wiki` | `.claude/skills/llm-wiki/SKILL.md` | "llm", "modelo", "prompt" |

## Adicionar skills externas

```bash
# Via ai-starter-kit (interativo)
node /path/to/ai-starter-kit/scripts/init-ai.mjs --add-skill

# Via skills.sh (manual)
# Acesse https://skills.sh e copie o arquivo SKILL.md desejado
# para .claude/skills/<nome>/SKILL.md
```
```

- [ ] **Step 3: Criar templates/.claude/skills/semantic-commit/SKILL.md**

```markdown
---
name: semantic-commit
description: Workflow de commit semântico com timestamp. Usar quando o usuário pede para "fazer commit", "salvar mudanças", "cn", ou qualquer variação de commit.
---

# Semantic Commit Workflow

## Tipos de commit

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Refatoração sem mudança de comportamento |
| `style` | Formatação, espaços (sem mudança de lógica) |
| `docs` | Apenas documentação |
| `test` | Adição ou atualização de testes |
| `chore` | Build, configs, dependências |
| `perf` | Melhoria de performance |

## Formato obrigatório

```
[type]: [descrição] : [dd/mm/yy] - [hh:mm]
```

**Exemplo:** `feat: adicionar autenticação OAuth : 13/04/26 - 14:30`

## Passos

1. Verificar mudanças: `git status` e `git diff --staged`
2. Identificar tipo pela natureza das mudanças
3. Executar:

```bash
git add <arquivos-relevantes>
git commit -m "$(cat <<'COMMIT'
[type]: [descrição] : [dd/mm/yy] - [hh:mm]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
COMMIT
)"
```

## Guardrails

- **Nunca** fazer stage de `.env` ou arquivos com segredos
- **Sempre** verificar `git status` antes e depois
- **Nunca** usar `--no-verify` para pular hooks
- Mensagem deve ser em português (ou idioma do projeto)
```

- [ ] **Step 4: Criar templates/.claude/skills/code-review/SKILL.md**

```markdown
---
name: code-review
description: Checklist genérico de revisão de código. Usar quando: "review", "revisar código", "verificar qualidade", "code review", "está bom esse código?".
---

# Code Review Checklist

Revise o código sistematicamente por categoria. Reporte apenas issues de alta confiança.

## Qualidade geral

- [ ] Funções com responsabilidade única (uma função = uma tarefa)
- [ ] Sem código duplicado — lógica repetida 3x+ merece abstração
- [ ] Nomes descritivos (sem abreviações crípticas, sem `data`, `info`, `temp`)
- [ ] Sem `any` types sem comentário justificando
- [ ] Sem `TODO` / `FIXME` não resolvidos

## Segurança

- [ ] Sem segredos, tokens ou chaves hardcoded
- [ ] Inputs de usuário/APIs externas validados antes de usar
- [ ] Sem SQL injection (queries parametrizadas)
- [ ] Sem XSS (sanitização de output HTML)
- [ ] Permissões mínimas necessárias

## Testes

- [ ] Lógica crítica coberta por testes
- [ ] Edge cases testados (null, empty, boundary)
- [ ] Testes testam comportamento, não implementação

## Performance

- [ ] Sem loops desnecessários em hot paths
- [ ] Sem N+1 queries (batch quando possível)
- [ ] Recursos abertos são fechados (conexões, file handles)

## Formato de feedback

```
[CATEGORIA] caminho/arquivo.ts:linha
Problema: descrição concreta do problema
Fix: solução ou código corrigido
Severidade: CRÍTICO | ALTO | BAIXO
```

**CRÍTICO** = bloqueia merge. **ALTO** = deve corrigir antes. **BAIXO** = pode corrigir depois.

## Referências

- https://skills.sh
- https://www.aitmpl.com/skills
```

- [ ] **Step 5: Criar templates/.claude/skills/debug-workflow/SKILL.md**

```markdown
---
name: debug-workflow
description: Metodologia científica de debugging. Usar quando: "debug", "bug", "erro", "não funciona", "investigar problema", "por que isso quebrou".
---

# Debug Workflow — Metodologia Científica

Nunca pule etapas. Cada etapa deve ser confirmada antes da próxima.

## Processo

### 1. Reproduzir
Crie o menor caso reproduzível possível.
- Qual é o input exato que causa o problema?
- Acontece consistentemente ou de forma intermitente?
- Em qual ambiente? (dev/prod/CI)

### 2. Isolar
Identifique a menor unidade de código responsável.
- Use `git bisect` para encontrar o commit que introduziu o bug
- Comente código até o problema desaparecer — o último bloco comentado é suspeito

### 3. Hipótese
Forme UMA hipótese sobre a causa raiz. Seja específico:
- "A variável X está undefined porque Y não foi inicializado antes de Z"

### 4. Testar hipótese
Execute o MENOR experimento para validar/refutar:
```bash
# Adicionar log temporário
console.log('[DEBUG]', { variavel: x, estado: y });

# ou usar debugger
node --inspect-brk script.js
```

### 5. Corrigir
Aplique o fix MÍNIMO que resolve a causa raiz. Evite "enquanto estou aqui" refactoring.

### 6. Verificar
- O bug original foi corrigido? ✓
- Nenhuma regressão introduzida? ✓ (`npm test`)
- O fix é reversível se necessário? ✓

## Comandos úteis

```bash
# Encontrar commit que introduziu bug
git bisect start
git bisect bad HEAD
git bisect good <commit-hash-bom>
# git bisect good/bad até encontrar o commit

# Ver histórico de uma linha específica
git log -L 42,42:src/arquivo.ts

# Stash para isolar mudanças locais
git stash && npm test && git stash pop
```

## Referências

- LLM Wiki: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- skills.sh: https://skills.sh
```

- [ ] **Step 6: Criar templates/.claude/skills/llm-wiki/SKILL.md**

```markdown
---
name: llm-wiki
description: Conceitos fundamentais de LLMs como contexto para decisões de arquitetura de agentes. Ativar quando discutir: prompts, tokens, contexto, temperatura, embeddings, RAG, fine-tuning, agentes, escolha de modelo, latência de inferência.
---

# LLM Wiki — Conceitos Essenciais

> Baseado em: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
> Skills: https://skills.sh | https://www.aitmpl.com/skills

---

## Tokens e Contexto

- LLMs processam **tokens**, não palavras — ~4 chars/token em inglês, ~2-3 chars em português
- **Context window**: limite total de tokens (entrada + saída). Ex: Claude Sonnet 4.6 = 200k tokens
- Informação no **meio** do contexto tende a ser "esquecida" (*lost in the middle*) — coloque o mais importante no início ou fim
- O **system prompt** define o papel e restrições do modelo — é processado com cache em modelos modernos

## Temperatura e Sampling

| Temperatura | Comportamento | Usar para |
|---|---|---|
| 0 | Determinístico, sempre o token mais provável | Código, SQL, dados estruturados |
| 0.1–0.3 | Ligeiramente criativo, consistente | Análise, explicações técnicas |
| 0.7–1.0 | Criativo, variado | Escrita, brainstorming |

- **top-p (nucleus sampling)**: considera apenas os tokens que somam P% de probabilidade
- Para código: temperatura 0; para texto criativo: 0.7+

## Agentes e Tool Use

- **Agente** = LLM + loop de ações + conjunto de ferramentas
- **ReAct pattern**: Reason → Act → Observe (repete até task concluída)
- Cada chamada de ferramenta = nova inferência = latência acumulada
- **Subagents**: agentes especializados chamados pelo agente orquestrador
- Custo de agentes: proporcional ao número de turnos × tokens por turno

### Quando usar subagents
- Tarefas independentes que podem rodar em paralelo
- Domínios especializados (UI, backend, testes)
- Quando o contexto do agente principal está saturado

## RAG vs Fine-tuning

| | RAG | Fine-tuning |
|---|---|---|
| **O que é** | Busca contexto relevante em runtime | Treina o modelo com novos dados |
| **Bom para** | Conhecimento que muda, fatos recentes | Estilo/formato consistente |
| **Ruim para** | Conhecimento implícito/procedural | Fatos novos pós-treino |
| **Custo** | Inferência + retrieval | Treinamento (caro) |
| **Regra prática** | Tente primeiro | Só se RAG não resolver |

## Prompt Engineering

- **Few-shot**: inclua 2-3 exemplos no prompt para guiar o formato da saída
- **Chain-of-thought**: "pense passo a passo" melhora raciocínio em tarefas complexas
- **Specificity wins**: quanto mais contexto relevante, melhor — seja concreto
- **Role assignment**: "Você é um especialista em X" muda o comportamento do modelo
- Evite prompts vagos como "melhore esse código" — prefira "refatore para reduzir duplicação em Y"

## Escolha de Modelo

| Perfil | Modelos | Usar quando |
|---|---|---|
| **Máxima capacidade** | Claude Opus 4.6, GPT-4 | Arquitetura, bugs críticos, decisões de release |
| **Equilíbrio** | Claude Sonnet 4.6, GPT-4o | Implementação de features, refactoring |
| **Rápido/barato** | Claude Haiku 4.5, GPT-3.5 | Formatação, boilerplate, edições repetitivas |

## Segurança e Privacidade

- Nunca envie dados sensíveis (PII, credenciais, dados de produção) ao modelo
- Prompts de usuário podem tentar **prompt injection** — valide e sanitize
- Use modos de aprovação para ações irreversíveis (delete, push, deploy)

## Referências

- Karpathy LLM Wiki: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- skills.sh: https://skills.sh
- aitmpl.com: https://www.aitmpl.com/skills
- Claude models: https://docs.anthropic.com/en/docs/about-claude/models
```

- [ ] **Step 7: Rodar testes (ainda devem falhar)**

```bash
cd /Users/andersonlimadev/Projects/IA/ai-starter-kit
node --test tests/init-ai.test.mjs 2>&1 | head -5
```

Saída esperada: `Cannot find module '../scripts/init-ai.mjs'`

- [ ] **Step 8: Commit**

```bash
git add templates/.claude/
git commit -m "$(cat <<'EOF'
feat: templates de skills (semantic-commit, code-review, debug, llm-wiki) : 13/04/26

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Agent templates e hooks

**Files:**
- Create: `templates/.claude/hooks/git-setup.sh`
- Create: `templates/.claude/agents/task-router.md`
- Create: `templates/.claude/agents/code-reviewer.md`
- Create: `templates/.claude/agents/debugger.md`
- Create: `templates/.codex/settings.json`
- Create: `templates/.codex/commands/project-commit.md`
- Create: `templates/.codex/agents/task-router.md`
- Create: `templates/.gemini/skills/llm-wiki/SKILL.md`
- Create: `templates/.agent/skills/semantic-commit/SKILL.md`
- Create: `templates/.agent/subagents/task-router.md`

- [ ] **Step 1: Criar templates/.claude/hooks/git-setup.sh**

```bash
#!/bin/bash
# Git Hooks Setup — {{PROJECT_NAME}}
# Instala hooks de pre-commit e post-merge

set -e
echo "Configurando Git hooks para {{PROJECT_NAME}}..."
mkdir -p .git/hooks

cat > .git/hooks/pre-commit << 'HOOK'
#!/bin/bash
echo "Rodando verificações pre-commit..."

if command -v npm &>/dev/null && [ -f package.json ]; then
  if grep -q '"typecheck"' package.json 2>/dev/null; then
    echo "Verificando TypeScript..."
    npm run typecheck || { echo "TypeScript falhou. Commit abortado."; exit 1; }
  fi
  if grep -q '"lint"' package.json 2>/dev/null; then
    echo "Rodando lint..."
    npm run lint || { echo "Lint falhou. Commit abortado."; exit 1; }
  fi
fi

echo "Pre-commit OK"
exit 0
HOOK

chmod +x .git/hooks/pre-commit

cat > .git/hooks/post-merge << 'HOOK'
#!/bin/bash
if git diff --name-only HEAD@{1} | grep -qE "package-lock\.json|requirements\.txt"; then
  echo "Dependências alteradas. Instale manualmente se necessário."
fi
exit 0
HOOK

chmod +x .git/hooks/post-merge

echo "Hooks instalados: pre-commit (lint/typecheck), post-merge (aviso de deps)"
```

- [ ] **Step 2: Criar templates/.claude/agents/task-router.md**

```markdown
---
name: task-router
description: Use este agente para rotear subtarefas para o modelo e specialist correto. Exemplos: tarefas multi-domínio, requests que tocam UI e backend, decisões de modelo.
model: sonnet
color: cyan
---

Você é um especialista em roteamento de tarefas para agentes de IA.

## Stack do projeto
{{STACK}} | {{LANGUAGE}}

## Responsabilidades

1. Dividir requests em subtarefas concretas e independentes
2. Atribuir o modelo mais adequado a cada subtarefa
3. Identificar dependências entre subtarefas
4. Produzir plano de execução com notas de risco

## Regras de roteamento

| Complexidade | Modelo | Quando usar |
|---|---|---|
| Alta | opus | Arquitetura, bugs críticos, decisões de release, segurança |
| Média | sonnet | Implementação de features, refactoring, revisão de código |
| Baixa | haiku | Formatação, boilerplate, edições repetitivas, traduções |

## Formato de saída

Para cada subtarefa:
- **Subtarefa**: descrição concreta
- **Modelo recomendado**: opus / sonnet / haiku
- **Por quê**: justificativa em 1 linha
- **Depende de**: lista de subtarefas que devem completar antes

## Referências
- LLM Wiki: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
```

- [ ] **Step 3: Criar templates/.claude/agents/code-reviewer.md**

```markdown
---
name: code-reviewer
description: Revisão de código focada em bugs, lógica e qualidade. Usar quando: "revisar PR", "verificar implementação", "code review", "está correto?".
model: sonnet
color: blue
---

Você é um especialista em revisão de código para projetos {{LANGUAGE}}/{{STACK}}.

## Responsabilidades

1. Identificar bugs e problemas de lógica com referência de arquivo:linha
2. Verificar segurança (injection, exposição de dados, validação de inputs)
3. Verificar qualidade (DRY, responsabilidade única, nomes descritivos)
4. Sugerir melhorias com código concreto — nunca feedback vago

## Processo

1. Leia o código com atenção antes de comentar
2. Agrupe feedback por severidade: CRÍTICO > ALTO > BAIXO
3. Para cada issue: descreva o problema, mostre o fix, explique o motivo

## Formato de feedback

```
[CATEGORIA] caminho/arquivo.ts:linha
Problema: descrição concreta
Fix:
```código corrigido```
Severidade: CRÍTICO | ALTO | BAIXO
```

## Critérios de aprovação

Aprove quando:
- Sem issues CRÍTICOS ou ALTOS
- Lógica claramente correta
- Sem segredos hardcoded
- Inputs externos validados

## Referências
- skills.sh: https://skills.sh
- aitmpl.com: https://www.aitmpl.com/skills
```

- [ ] **Step 4: Criar templates/.claude/agents/debugger.md**

```markdown
---
name: debugger
description: Investigação científica de bugs. Usar quando: "encontrar bug", "investigar erro", "debug sistemático", "por que X não funciona".
model: opus
color: yellow
---

Você é um especialista em debugging sistemático para {{LANGUAGE}}/{{STACK}}.

## Processo obrigatório (nunca pule etapas)

### Etapa 1 — Reproduzir
Confirme o bug com o menor caso reproduzível possível.
Pergunte: qual é o input exato? Acontece sempre?

### Etapa 2 — Isolar
Identifique a menor unidade de código responsável.
Use `git bisect` se o bug foi introduzido recentemente.

### Etapa 3 — Hipótese
Forme UMA hipótese específica sobre a causa raiz.
Exemplo: "X é undefined porque Y retorna null quando Z".

### Etapa 4 — Testar
Execute o menor experimento para validar/refutar a hipótese.
Adicione log temporário ou use debugger.

### Etapa 5 — Corrigir
Aplique o fix mínimo. Sem refactoring adicional neste passo.

### Etapa 6 — Verificar
Confirme: bug corrigido + sem regressões (`npm test`) + fix é reversível.

## Comandos úteis

```bash
git bisect start && git bisect bad HEAD && git bisect good <hash>
git log -L <linha>,<linha>:<arquivo>
node --inspect-brk <script>
```

## Referências
- Debug workflow skill: `.claude/skills/debug-workflow/SKILL.md`
- LLM Wiki: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
```

- [ ] **Step 5: Criar templates/.codex/settings.json**

```json
{
  "projectContext": {
    "name": "{{PROJECT_NAME}}",
    "description": "{{PROJECT_DESCRIPTION}}",
    "stack": "{{STACK}}",
    "language": "{{LANGUAGE}}"
  },
  "model": "o4-mini",
  "instructions": "Consulte AGENTS.md para contexto do projeto e regras. Stack: {{STACK}}.",
  "restrictions": [
    "Never commit .env files",
    "Never hardcode secrets"
  ]
}
```

- [ ] **Step 6: Criar templates/.codex/commands/project-commit.md**

```markdown
# Smart Commit — {{PROJECT_NAME}}

Gere uma mensagem de commit semântico seguindo o padrão do projeto.

## Passos

### 1. Analisar mudanças
```bash
git status
git diff --staged
```

### 2. Determinar tipo
| Tipo | Quando |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Refatoração |
| `docs` | Documentação |
| `test` | Testes |
| `chore` | Build/config/deps |

### 3. Formato
```
[type]: [descrição] : [dd/mm/yy] - [hh:mm]
```

### 4. Executar
```bash
git add <arquivos>
git commit -m "[type]: [descrição] : $(date '+%d/%m/%y - %H:%M')"
```

## Guardrails
- Nunca commitar `.env`
- Mensagem em português (padrão do projeto)
```

- [ ] **Step 7: Criar templates/.codex/agents/task-router.md**

Mesmo conteúdo do task-router do Claude (copiado — Codex usa o mesmo formato de frontmatter):

```markdown
---
name: task-router
description: Roteia subtarefas para o modelo e specialist correto.
model: o4-mini
---

Você é um especialista em roteamento de tarefas.

Stack do projeto: {{STACK}} | {{LANGUAGE}}

Responsabilidades:
1. Dividir requests em subtarefas concretas
2. Atribuir modelo (o1 para arquitetura/bugs críticos, o4-mini para implementação, gpt-4o-mini para boilerplate)
3. Produzir plano com dependências e notas de risco

Formato: subtarefa | modelo | justificativa
```

- [ ] **Step 8: Criar templates/.gemini/skills/llm-wiki/SKILL.md**

Mesma skill llm-wiki do Claude (formato compatível com Gemini CLI):

```markdown
---
name: llm-wiki
description: Conceitos fundamentais de LLMs. Ativar quando discutir tokens, contexto, temperatura, RAG, agentes, escolha de modelo.
---

# LLM Wiki — Conceitos Essenciais

> Baseado em: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
> Skills: https://skills.sh | https://www.aitmpl.com/skills

## Tokens e Contexto
- ~4 chars/token em inglês, ~2-3 em português
- Context window: limite total de tokens (entrada + saída)
- Informação no meio do contexto pode ser esquecida (*lost in the middle*)

## Temperatura
- 0: determinístico (código, dados) | 0.7+: criativo (texto)

## Agentes
- ReAct: Reason → Act → Observe (loop)
- Subagents: especializados, chamados pelo orquestrador
- Custo: proporcional a turnos × tokens

## RAG vs Fine-tuning
- RAG: contexto em runtime, bom para conhecimento mutável
- Fine-tuning: estilo/formato, não para fatos novos

## Modelos (Gemini)
- Gemini 2.5 Pro: arquitetura, decisões críticas
- Gemini 2.0 Flash: implementação, equilíbrio custo/qualidade
- Gemini 2.0 Flash Lite: formatação, boilerplate

## Referências
- https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- https://skills.sh | https://www.aitmpl.com/skills
```

- [ ] **Step 9: Criar templates/.agent/skills/semantic-commit/SKILL.md**

```markdown
---
name: semantic-commit
description: Commit semântico. Usar quando: "commit", "salvar", "cn".
---

# Semantic Commit

Formato: `[type]: [descrição] : [dd/mm/yy] - [hh:mm]`

Tipos: feat | fix | refactor | style | docs | test | chore | perf

Passos:
1. `git status` e `git diff --staged`
2. Identificar tipo
3. `git add <arquivos> && git commit -m "[type]: [desc] : $(date '+%d/%m/%y - %H:%M')"`

Nunca commitar `.env`.
```

- [ ] **Step 10: Criar templates/.agent/subagents/task-router.md**

```markdown
---
name: task-router
description: Roteia subtarefas para modelo/specialist correto.
---

Especialista em roteamento de tarefas para {{PROJECT_NAME}} ({{STACK}}).

Responsabilidades:
1. Dividir requests em subtarefas
2. Modelo alto (opus/o1): arquitetura e bugs críticos
3. Modelo médio (sonnet/o4-mini): implementação
4. Modelo baixo (haiku/flash-lite): boilerplate

Formato: subtarefa | modelo | motivo
```

- [ ] **Step 11: Commit**

```bash
git add templates/
git commit -m "$(cat <<'EOF'
feat: templates de agents, hooks e configs para Claude/Codex/Gemini/.agent : 13/04/26

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Script principal — init-ai.mjs

**Files:**
- Create: `scripts/init-ai.mjs`

- [ ] **Step 1: Criar scripts/init-ai.mjs**

```javascript
#!/usr/bin/env node
/**
 * init-ai — AI Agent Scaffold Generator
 * Gera infraestrutura de AI agents em qualquer repositório.
 * Uso: node scripts/init-ai.mjs
 */

import { input, select, checkbox, confirm } from '@inquirer/prompts';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import https from 'node:https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');
const TARGET_DIR = process.cwd();

// ── Funções utilitárias exportadas (testáveis) ───────────────────────────────

export function replacePlaceholders(content, vars) {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, value ?? ''),
    content
  );
}

export function getTemplateFiles(clis) {
  const files = [
    { src: 'CLAUDE.md', dest: 'CLAUDE.md' },
    { src: 'AGENTS.md', dest: 'AGENTS.md' },
    { dest: 'GEMINI.md', symlink: 'AGENTS.md' },
  ];

  if (clis.includes('claude')) {
    files.push(
      { src: '.claude/settings.json', dest: '.claude/settings.json' },
      { src: '.claude/SKILLS.md', dest: '.claude/SKILLS.md' },
      { src: '.claude/skills/semantic-commit/SKILL.md', dest: '.claude/skills/semantic-commit/SKILL.md' },
      { src: '.claude/skills/code-review/SKILL.md', dest: '.claude/skills/code-review/SKILL.md' },
      { src: '.claude/skills/debug-workflow/SKILL.md', dest: '.claude/skills/debug-workflow/SKILL.md' },
      { src: '.claude/skills/llm-wiki/SKILL.md', dest: '.claude/skills/llm-wiki/SKILL.md' },
      { src: '.claude/hooks/git-setup.sh', dest: '.claude/hooks/git-setup.sh', executable: true },
      { src: '.claude/agents/task-router.md', dest: '.claude/agents/task-router.md' },
      { src: '.claude/agents/code-reviewer.md', dest: '.claude/agents/code-reviewer.md' },
      { src: '.claude/agents/debugger.md', dest: '.claude/agents/debugger.md' }
    );
  }

  if (clis.includes('codex')) {
    files.push(
      { src: '.codex/settings.json', dest: '.codex/settings.json' },
      { src: '.codex/commands/project-commit.md', dest: '.codex/commands/project-commit.md' },
      { src: '.codex/agents/task-router.md', dest: '.codex/agents/task-router.md' }
    );
  }

  if (clis.includes('gemini')) {
    files.push(
      { src: '.gemini/skills/llm-wiki/SKILL.md', dest: '.gemini/skills/llm-wiki/SKILL.md' }
    );
  }

  if (clis.includes('copilot')) {
    files.push(
      { src: '.agent/skills/semantic-commit/SKILL.md', dest: '.agent/skills/semantic-commit/SKILL.md' },
      { src: '.agent/subagents/task-router.md', dest: '.agent/subagents/task-router.md' }
    );
  }

  return files;
}

// ── Detecção de CLIs instalados ──────────────────────────────────────────────

function detectCli(name) {
  try {
    execSync(`which ${name}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// ── Fetch de skills externas (skills.sh) ─────────────────────────────────────

async function fetchExtraSkillsCatalog() {
  return new Promise((resolve) => {
    const req = https.get(
      'https://skills.sh/api/catalog',
      { timeout: 5000 },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try { resolve(JSON.parse(data)); }
          catch { resolve(null); }
        });
      }
    );
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

// ── Escrita de arquivos ───────────────────────────────────────────────────────

function writeFiles(files, vars, conflictStrategy) {
  const written = [];
  const skipped = [];

  for (const file of files) {
    const destPath = path.join(TARGET_DIR, file.dest);
    const exists = fs.existsSync(destPath);

    if (exists && conflictStrategy === 'skip') {
      skipped.push(file.dest);
      continue;
    }

    if (exists && conflictStrategy === 'backup') {
      fs.renameSync(destPath, destPath + '.bak');
    }

    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    if (file.symlink) {
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      fs.symlinkSync(file.symlink, destPath);
      written.push(file.dest);
      continue;
    }

    const srcPath = path.join(TEMPLATES_DIR, file.src);
    const raw = fs.readFileSync(srcPath, 'utf8');
    const content = replacePlaceholders(raw, vars);
    fs.writeFileSync(destPath, content, 'utf8');

    if (file.executable) fs.chmodSync(destPath, '755');
    written.push(file.dest);
  }

  return { written, skipped };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🤖  AI Agent Scaffold Generator');
  console.log('─'.repeat(40));
  console.log(`Destino: ${TARGET_DIR}\n`);

  // Etapa 1 — Contexto do projeto
  const projectName = await input({
    message: 'Nome do projeto:',
    default: path.basename(TARGET_DIR),
  });

  const description = await input({
    message: 'Descrição curta:',
    default: 'Projeto com suporte a AI agents',
  });

  const language = await select({
    message: 'Linguagem principal:',
    choices: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Outra'].map(v => ({ value: v, name: v })),
  });

  const stack = await input({
    message: 'Stack/frameworks (opcional):',
    default: language,
  });

  // Etapa 2 — Seleção de CLIs
  const detected = {
    claude: detectCli('claude'),
    codex: detectCli('codex'),
    gemini: detectCli('gemini'),
    copilot: detectCli('gh'),
  };

  const selectedClis = await checkbox({
    message: 'Quais AI CLIs você usa? (espaço para marcar)',
    choices: [
      {
        name: `Claude Code  [recomendado${detected.claude ? ' ✓ instalado' : ''}]`,
        value: 'claude',
        checked: true,
      },
      {
        name: `OpenAI Codex CLI${detected.codex ? '  ✓ instalado' : ''}`,
        value: 'codex',
        checked: detected.codex,
      },
      {
        name: `Gemini CLI${detected.gemini ? '  ✓ instalado' : ''}`,
        value: 'gemini',
        checked: detected.gemini,
      },
      {
        name: `GitHub Copilot CLI${detected.copilot ? '  ✓ instalado' : ''}`,
        value: 'copilot',
        checked: detected.copilot,
      },
    ],
  });

  // Claude sempre incluído
  const clis = selectedClis.includes('claude') ? selectedClis : ['claude', ...selectedClis];

  // Etapa 3 — Skills extras
  const wantExtra = await confirm({
    message: 'Instalar skills adicionais do skills.sh/aitmpl.com?',
    default: false,
  });

  const vars = {
    PROJECT_NAME: projectName,
    PROJECT_DESCRIPTION: description,
    LANGUAGE: language,
    STACK: stack,
  };

  // Etapa 4 — Verificar conflitos
  const files = getTemplateFiles(clis);
  const conflicts = files.filter(f => !f.symlink && fs.existsSync(path.join(TARGET_DIR, f.dest)));

  let conflictStrategy = 'skip';
  if (conflicts.length > 0) {
    console.log(`\n⚠️  ${conflicts.length} arquivo(s) existente(s):`);
    conflicts.forEach(f => console.log(`   ${f.dest}`));
    conflictStrategy = await select({
      message: 'Como proceder?',
      choices: [
        { value: 'skip', name: 'Pular arquivos existentes (seguro)' },
        { value: 'overwrite', name: 'Sobrescrever tudo' },
        { value: 'backup', name: 'Fazer backup (.bak) e sobrescrever' },
      ],
    });
  }

  // Etapa 5 — Resumo e confirmação
  console.log(`\nSerão criados/verificados ${files.length} arquivo(s):\n`);
  files.forEach(f => {
    const isConflict = conflicts.some(c => c.dest === f.dest);
    const marker = isConflict ? '⚠ ' : '  ';
    console.log(`  ${marker}${f.dest}${f.symlink ? ' → ' + f.symlink : ''}`);
  });

  const confirmed = await confirm({ message: '\nConfirmar instalação?', default: true });
  if (!confirmed) {
    console.log('\nCancelado.');
    process.exit(0);
  }

  // Etapa 6 — Escrever arquivos
  const { written, skipped } = writeFiles(files, vars, conflictStrategy);

  // Etapa 7 — Skills externas (opcional)
  if (wantExtra) {
    console.log('\nBuscando catálogo de skills externas...');
    const catalog = await fetchExtraSkillsCatalog();
    if (catalog) {
      console.log('Catálogo disponível em: https://skills.sh');
    } else {
      console.log('⚠️  Não foi possível conectar ao skills.sh. Acesse manualmente:');
    }
    console.log('   → https://skills.sh');
    console.log('   → https://www.aitmpl.com/skills');
  }

  // Resumo final
  console.log('\n' + '─'.repeat(40));
  console.log(`✅  Scaffold instalado em ${TARGET_DIR}`);
  console.log(`   ${written.length} arquivo(s) criado(s)${skipped.length > 0 ? `, ${skipped.length} pulado(s)` : ''}`);
  console.log('\nPróximos passos:');
  console.log('  1. Revise CLAUDE.md e AGENTS.md e ajuste ao seu projeto');
  console.log('  2. Personalize as skills em .claude/skills/');
  console.log('  3. Execute: claude  (ou codex / gemini)');
  console.log('  4. Skills externas: https://skills.sh | https://www.aitmpl.com/skills');
  console.log('');
}

main().catch(err => {
  console.error('\n❌ Erro:', err.message);
  process.exit(1);
});
```

- [ ] **Step 2: Rodar testes (agora devem passar)**

```bash
cd /Users/andersonlimadev/Projects/IA/ai-starter-kit
node --test tests/init-ai.test.mjs
```

Saída esperada:
```
▶ replacePlaceholders substitui todas as ocorrências
  ✔ replacePlaceholders substitui todas as ocorrências (Xms)
▶ replacePlaceholders não altera texto sem placeholders
  ✔ ...
▶ getTemplateFiles sempre inclui claude quando selecionado
  ✔ ...
... (todos 7 testes passando)
```

- [ ] **Step 3: Verificar que o script pode ser importado sem erros**

```bash
node --input-type=module <<'EOF'
import { replacePlaceholders, getTemplateFiles } from './scripts/init-ai.mjs';
console.log('Import OK');
console.log('Files para claude:', getTemplateFiles(['claude']).length, 'arquivos');
EOF
```

Saída esperada:
```
Import OK
Files para claude: 11 arquivos
```

- [ ] **Step 4: Commit**

```bash
git add scripts/init-ai.mjs
git commit -m "$(cat <<'EOF'
feat: script init-ai.mjs com onboarding interativo e scaffold de AI agents : 13/04/26

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Smoke test e atualização do README

**Files:**
- Modify: `README.md` (adicionar seção init-ai)
- Modify: `scripts/setup.sh` (mencionar init-ai como próximo passo)

- [ ] **Step 1: Verificar smoke test manual do script**

```bash
cd /tmp && mkdir test-ai-scaffold && cd test-ai-scaffold && git init -q
node /Users/andersonlimadev/Projects/IA/ai-starter-kit/scripts/init-ai.mjs <<'EOF'
test-projeto
Projeto de teste
TypeScript
Next.js


n
y
EOF
```

Verificar que os arquivos foram criados:

```bash
ls CLAUDE.md AGENTS.md GEMINI.md .claude/settings.json .claude/skills/semantic-commit/SKILL.md
```

Saída esperada: todos os arquivos listados sem erro.

- [ ] **Step 2: Verificar substituição de placeholders**

```bash
grep "test-projeto" CLAUDE.md
grep "test-projeto" AGENTS.md
grep "Next.js" .claude/settings.json
```

Saída esperada: linhas com o conteúdo correto substituído (sem `{{PROJECT_NAME}}`).

- [ ] **Step 3: Verificar GEMINI.md como symlink**

```bash
ls -la GEMINI.md
```

Saída esperada: `GEMINI.md -> AGENTS.md`

- [ ] **Step 4: Limpar teste**

```bash
rm -rf /tmp/test-ai-scaffold
```

- [ ] **Step 5: Adicionar seção init-ai ao README.md**

No README.md existente, após a seção `## Quickstart (5 minutos)`, adicionar:

```markdown
## Init AI — Scaffold para qualquer repositório

O script `init-ai` gera toda a infraestrutura de AI agents em qualquer repositório existente:

```bash
# No diretório do seu projeto:
node /path/to/ai-starter-kit/scripts/init-ai.mjs

# Ou via npm (se instalado como devDep):
npm run init-ai
```

O script irá:
1. Perguntar o nome, stack e linguagem do projeto
2. Detectar CLIs instalados (Claude Code sugerido por padrão)
3. Gerar `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.claude/skills/`, `.claude/agents/` e mais
4. Oferecer skills adicionais do [skills.sh](https://skills.sh) e [aitmpl.com](https://www.aitmpl.com/skills)

**Skills incluídas por padrão:** `semantic-commit`, `code-review`, `debug-workflow`, `llm-wiki`
```

- [ ] **Step 6: Rodar todos os testes**

```bash
cd /Users/andersonlimadev/Projects/IA/ai-starter-kit
node --test tests/init-ai.test.mjs
```

Saída esperada: 7 testes passando.

- [ ] **Step 7: Commit final**

```bash
git add README.md scripts/setup.sh
git commit -m "$(cat <<'EOF'
docs: adicionar seção init-ai ao README e referências no setup.sh : 13/04/26

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review

### Cobertura do spec

| Requisito do spec | Coberto por |
|---|---|
| Script Node.js com @inquirer/prompts | Task 1 (setup) + Task 5 (script) |
| Templates em `templates/` | Tasks 2, 3, 4 |
| 4 skills embutidas | Task 3 |
| 3 subagents | Task 4 |
| 4 CLIs com Claude como padrão | Task 5 (getTemplateFiles + checkbox) |
| Detecção automática de CLIs | Task 5 (detectCli) |
| Skills externas via skills.sh | Task 5 (fetchExtraSkillsCatalog) |
| Fallback offline | Task 5 (try/catch no fetch) |
| Conflito: 3 estratégias | Task 5 (conflictStrategy) |
| GEMINI.md como symlink | Task 5 (writeFiles com file.symlink) |
| Substituição de placeholders | Task 5 (replacePlaceholders) |
| Testes unitários | Tasks 1 + 5 |
| README atualizado | Task 6 |
| Smoke test | Task 6 |

### Verificações adicionais

- `replacePlaceholders` exportada e testada ✓
- `getTemplateFiles` exportada e testada ✓
- Nomes de função consistentes entre testes (Task 1) e implementação (Task 5) ✓
- Paths absolutos em todos os passos ✓
- Sem TBDs ou placeholders não resolvidos ✓
