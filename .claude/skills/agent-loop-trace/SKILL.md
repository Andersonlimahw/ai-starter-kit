---
name: agent-loop-trace
description: Visualize an agent's perceive→think→act loop. Inspects tool calls, latency per step, decision branches, retry patterns. Surfaces bottlenecks. Triggers on "trace agent", "why is agent slow", "agent loop analysis", "what did the agent do".
---

# agent-loop-trace

## Workflow
1. Locate agent run logs / transcript.
2. Parse into steps: each step = {perceive (input), think (reasoning), act (tool call), observe (result)}.
3. Compute per-step metrics: latency, tokens in/out, tool used, error?
4. Render timeline + decision tree.
5. Flag patterns: retry loops, redundant tool calls, hallucinated tools, premature termination.

## Output
```
Run: agent_xyz  (total 47s, $0.18, 23 steps)

Step | t(s)| Tokens | Action
  1  | 0.4 | 220/80 | perceive: user prompt
  2  | 2.1 | 280/40 | think: plan 3 steps
  3  | 8.2 | 120/0  | tool: search ✓
  4  | 1.1 | 140/60 | think: refine
  5  | 7.8 | 110/0  | tool: search ✗ (same query)  ← REDUNDANT
  6  | ...

Anti-patterns detected:
  • Same search query twice (steps 3, 5)
  • Long think gap with no progress (steps 11-14)
  • Final answer not grounded in tool results
```

## Reference
"How I use LLMs" / "Deep Dive into LLMs" Karpathy talks
