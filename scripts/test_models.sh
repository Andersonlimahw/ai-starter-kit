#!/usr/bin/env bash
# AI Agents Starter Kit – Smoke Tests
# Verifica se todos os CLIs de IA estão instalados e operacionais.
set -uo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS=0
FAIL=0

ok()   { echo -e "${GREEN}[✔]${NC} $1"; PASS=$((PASS+1)); }
fail() { echo -e "${RED}[✗]${NC} $1"; FAIL=$((FAIL+1)); }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }

echo ""
echo "═══════════════════════════════════════════"
echo "   AI Agents Starter Kit – Smoke Tests"
echo "═══════════════════════════════════════════"
echo ""

# Carregar .env se existir
if [ -f ".env" ]; then
  # shellcheck disable=SC1091
  set -a; source .env; set +a
  ok ".env carregado"
else
  warn ".env não encontrado. Algumas verificações podem falhar."
fi

echo ""
echo "── Verificando CLIs instalados ─────────────────"

check_cli() {
  local name="$1"
  local cmd="$2"
  local version_flag="${3:---version}"

  if command -v "$cmd" >/dev/null 2>&1; then
    local ver
    ver=$("$cmd" $version_flag 2>/dev/null | head -1 || echo "desconhecida")
    ok "$name: $ver"
  else
    fail "$name não encontrado. Execute: bash scripts/setup.sh"
  fi
}

check_cli "Claude Code"     "claude"     "--version"
check_cli "Codex CLI"       "codex"      "--version"
check_cli "Gemini CLI"      "gemini"     "--version"
check_cli "Copilot CLI"     "copilot"    "--version"
check_cli "OpenClaude CLI"  "openclaude" "--version"

echo ""
echo "── Verificando chaves de API ───────────────────"

check_key() {
  local name="$1"
  local var="$2"
  if [ -n "${!var:-}" ]; then
    ok "$name configurado (${var})"
  else
    warn "$name não configurado (${var} vazio)"
  fi
}

check_key "Anthropic (Claude)" "CLAUDE_API_KEY"
check_key "OpenAI (Codex)"     "OPENAI_API_KEY"
check_key "Google (Gemini)"    "GEMINI_API_KEY"
check_key "GitHub (Copilot)"   "GITHUB_TOKEN"

echo ""
echo "═══════════════════════════════════════════"
echo -e "Resultado: ${GREEN}${PASS} ok${NC} | ${RED}${FAIL} falha(s)${NC}"

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}Todos os CLIs estão operacionais!${NC}"
else
  echo -e "${YELLOW}Corrija as falhas acima e execute novamente.${NC}"
fi
echo ""
