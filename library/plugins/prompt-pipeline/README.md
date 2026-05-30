# prompt-pipeline

Stage **0→1→2** orchestration layer for coding agents, packaged as one co-versioned Claude Code plugin. The three skills are **not redundant** — they form a pipeline, each with a distinct deliverable, sharing **one `EXEC-MAP` contract** so intent is classified once instead of three times.

```
senior-prompt-engineer  (stage 0)  refine prompt + emit EXEC-MAP v1
        ↓ contract
skills-selector         (stage 1)  consume intent+skills → SKILLS: block
        ↓ contract
smart-dispatch          (stage 2)  consume effort+models → route agent/model/provider
        ↓
execution
```

## Skills

| Skill | Stage | Deliverable |
|-------|-------|-------------|
| `senior-prompt-engineer` | 0 | Definitive prompt + `EXEC-MAP v1` (intent, effort, time, tokens, skills, models, mcp) |
| `skills-selector` | 1 | `SKILLS: []` block — which skills load (consumes `EXEC-MAP.intent`/`.skills`) |
| `smart-dispatch` | 2 | Agent/model/provider routing + RTK Tier-0 bypass (consumes `EXEC-MAP.effort`/`.models`) |

## Command

`/prompt-pipeline [request]` — runs all three stages in order, passing the same `EXEC-MAP` down the chain. Omit the request to operate on the current chat.

## The EXEC-MAP contract

`senior-prompt-engineer` emits this once; downstream stages **consume, validate, prune** — they never re-classify from scratch. That's the anti-overlap fix.

```
EXEC-MAP v1
intent:   build-code
executor: claude
effort:   medium
time:     ~15–30 min
tokens:   ~12k–25k
skills:   [smart-dispatch, git-commit]
models:   {plan: opus, impl: sonnet, mechanical: haiku}
agents:   inline
mcp:      [context-mode]
notes:    TBD — confirm target files
```

## Why a plugin (not a merge)

- **Cohesion**: the three are one orchestration layer — packaging them together makes the unit explicit.
- **Co-versioning**: changing the pipeline order = one release, not three loose edits.
- **Distribution**: one install delivers the whole layer (see `marketplace.json`).
- **No collapse**: kept as three separate `SKILL.md` files to preserve the triviality gate and on-demand token-saving load — collapsing into one skill would lose both.

## Install

Claude Code: add the marketplace, then install `prompt-pipeline`. Skills become available as `senior-prompt-engineer`, `skills-selector`, `smart-dispatch`; the command as `/prompt-pipeline`.

Cross-CLI (Codex/Gemini/OpenCode/lemon): skills are executor-aware — model tiers map to the target CLI's quality/balanced/budget tiers, noted in `EXEC-MAP.notes`.
