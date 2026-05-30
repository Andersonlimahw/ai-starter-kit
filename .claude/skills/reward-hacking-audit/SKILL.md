---
name: reward-hacking-audit
description: Audit an eval, reward function, or agent for reward hacking / Goodhart's law / spec gaming. Karpathy "outcome supervision" lens. Triggers on "reward hacking", "goodhart check", "is this metric gameable", "spec gaming".
---

# reward-hacking-audit

## Failure modes to detect
1. **Proxy metric**: target measurable thing ≠ thing you want.
2. **Lexical match**: judge keyword-matches without semantic check.
3. **Length bias**: longer = higher score regardless of correctness.
4. **Style bias**: judge prefers tone over correctness.
5. **Self-preference**: model judges itself favorably.
6. **Refusal exploit**: high score by refusing everything.
7. **Format hack**: scoring rewards format compliance, model ignores task.
8. **Adversarial gradient**: optimizer drives model into weird basin.

## Workflow
1. Read eval rubric / reward function.
2. For each failure mode: can the agent achieve high score WITHOUT solving the task?
3. Suggest counter-eval cases that detect the hack.
4. Recommend fixes (multi-judge, holdout adversarial, human-spot-check).

## Output
```
Reward audit: <eval name>

Risk     Mode               Evidence                Fix
HIGH     Length bias        rubric: "thorough"      cap length, score per-claim
MED      Self-preference    judge=same model        use different model as judge
LOW      Refusal exploit    refusal score = 0       ✓ handled
```

## Reference
Karpathy on RLHF limitations; "outcome supervision" discussions.
