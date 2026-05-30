---
name: context-budget
description: Compute context window budget for a prompt/agent — sums system prompt, tool descriptions, examples, conversation history; flags overruns; suggests cuts. Triggers on "context budget", "how much context", "will this fit", "budget my prompt".
---

# context-budget

## Workflow
1. Identify model + context limit (Opus 200k, Sonnet 200k, Haiku 200k, GPT-4o 128k, etc.).
2. Sum components:
   - System prompt tokens
   - Tool/function schemas
   - Few-shot examples
   - Memory / retrieved docs
   - Reserved for output (subtract from budget)
3. Compute headroom = limit − sum − output_reserve.
4. If headroom < 20%: flag, suggest cuts in priority order.

## Output
```
Model: claude-opus-4-7  (200k limit)
Component        Tokens   %
System prompt    8,200    4.1%
Tool schemas     12,400   6.2%
Examples (5)     4,800    2.4%
RAG chunks (top10) 18,000 9.0%
Reserved output  -8,192   4.1%
Headroom         148,408  74.2%  ✓
```

## Reduction priorities (highest payoff first)
1. Examples: drop weakest, keep most-diverse 3.
2. Tool schemas: remove unused params, shorten descriptions.
3. System prompt: caveman-compress (call `caveman:compress`).
4. RAG: lower top-k, smaller chunks.
