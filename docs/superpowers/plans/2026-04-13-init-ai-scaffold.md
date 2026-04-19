# init-ai Scaffold Generator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the script `scripts/init-ai.mjs` and the templates in `templates/` to generate complete AI agents infrastructure in any target repository.

**Architecture:** Interactive Node.js script (`@inquirer/prompts`) that reads templates from `templates/`, collects project context via onboarding, detects installed CLIs, replaces placeholders and writes files to the target repo. Templates are Markdown/JSON files with placeholders `{{KEY}}`.

**Tech Stack:** Node.js >=20, `@inquirer/prompts ^7`, `node:fs`, `node:path`, `node:child_process`

---

## File Map

### Create (new)
| File | Responsibility |
|---|---|
| `scripts/init-ai.mjs` | Main script — onboarding, CLI detection, template copying |
| `templates/CLAUDE.md` | Entry point template for Claude Code |
| `templates/AGENTS.md` | Main index template for AI agents |
| `templates/.claude/settings.json` | Project config for Claude Code |
| `templates/.claude/SKILLS.md` | Project skills index |
| `templates/.claude/skills/semantic-commit/SKILL.md` | Semantic commit skill |
| `templates/.claude/skills/code-review/SKILL.md` | Code review skill |
| `templates/.claude/skills/debug-workflow/SKILL.md` | Systematic debugging skill |
| `templates/.claude/skills/llm-wiki/SKILL.md` | Skill with LLM concepts (Karpathy) |
| `templates/.claude/hooks/git-setup.sh` | Git hook (pre-commit, post-merge) |
| `templates/.claude/agents/task-router.md` | Task router subagent |
| `templates/.claude/agents/code-reviewer.md` | Code reviewer subagent |
| `templates/.claude/agents/debugger.md` | Debugger subagent |
| `templates/.codex/settings.json` | Config for Codex CLI |
| `templates/.codex/commands/project-commit.md` | Commit command for Codex |
| `templates/.codex/agents/task-router.md` | Task router for Codex |
| `templates/.gemini/skills/llm-wiki/SKILL.md` | LLM wiki skill for Gemini CLI |
| `templates/.agent/skills/semantic-commit/SKILL.md` | Commit skill for Copilot/others |
| `templates/.agent/subagents/task-router.md` | Task router for Copilot/others |
| `tests/init-ai.test.mjs` | Unit tests for utility functions 

### Modify (existing)
| File | What changes |
|---|---|
| `package.json` | Add @inquirer/prompts devDep + init-ai script 

---

## Task 1: Setup — package.json and directory structure

**Files:**
- Modify: `package.json`
- Create: `templates/` (template root directory)
- Create: `tests/init-ai.test.mjs`

- [ ] **Step 1: Add devDep and script to package.json**

Edit `package.json`:

```json
{
  "name": "ai-agents-starter-kit",
  "version": "1.0.0",
  "description": "Free AI Agents Starter Kit – Claude Code, Codex, Gemini & Copilot CLI",
  "keywords": [
    "ai", "agents", "claude-code", "codex", "gemini", "copilot", "llm", "mcp", "starter-kit"
  ],
  "homepage": "https://lemon.dev/pro-agents",
  "repository": {
    "type": "git",
    "url": "https://github.com/lemondev/ai-agents-starter-kit.git"
  },
  "license": "MIT",
  "engines": { "node": ">=20" },
  "scripts": {
    "setup": "bash scripts/setup.sh",
    "init-ai": "node scripts/init-ai.mjs",
    "test": "node --test tests/**/*.test.mjs examples/**/*.test.js 2>/dev/null || echo 'No tests found'",
    "test:smoke": "bash scripts/test_models.sh",
    "lint": "eslint . --ext .js,.ts,.mjs --ignore-pattern node_modules"
  },
  "devDependencies": {
    "@inquirer/prompts": "^7.0.0",
    "eslint": "^9.0.0"
  }
}
```

- [ ] **Step 2: Install dependency**

```bash
cd /Users/andersonlimadev/Projects/IA/ai-starter-kit
npm install
```

Expected output: `added N packages` without errors.

- [ ] **Step 3: Create template directories**

```bash
mkdir -p templates/.claude/skills/semantic-commit
mkdir -p templates/.claude/skills/code-review
mkdir -p templates/.claude/skills/debug-workflow
mkdir -p templates/.claude/skills/llm-wiki
mkdir -p templates/.claude/hooks
mkdir -p templates/.claude/agents
mkdir -p templates/.codex/commands
mkdir -p templates/.codex/agents
mkdir -p templates/.gemini/skills/llm-wiki
mkdir -p templates/.agent/skills/semantic-commit
mkdir -p templates/.agent/subagents
mkdir -p tests
```

- [ ] **Step 4: Write unit test for utility functions**

