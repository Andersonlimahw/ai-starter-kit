---
name: prompt-version
description: Version prompts/skills like code — append entry to CHANGELOG, run eval, attach eval delta to version. Forces "every prompt change = versioned + measured". Triggers on "version this prompt", "release prompt v2", "log prompt change".
---

# prompt-version

## Workflow
1. Detect target prompt/skill file.
2. Compute next version (semver: patch = wording, minor = behavior, major = breaking).
3. Run eval against prior version baseline.
4. Append entry to `prompts/CHANGELOG.md`:
```
## [1.2.0] — 2026-05-18
**File**: skills/eval-first/SKILL.md
**Change**: added category coverage demand
**Eval**: 0.87 → 0.91 (+0.04)
**Tokens**: 410 → 480
**Breaking**: no
```
5. Tag git: `prompt/<name>-v1.2.0`.

## Rules
- No version bump without eval result.
- Major version requires migration note for downstream agents.
- Keep prior version archived: `prompts/_archive/<name>-v1.1.0.md`.

## Companion
`eval-first`, `regression-eval`.
