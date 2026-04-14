#!/bin/bash
# Git Hooks Setup — {{PROJECT_NAME}}
# Instala hooks de pre-commit e post-merge

set -e
echo "Configurando Git hooks para {{PROJECT_NAME}}..."
mkdir -p .git/hooks

cat > .git/hooks/pre-commit << 'HOOK'
#!/bin/bash
echo "Rodando verificações pre-commit..."

if command -v npm &>/dev/null && [ -f package.json ]; then
  if grep -q '"typecheck"' package.json 2>/dev/null; then
    echo "Verificando TypeScript..."
    npm run typecheck || { echo "TypeScript falhou. Commit abortado."; exit 1; }
  fi
  if grep -q '"lint"' package.json 2>/dev/null; then
    echo "Rodando lint..."
    npm run lint || { echo "Lint falhou. Commit abortado."; exit 1; }
  fi
fi

echo "Pre-commit OK"
exit 0
HOOK

chmod +x .git/hooks/pre-commit

cat > .git/hooks/post-merge << 'HOOK'
#!/bin/bash
if git diff --name-only HEAD@{1} | grep -qE "package-lock\.json|requirements\.txt"; then
  echo "Dependências alteradas. Instale manualmente se necessário."
fi
exit 0
HOOK

chmod +x .git/hooks/post-merge

echo "Hooks instalados: pre-commit (lint/typecheck), post-merge (aviso de deps)"
