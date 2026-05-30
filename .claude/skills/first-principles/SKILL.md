---
name: first-principles
description: Break down any ML/AI concept to first principles — strip jargon, derive from basics, build physical/mathematical analogy. Karpathy intuition-building style. Triggers on "first principles", "explain like I'm 5", "derive from scratch", "why does X actually work".
---

# first-principles

## Workflow
1. State the concept in jargon-free terms (1 sentence).
2. Identify the **primitives** it builds on (math, physics, intuition).
3. Derive the concept from those primitives — step by step, no leaps.
4. Add **one analogy** from a different domain (physics, cooking, sports).
5. State the **assumptions** that make it work — and when those break.
6. End with: "if you only remember one thing..."

## Output template
```
# <Concept>

## Plain English
<one sentence, no jargon>

## Primitives
- primitive 1
- primitive 2

## Derivation
Step 1: ...
Step 2: ...
Step 3 (the leap): ...

## Analogy
<from physics/biology/everyday>

## Assumptions
- A1: ... (breaks when ...)

## One thing
<single takeaway>
```

## Refuse
- Hand-wavy explanations.
- "It just works because of the loss function."
- Skipping the assumptions section.
