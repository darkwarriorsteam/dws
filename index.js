const { Client, ReactionUserManager, TextChannel } = require('discord.js');
const fs = require('fs');
const client = new Client({partials: ['REACTION', 'MESSAGE', 'USER', 'CHANNEL', 'GUILD_MEMBER', '']});

const MessageHandler = require('./MessageHandler.js');
const EmbedBuilder = require('./EmbedBuilder.js');

var messageId, guildId, channelId, rolesToAdd, rolesToRemove, defaultRoles;

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await refresh();
  console.log("Successfully refreshed client data after restart.");
  if(messageId !== null && guildId !== null && channelId !== null) {
    startListeners();
    console.log(`Started listeners for reactions on verification message. ID: ${messageId}`);
  }
});

client.on('message', async msg => {
  if(msg.author.bot) return;
  if(msg.content.startsWith("!!verification")) {
    if(messageId === null || guildId === null || channelId === null) {
      sendValidationMessage(msg);
    } else {
      msg.channel.send(`There is already a verification message in a channel. Channel ID: ${channelId}`);
    }
    msg.delete();
    return;
  }
  if(msg.content.startsWith("!!resetv")) {
    await resetVerificationData();
    refreshOnReset();
    msg.delete();
  }
});

function sendValidationMessage(message) {
  const embed = EmbedBuilder.buildVerificationEmbed();

  message.channel.send(embed).then(async msg => {
    await msg.react('✅');
    await refreshFileData(msg);
    await refresh();
    startListeners();
  });
}

async function startListeners() {
  const guild = await client.guilds.cache.find(guild => guild.id === guildId);
  const channel = await guild.channels.cache.get(channelId);
  const msg = await channel.messages.fetch(messageId);

  const c = msg.createReactionCollector(() => true, { dispose: true });
  c.on('collect', async (reaction, user) => {
    if(reaction.emoji.name !== '✅') {
      reaction.users.remove(user);
      return false;
    }
    const member = msg.guild.member(user);
    for(var i in rolesToAdd) {
      await member.roles.add(msg.guild.roles.cache.find(role => role.name === rolesToAdd[i]));
    }
    for(var i in rolesToRemove) {
      await member.roles.remove(msg.guild.roles.cache.find(role => role.name === rolesToRemove[i]));
    }
  });

  c.on('remove', async (reaction, user) => {
    const member = msg.guild.member(user);
    await member.roles.remove(member.roles.cache);
    for(var i in defaultRoles) {
      member.roles.add(msg.guild.roles.cache.find(role => role.name === defaultRoles[i]));
    }
  });
}

function refresh() {
  const file = require('./json/data.json');

  messageId = file.data.verification.messageId;
  channelId = file.data.verification.channelId;
  guildId = file.data.verification.guildId;
  rolesToAdd = file.data.verification.rolesToAdd;
  rolesToRemove = file.data.verification.rolesToRemove;
  defaultRoles = file.data.verification.defaultRoles;
}

async function refreshOnReset() {
  const guild = await client.guilds.cache.find(guild => guild.id === guildId);
  const channel = await guild.channels.cache.get(channelId);
  const msg = await channel.messages.fetch(messageId);
  refresh();
  msg.delete();
}

function refreshFileData(msg) {
  const file = require('./json/data.json');

  file.data.verification.messageId = msg.id;
  file.data.verification.channelId = msg.channel.id;
  file.data.verification.guildId = msg.guild.id;

  fs.writeFile('./json/data.json', JSON.stringify(file), err => {
    console.log(err === null ? "No errors occoured during file writing" : `Error occoured during file writing: ${err}`);
  });
}

function resetVerificationData() {
  const file = require('./json/data.json');

  file.data.verification.messageId = null;
  file.data.verification.channelId = null;
  file.data.verification.guildId = null;

  fs.writeFile('./json/data.json', JSON.stringify(file), err => {
    console.log(err === null ? "No errors occoured during file writing" : `Error occoured during file writing: ${err}`);
  });
}

client.login(process.env.DCTKN);