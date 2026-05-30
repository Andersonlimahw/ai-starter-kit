---
name: data-is-code
description: Treat dataset / eval JSONL as code — lint, validate schema, detect duplicates, leakage between train/eval, label imbalance, PII. Karpathy "Software 2.0" lens. Triggers on "audit dataset", "lint jsonl", "check for leakage", "validate eval data".
---

# data-is-code

Karpathy: data IS the program. Lint it like code.

## Checks
1. **Schema**: every row has required keys, correct types.
2. **Duplicates**: exact + near-dup (normalized hash, embedding cosine >0.95).
3. **Leakage**: train↔eval overlap by hash, by ngram, by embedding.
4. **Balance**: label/category distribution, flag if >70% single class.
5. **PII**: regex sweep for emails, phones, SSN, credit cards, API keys.
6. **Length**: outliers (>3σ) — usually broken rows.
7. **Encoding**: invalid UTF-8, BOM, mixed line endings.

## Output
```
Dataset: evals/feature_x.jsonl  (n=240)

✓ Schema:      OK
✗ Duplicates:  12 exact (5%) — rows [22, 39, 41, ...]
✗ Leakage:     3 eval rows match train by hash
✓ Balance:     class A 52%, B 31%, C 17%
⚠ PII:         2 rows contain emails (rows 88, 142)
✓ Length:      no outliers
⚠ Encoding:    1 row has invalid UTF-8 (row 201)

Action: dedupe, fix leakage, scrub PII before training.
```

## Refuse
- Training with detected leakage.
- Eval with class imbalance >90% without explicit ack.
