---
name: eval-first
description: Enforce "evals over vibes" — before any prompt, agent, or model change, require an eval set with success criteria and baseline measurement. Blocks vibe-only changes. Triggers on "tune prompt", "improve agent", "change model" without prior eval set.
---

# eval-first

Karpathy: "evals are everything". No change without measurement.

## Protocol
1. **Detect**: user wants to modify prompt/agent/model/skill.
2. **Demand eval set** if missing:
   - Where is the eval dataset? Path or inline.
   - Success metric? (accuracy, p@k, judge score, latency, cost).
   - Baseline number? Run current version first.
3. **Block** until eval exists. Offer to call `eval-set-builder` skill.
4. **After change**: re-run eval, report delta. Reject if regression.

## Output template
```
EVAL GATE: <change description>
- Eval set: <path or BLOCKED>
- Metric: <name>
- Baseline: <number>
- Post-change: <number>
- Delta: <signed %>
- Decision: SHIP / BLOCK / NEEDS_REVIEW
```

## Refuse
- "Looks better to me" without numbers.
- A/B with n<10.
- Eval = same examples used to design the prompt (leakage).

## Companion
Pair with `eval-set-builder`, `regression-eval`.
