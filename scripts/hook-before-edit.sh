#!/usr/bin/env bash
# AI Agents Starter Kit – Hook: before_code_edit
# Valida o estilo de código antes do agente fazer edições.
# Configure no config.json do seu CLI para usar este hook.
set -euo pipefail

echo "── Hook: before_code_edit ──────────────────────"

# ── ESLint (JavaScript/TypeScript) ────────────────────────────────────────────
if command -v npx >/dev/null 2>&1 && [ -f ".eslintrc*" ] || [ -f "eslint.config.*" ] 2>/dev/null; then
  echo "Validando estilo de código com ESLint..."
  if ! npx eslint . --ext .js,.ts --max-warnings 0 2>/dev/null; then
    echo "✗ Erros de lint detectados. Corrija antes de executar o agente."
    exit 1
  fi
  echo "✔ ESLint: sem erros."
fi

# ── Flake8 (Python) ───────────────────────────────────────────────────────────
if command -v flake8 >/dev/null 2>&1 && find . -name "*.py" -not -path "./.git/*" | grep -q .; then
  echo "Validando código Python com Flake8..."
  if ! flake8 . --max-line-length=88 --exclude=.git,__pycache__,.env 2>/dev/null; then
    echo "✗ Erros de lint Python detectados. Corrija antes de executar o agente."
    exit 1
  fi
  echo "✔ Flake8: sem erros."
fi

echo "✔ Validação de código concluída. Agente pode prosseguir."