Create `tests/init-ai.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';

// We extract pure functions to test in isolation
// (init-ai.mjs exports replacePlaceholders and getTemplateFiles)
import { replacePlaceholders, getTemplateFiles } from '../scripts/init-ai.mjs';

test('replacePlaceholders replaces all occurrences', () => {
  const template = 'Project: {{PROJECT_NAME}} — stack: {{STACK}} ({{PROJECT_NAME}})';
  const vars = { PROJECT_NAME: 'my-app', STACK: 'Next.js' };
  const result = replacePlaceholders(template, vars);
  assert.equal(result, 'Project: my-app — stack: Next.js (my-app)');
});

test('replacePlaceholders does not change text without placeholders', () => {
  const template = 'Text without placeholders.';
  const result = replacePlaceholders(template, { FOO: 'bar' });
  assert.equal(result, 'Text without placeholders.');
});

test('getTemplateFiles always includes claude when selected', () => {
  const files = getTemplateFiles(['claude']);
  const dests = files.map(f => f.dest);
  assert.ok(dests.includes('CLAUDE.md'));
  assert.ok(dests.includes('AGENTS.md'));
  assert.ok(dests.includes('.claude/settings.json'));
  assert.ok(dests.includes('.claude/skills/semantic-commit/SKILL.md'));
});

test('getTemplateFiles includes codex when selected', () => {
  const files = getTemplateFiles(['claude', 'codex']);
  const dests = files.map(f => f.dest);
  assert.ok(dests.includes('.codex/settings.json'));
  assert.ok(dests.includes('.codex/commands/project-commit.md'));
});

test('getTemplateFiles does not include codex when not selected', () => {
  const files = getTemplateFiles(['claude']);
  const dests = files.map(f => f.dest);
  assert.ok(!dests.includes('.codex/settings.json'));
});

test('getTemplateFiles includes gemini when selected', () => {
  const files = getTemplateFiles(['claude', 'gemini']);
  const dests = files.map(f => f.dest);
  assert.ok(dests.includes('.gemini/skills/llm-wiki/SKILL.md'));
});

test('getTemplateFiles includes GEMINI.md as symlink', () => {
  const files = getTemplateFiles(['claude']);
  const symlink = files.find(f => f.dest === 'GEMINI.md');
  assert.ok(symlink);
  assert.equal(symlink.symlink, 'AGENTS.md');
});
```

- [ ] **Step 5: Run tests (expect failure — script does not exist yet)**

```bash
cd /Users/andersonlimadev/Projects/IA/ai-starter-kit
node --test tests/init-ai.test.mjs 2>&1 | head -20
```

Expected output: import error `Cannot find module '../scripts/init-ai.mjs'` — confirms that the test is correct and waiting for the script.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tests/init-ai.test.mjs
git commit -m "$(cat <<'EOF'
feat: setup init-ai with @inquirer/prompts and unit tests : 13/04/26

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Root templates — CLAUDE.md and AGENTS.md

**Files:**
- Create: `templates/CLAUDE.md`
- Create: `templates/AGENTS.md`

- [ ] **Step 1: Create templates/CLAUDE.md**

```markdown
# {{PROJECT_NAME}} — Claude Code Entry

Rules and context centralized in AGENTS.md.

## Quick reminder
- Commits: use `cn "message"` (semantic-commit skill)
- Code review: use the `code-review` skill
- Debug: use the `debug-workflow` skill
- Stack: {{STACK}}
- Language: {{LANGUAGE}}

## Source of truth
Read **[AGENTS.md](./AGENTS.md)** for the complete guidelines index.
```

- [ ] **Step 2: Create templates/AGENTS.md**

```markdown
# {{PROJECT_NAME}} — AI Agents Index

{{PROJECT_DESCRIPTION}}

## Stack
**Language:** {{LANGUAGE}} | **Frameworks:** {{STACK}}

---

## Available Skills

| Skill | Description | Trigger |
|---|---|---|
| `semantic-commit` | Semantic commit workflow with timestamp | "commit", "cn", "do commit" |
| `code-review` | Generic code review checklist | "review", "review", "verify code" |
| `debug-workflow` | Scientific debugging methodology | "debug", "bug", "error", "investigate" |
| `llm-wiki` | Fundamental LLM concepts as context | "llm", "model", "prompt", "token" |

## Available Subagents

| Agent | Model | Function |
|---|---|---|
| `task-router` | sonnet | Routes subtasks to the correct model/specialist |
| `code-reviewer` | sonnet | Review focused on bugs and quality |
| `debugger` | opus | Scientific bug investigation |

---

## Project architecture

> Add your project-specific architecture rules here.
> Example: layer patterns, naming conventions, constraints.

---

## References

- LLM Wiki (Karpathy): https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- External skills: https://skills.sh
- AI Templates: https://www.aitmpl.com/skills
```

- [ ] **Step 3: Commit**

```bash
git add templates/CLAUDE.md templates/AGENTS.md
git commit -m "$(cat <<'EOF'
feat: CLAUDE.md and AGENTS.md templates with placeholders : 13/04/26

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Skills templates (.claude/skills/)

**Files:**
- Create: `templates/.claude/settings.json`
- Create: `templates/.claude/SKILLS.md`
- Create: `templates/.claude/skills/semantic-commit/SKILL.md`
- Create: `templates/.claude/skills/code-review/SKILL.md`
- Create: `templates/.claude/skills/debug-workflow/SKILL.md`
- Create: `templates/.claude/skills/llm-wiki/SKILL.md`

- [ ] **Step 1: Create templates/.claude/settings.json**

```json
{
  "projectContext": {
    "name": "{{PROJECT_NAME}}",
    "description": "{{PROJECT_DESCRIPTION}}",
    "stack": "{{STACK}}",
    "language": "{{LANGUAGE}}"
  },
  "commands": {
    "lint": "npm run lint",
    "test": "npm test",
    "build": "npm run build",
    "typecheck": "npm run typecheck"
  },
  "restrictions": [
    "Never commit .env files or secrets",
    "Never hardcode API keys in source code",
    "Always validate inputs at system boundaries"
  ],
  "autoContext": {
    "always": ["AGENTS.md", "CLAUDE.md"]
  }
}
```

- [ ] **Step 2: Create templates/.claude/SKILLS.md**

```markdown
# Skills Index — {{PROJECT_NAME}}

