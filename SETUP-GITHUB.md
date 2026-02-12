# Configurar tudo no GitHub (Actions, deploy, repositório)

Este guia configura o repositório no GitHub, GitHub Actions (CI e deploy) e a integração com Vercel e Railway.

---

## 1. Criar o repositório e fazer o primeiro push

### Opção A: Script que instala tudo (recomendado se não tem GitHub CLI)

No **Terminal** do macOS, na pasta do projeto:

```bash
cd /caminho/para/click-race
chmod +x scripts/install-gh-and-setup-repo.sh
bash scripts/install-gh-and-setup-repo.sh
```

O script:

1. Instala o **Homebrew** (se ainda não tiver)
2. Instala o **GitHub CLI** (`gh`) com `brew install gh`
3. Pede para você fazer **login no GitHub** no navegador (`gh auth login`)
4. Cria o repositório no GitHub e faz o primeiro push

Nome do repo: `click-race`. Para outro nome: `bash scripts/install-gh-and-setup-repo.sh meu-repo`.

### Opção B: Só criar o repo (quando já tem `gh` instalado)

```bash
gh auth login
chmod +x scripts/create-github-repo.sh
./scripts/create-github-repo.sh
```

### Opção C: Manual (sem scripts)

1. Crie um repositório **vazio** no GitHub (sem README, sem .gitignore).
2. Na pasta do projeto:

```bash
git init
git add .
git commit -m "Initial commit: Click Race"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/click-race.git
git push -u origin main
```

---

## 2. Secrets no GitHub (para os deploys)

Em **GitHub → Repositório → Settings → Secrets and variables → Actions** → **New repository secret**.

### Para o deploy no Vercel (frontend)

| Nome | Onde pegar |
|------|------------|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens → Create Token |
| `VERCEL_ORG_ID` | Projeto no Vercel → Settings → General → "Organization ID" (ou rode `vercel link` e veja `.vercel/project.json`) |
| `VERCEL_PROJECT_ID` | Mesmo lugar, "Project ID" |
| `NEXT_PUBLIC_SOCKET_URL` | URL do backend em produção (ex.: `https://seu-backend.railway.app`) |

### Para o deploy no Railway (backend)

| Nome | Onde pegar |
|------|------------|
| `RAILWAY_TOKEN` | Railway → Account Settings → Tokens → Create Token |

No Railway, depois de criar o projeto e o serviço para a pasta `server`, você pode vincular o repo pelo dashboard (Deploy from GitHub); a Action usa o token para `railway up` em cada push.

---

## 3. Vercel (frontend)

1. Acesse [vercel.com](https://vercel.com) e conecte sua conta ao GitHub.
2. **Add New Project** → importe o repositório `click-race`.
3. **Root Directory:** defina como **`client`** (o Next.js está em `client/`).
4. **Environment Variables:**  
   - `NEXT_PUBLIC_SOCKET_URL` = URL do backend (ex.: a URL do Railway).
5. Deploy.

Se quiser que o deploy seja **só** pela GitHub Action (em vez do deploy automático do Vercel ao dar push), desative “Automatically deploy on push” nas configurações do projeto e use apenas o workflow `Deploy Frontend (Vercel)`.

---

## 4. Railway (backend)

1. Acesse [railway.app](https://railway.app) e conecte o GitHub.
2. **New Project** → **Deploy from GitHub repo** → escolha `click-race`.
3. No serviço criado: **Settings** → **Root Directory** = **`server`**.
4. **Variables:**  
   - `CORS_ORIGIN` = URL do frontend no Vercel (ex.: `https://click-race.vercel.app`).
5. Railway vai fazer deploy a cada push em `main` (ou use a Action com `RAILWAY_TOKEN`).

A URL do serviço (ex.: `https://xxx.railway.app`) é a que você usa em `NEXT_PUBLIC_SOCKET_URL` no Vercel e em `CORS_ORIGIN` no Railway.

---

## 5. O que os workflows fazem

| Workflow | Quando roda | O que faz |
|----------|------------|-----------|
| **CI** | Em todo push/PR em `main`/`master` | Instala e faz build do `client` e do `server` para garantir que não quebrou nada. |
| **Deploy Frontend (Vercel)** | Em push em `main` (e manual) | Faz build e deploy do frontend no Vercel usando os secrets. |
| **Deploy Backend (Railway)** | Em push em `main` quando mudar algo em `server/` (e manual) | Faz deploy do backend no Railway com o CLI. |

---

## 6. Resumo rápido

1. Rodar `./scripts/create-github-repo.sh` (ou criar o repo e dar push manual).
2. Adicionar os **secrets** no GitHub (Vercel + Railway).
3. Conectar o **Vercel** ao repo com Root Directory = `client` e variável `NEXT_PUBLIC_SOCKET_URL`.
4. Conectar o **Railway** ao repo com Root Directory = `server` e variável `CORS_ORIGIN`.
5. A partir daí: push em `main` → CI roda; frontend e backend podem ser deployados pelo Vercel/Railway ou pelas Actions, conforme sua preferência.

Arquivos já incluídos no repo: manifest (PWA), `.gitignore`, `.github/workflows` (CI + deploy Vercel + deploy Railway).
