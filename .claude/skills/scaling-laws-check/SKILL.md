---
name: scaling-laws-check
description: Estimate cost / compute / data tradeoff before fine-tuning or scaling. Applies Chinchilla scaling, FLOP budgets, and rough cloud cost. Triggers on "should I fine-tune", "estimate training cost", "scaling laws", "chinchilla optimal".
---

# scaling-laws-check

## Inputs to gather
- Goal model size (N params)
- Available training tokens (D)
- Hardware (GPU type, count, hours)
- Cloud rate ($/GPU-hour)

## Computations
1. **Chinchilla optimal**: D_optimal ≈ 20 × N. Flag if D < 0.5 × D_optimal (under-trained) or > 5 × D_optimal (diminishing returns).
2. **FLOPs**: 6 × N × D for training (Kaplan/Chinchilla).
3. **Wall time**: FLOPs / (GPUs × FLOPs/s × MFU).  Assume MFU 0.4.
4. **Cost**: wall_time × GPUs × $/hr.
5. **Compare alternatives**: LoRA fine-tune, prompt eng + RAG, distillation, smaller base.

## Output
```
Plan: fine-tune 7B on 2B tokens
  Chinchilla opt: 140B tokens — UNDER-TRAINED, expect modest gain
  FLOPs:         8.4e19
  8×A100:        ~14 days at MFU 0.4
  Cost:          ~$10,800
Alternatives:
  LoRA (r=16):   ~$80, 6h, often 90% of full FT quality
  RAG + prompt:  ~$0, hours, recoverable
Recommend: LoRA first, measure, escalate if needed.
```

## Reference
Chinchilla paper; Karpathy "Deep Dive into LLMs" pre-training section.
