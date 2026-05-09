#!/usr/bin/env bash
# AI Agents Starter Kit – Setup Script
# Installs all AI CLIs required for the kit.
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

# ── Verify base dependencies ───────────────────────────────────────────────
command -v node >/dev/null 2>&1 || { echo "Node.js not found. Install: https://nodejs.org"; exit 1; }
command -v npm  >/dev/null 2>&1 || { echo "npm not found."; exit 1; }
NODE_VER=$(node -e "process.exit(parseInt(process.versions.node) < 20 ? 1 : 0)" 2>/dev/null && echo "ok" || echo "old")
[[ "$NODE_VER" == "old" ]] && warning "Node.js < 20 detected. We recommend >= 20."

# ── Claude Code ───────────────────────────────────────────────────────────────
echo ""
echo "Installing Claude Code..."
if command -v claude >/dev/null 2>&1; then
  info "Claude Code already installed: $(claude --version 2>/dev/null || echo 'unknown version')"
else
  curl -fsSL https://claude.ai/install.sh | bash
  info "Claude Code installed!"
fi

# ── OpenAI Codex CLI ──────────────────────────────────────────────────────────
echo ""
echo "Installing Codex CLI..."
if command -v codex >/dev/null 2>&1; then
  info "Codex CLI already installed: $(codex --version 2>/dev/null || echo 'unknown version')"
else
  npm install -g @openai/codex
  info "Codex CLI installed!"
fi

# ── Gemini CLI ────────────────────────────────────────────────────────────────
echo ""
echo "Installing Gemini CLI..."
if command -v gemini >/dev/null 2>&1; then
  info "Gemini CLI already installed: $(gemini --version 2>/dev/null || echo 'unknown version')"
else
  npm install -g @google/gemini-cli
  info "Gemini CLI installed!"
fi

# ── GitHub Copilot CLI ────────────────────────────────────────────────────────
echo ""
echo "Installing GitHub Copilot CLI..."
if command -v copilot >/dev/null 2>&1; then
  info "Copilot CLI already installed: $(copilot --version 2>/dev/null || echo 'unknown version')"
else
  npm install -g @github/copilot
  info "Copilot CLI installed!"
fi

# ── OpenCode CLI ────────────────────────────────────────────────────────────
echo ""
echo "Installing OpenCode CLI..."
if command -v opencode >/dev/null 2>&1; then
  info "OpenCode CLI already installed: $(opencode --version 2>/dev/null || echo 'unknown version')"
else
  npm install -g opencode-ai
  info "OpenCode CLI installed!"
fi

# ── Configure .env ───────────────────────────────────────────────────────────
echo ""
if [ ! -f ".env" ]; then
  cp .env.example .env
  warning ".env file created from .env.example. Configure your API keys before continuing."
else
  info ".env already exists."
fi

echo ""
echo "═══════════════════════════════════════════"
info "Setup completed! Next steps:"
echo "  1. Edit .env with your API keys"
echo "  2. If you want to generate the AI agents scaffold in another repository, run: npm run init-ai"
echo "  3. Run: bash scripts/test_models.sh"
echo "  4. Explore: cd examples/debugger-claude && claude"
echo ""
echo "  💎 PRO version: https://lemon.dev.br"
echo "═══════════════════════════════════════════"
echo ""
