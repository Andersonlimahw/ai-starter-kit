---
name: prompt-pipeline
description: Run the full stage 0→1→2 orchestration on a request — refine the prompt (senior-prompt-engineer), select skills (skills-selector), then dispatch model/agent (smart-dispatch), passing one shared EXEC-MAP contract between them.
---

# /prompt-pipeline — full orchestration in one shot

Run the three pipeline stages in order on `$ARGUMENTS` (or the current chat if empty). Each stage hands the **EXEC-MAP contract** to the next so intent is classified **once**, not three times.

## Stages

1. **senior-prompt-engineer (stage 0)** — refine the request into a definitive prompt and emit the `EXEC-MAP v1` block (intent, executor, effort, time, tokens, candidate skills, model-per-phase, mcp). Honor the triviality gate: if the request is already clear/one-line, emit `Prompt já claro; pulando refino` and skip to stage 1 with a minimal map.
2. **skills-selector (stage 1)** — **consume** `EXEC-MAP.intent` + `EXEC-MAP.skills`; validate and prune (cap 2, narrow>broad, heavy needs signal) instead of re-classifying. Emit the `SKILLS:` block.
3. **smart-dispatch (stage 2)** — **consume** `EXEC-MAP.effort` + `EXEC-MAP.models`; apply Tier 0 local-first / RTK bypass and escalation. Route and execute.

## Rules

- Pass the **same EXEC-MAP** down the chain; downstream stages refine it, never rebuild it from zero.
- Trivial request → stages 1/2 may collapse to `SKILLS: []` + inline execution.
- Keep the user's language; identifiers stay in English.
- Honor token economy (rtk, caveman in user-facing summaries; prompt artifact stays normal prose).

Invoke the skills via the platform Skill mechanism — do not paraphrase their bodies.