Available skills in this project:

| Skill | File | Trigger |
|---|---|---|
| `semantic-commit` | `.claude/skills/semantic-commit/SKILL.md` | "commit", "cn" |
| `code-review` | `.claude/skills/code-review/SKILL.md` | "review", "review" |
| `debug-workflow` | `.claude/skills/debug-workflow/SKILL.md` | "debug", "bug" |
| `llm-wiki` | `.claude/skills/llm-wiki/SKILL.md` | "llm", "model", "prompt" |

## Add external skills

```bash
# Via ai-starter-kit (interactive)
node /path/to/ai-starter-kit/scripts/init-ai.mjs --add-skill

# Via skills.sh (manual)
# Access https://skills.sh and copy the desired SKILL.md file
# to .claude/skills/<name>/SKILL.md
```
```

- [ ] **Step 3: Create templates/.claude/skills/semantic-commit/SKILL.md**

```markdown
---
name: semantic-commit
description: Semantic commit workflow with timestamp. Use when the user asks to "do commit", "save changes", "cn", or any commit variation.
---

# Semantic Commit Workflow

## Commit types

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Refactoring without behavior change |
| `style` | Formatting, spaces (no logic change) |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `chore` | Build, configs, dependencies |
| `perf` | Performance improvement |

## Required format

```
[type]: [description] : [dd/mm/yy] - [hh:mm]
```

**Example:** `feat: add OAuth authentication : 13/04/26 - 14:30`

## Steps

1. Verify changes: `git status` and `git diff --staged`
2. Identify type by the nature of changes
3. Execute:

```bash
git add <relevant-files>
git commit -m "$(cat <<'COMMIT'
[type]: [description] : [dd/mm/yy] - [hh:mm]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
COMMIT
)"
```

## Guardrails

- **Never** stage `.env` or files with secrets
- **Always** check `git status` before and after
- **Never** use `--no-verify` to skip hooks
- Message must be in English (or project language)
```

- [ ] **Step 4: Create templates/.claude/skills/code-review/SKILL.md**

```markdown
---
name: code-review
description: Generic code review checklist. Use when: "review", "review code", "verify quality", "code review", "is this code good?".
---

# Code Review Checklist

Review code systematically by category. Report only high-confidence issues.

## General quality

- [ ] Functions with single responsibility (one function = one task)
- [ ] No duplicate code — logic repeated 3x+ deserves abstraction
- [ ] Descriptive names (no cryptic abbreviations, no `data`, `info`, `temp`)
- [ ] No `any` types without a justifying comment
- [ ] No unresolved `TODO` / `FIXME`

## Security

- [ ] No hardcoded secrets, tokens, or keys
- [ ] User inputs/external APIs validated before use
- [ ] No SQL injection (parameterized queries)
- [ ] No XSS (HTML output sanitization)
- [ ] Minimum necessary permissions

## Tests

- [ ] Critical logic covered by tests
- [ ] Edge cases tested (null, empty, boundary)
- [ ] Tests test behavior, not implementation

## Performance

- [ ] No unnecessary loops in hot paths
- [ ] No N+1 queries (batch when possible)
- [ ] Open resources are closed (connections, file handles)

## Feedback format

```
[CATEGORY] path/file.ts:line
Problem: concrete description of the problem
Fix: solution or corrected code
Severity: CRITICAL | HIGH | LOW
```

**CRITICAL** = blocks merge. **HIGH** = must fix before. **LOW** = can fix later.

## References

- https://skills.sh
- https://www.aitmpl.com/skills
```

- [ ] **Step 5: Create templates/.claude/skills/debug-workflow/SKILL.md**

```markdown
---
name: debug-workflow
description: Scientific debugging methodology. Use when: "debug", "bug", "error", "doesn't work", "investigate problem", "why did this break".
---

# Debug Workflow — Scientific Methodology

Never skip steps. Each step must be confirmed before the next.

## Process

### 1. Reproduce
Create the smallest reproducible case possible.
- What is the exact input causing the problem?
- Does it happen consistently or intermittently?
- In which environment? (dev/prod/CI)

### 2. Isolate
Identify the smallest responsible code unit.
- Use `git bisect` to find the commit that introduced the bug
- Comment out code until the problem disappears — the last commented block is suspect

### 3. Hypothesis
Form ONE hypothesis about the root cause. Be specific:
- "Variable X is undefined because Y was not initialized before Z"

### 4. Test hypothesis
Run the SMALLEST experiment to validate/refute:
```bash
# Add temporary log
console.log('[DEBUG]', { variable: x, state: y });

# or use debugger
node --inspect-brk script.js
```

### 5. Fix
Apply the MINIMUM fix that resolves the root cause. Avoid "while I'm here" refactoring.

### 6. Verify
- Was the original bug fixed? ✓
- No regressions introduced? ✓ (`npm test`)
- Is the fix reversible if necessary? ✓

## Useful commands

```bash
# Find commit that introduced bug
git bisect start
git bisect bad HEAD
git bisect good <good-commit-hash>
# git bisect good/bad until you find the commit

# See history of a specific line
git log -L 42,42:src/file.ts

# Stash to isolate local changes
git stash && npm test && git stash pop
```

## References

- LLM Wiki: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- skills.sh: https://skills.sh
```

- [ ] **Step 6: Create templates/.claude/skills/llm-wiki/SKILL.md**

```markdown
---
name: llm-wiki
description: Fundamental LLM concepts as context for agent architecture decisions. Activate when discussing: prompts, tokens, context, temperature, embeddings, RAG, fine-tuning, agents, model choice, inference latency.
---

