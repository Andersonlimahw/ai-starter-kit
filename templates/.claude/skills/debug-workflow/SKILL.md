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
