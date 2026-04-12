#!/usr/bin/env bash
# AI Agents Starter Kit – Setup Script
# Instala todos os CLIs de IA necessários para o kit.
set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

info()    { echo -e "${GREEN}[✔]${NC} $1"; }
warning() { echo -e "${YELLOW}[!]${NC} $1"; }

echo ""
echo "═══════════════════════════════════════════"
echo "   AI Agents Starter Kit – Setup"
echo "═══════════════════════════════════════════"
echo ""

# ── Verificar dependências base ───────────────────────────────────────────────
command -v node >/dev/null 2>&1 || { echo "Node.js não encontrado. Instale: https://nodejs.org"; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "npm não encontrado."; exit 1; }
NODE_VER=$(node -e "process.exit(parseInt(process.versions.node) < 20 ? 1 : 0)" 2>/dev/null && echo "ok" || echo "old")
[[ "$NODE_VER" == "old" ]] && warning "Node.js < 20 detectado. Recomendamos >= 20."

# ── Claude Code ───────────────────────────────────────────────────────────────
echo ""
echo "Instalando Claude Code..."
if command -v claude >/dev/null 2>&1; then
  info "Claude Code já instalado: $(claude --version 2>/dev/null || echo 'versão desconhecida')"
else
  curl -fsSL https://claude.ai/install.sh | bash
  info "Claude Code instalado!"
fi

# ── OpenAI Codex CLI ──────────────────────────────────────────────────────────
echo ""
echo "Instalando Codex CLI..."
if command -v codex >/dev/null 2>&1; then
  info "Codex CLI já instalado: $(codex --version 2>/dev/null || echo 'versão desconhecida')"
else
  npm install -g @openai/codex
  info "Codex CLI instalado!"
fi

# ── Gemini CLI ────────────────────────────────────────────────────────────────
echo ""
echo "Instalando Gemini CLI..."
if command -v gemini >/dev/null 2>&1; then
  info "Gemini CLI já instalado: $(gemini --version 2>/dev/null || echo 'versão desconhecida')"
else
  npm install -g @google/gemini-cli
  info "Gemini CLI instalado!"
fi

# ── GitHub Copilot CLI ────────────────────────────────────────────────────────
echo ""
echo "Instalando GitHub Copilot CLI..."
if command -v copilot >/dev/null 2>&1; then
  info "Copilot CLI já instalado: $(copilot --version 2>/dev/null || echo 'versão desconhecida')"
else
  npm install -g @github/copilot
  info "Copilot CLI instalado!"
fi

# ── OpenClaude CLI ────────────────────────────────────────────────────────────
echo ""
echo "Instalando OpenClaude CLI..."
if command -v openclaude >/dev/null 2>&1; then
  info "OpenClaude CLI já instalado: $(openclaude --version 2>/dev/null || echo 'versão desconhecida')"
else
  npm install -g @gitlawb/openclaude
  info "OpenClaude CLI instalado!"
fi

# ── Configurar .env ───────────────────────────────────────────────────────────
echo ""
if [ ! -f ".env" ]; then
  cp .env.example .env
  warning "Arquivo .env criado a partir de .env.example. Configure suas chaves de API antes de continuar."
else
  info ".env já existe."
fi

echo ""
echo "═══════════════════════════════════════════"
info "Setup concluído! Próximos passos:"
echo "  1. Edite .env com suas chaves de API"
echo "  2. Execute: bash scripts/test_models.sh"
echo "  3. Explore: cd examples/depurador-claude && claude"
echo ""
echo "  💎 Versão PRO: https://lemon.dev/pro-agents"
echo "═══════════════════════════════════════════"
echo ""
