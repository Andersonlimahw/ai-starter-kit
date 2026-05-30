---
name: tokenizer-inspect
description: Inspect how text gets tokenized by BPE — count tokens, highlight edge cases (unicode, whitespace, digits, code), suggest compaction. Karpathy "Let's build the GPT Tokenizer" lens. Triggers on "count tokens", "tokenize this", "tokenizer audit", "how many tokens".
---

# tokenizer-inspect

## Workflow
1. Accept text or file path.
2. Pick tokenizer (default: tiktoken cl100k_base; allow gpt2, llama, claude estimate).
3. Output:
   - Total token count + char count + ratio.
   - First 20 token boundaries highlighted.
   - Edge case flags.
   - Compaction suggestions.

## Edge cases to flag
- Multi-byte unicode splitting weirdly (emojis, accented chars).
- Numbers tokenized per-digit (cost amplifier).
- Repeated whitespace creating extra tokens.
- Trailing spaces vs no-trailing (model behavior changes).
- Code: indentation eating tokens.

## Output template
```
Text: 1,240 chars / 387 tokens  (3.2 chars/token — normal: 4)
Top expensive sections:
  L12 "    " (4-space indent) ×40 = 80 tokens
  L88 "1234567890" → 10 separate tokens
Suggestions:
  - Replace 4-space → 2-space indent: saves ~40 tokens
  - Inline numbers as "ten" not "10": saves N tokens (if semantic)
```

## Reference
https://github.com/karpathy/minbpe
"Let's build the GPT Tokenizer" lecture
