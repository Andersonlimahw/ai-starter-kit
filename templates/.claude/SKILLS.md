# Skills Index — {{PROJECT_NAME}}

Skills available in this project:

| Skill | File | Trigger |
|---|---|---|
| `semantic-commit` | `.claude/skills/semantic-commit/SKILL.md` | "commit", "cn" |
| `code-review` | `.claude/skills/code-review/SKILL.md` | "review", "review" |
| `debug-workflow` | `.claude/skills/debug-workflow/SKILL.md` | "debug", "bug" |
| `llm-wiki` | `.claude/skills/llm-wiki/SKILL.md` | "llm", "model", "prompt" |

## Add external skills

```bash
# Via ai-starter-kit (interactive)
node /path/to/ai-starter-kit/scripts/init-ai.mjs --add-skill

# Via skills.sh (manual)
# Access https://skills.sh and copy the desired SKILL.md file
# to .claude/skills/<name>/SKILL.md
```
