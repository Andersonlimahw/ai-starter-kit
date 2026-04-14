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
