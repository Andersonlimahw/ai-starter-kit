---
name: makemore-style
description: Generate a progressive learning notebook for any domain — starts at bigram baseline, escalates to MLP, RNN, transformer. Each stage adds one concept. Karpathy makemore pedagogy. Triggers on "build progressive notebook", "makemore-style tutorial", "teach me X step by step".
---

# makemore-style

Layered teaching: each model is one step deeper than the last. Run, compare loss, then add complexity.

## Stages template
1. **Counting baseline** — frequency table. No learning, just statistics.
2. **Bigram NN** — single linear layer, learn what counting did.
3. **MLP** — context window, embeddings, hidden layer (Bengio 2003).
4. **WaveNet / dilated** — hierarchical context.
5. **Transformer** — attention replaces fixed mixing.

## Per-stage requirements
- Same dataset, same eval (loss + samples).
- Show parameter count delta.
- Show loss delta vs prior stage.
- One paragraph: "what did this stage buy us?"

## Output
Single `.ipynb` or markdown with code blocks, one section per stage.

## Reference
- makemore: https://github.com/karpathy/makemore
- "Building makemore" lecture series
