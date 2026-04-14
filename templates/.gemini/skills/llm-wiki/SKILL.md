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
