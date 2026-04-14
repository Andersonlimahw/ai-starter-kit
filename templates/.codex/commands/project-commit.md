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
