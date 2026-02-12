# Publicar no Vercel (e servidor em nuvem)

O Click Race tem **dois partes**: o **frontend** (Next.js) e o **backend** (Node + Socket.io). O Vercel hospeda só o frontend. O backend precisa rodar em um serviço que suporte WebSockets (Node persistente).

---

## 1. Publicar o servidor (backend)

O servidor **não** roda no Vercel (serverless não mantém Socket.io). Use um destes:

- **Railway** – https://railway.app (grátis para começar)
- **Render** – https://render.com (plano grátis)
- **Fly.io** – https://fly.io

### Exemplo com Railway

1. Crie uma conta em railway.app e um novo projeto.
2. “Add Service” → **Deploy from GitHub repo** (ou upload da pasta `server`).
3. Defina o **Root Directory** do serviço como: `server` (ou o caminho onde está a pasta do servidor no repo).
4. **Variáveis de ambiente** no Railway:
   - `CORS_ORIGIN` = URL do frontend no Vercel (ex.: `https://click-race.vercel.app`)
   - `PORT` – em geral o Railway define sozinho.
5. Comando de start: o Railway costuma detectar `npm start`; no `server` temos `"start": "node src/index.js"`. Se o root do deploy for `server`, está ok.
6. Depois do deploy, anote a **URL do serviço** (ex.: `https://click-race-server.railway.app`). Essa será a URL do Socket.io.

### Exemplo com Render

1. New → **Web Service**, conecte o repo.
2. **Root Directory:** `server`.
3. **Build Command:** `npm install`.
4. **Start Command:** `npm start`.
5. **Environment:** adicione `CORS_ORIGIN` = `https://seu-app.vercel.app`.
6. Anote a URL do serviço (ex.: `https://click-race-server.onrender.com`).

---

## 2. Publicar o frontend no Vercel

1. Acesse **https://vercel.com** e faça login (GitHub).
2. **Add New** → **Project** → importe o repositório do Click Race.
3. **Configuração do projeto:**
   - **Root Directory:** clique em “Edit” e selecione **`click-race`** (ou, se o repo for só do click-race, a raiz).  
     Se a raiz do repo for a pasta do monorepo (ex.: `Dev`), use **`click-race`** como root.  
     O importante: o Vercel precisa ver a pasta **`client`** dentro do root (ex.: `click-race/client`).
   - Se o repositório tiver **só** a pasta `client` na raiz, use root **`.`** e ajuste o passo 4.

4. **Root Directory para o Next.js:**  
   Se a raiz do projeto no Vercel for `click-race`, defina:
   - **Root Directory:** `client`  
   Assim o Vercel usa `client` como projeto Next.js (instala dependências e roda `build` dentro de `client`).

5. **Variáveis de ambiente** no Vercel (Settings → Environment Variables):
   - Nome: `NEXT_PUBLIC_SOCKET_URL`  
   - Valor: a URL do servidor que você anotou (ex.: `https://click-race-server.railway.app` ou `https://click-race-server.onrender.com`).  
   - **Não** use `http://` se o site for HTTPS; use `https://` na URL do servidor.

6. **Deploy:** dê **Deploy**. O Vercel vai rodar `npm install` e `npm run build` dentro de `client`.

---

## 3. Ajustar CORS no servidor

No serviço onde o **servidor** está hospedado (Railway, Render, etc.), a variável **`CORS_ORIGIN`** deve ser exatamente a URL do app no Vercel, por exemplo:

- `https://click-race.vercel.app`  
ou a URL customizada que o Vercel mostrar (ex.: `https://meu-projeto-xxx.vercel.app`).

Assim o navegador permite o frontend (Vercel) falar com o backend (Railway/Render).

---

## Resumo

| Onde        | O quê                         | URL / env                          |
|------------|-------------------------------|------------------------------------|
| Vercel     | Frontend (Next.js)            | `https://seu-app.vercel.app`       |
| Railway/Render | Backend (Node + Socket.io) | `https://seu-server.railway.app`   |
| Vercel env | `NEXT_PUBLIC_SOCKET_URL`      | URL do backend (https)              |
| Servidor env | `CORS_ORIGIN`              | URL do frontend no Vercel          |

Depois disso, o jogo estará no ar: frontend no Vercel e tempo real pelo servidor em nuvem.
