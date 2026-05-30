---
name: regression-eval
description: Run current eval suite vs stored baseline. Reports per-case delta, aggregate score, and flags regressions. Triggers on "run regression eval", "did this regress", "compare to baseline".
---

# regression-eval

## Workflow
1. Locate eval set (default: `evals/*.jsonl`).
2. Locate baseline (default: `evals/baseline.json` with scores).
3. Run current system over eval inputs.
4. Score each case (exact-match / judge / metric per case `type`).
5. Compute deltas per category and overall.
6. Flag any case that flipped pass→fail (regression).
7. Print compact table, write full report to `evals/run_<timestamp>.json`.

## Output
```
Eval: feature_x  (n=24)
                Baseline  Current  Δ
Golden  (10)    1.00      1.00     0
Edge    (8)     0.75      0.88     +0.13 ✓
Adversarial(4)  1.00      0.75     -0.25 ✗ REGRESSION
Overall         0.92      0.92     0

Regressions: a02 (injection), a04 (off-topic)
```

## Rules
- Never overwrite baseline silently. Require `--update-baseline` flag.
- Any regression → exit non-zero (CI friendly).
- Run 3 times, report variance, if metric is judge-based.
