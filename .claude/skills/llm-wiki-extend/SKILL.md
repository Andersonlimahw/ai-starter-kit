---
name: llm-wiki-extend
description: Add a new entry to the existing llm-wiki — following the project's template (concept → intuition → math → code → references). Maintains consistency across entries. Triggers on "add to llm-wiki", "new wiki entry", "document concept X".
---

# llm-wiki-extend

Extends the existing `llm-wiki` skill / docs without diverging from its style.

## Workflow
1. Detect existing wiki location (likely `docs/llm-wiki/` or `skills/llm-wiki/`).
2. Read 2-3 existing entries to learn the house style.
3. Match: heading hierarchy, code block conventions, citation format.
4. Write new entry following template below.
5. Update index / TOC if present.

## Entry template
```markdown
# <Concept>

## TL;DR
<one paragraph>

## Intuition
<plain English, analogy if useful>

## Formal
<math, equations, definitions>

## Code (toy)
```python
# minimal demo
```

## Pitfalls
- common mistake 1
- common mistake 2

## See also
- [[related-concept]]
- paper / lecture link
```

## Rules
- Match existing tone (likely Portuguese-BR for this project).
- Cross-link with `[[name]]` to other entries.
- Every concept needs runnable code, not just math.
