# Agente Gerador de Código – Codex CLI

Este exemplo demonstra um agente de **geração de código** usando o OpenAI Codex CLI.

## O que ele faz

- Gera funções, classes e módulos a partir de descrições em linguagem natural
- Cria testes unitários automaticamente
- Refatora código existente seguindo boas práticas
- Usa sub-agentes para gerar e testar em paralelo

## Como usar

```bash
cd examples/gerador-codex
codex
```

Ou via linha de comando:
```bash
codex run --memory=projects.json \
  --skill "code-generation" \
  "Implemente uma classe Queue em Python com enfileirar, desenfileirar e peek."
```

## Estrutura

```
gerador-codex/
├── AGENTS.md          # Este arquivo (documentação do agente)
├── codex-agent.ts     # Exemplo de orquestração TypeScript
├── simple_agent.py    # Exemplo de agente Python
├── projects.json      # Arquivo de memória/contexto do Codex
└── generated/         # Código gerado pelo agente (criado ao usar)
```

## Exemplo de resultado

```
Você: Crie uma função de busca binária em Python com tipos.

Codex: 
def busca_binaria(lista: list[int], alvo: int) -> int:
    esquerda, direita = 0, len(lista) - 1
    while esquerda <= direita:
        meio = (esquerda + direita) // 2
        if lista[meio] == alvo:
            return meio
        elif lista[meio] < alvo:
            esquerda = meio + 1
        else:
            direita = meio - 1
    return -1
```
