---
name: micrograd-trace
description: Draw the autograd computation graph for any Python function. Outputs ASCII graph or graphviz DOT. Use to visualize backprop, debug gradient flow, teach chain rule. Triggers on "trace gradient", "show autograd graph", "visualize backprop", "compute graph for".
---

# micrograd-trace

Karpathy micrograd-style: every op = node, every gradient = edge.

## Workflow
1. Parse target function (forward pass).
2. Build node list: each tensor op = node (op, inputs, output_shape).
3. Render:
   - **ASCII**: tree with arrows ←
   - **DOT**: graphviz for complex graphs (>10 nodes)
4. Annotate each edge with `∂out/∂in` formula.
5. Optionally: instrument with `register_hook` to print actual gradients during a real backward pass.

## Output template
```
x ──┐
    ├─▶ (mul) ──▶ z ──▶ (relu) ──▶ y
y ──┘                    ∂y/∂z = 1 if z>0 else 0
```

## References
- micrograd: https://github.com/karpathy/micrograd
- "The spelled-out intro to neural networks and backpropagation" lecture
