---
name: nanogpt-explainer
description: Re-explain any ML/AI Python file line-by-line in Karpathy lecture style. Walks reader through the code with intuition, shape annotations, and why-decisions. Triggers on "explain this file like Karpathy", "walk me through this code", "lecture-style explain", "explain line by line".
---

# nanogpt-explainer

Turn dense ML code into a lecture.

## Workflow
1. Read target file fully.
2. Group lines into logical blocks (imports, data, model, train loop, eval).
3. For each block: state purpose in one sentence, annotate tensor shapes, flag non-obvious decisions.
4. End with: "what would break if you removed this?" per block.

## Format
```
### Block: <name>  (lines X-Y)
**Purpose**: ...
**Shapes**: input (B,T) → output (B,T,V)
**Why**: ...
**Gotcha**: ...
```

## Tone
Conversational, second-person. Assume reader knows Python, not ML. Build intuition before formalism.