# LLM Wiki — Essential Concepts

> Based on: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
> Skills: https://skills.sh | https://www.aitmpl.com/skills

---

## Tokens and Context

- LLMs process **tokens**, not words — ~4 chars/token in English, ~2-3 chars in Portuguese
- **Context window**: total token limit (input + output). Ex: Claude Sonnet 4.6 = 200k tokens
- Information in the **middle** of the context tends to be "forgotten" (*lost in the middle*) — place the most important information at the beginning or end
- The **system prompt** defines the role and constraints of the model — it is processed with cache in modern models

## Temperature and Sampling

| Temperature | Behavior | Use for |
|---|---|---|
| 0 | Deterministic, always the most probable token | Code, SQL, structured data |
| 0.1–0.3 | Slightly creative, consistent | Analysis, technical explanations |
| 0.7–1.0 | Creative, varied | Writing, brainstorming |

- **top-p (nucleus sampling)**: considers only tokens that sum to P% probability
- For code: temperature 0; for creative text: 0.7+

## Agents and Tool Use

- **Agent** = LLM + action loop + toolset
- **ReAct pattern**: Reason → Act → Observe (repeats until task completed)
- Each tool call = new inference = accumulated latency
- **Subagents**: specialized agents called by the orchestrator agent
- Agent cost: proportional to the number of turns × tokens per turn

### When to use subagents
- Independent tasks that can run in parallel
- Specialized domains (UI, backend, tests)
- When the main agent's context is saturated

## RAG vs Fine-tuning

| | RAG | Fine-tuning |
|---|---|---|
| **What is it** | Searches for relevant context at runtime | Trains the model with new data |
| **Good for** | Changing knowledge, recent facts | Consistent style/format |
| **Bad for** | Implicit/procedural knowledge | New facts post-training |
| **Cost** | Inference + retrieval | Training (expensive) |
| **Rule of thumb** | Try first | Only if RAG doesn't solve it |

## Prompt Engineering

- **Few-shot**: include 2-3 examples in the prompt to guide the output format
- **Chain-of-thought**: "think step-by-step" improves reasoning in complex tasks
- **Specificity wins**: the more relevant context, the better — be concrete
- **Role assignment**: "You are an expert in X" changes the model's behavior
- Avoid vague prompts like "improve this code" — prefer "refactor to reduce duplication in Y"

## Model Choice

| Profile | Models | Use when |
|---|---|---|
| **Maximum capacity** | Claude Opus 4.6, GPT-4 | Architecture, critical bugs, release decisions |
| **Balance** | Claude Sonnet 4.6, GPT-4o | Feature implementation, refactoring |
| **Fast/cheap** | Claude Haiku 4.5, GPT-3.5 | Formatting, boilerplate, repetitive edits |

## Security and Privacy

- Never send sensitive data (PII, credentials, production data) to the model
- User prompts may attempt **prompt injection** — validate and sanitize
- Use approval modes for irreversible actions (delete, push, deploy)

## References

- Karpathy LLM Wiki: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- skills.sh: https://skills.sh
- aitmpl.com: https://www.aitmpl.com/skills
- Claude models: https://docs.anthropic.com/en/docs/about-claude/models
```

- [ ] **Step 7: Run tests (still should fail)**

```bash
cd /Users/andersonlimadev/Projects/IA/ai-starter-kit
node --test tests/init-ai.test.mjs 2>&1 | head -5
```

Expected output: `Cannot find module '../scripts/init-ai.mjs'`

- [ ] **Step 8: Commit**

```bash
git add templates/.claude/
git commit -m "$(cat <<'EOF'
feat: skills templates (semantic-commit, code-review, debug, llm-wiki) : 13/04/26

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Agent templates and hooks

**Files:**
- Create: `templates/.claude/hooks/git-setup.sh`
- Create: `templates/.claude/agents/task-router.md`
- Create: `templates/.claude/agents/code-reviewer.md`
- Create: `templates/.claude/agents/debugger.md`
- Create: `templates/.codex/settings.json`
- Create: `templates/.codex/commands/project-commit.md`
- Create: `templates/.codex/agents/task-router.md`
- Create: `templates/.gemini/skills/llm-wiki/SKILL.md`
- Create: `templates/.agent/skills/semantic-commit/SKILL.md`
- Create: `templates/.agent/subagents/task-router.md`

- [ ] **Step 1: Create templates/.claude/hooks/git-setup.sh**

```bash
#!/bin/bash
# Git Hooks Setup — {{PROJECT_NAME}}
# Installs pre-commit and post-merge hooks

set -e
echo "Configuring Git hooks for {{PROJECT_NAME}}"...
mkdir -p .git/hooks

cat > .git/hooks/pre-commit << 'HOOK'
#!/bin/bash
echo "Running pre-commit checks"...

if command -v npm &>/dev/null && [ -f package.json ]; then
  if grep -q '"typecheck"' package.json 2>/dev/null;
 then
    echo "Checking TypeScript"...
    npm run typecheck || { echo "TypeScript failed. Commit aborted."; exit 1; }
  fi
  if grep -q '"lint"' package.json 2>/dev/null;
 then
    echo "Running lint"...
    npm run lint || { echo "Lint failed. Commit aborted."; exit 1; }
  fi
fi

echo "Pre-commit OK"
exit 0
HOOK

chmod +x .git/hooks/pre-commit

cat > .git/hooks/post-merge << 'HOOK'
#!/bin/bash
if git diff --name-only HEAD@{1} | grep -qE "package-lock\.json|requirements\.txt"; then
  echo "Dependencies changed. Install manually if necessary."
fi
exit 0
Hook

chmod +x .git/hooks/post-merge

echo "Hooks installed: pre-commit (lint/typecheck), post-merge (deps warning)"
```

