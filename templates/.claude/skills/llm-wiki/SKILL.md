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
