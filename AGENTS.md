# AI Agents Starter Kit — Working Agreement

Este repositório é um **harness** (ambiente de execução) para agentes de IA. Ele define contratos, regras e ferramentas para garantir que a IA opere de forma segura, previsível e idiomática.

---

## 📂 Índice de Documentação (`/docs`)

Consulte estes documentos para entender as entranhas e o futuro deste kit:

- **[README-en.md](./docs/README-en.md)**: English version and international SEO targets.
- **superpowers/**: Arquitetura de "superpoderes" e automações avançadas.
    - **plans/**:
        - [2026-04-13-init-ai-scaffold.md](./docs/superpowers/plans/2026-04-13-init-ai-scaffold.md): Plano de implementação do scaffold automatizado.
    - **specs/**:
        - [2026-04-13-init-ai-scaffold-design.md](./docs/superpowers/specs/2026-04-13-init-ai-scaffold-design.md): Spec técnica do gerador `init-ai`.

---

## 📜 Contrato do Agente (Boris Best Practices)

Ao operar neste repositório, você deve seguir este contrato operacional:

### 1. Intenção e Planejamento
- **Modo Plano**: Para qualquer tarefa que envolva mais de um arquivo ou lógica complexa, você **deve** começar em modo de plano (`Plan Mode`).
- **Verificação Empírica**: Antes de corrigir um bug, você deve reproduzi-lo com um script ou teste que falhe.

### 2. Estilo e Convenções
- **Stack**: Node.js (TypeScript) e Python.
- **Commits**: Use a skill `semantic-commit`. Formato: `[type]: [desc] : dd/mm/yy - hh:mm`.
- **Linguagem**: Documentação e commits em **Português (pt-BR)**, código e variáveis em **Inglês**.

### 3. Regras de "Nunca" (Hard Guardrails)
- **NUNCA** commite arquivos `.env` ou segredos.
- **NUNCA** execute comandos contra produção sem aprovação humana explícita.
- **NUNCA** ignore falhas de linter ou typecheck ao finalizar uma tarefa.

---

## 🛠️ Skills e Subagents

| Nome | Tipo | Função Principal |
|---|---|---|
| `semantic-commit` | Skill | Gera mensagens de commit semântico com timestamp. |
| `code-review` | Skill | Checklist de qualidade, segurança e performance. |
| `debug-workflow` | Skill | Metodologia científica: Reproduzir -> Isolar -> Corrigir. |
| `llm-wiki` | Skill | Base de conhecimento sobre tokens, RAG e agentes. |
| `task-router` | Agent | Roteia tarefas complexas para o modelo ideal (Opus/Sonnet/Haiku). |

---

## 🦾 Modelos Suportados

- **Claude Code**: Recomendado para execução complexa e refatoração.
- **Gemini CLI**: Ideal para análise de contexto longo (logs, docs extensos).
- **Codex CLI**: Execuções rápidas e geração de boilerplate.

---

## 🔐 Checklist de Segurança
- [ ] Variáveis de ambiente isoladas no `.env`.
- [ ] Stage de arquivos revisado (`git status`).
- [ ] Comandos `Bash` perigosos confirmados manualmente.

---

*Para dúvidas ou expansão, utilize a skill `llm-wiki` ou consulte [lemon.dev](https://lemon.dev).*
