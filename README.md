# 🤖 Bot de Atualizações para Discord (`/atualizacao`)

Um bot moderno em **Node.js (discord.js v14)** que permite publicar notas de atualização/changelogs bonitos e formatados no Discord através do comando `/atualizacao`.

---

## 🌟 Funcionalidades

- 📝 **Formulário Interativo (Modal)**: Janela no Discord para preencher o título, novidades, melhorias, correções e notas.
- 🎨 **Embed Personalizável**: Cores configuráveis, ícones/emojis organizados, timestamp e identificação de quem publicou.
- 📢 **Suporte a Menção**: Opção de mencionar `@everyone` ou `@here`.
- 🖼️ **Imagens / Banners**: Opção para adicionar um banner na atualização.
- 🎯 **Seleção de Canal**: Escolha em qual canal enviar a atualização diretamente no comando.

---

## 🛠️ Passo a Passo de Configuração

### 1. Criar o Bot no Discord Developer Portal

1. Aceda ao [Discord Developer Portal](https://discord.com/developers/applications).
2. Clique em **"New Application"** no canto superior direito e escolha um nome para o seu bot (ex: `ICE Changelog`).
3. No menu lateral esquerdo, vá em **"Bot"**:
   - Clique em **"Reset Token"** para gerar o token. Copie este valor (é o seu `DISCORD_TOKEN`).
4. No menu lateral esquerdo, vá em **"OAuth2"**:
   - Copie o **"Client ID"** (é o seu `CLIENT_ID`).

### 2. Convidar o Bot para o seu Servidor

1. No menu lateral esquerdo, vá em **OAuth2** > **URL Generator**.
2. Na secção **Scopes**, selecione:
   - `bot`
   - `applications.commands`
3. Na secção **Bot Permissions**, selecione:
   - `Send Messages`
   - `Embed Links`
   - `Attach Files`
   - `Use External Emojis`
   - `Read Message History`
4. Copie o URL gerado na parte inferior e cole no seu navegador para adicionar o bot ao seu servidor do Discord.

---

## 🚀 Como Executar o Bot

### 1. Configurar as Variáveis de Ambiente
Abra o ficheiro `.env` na raiz do projeto e preencha com o seu **Token** e **Client ID**:

```env
DISCORD_TOKEN=seu_token_aqui
CLIENT_ID=seu_client_id_aqui
GUILD_ID=
```

*(Dica: Se colocar o ID do seu servidor de testes em `GUILD_ID`, o comando `/atualizacao` ficará disponível **instantaneamente** nesse servidor!)*

### 2. Instalar as Dependências
Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

### 3. Registar o Comando Slash no Discord
Execute o comando abaixo uma vez para enviar o `/atualizacao` para o Discord:

```bash
npm run deploy
```

### 4. Iniciar o Bot
Inicie o bot com:

```bash
npm start
```

---

## 📸 Como usar no Discord

1. No seu servidor do Discord, digite `/atualizacao`.
2. *(Opcional)* Escolha o **canal**, a **cor** ou se deseja **mencionar** `@everyone`.
3. Pressione `ENTER` — uma janela popup (Modal) irá abrir no Discord!
4. Preencha o Título, Novidades, Melhorias e Correções de Bugs.
5. Clique em **Enviar**! O bot enviará o Embed formatado tudo bonitinho! ✨
