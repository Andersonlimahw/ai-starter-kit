#!/usr/bin/env bash
# AI Agents Starter Kit – Smoke Tests
# Verifies if all AI CLIs are installed and operational.
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

# Load .env if it exists
if [ -f ".env" ]; then
  # shellcheck disable=SC1091
  set -a; source .env; set +a
  ok ".env loaded"
else
  warn ".env not found. Some checks may fail."
fi

echo ""
echo "── Verifying installed CLIs ─────────────────"

check_cli() {
  local name="$1"
  local cmd="$2"
  local version_flag="${3:---version}"

  if command -v "$cmd" >/dev/null 2>&1; then
    local ver
    ver=$("$cmd" $version_flag 2>/dev/null | head -1 || echo "unknown")
    ok "$name: $ver"
  else
    fail "$name not found. Run: bash scripts/setup.sh"
  fi
}

check_cli "Claude Code"     "claude"     "--version"
check_cli "Codex CLI"       "codex"      "--version"
check_cli "Gemini CLI"      "gemini"     "--version"
check_cli "Copilot CLI"     "copilot"    "--version"
check_cli "OpenClaude CLI"  "openclaude" "--version"

echo ""
echo "── Verifying API keys ───────────────────"

check_key() {
  local name="$1"
  local var="$2"
  if [ -n "${!var:-}" ]; then
    ok "$name configured (${var})"
  else
    warn "$name not configured (${var} empty)"
  fi
}

check_key "Anthropic (Claude)" "CLAUDE_API_KEY"
check_key "OpenAI (Codex)"     "OPENAI_API_KEY"
check_key "Google (Gemini)"    "GEMINI_API_KEY"
check_key "GitHub (Copilot)"   "GITHUB_TOKEN"

echo ""
echo "═══════════════════════════════════════════"
echo -e "Result: ${GREEN}${PASS} ok${NC} | ${RED}${FAIL} failure(s)${NC}"

if [ $FAIL -eq 0 ]; then
  echo -e "${GREEN}All CLIs are operational!${NC}"
else
  echo -e "${YELLOW}Fix the failures above and run again.${NC}"
fi
echo ""
