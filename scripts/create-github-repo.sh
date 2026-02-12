#!/usr/bin/env bash
# Cria um repositório GitHub "click-race" e faz o primeiro push.
# Requer: GitHub CLI instalado e logado (gh auth login)

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_NAME="${1:-click-race}"

cd "$REPO_ROOT"

if [[ -n "$(git rev-parse --git-dir 2>/dev/null)" && "$(git rev-parse --show-toplevel)" != "$REPO_ROOT" ]]; then
  echo "→ Este diretório está dentro de outro repositório Git."
  echo "  Inicializando um repositório novo aqui e fazendo o primeiro commit..."
  rm -rf .git 2>/dev/null || true
  git init
fi

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  git init
fi

git add .
git status

if ! git diff --cached --quiet 2>/dev/null; then
  git commit -m "Initial commit: Click Race - jogo multiplayer em tempo real"
fi
git branch -M main

if ! gh repo view "$REPO_NAME" 2>/dev/null; then
  echo "→ Criando repositório no GitHub: $REPO_NAME"
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
else
  echo "→ Repositório $REPO_NAME já existe. Adicionando remote e fazendo push..."
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/$(gh api user -q .login)/${REPO_NAME}.git"
  git push -u origin main
fi

echo ""
echo "✅ Repositório: https://github.com/$(gh api user -q .login)/${REPO_NAME}"
echo "   Próximo: configure secrets e conecte Vercel/Railway (veja SETUP-GITHUB.md)"
