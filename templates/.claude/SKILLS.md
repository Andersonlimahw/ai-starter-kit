# Skills Index — {{PROJECT_NAME}}

Skills disponíveis neste projeto:

| Skill | Arquivo | Trigger |
|---|---|---|
| `semantic-commit` | `.claude/skills/semantic-commit/SKILL.md` | "commit", "cn" |
| `code-review` | `.claude/skills/code-review/SKILL.md` | "review", "revisar" |
| `debug-workflow` | `.claude/skills/debug-workflow/SKILL.md` | "debug", "bug" |
| `llm-wiki` | `.claude/skills/llm-wiki/SKILL.md` | "llm", "modelo", "prompt" |

## Adicionar skills externas

```bash
# Via ai-starter-kit (interativo)
node /path/to/ai-starter-kit/scripts/init-ai.mjs --add-skill

# Via skills.sh (manual)
# Acesse https://skills.sh e copie o arquivo SKILL.md desejado
# para .claude/skills/<nome>/SKILL.md
```
