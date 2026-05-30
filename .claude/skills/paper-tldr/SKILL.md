---
name: paper-tldr
description: Karpathy-style TL;DR of an ML paper — intuition first, math second, with a runnable code sketch and "why this matters". Triggers on "tldr paper", "explain this paper", "summarize arxiv", "paper summary".
---

# paper-tldr

## Output template
```
# <Paper Title>
**Authors** · **Date** · **arxiv:NNNN.NNNNN**

## The Pitch (1 sentence)
<one sentence stating the contribution>

## Intuition (3-5 sentences)
<plain-English why it works, before any math>

## Method (key equations only)
<2-3 equations, annotated>

## Code sketch
```python
# <20-line minimal implementation showing core idea>
```

## Results (the one number that matters)
<single most-important benchmark + delta vs prior SOTA>

## Why it matters
<2 sentences: what this unlocks, what's still open>

## Karpathy take
<honest assessment: is this incremental or paradigm-shift, what would you build on top>

## Read if you care about
<bullet list of topics this is essential reading for>
```

## Style rules
- Intuition before math. Always.
- One number, not a table.
- Code sketch must be runnable on a laptop, even at toy scale.
- Skip ablation tables. Reference, don't reproduce.
