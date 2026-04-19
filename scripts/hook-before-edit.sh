#!/usr/bin/env bash
# AI Agents Starter Kit – Hook: before_code_edit
# Validates code style before the agent makes edits.
# Configure in your CLI's config.json to use this hook.
set -euo pipefail

echo "── Hook: before_code_edit ──────────────────────"

# ── ESLint (JavaScript/TypeScript) ────────────────────────────────────────────
if command -v npx >/dev/null 2>&1 && ls .eslintrc* eslint.config.* 2>/dev/null | grep -q .; then
  echo "Validating code style with ESLint..."
  if ! npx eslint . --ext .js,.ts --max-warnings 0 2>/dev/null; then
    echo "✗ Lint errors detected. Fix them before running the agent."
    exit 1
  fi
  echo "✔ ESLint: no errors."
fi

# ── Flake8 (Python) ───────────────────────────────────────────────────────────
if command -v flake8 >/dev/null 2>&1 && find . -name "*.py" -not -path "./.git/*" | grep -q .; then
  echo "Validating Python code with Flake8..."
  if ! flake8 . --max-line-length=88 --exclude=.git,__pycache__,.env 2>/dev/null; then
    echo "✗ Python lint errors detected. Fix them before running the agent."
    exit 1
  fi
  echo "✔ Flake8: no errors."
fi

echo "✔ Code validation completed. Agent may proceed."
