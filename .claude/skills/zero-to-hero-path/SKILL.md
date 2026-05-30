---
name: zero-to-hero-path
description: Generate a Karpathy Zero-to-Hero style learning path for any AI/ML topic. Outputs ordered: prerequisites, videos, papers, hands-on exercises, evaluation milestones. Triggers on "learning path for", "how do I learn X", "study plan", "roadmap for".
---

# zero-to-hero-path

Build study plan that mirrors Karpathy's pedagogy: code-first, build-twice (toy + real), eval each step.

## Output structure
```
# Path: <topic>

## 0. Prereqs
- skill / book / video — why needed

## 1. Foundations (build toy)
- exercise: implement X in <50 lines
- success: passes test Y

## 2. Real-world variant
- read paper / repo: <link>
- exercise: extend toy to handle Z

## 3. Stress test
- benchmark / eval: run on dataset W, target metric ≥ V

## 4. Teach back
- write blog post / lecture explaining it
```

## Rules
- 4-6 stages max. Each stage ≤ 1 week of effort.
- Every stage has a runnable artifact AND a measurable success criterion.
- Link to Karpathy videos, lectures, repos when relevant.
- No passive reading without code exercise.

## Reference
https://karpathy.ai/zero-to-hero.html
