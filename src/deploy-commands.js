import { REST, Routes, SlashCommandBuilder, ChannelType, PermissionFlagsBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId || token === 'SEU_DISCORD_TOKEN_AQUI') {
  console.error('❌ ERRO: Por favor, configure o DISCORD_TOKEN e CLIENT_ID no ficheiro .env antes de registar os comandos!');
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName('atualizacao')
    .setDescription('Abre um formulário para publicar uma nota de atualização formatada.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addChannelOption(option =>
      option
        .setName('canal')
        .setDescription('Canal onde a atualização será publicada (padrão: canal atual)')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(false)
    )
    .addStringOption(option =>
      option
        .setName('mencionar')
        .setDescription('Mencionar algum cargo ao enviar a atualização?')
        .setRequired(false)
        .addChoices(
          { name: 'Nenhum', value: 'none' },
          { name: '@everyone', value: 'everyone' },
          { name: '@here', value: 'here' }
        )
    )
    .addStringOption(option =>
      option
        .setName('cor')
        .setDescription('Cor do destaque do Embed')
        .setRequired(false)
        .addChoices(
          { name: '🔵 Azul (Padrão)', value: '#3B82F6' },
          { name: '🟢 Verde / Sucesso', value: '#10B981' },
          { name: '💜 Roxo / Especial', value: '#8B5CF6' },
          { name: '🔴 Vermelho / Crítico', value: '#EF4444' },
          { name: '🟡 Dourado / Edição Especial', value: '#F59E0B' },
          { name: '⚫ Escuro / Elegante', value: '#1E293B' }
        )
    )
    .addStringOption(option =>
      option
        .setName('imagem')
        .setDescription('URL de uma imagem/banner para incluir na atualização (opcional)')
        .setRequired(false)
    )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('🔄 A registar comandos Slash (/atualizacao)...');

    if (guildId && guildId.trim() !== '') {
      // Registo rápido no servidor específico (ideal para testes)
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      console.log(`✅ Comando /atualizacao registado com sucesso no servidor (${guildId})!`);
    } else {
      // Registo global em todos os servidores
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );
      console.log('✅ Comando /atualizacao registado com sucesso globalmente!');
    }
  } catch (error) {
    console.error('❌ Erro ao registar comando:', error);
  }
})();
