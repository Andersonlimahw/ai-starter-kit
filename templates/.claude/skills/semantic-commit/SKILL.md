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
