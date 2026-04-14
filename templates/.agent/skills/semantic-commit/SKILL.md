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
