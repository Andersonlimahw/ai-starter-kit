---
name: prompt-compress
description: Compress a system prompt or skill body while preserving semantic content. More aggressive than caveman:compress — targets system prompts and tool descriptions, validates with eval set. Triggers on "compress this prompt", "shrink system prompt", "reduce prompt tokens".
---

# prompt-compress

## Workflow
1. Read target prompt + eval set (REQUIRED — refuse without one).
2. Baseline: run eval, record score + token count.
3. Apply compressions iteratively (caveman style):
   - Drop articles, fillers, pleasantries.
   - Merge redundant rules.
   - Convert prose lists → bullet lists.
   - Inline examples if they replace explanation.
   - Replace verbose phrasing with technical terms.
4. Re-run eval after each pass. Stop if score drops >2%.
5. Output diff + new prompt + score+token deltas.

## Refuse to compress
- Safety / refusal instructions (those stay verbose).
- Examples (they're cheap calibration).
- Anything user marks `<keep>`.

## Output
```
Original:  4,820 tokens, eval 0.87
Pass 1:    3,100 tokens, eval 0.87  (-36%)
Pass 2:    2,400 tokens, eval 0.85  (-50%)  ← chose this
Pass 3:    1,900 tokens, eval 0.78  ✗ regression

Saved 50%. New eval within tolerance.
```

## Companion
`caveman:compress` (memory files), `eval-first` (gate).
