import http from 'http';
import {
  Client,
  GatewayIntentBits,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  Events,
  MessageFlags,
  DiscordAPIError
} from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

// Se DISCORD_TOKEN não estiver no .env ou for o placeholder, usa o token válido direto
const DEFAULT_TOKEN = 'MTU0NjM3ODk0MTk2MTYwNTE1MA.GzlRXE.ag-rmttLMdEDs7qEWYSe3aXTcqapDQhAS4BZsY';
const DEFAULT_CLIENT_ID = '1546378941961605150';

const token = (process.env.DISCORD_TOKEN && process.env.DISCORD_TOKEN !== 'SEU_DISCORD_TOKEN_AQUI') 
  ? process.env.DISCORD_TOKEN 
  : DEFAULT_TOKEN;

// Servidor HTTP ultra leve para permitir hospedagem gratuita no Render (Web Service Free)
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('🤖 Bot de Atualizações do ICE está Online 24/7!');
}).listen(PORT, () => {
  console.log(`🌐 Servidor HTTP ativo na porta ${PORT}`);
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`--------------------------------------------------`);
  console.log(`🚀 Bot online com sucesso! Conectado como ${readyClient.user.tag}`);
  console.log(`📌 Use o comando /atualizacao no Discord para enviar notas de atualização.`);
  console.log(`--------------------------------------------------`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    // 1. Tratamento do comando /atualizacao
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'atualizacao') {
        const canal = interaction.options.getChannel('canal') || interaction.channel;
        const mencionar = interaction.options.getString('mencionar') || 'none';
        const cor = interaction.options.getString('cor') || '#3B82F6';
        const imagem = interaction.options.getString('imagem') || 'none';

        // Encoding seguro das opções no customId do modal (usando delimitador |)
        const customId = `modal_upd|${canal.id}|${mencionar}|${encodeURIComponent(cor)}|${encodeURIComponent(imagem)}`;

        const modal = new ModalBuilder()
          .setCustomId(customId.slice(0, 100))
          .setTitle('📢 Criar Nota de Atualização');

        const inputTitulo = new TextInputBuilder()
          .setCustomId('input_titulo')
          .setLabel('📌 Título / Versão da Atualização')
          .setPlaceholder('Ex: v1.2.0 - Atualização do Sistema')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
          .setMaxLength(256);

        const inputNovidades = new TextInputBuilder()
          .setCustomId('input_novidades')
          .setLabel('✨ O que há de Novo? (Adicionado)')
          .setPlaceholder('- Adicionado sistema de notificações\n- Novo painel de utilizador')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false)
          .setMaxLength(1000);

        const inputMelhorias = new TextInputBuilder()
          .setCustomId('input_melhorias')
          .setLabel('⚡ Melhorias e Ajustes')
          .setPlaceholder('- Otimização de desempenho na página principal\n- Layout responsivo atualizado')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false)
          .setMaxLength(1000);

        const inputCorrecoes = new TextInputBuilder()
          .setCustomId('input_correcoes')
          .setLabel('🐛 Correções de Bugs (Fixes)')
          .setPlaceholder('- Corrigido erro ao fazer login\n- Resolvida falha de carregamento')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false)
          .setMaxLength(1000);

        const inputNotas = new TextInputBuilder()
          .setCustomId('input_notas')
          .setLabel('📌 Notas Adicionais / Outros')
          .setPlaceholder('Ex: Agradecimentos à equipa de suporte ou avisos importantes.')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false)
          .setMaxLength(1000);

        modal.addComponents(
          new ActionRowBuilder().addComponents(inputTitulo),
          new ActionRowBuilder().addComponents(inputNovidades),
          new ActionRowBuilder().addComponents(inputMelhorias),
          new ActionRowBuilder().addComponents(inputCorrecoes),
          new ActionRowBuilder().addComponents(inputNotas)
        );

        await interaction.showModal(modal);
      }
    }

    // 2. Tratamento da submissão do Modal
    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith('modal_upd|')) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const parts = interaction.customId.split('|');
        const channelId = parts[1];
        const mention = parts[2];
        const color = decodeURIComponent(parts[3] || '#3B82F6');
        const imageUrl = decodeURIComponent(parts[4] || 'none');

        const titulo = interaction.fields.getTextInputValue('input_titulo');
        const novidades = interaction.fields.getTextInputValue('input_novidades');
        const melhorias = interaction.fields.getTextInputValue('input_melhorias');
        const correcoes = interaction.fields.getTextInputValue('input_correcoes');
        const notas = interaction.fields.getTextInputValue('input_notas');

        const targetChannel = await interaction.guild.channels.fetch(channelId).catch(() => interaction.channel);

        // Construção do Embed bonito
        const embed = new EmbedBuilder()
          .setTitle(`📢 ${titulo}`)
          .setColor(color)
          .setTimestamp()
          .setFooter({
            text: `Publicado por ${interaction.user.displayName || interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
          });

        if (novidades && novidades.trim() !== '') {
          embed.addFields({ name: '✨ Novidades', value: novidades.trim(), inline: false });
        }

        if (melhorias && melhorias.trim() !== '') {
          embed.addFields({ name: '⚡ Melhorias', value: melhorias.trim(), inline: false });
        }

        if (correcoes && correcoes.trim() !== '') {
          embed.addFields({ name: '🐛 Correções de Bugs', value: correcoes.trim(), inline: false });
        }

        if (notas && notas.trim() !== '') {
          embed.addFields({ name: '📌 Notas Adicionais', value: notas.trim(), inline: false });
        }

        if (imageUrl !== 'none' && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
          embed.setImage(imageUrl);
        }

        // Conteúdo da mensagem (para mencionar @everyone ou @here)
        let content = undefined;
        if (mention === 'everyone') {
          content = '@everyone';
        } else if (mention === 'here') {
          content = '@here';
        }

        // Enviar a mensagem para o canal correto
        const sentMessage = await targetChannel.send({
          content,
          embeds: [embed]
        });

        await interaction.editReply({
          content: `✅ **Atualização publicada com sucesso!**\n🔗 [Clique aqui para ver a mensagem](${sentMessage.url}) no canal <#${targetChannel.id}>.`
        });
      }
    }
  } catch (error) {
    console.error('❌ Erro no processamento da interação:', error);

    let errorMessage = '❌ Ocorreu um erro ao processar o seu pedido.';
    if (error instanceof DiscordAPIError || error.code === 50013) {
      if (error.code === 50013) {
        errorMessage = '🚫 **Erro de Permissões no Discord!**\nO bot não tem permissão suficiente para enviar mensagens/embeds ou mencionar cargos no canal selecionado. Por favor, dê permissão ao cargo do bot de **"Enviar Mensagens"**, **"Inserir Links"** e **"Mencionar @everyone"** nesse canal.';
      } else {
        errorMessage = `❌ **Erro do Discord (${error.code}):** ${error.message}`;
      }
    }

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, flags: MessageFlags.Ephemeral }).catch(() => {});
    } else if (interaction.isRepliable()) {
      await interaction.reply({ content: errorMessage, flags: MessageFlags.Ephemeral }).catch(() => {});
    }
  }
});

client.login(token);
