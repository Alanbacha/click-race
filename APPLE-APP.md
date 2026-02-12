# Como transformar o Click Race em app Apple

Existem duas formas principais.

**Já deixamos o projeto preparado para PWA** (manifest + meta tags no layout).

---

## Opção 1: PWA (Progressive Web App) – mais rápido

O usuário **adiciona o jogo à tela inicial** do iPhone/iPad e abre como app. **Não vai para a App Store.**

### O que já está feito

- `client/public/manifest.json` – nome do app, cores, modo standalone
- Meta tags no layout – app capaz de abrir em tela cheia no iOS

### Ícones (opcional)

Para um ícone bonito na tela inicial, coloque na pasta `client/public/`:

- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)

Se não colocar, o iPhone usa um ícone padrão; o “Adicionar à tela inicial” continua funcionando.

### No iPhone/iPad
   - Abrir o jogo no Safari (ex.: `https://seu-dominio.com` ou no local: `http://SEU-IP:3000`)
   - Toque no botão **Compartilhar** → **“Adicionar à Tela Inicial”**
   - Nome: ex. “Click Race” → Adicionar

O ícone aparece na tela inicial e abre em tela cheia, sem barra do Safari.

### Requisito

- O jogo precisa estar **publicado na internet** (ou na mesma rede que o celular, usando o IP da sua máquina) para o Socket.io conectar ao servidor. PWA não “transforma” o backend em app; o backend continua num servidor.

---

## Opção 2: App nativo iOS (Capacitor) – para publicar na App Store

Usa **Capacitor** (Ionic) para empacotar o frontend em um app iOS e publicar na App Store. O backend continua num servidor (seu ou em nuvem).

### Passos gerais

1. **Ter o frontend buildado (estático)**  
   O Next.js precisa ser exportado como estático para o Capacitor servir os arquivos dentro do app.

2. **Instalar e configurar o Capacitor** no projeto (na pasta do client).

3. **Configurar o app iOS** no Xcode (nome, bundle ID, ícones, etc.).

4. **Apontar o frontend para o servidor em produção**  
   No app, a URL do Socket.io (e da API, se houver) deve ser a do seu servidor (ex.: `https://api.seudominio.com`), não `localhost`.

5. **Abrir o projeto iOS no Xcode**, rodar no simulador ou em dispositivo, e depois **Archive** → enviar para a App Store.

### Estrutura sugerida

```
click-race/
  client/          → build estático (npm run build + export)
  server/          → sobe em um servidor (Node na nuvem)
  ios/             → projeto Xcode (gerado pelo Capacitor)
```

O app iOS = WebView que carrega o frontend estático e se conecta ao servidor na nuvem.

---

## Resumo

| Objetivo                         | Usar              |
|----------------------------------|-------------------|
| Usar no iPhone como “app” rápido | **PWA** (Adicionar à tela inicial) |
| App na App Store                 | **Capacitor** + backend em servidor |

A **Opção 1** já está pronta. Para a **Opção 2** (Capacitor + App Store), dá para seguir o guia acima ou pedir ajuda para configurar o export estático do Next.js e o projeto iOS.
