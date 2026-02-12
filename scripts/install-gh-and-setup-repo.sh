#!/usr/bin/env bash
# Instala Homebrew (se precisar), GitHub CLI (gh), e cria o repositório no GitHub.
# Rode no Terminal do macOS:  bash scripts/install-gh-and-setup-repo.sh

set -e
REPO_NAME="${1:-click-race}"

echo "=== 1. Homebrew ==="
if command -v brew >/dev/null 2>&1; then
  echo "Homebrew já instalado: $(brew --prefix)"
else
  echo "Instalando Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # Adiciona brew ao PATH nesta sessão (e no perfil para as próximas)
  if [ -x /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
    echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile 2>/dev/null || true
  elif [ -x /usr/local/bin/brew ]; then
    eval "$(/usr/local/bin/brew shellenv)"
    echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile 2>/dev/null || true
  fi
fi

# Garante que brew está no PATH
if ! command -v brew >/dev/null 2>&1; then
  [ -x /opt/homebrew/bin/brew ] && eval "$(/opt/homebrew/bin/brew shellenv)"
  [ -x /usr/local/bin/brew ] && eval "$(/usr/local/bin/brew shellenv)"
fi
command -v brew >/dev/null 2>&1 || { echo "Erro: brew não encontrado."; exit 1; }

echo ""
echo "=== 2. GitHub CLI (gh) ==="
if command -v gh >/dev/null 2>&1; then
  echo "gh já instalado: $(gh --version | head -1)"
else
  brew install gh
fi

echo ""
echo "=== 3. Login no GitHub ==="
if gh auth status 2>/dev/null; then
  echo "Você já está logado no GitHub."
else
  echo "Abra o navegador para fazer login no GitHub."
  echo "Quando perguntar o protocolo: escolha HTTPS (mais simples, não precisa de chave SSH)."
  gh auth login
fi
# Usa o mesmo protocolo que o usuário configurou no gh (https ou ssh)
GIT_PROTOCOL="https"
if gh config get git_protocol >/dev/null 2>&1; then
  GIT_PROTOCOL="$(gh config get git_protocol)"
fi

echo ""
echo "=== 4. Criar repositório e fazer push ==="
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

GIT_DIR="$(git rev-parse --git-dir 2>/dev/null)"
GIT_TOP="$(git rev-parse --show-toplevel 2>/dev/null)"
if [ -n "$GIT_DIR" ] && [ "$GIT_TOP" != "$REPO_ROOT" ]; then
  echo "Pasta está dentro de outro repositório. Inicializando Git aqui..."
  rm -rf .git 2>/dev/null || true
  git init
fi

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  git init
fi

git add .
if ! git diff --cached --quiet 2>/dev/null; then
  git commit -m "Initial commit: Click Race - jogo multiplayer em tempo real"
fi
git branch -M main

USER="$(gh api user -q .login)"
if [ "$GIT_PROTOCOL" = "ssh" ]; then
  REMOTE_URL="git@github.com:${USER}/${REPO_NAME}.git"
else
  REMOTE_URL="https://github.com/${USER}/${REPO_NAME}.git"
fi

if ! gh repo view "$REPO_NAME" 2>/dev/null; then
  echo "Criando repositório no GitHub: $REPO_NAME"
  gh repo create "$REPO_NAME" --public --source=. --remote=origin --push
else
  echo "Repositório $REPO_NAME já existe. Configurando remote e fazendo push..."
  git remote remove origin 2>/dev/null || true
  git remote add origin "$REMOTE_URL"
  git push -u origin main
fi

echo ""
echo "✅ Concluído."
echo "   Repositório: https://github.com/${USER}/${REPO_NAME}"
echo "   Próximo: configure os secrets e conecte Vercel/Railway (veja SETUP-GITHUB.md)"
