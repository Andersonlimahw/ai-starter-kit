---
name: vibe-detector
description: Scan a repo or diff for "vibe-coded" sections — code that lacks tests, evals, logging, error handling, or has hardcoded prompts/magic numbers. Karpathy warning lens. Triggers on "vibe check", "audit for vibes", "is this vibe-coded".
---

# vibe-detector

Karpathy: vibe coding is fine for hobby, dangerous in prod.

## Signals (each adds vibe-score)
| Signal | Points |
|--------|--------|
| Function >50 lines no test | +2 |
| Prompt string hardcoded inline | +3 |
| Magic numbers (no const) | +1 |
| No error handling on API call | +2 |
| No logging in agent loop | +2 |
| Eval missing for AI feature | +3 |
| LLM call with `temperature` unspecified | +1 |
| TODO / FIXME / "for now" | +1 each |
| Commented-out code blocks | +1 |
| `any` / `# type: ignore` clusters | +2 |

## Output
```
Vibe report — <path>
Score: 14 (HIGH — refactor before ship)

Hotspots:
  src/agent.py:42  hardcoded prompt (3 pts)
  src/agent.py:88  no error handling on openai.chat (2 pts)
  src/eval/      MISSING — AI feature has no evals (3 pts)
```

## Thresholds
- 0-3: ship.
- 4-9: review.
- 10+: block, refactor.
