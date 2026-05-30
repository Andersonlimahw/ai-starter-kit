---
name: llm-from-scratch
description: Generate minimal, runnable from-scratch implementation of LLM concepts (attention, BPE tokenizer, backprop, RoPE, KV-cache, MoE, LoRA, RLHF). Karpathy-style pedagogy — code first, theory in comments. Triggers on "explain X from scratch", "minimal X implementation", "show me how X works in code", "build X from zero".
---

# llm-from-scratch

Karpathy pedagogy: explain by **building**. Output single runnable file <100 lines.

## Workflow
1. Identify concept (attention, tokenizer, backprop, RoPE, KV-cache, MoE, LoRA, sampling, RLHF reward model).
2. Pick toy scale (vocab=27, dim=32, seq=8) to keep readable.
3. Write torch/numpy code, dense comments explaining each line.
4. End with `if __name__ == "__main__":` smoke test printing shapes/loss.
5. Include 2-line "what this teaches" comment at top.

## Style rules
- No frameworks (no HF transformers). Just torch + math.
- Variable names match papers (Q, K, V, not query_matrix).
- Comment why before what.
- Show the gradient flow explicitly when relevant.

## References
- nanoGPT: https://github.com/karpathy/nanoGPT
- micrograd: https://github.com/karpathy/micrograd
- minBPE: https://github.com/karpathy/minbpe
- Zero-to-Hero: https://karpathy.ai/zero-to-hero.html