- [ ] **Step 2: Create templates/.claude/agents/task-router.md**

```markdown
---
name: task-router
description: Use this agent to route subtasks to the correct model and specialist. Examples: multi-domain tasks, requests touching UI and backend, model decisions.
model: sonnet
color: cyan
---

You are an expert in task routing for AI agents.

## Project stack
{{STACK}} | {{LANGUAGE}}

## Responsibilities

1. Divide requests into concrete and independent subtasks
2. Assign the most suitable model to each subtask
3. Identify dependencies between subtasks
4. Produce execution plan with risk notes

## Routing rules

| Complexity | Model | When to use |
|---|---|---|
| High | opus | Architecture, critical bugs, release decisions, security |
| Medium | sonnet | Feature implementation, refactoring, code review |
| Low | haiku | Formatting, boilerplate, repetitive edits, translations |

## Output format

For each subtask:
- **Subtask**: concrete description
- **Recommended model**: opus / sonnet / haiku
- **Why**: 1-line justification
- **Depends on**: list of subtasks that must complete before

## References
- LLM Wiki: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
```

- [ ] **Step 3: Create templates/.claude/agents/code-reviewer.md**

```markdown
---
name: code-reviewer
description: Code review focused on bugs, logic, and quality. Use when: "review PR", "verify implementation", "code review", "is it correct?".
model: sonnet
color: blue
---

You are a code review expert for {{LANGUAGE}}/{{STACK}} projects.

## Responsibilities

1. Identify bugs and logic issues with file:line reference
2. Verify security (injection, data exposure, input validation)
3. Verify quality (DRY, single responsibility, descriptive names)
4. Suggest improvements with concrete code — never vague feedback

## Process

1. Read the code carefully before commenting
2. Group feedback by severity: CRITICAL > HIGH > LOW
3. For each issue: describe the problem, show the fix, explain the reason

## Feedback format

```
[CATEGORY] path/file.ts:line
Problem: concrete description
Fix:
```corrected code```
Severity: CRITICAL | HIGH | LOW
```

## Approval criteria

Approve when:
- No CRITICAL or HIGH issues
- Clearly correct logic
- No hardcoded secrets
- External inputs validated

## References
- skills.sh: https://skills.sh
- aitmpl.com: https://www.aitmpl.com/skills
```

- [ ] **Step 4: Create templates/.claude/agents/debugger.md**

```markdown
---
name: debugger
description: Scientific bug investigation. Use when: "find bug", "investigate error", "systematic debug", "why X doesn't work".
model: opus
color: yellow
---

You are a systematic debugging expert for {{LANGUAGE}}/{{STACK}}.

## Mandatory process (never skip steps)

### Step 1 — Reproduce
Confirm the bug with the smallest reproducible case possible.
Ask: what is the exact input? Does it always happen?

### Step 2 — Isolate
Identify the smallest responsible code unit.
Use `git bisect` if the bug was introduced recently.

### Step 3 — Hypothesis
Form ONE specific hypothesis about the root cause.
Example: "X is undefined because Y returns null when Z".

### Step 4 — Test
Run the smallest experiment to validate/refute the hypothesis.
Add temporary log or use debugger.

### Step 5 — Fix
Apply the minimum fix. No additional refactoring in this step.

### Step 6 — Verify
Confirm: bug fixed + no regressions (npm test) + fix is reversible.

## Useful commands

```bash
git bisect start && git bisect bad HEAD && git bisect good <hash>
git log -L <line>,<line>:<file>
node --inspect-brk <script>
```

## References
- Debug workflow skill: `.claude/skills/debug-workflow/SKILL.md`
- LLM Wiki: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
```

- [ ] **Step 5: Create templates/.codex/settings.json**

```json
{
  "projectContext": {
    "name": "{{PROJECT_NAME}}",
    "description": "{{PROJECT_DESCRIPTION}}",
    "stack": "{{STACK}}",
    "language": "{{LANGUAGE}}"
  },
  "model": "o4-mini",
  "instructions": "See AGENTS.md for project context and rules. Stack: {{STACK}}.",
  "restrictions": [
    "Never commit .env files",
    "Never hardcode secrets"
  ]
}
```

- [ ] **Step 6: Create templates/.codex/commands/project-commit.md**

```markdown
# Smart Commit — {{PROJECT_NAME}}

Generate a semantic commit message following the project pattern.

## Steps

### 1. Analyze changes
```bash
git status
git diff --staged
```

### 2. Determine type
| Type | When |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Refactoring |
| `docs` | Documentation |
| `test` | Tests |
| `chore` | Build/config/deps |

### 3. Format
```
[type]: [description] : [dd/mm/yy] - [hh:mm]
```

### 4. Execute
```bash
git add <files>
git commit -m "[type]: [description] : $(date '+%d/%m/%y - %H:%M')"
```

## Guardrails
- Never commit `.env`
- Message in English (project default)
```

- [ ] **Step 7: Create templates/.codex/agents/task-router.md**

Same content as Claude's task-router (copied — Codex uses the same frontmatter format):

```markdown
---
name: task-router
description: Routes subtasks to the correct model and specialist.
model: o4-mini
---

You are a task routing expert.

Project stack: {{STACK}} | {{LANGUAGE}}

Responsibilities:
1. Divide requests into concrete subtasks
2. Assign model (o1 for architecture/critical bugs, o4-mini for implementation, gpt-4o-mini for boilerplate)
3. Produce plan with dependencies and risk notes

Format: subtask | model | justification
```

