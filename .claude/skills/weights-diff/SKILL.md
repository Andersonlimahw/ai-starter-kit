---
name: weights-diff
description: Semantic diff between two model checkpoints, configs, or training runs. Reports param count delta, layer changes, hyperparam delta, eval score delta. Triggers on "diff checkpoints", "compare models", "what changed in this checkpoint".
---

# weights-diff

## Workflow
1. Accept two checkpoints (paths or run IDs).
2. Compare:
   - **Architecture**: layer count, dims, head count — flag any change.
   - **Param count**: total + per-layer.
   - **Weights**: per-tensor norm delta, top-k most-changed tensors.
   - **Config**: hyperparams diff (lr, batch, schedule, dropout).
   - **Training**: steps, dataset hash, seed.
   - **Eval**: scores on shared eval set.
3. Surface anomalies: silent arch changes, weight reinit, eval regression.

## Output
```
Checkpoint diff: v1 → v2

Arch:           identical
Params:         124M → 124M (Δ 0)
Top changed:    layer.10.mlp.fc.weight  ||Δ|| = 0.42
                layer.0.attn.qkv.weight ||Δ|| = 0.31
Config:         lr 3e-4 → 1e-4, batch 32 → 64
Train steps:    50k → 80k (+30k)
Dataset:        same hash ✓
Eval:           0.71 → 0.74  (+0.03 ✓)
```

## Refuse
- Comparing across different architectures silently — force explicit ack.
