# Agente Depurador – Claude Code

Este exemplo demonstra um agente de **depuração de código** usando Claude Code.

## O que ele faz

- Analisa o código em busca de bugs e erros
- Usa habilidade `SearchLogs` para checar logs de execução
- Cria sub-agentes para análise paralela quando necessário
- Sugere correções com explicações claras

## Como usar

```bash
# Na raiz do kit:
cd examples/depurador-claude
claude
```

O Claude Code irá ler o `CLAUDE.md` desta pasta e agir como um agente de depuração especializado.

## Estrutura

```
depurador-claude/
├── AGENTS.md       # Este arquivo (documentação do agente)
├── CLAUDE.md       # Instruções para o Claude Code
├── sample_bug.py   # Código de exemplo com bugs para depurar
└── memory_log.json # Log de memória do agente (gerado ao usar)
```

## Exemplo de uso

```
Você: Analise o arquivo sample_bug.py e encontre todos os bugs.

Claude: Vou analisar o arquivo...
[lê sample_bug.py]
Encontrei 3 problemas:
1. Linha 12: divisão por zero possível quando `count = 0`
2. Linha 28: variável `result` usada antes de ser inicializada
3. Linha 45: loop infinito se `items` estiver vazio
...
```