- [ ] **Step 8: Create templates/.gemini/skills/llm-wiki/SKILL.md**

Same llm-wiki skill as Claude (Gemini CLI compatible format):

```markdown
---
name: llm-wiki
description: Fundamental LLM concepts. Activate when discussing tokens, context, temperature, RAG, agents, model choice.
---

# LLM Wiki — Essential Concepts

> Based on: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
> Skills: https://skills.sh | https://www.aitmpl.com/skills

## Tokens and Context
- ~4 chars/token in English, ~2-3 in Portuguese
- Context window: total token limit (input + output)
- Information in the middle of the context can be forgotten (lost in the middle)

## Temperature
- 0: deterministic (code, data) | 0.7+: creative (text)

## Agents
- ReAct: Reason → Act → Observe (loop)
- Subagents: specialized, called by the orchestrator
- Cost: proportional to turns × tokens

## RAG vs Fine-tuning
- RAG: runtime context, good for mutable knowledge
- Fine-tuning: style/format, not for new facts

## Models (Gemini)
- Gemini 2.5 Pro: architecture, critical decisions
- Gemini 2.0 Flash: implementation, cost/quality balance
- Gemini 2.0 Flash Lite: formatting, boilerplate

## References
- https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- https://skills.sh | https://www.aitmpl.com/skills
```

- [ ] **Step 9: Create templates/.agent/skills/semantic-commit/SKILL.md**

```markdown
---
name: semantic-commit
description: Semantic commit. Use when: "commit", "save", "cn".
---

# Semantic Commit

Format: `[type]: [description] : [dd/mm/yy] - [hh:mm]`

Types: feat | fix | refactor | style | docs | test | chore | perf

Steps:
1. `git status` and `git diff --staged`
2. Identify type
3. `git add <files> && git commit -m "[type]: [desc] : $(date '+%d/%m/%y - %H:%M')"`

Never commit `.env`.
```

- [ ] **Step 10: Create templates/.agent/subagents/task-router.md**

```markdown
---
name: task-router
description: Routes subtasks to the correct model/specialist.
---

Task routing expert for {{PROJECT_NAME}} ({{STACK}}).

Responsibilities:
1. Divide requests into subtasks
2. High model (opus/o1): architecture and critical bugs
3. Medium model (sonnet/o4-mini): implementation
4. Low model (haiku/flash-lite): boilerplate

Format: subtask | model | reason
```

- [ ] **Step 11: Commit**

```bash
git add templates/
git commit -m "$(cat <<'EOF'
feat: agent templates, hooks and configs for Claude/Codex/Gemini/.agent : 13/04/26

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Main script — init-ai.mjs

**Files:**
- Create: `scripts/init-ai.mjs`

- [ ] **Step 1: Create scripts/init-ai.mjs**

```javascript
#!/usr/bin/env node
/**
 * init-ai — AI Agent Scaffold Generator
 * Generates AI agents infrastructure in any repository.
 * Usage: node scripts/init-ai.mjs
 */

import { input, select, checkbox, confirm } from '@inquirer/prompts';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import https from 'node:https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');
const TARGET_DIR = process.cwd();

// ── Exported utility functions (testable) ───────────────────────────────

export function replacePlaceholders(content, vars) {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, value ?? ''),
    content
  );
}

export function getTemplateFiles(clis) {
  const files = [
    { src: 'CLAUDE.md', dest: 'CLAUDE.md' },
    { src: 'AGENTS.md', dest: 'AGENTS.md' },
    { dest: 'GEMINI.md', symlink: 'AGENTS.md' },
  ];

  if (clis.includes('claude')) {
    files.push(
      { src: '.claude/settings.json', dest: '.claude/settings.json' },
      { src: '.claude/SKILLS.md', dest: '.claude/SKILLS.md' },
      { src: '.claude/skills/semantic-commit/SKILL.md', dest: '.claude/skills/semantic-commit/SKILL.md' },
      { src: '.claude/skills/code-review/SKILL.md', dest: '.claude/skills/code-review/SKILL.md' },
      { src: '.claude/skills/debug-workflow/SKILL.md', dest: '.claude/skills/debug-workflow/SKILL.md' },
      { src: '.claude/skills/llm-wiki/SKILL.md', dest: '.claude/skills/llm-wiki/SKILL.md' },
      { src: '.claude/hooks/git-setup.sh', dest: '.claude/hooks/git-setup.sh', executable: true },
      { src: '.claude/agents/task-router.md', dest: '.claude/agents/task-router.md' },
      { src: '.claude/agents/code-reviewer.md', dest: '.claude/agents/code-reviewer.md' },
      { src: '.claude/agents/debugger.md', dest: '.claude/agents/debugger.md' }
    );
  }

  if (clis.includes('codex')) {
    files.push(
      { src: '.codex/settings.json', dest: '.codex/settings.json' },
      { src: '.codex/commands/project-commit.md', dest: '.codex/commands/project-commit.md' },
      { src: '.codex/agents/task-router.md', dest: '.codex/agents/task-router.md' }
    );
  }

  if (clis.includes('gemini')) {
    files.push(
      { src: '.gemini/skills/llm-wiki/SKILL.md', dest: '.gemini/skills/llm-wiki/SKILL.md' }
    );
  }

  if (clis.includes('copilot')) {
    files.push(
      { src: '.agent/skills/semantic-commit/SKILL.md', dest: '.agent/skills/semantic-commit/SKILL.md' },
      { src: '.agent/subagents/task-router.md', dest: '.agent/subagents/task-router.md' }
    );
  }

  return files;
}

