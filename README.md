# 🏁 Click Race

Jogo multiplayer em tempo real - **quem clica primeiro?**

## Como rodar

```bash
# Instalar dependências
npm install
cd server && npm install
cd ../client && npm install
cd ..

# Rodar servidor e cliente (em paralelo)
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:4000

## Fluxo do jogo

1. **Home** - Digite seu nome e crie ou entre em uma sala
2. **Criar sala** - Pública ou privada (com senha)
3. **Lobby** - Admin define quantos times (2–6), cada um com cor
4. **Organização** - Arraste jogadores para os times ou use Shuffle
5. **Config** - Pontos para vencer, duração da rodada, delay do botão
6. **Jogo** - Botão grande; ao clicar, a tela muda para a cor do time do vencedor
7. **Rodada** - Admin define pontos, inicia próxima rodada
8. **Fim** - Time que atingir a pontuação alvo vence

## Publicar (GitHub + Vercel + Railway)

- **Criar repo e configurar tudo:** [SETUP-GITHUB.md](./SETUP-GITHUB.md) (script para criar o repo, GitHub Actions, secrets, Vercel e Railway).
- **Deploy manual:** [DEPLOY.md](./DEPLOY.md).

## Stack

- **Frontend:** Next.js 14, React, Tailwind, Framer Motion, Socket.io Client
- **Backend:** Node.js, Express, Socket.io
- **Arquitetura:** SOLID, Clean Code