// ── Detection of installed CLIs ──────────────────────────────────────────────

function detectCli(name) {
  try {
    execSync(`which ${name}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// ── Fetch external skills (skills.sh) ─────────────────────────────────────

async function fetchExtraSkillsCatalog() {
  return new Promise((resolve) => {
    const req = https.get(
      'https://skills.sh/api/catalog',
      { timeout: 5000 },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try { resolve(JSON.parse(data)); }
          catch { resolve(null); }
        });
      }
    );
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

// ── File writing ───────────────────────────────────────────────────────

function writeFiles(files, vars, conflictStrategy) {
  const written = [];
  const skipped = [];

  for (const file of files) {
    const destPath = path.join(TARGET_DIR, file.dest);
    const exists = fs.existsSync(destPath);

    if (exists && conflictStrategy === 'skip') {
      skipped.push(file.dest);
      continue;
    }

    if (exists && conflictStrategy === 'backup') {
      fs.renameSync(destPath, destPath + '.bak');
    }

    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    if (file.symlink) {
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      fs.symlinkSync(file.symlink, destPath);
      written.push(file.dest);
      continue;
    }

    const srcPath = path.join(TEMPLATES_DIR, file.src);
    const raw = fs.readFileSync(srcPath, 'utf8');
    const content = replacePlaceholders(raw, vars);
    fs.writeFileSync(destPath, content, 'utf8');

    if (file.executable) fs.chmodSync(destPath, '755');
    written.push(file.dest);
  }

  return { written, skipped };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🤖  AI Agent Scaffold Generator');
  console.log('─'.repeat(40));
  console.log(`Destination: ${TARGET_DIR}\n`);

  // Step 1 — Project context
  const projectName = await input({
    message: 'Project name:',
    default: path.basename(TARGET_DIR),
  });

  const description = await input({
    message: 'Short description:',
    default: 'Project with AI agents support',
  });

  const language = await select({
    message: 'Main language:',
    choices: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Other'].map(v => ({ value: v, name: v })),
  });

  const stack = await input({
    message: 'Stack/frameworks (optional):',
    default: language,
  });

  // Step 2 — CLI selection
  const detected = {
    claude: detectCli('claude'),
    codex: detectCli('codex'),
    gemini: detectCli('gemini'),
    copilot: detectCli('gh'),
  };

  const selectedClis = await checkbox({
    message: 'Which AI CLIs do you use? (space to mark)',
    choices: [
      {
        name: `Claude Code  [recommended${detected.claude ? ' ✓ installed' : ''}]`,
        value: 'claude',
        checked: true,
      },
      {
        name: `OpenAI Codex CLI${detected.codex ? '  ✓ installed' : ''}`,
        value: 'codex',
        checked: detected.codex,
      },
      {
        name: `Gemini CLI${detected.gemini ? '  ✓ installed' : ''}`,
        value: 'gemini',
        checked: detected.gemini,
      },
      {
        name: `GitHub Copilot CLI${detected.copilot ? '  ✓ installed' : ''}`,
        value: 'copilot',
        checked: detected.copilot,
      },
    ],
  });

  // Claude always included
  const clis = selectedClis.includes('claude') ? selectedClis : ['claude', ...selectedClis];

  // Step 3 — Extra skills
  const wantExtra = await confirm({
    message: 'Install additional skills from skills.sh/aitmpl.com?',
    default: false,
  });

  const vars = {
    PROJECT_NAME: projectName,
    PROJECT_DESCRIPTION: description,
    LANGUAGE: language,
    STACK: stack,
  };

  // Step 4 — Check for conflicts
  const files = getTemplateFiles(clis);
  const conflicts = files.filter(f => !f.symlink && fs.existsSync(path.join(TARGET_DIR, f.dest)));

  let conflictStrategy = 'skip';
  if (conflicts.length > 0) {
    console.log(`\n⚠️  ${conflicts.length} existing file(s):`);
    conflicts.forEach(f => console.log(`   ${f.dest}`));
    conflictStrategy = await select({
      message: 'How to proceed?',
      choices: [
        { value: 'skip', name: 'Skip existing files (safe)' },
        { value: 'overwrite', name: 'Overwrite everything' },
        { value: 'backup', name: 'Backup (.bak) and overwrite' },
      ],
    });
  }

  // Step 5 — Summary and confirmation
  console.log(`\n${files.length} file(s) will be created/verified:\n`);
  files.forEach(f => {
    const isConflict = conflicts.some(c => c.dest === f.dest);
    const marker = isConflict ? '⚠ ' : '  ';
    console.log(`  ${marker}${f.dest}${f.symlink ? ' → ' + f.symlink : ''}`);
  });

  const confirmed = await confirm({ message: '\nConfirm installation?', default: true });
  if (!confirmed) {
    console.log('\nCancelled.');
    process.exit(0);
  }

  // Step 6 — Write files
  const { written, skipped } = writeFiles(files, vars, conflictStrategy);

  // Step 7 — External skills (optional)
  if (wantExtra) {
    console.log('\nFetching external skills catalog...');
    const catalog = await fetchExtraSkillsCatalog();
    if (catalog) {
      console.log('Catalog available at: https://skills.sh');
    } else {
      console.log('⚠️  Could not connect to skills.sh. Access manually:');
    }
    console.log('   → https://skills.sh');
    console.log('   → https://www.aitmpl.com/skills');
  }

  // Final summary
  console.log('\n' + '─'.repeat(40));
  console.log(`✅  Scaffold installed in ${TARGET_DIR}`);
  console.log(`   ${written.length} file(s) created${skipped.length > 0 ? `, ${skipped.length} skipped` : ''}`);
  console.log('\nNext steps:');
  console.log('  1. Review CLAUDE.md and AGENTS.md and adjust to your project');
  console.log('  2. Customize skills in .claude/skills/');
  console.log('  3. Run: claude  (or codex / gemini)');
  console.log('  4. External skills: https://skills.sh | https://www.aitmpl.com/skills');
  consoleconsole.log('');
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
```

- [ ] **Step 2: Run tests (now they should pass)**

```bash
cd /Users/andersonlimadev/Projects/IA/ai-starter-kit
node --test tests/init-ai.test.mjs
```

Expected output:
```
▶ replacePlaceholders replaces all occurrences
  ✔ replacePlaceholders replaces all occurrences (Xms)
▶ replacePlaceholders does not change text without placeholders
  ✔ ...
▶ getTemplateFiles always includes claude when selected
  ✔ ...
... (all 7 tests passing)
```

- [ ] **Step 3: Verify that the script can be imported without errors**

```bash
node --input-type=module <<'EOF'
import { replacePlaceholders, getTemplateFiles } from './scripts/init-ai.mjs';
console.log('Import OK');
console.log('Files for claude:', getTemplateFiles(['claude']).length, 'files');
EOF
```

Expected output:
```
Import OK
Files for claude: 11 files
```

- [ ] **Step 4: Commit**

```bash
git add scripts/init-ai.mjs
git commit -m "$(cat <<'EOF'
feat: init-ai.mjs script with interactive onboarding and AI agent scaffold : 13/04/26

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Smoke test and README update

**Files:**
- Modify: `README.md` (add init-ai section)
- Modify: `scripts/setup.sh` (mention init-ai as next step)

- [ ] **Step 1: Verify manual script smoke test**

```bash
cd /tmp && mkdir test-ai-scaffold && cd test-ai-scaffold && git init -q
node /Users/andersonlimadev/Projects/IA/ai-starter-kit/scripts/init-ai.mjs <<'EOF'
test-project
Test project
TypeScript
Next.js


n
y
EOF
```

Verify that files were created:

```bash
ls CLAUDE.md AGENTS.md GEMINI.md .claude/settings.json .claude/skills/semantic-commit/SKILL.md
```

Expected output: all files listed without error.

- [ ] **Step 2: Verify placeholder substitution**

```bash
grep "test-project" CLAUDE.md
grep "test-project" AGENTS.md
grep "Next.js" .claude/settings.json
```

Expected output: lines with the correct substituted content (no `{{PROJECT_NAME}}`).

- [ ] **Step 3: Verify GEMINI.md as symlink**

```bash
ls -la GEMINI.md
```

Expected output: `GEMINI.md -> AGENTS.md`

- [ ] **Step 4: Clean up test**

```bash
rm -rf /tmp/test-ai-scaffold
```

- [ ] **Step 5: Add init-ai section to README.md**

In the existing README.md, after the `## Quickstart (5 minutes)` section, add:

```markdown
## Init AI — Scaffold for any repository

The `init-ai` script generates all AI agent infrastructure in any existing repository:

```bash
# In your project directory:
node /path/to/ai-starter-kit/scripts/init-ai.mjs

# Or via npm (if installed as devDep):
npm run init-ai
```

The script will:
1. Ask for project name, stack, and language
2. Detect installed CLIs (Claude Code suggested by default)
3. Generate `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.claude/skills/`, `.claude/agents/` and more
4. Offer additional skills from [skills.sh](https://skills.sh) and [aitmpl.com](https://www.aitmpl.com/skills)

**Skills included by default:** `semantic-commit`, `code-review`, `debug-workflow`, `llm-wiki`
```

- [ ] **Step 6: Run all tests**

```bash
cd /Users/andersonlimadev/Projects/IA/ai-starter-kit
node --test tests/init-ai.test.mjs
```

Expected output: 7 tests passing.

- [ ] **Step 7: Final commit**

```bash
git add README.md scripts/setup.sh
git commit -m "$(cat <<'EOF'
docs: add init-ai section to README and references in setup.sh : 13/04/26

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review

### Spec coverage

| Spec requirement | Covered by |
|---|---|
| Node.js script with @inquirer/prompts | Task 1 (setup) + Task 5 (script) |
| Templates in `templates/` | Tasks 2, 3, 4 |
| 4 built-in skills | Task 3 |
| 3 subagents | Task 4 |
| 4 CLIs with Claude as default | Task 5 (getTemplateFiles + checkbox) |
| Automatic CLI detection | Task 5 (detectCli) |
| External skills via skills.sh | Task 5 (fetchExtraSkillsCatalog) |
| Offline fallback | Task 5 (try/catch in fetch) |
| Conflict: 3 strategies | Task 5 (conflictStrategy) |
| GEMINI.md as symlink | Task 5 (writeFiles with file.symlink) |
| Placeholder substitution | Task 5 (replacePlaceholders) |
| Unit tests | Tasks 1 + 5 |
| Updated README | Task 6 |
| Smoke test | Task 6 |

### Additional checks

- `replacePlaceholders` exported and tested ✓
- `getTemplateFiles` exported and tested ✓
- Function names consistent between tests (Task 1) and implementation (Task 5) ✓
- Absolute paths in all steps ✓
- No TBDs or unresolved placeholders ✓
