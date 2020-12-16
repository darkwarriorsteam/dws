var Discord = require('discord.js');
import { EmbedBuilder } from './EmbedBuilder';
import { Guild, GuildChannel, GuildMember, Message, MessageEmbed, MessageReaction } from 'discord.js';
import { MainProcess } from './index';
import { BotFiles, FileManager } from './FileManager';

export class VerificationManager {
  messageId: any;
  channelId: any;
  guildId: any;
  rolesToAdd: string[];
  rolesToRemove: string[];
  defaultRoles: string[];

  constructor() {
    this.messageId = this.channelId = this.guildId = null;
    this.rolesToAdd = this.rolesToRemove = this.defaultRoles = [];
  }

  async start() {
    this.refresh();
    console.log("Verification Service || Successfully refreshed data after restart.");
    if(this.messageId !== null && this.guildId !== null && this.channelId !== null) {
      this.startListeners();
      console.log(`Verification Service || Started listeners for reactions on verification message. ID: ${this.messageId}`);
    }
  }

  async sendValidationMessage(message: Message) {
    var embed: MessageEmbed = EmbedBuilder.getVerificationEmbed();

    await message.channel.send("<@&772200267227332628>");
    message.channel.send(embed).then(async (msg: Message) => {
      await msg.react('✅');
      this.refreshFileData(msg);
      this.refresh();
      this.startListeners();
    });
  }

  async refreshOnReset() {
    const guild: Guild = MainProcess.getClient().guilds.cache.find(guild => guild.id === this.guildId)!;
    const channel: GuildChannel = guild.channels.cache.get(this.channelId)!;
    if(!channel.isText()) return;
    const msg: Message = await channel.messages.fetch(this.messageId);
    this.refresh();
    msg.delete();
  }

  refresh() {
    var file = require('./json/verification.json');

    this.messageId = file.data.messageId;
    this.channelId = file.data.channelId;
    this.guildId = file.data.guildId;
    this.rolesToAdd = file.data.rolesToAdd;
    this.rolesToRemove = file.data.rolesToRemove;
    this.defaultRoles = file.data.defaultRoles;
  }

  refreshFileData(msg: Message) {
    var file = BotFiles.verification();

    file.data.messageId = msg.id;
    file.data.channelId = msg.channel.id;
    file.data.guildId = msg.guild!.id;

    FileManager.write(BotFiles.verification.prototype.path(), file);
  }

  resetVerificationData() {
    var file = BotFiles.verification();

    file.data.messageId = null;
    file.data.channelId = null;
    file.data.guildId = null;

    FileManager.write(BotFiles.verification.prototype.path(), file);
  }

  async startListeners() {
    const guild: Guild = MainProcess.getClient().guilds.cache.find(guild => guild.id === this.guildId)!;
    const channel: GuildChannel = guild.channels.cache.get(this.channelId)!;
    if(!channel.isText()) return;
    console.log('Verification Service || Found channel from configured id');
    const msg: Message = await channel.messages.fetch(this.messageId);
    console.log('Verification Service || Starting Listeners was successful');

    const c = msg.createReactionCollector(() => true, { dispose: true });
    c.on('collect', async (reaction, user) => {
      if(reaction.emoji.name !== '✅') {
        reaction.users.remove(user);
        console.log(`Verification Service || User ${user.tag} reacted with ${reaction.emoji.name}. Reaction was removed succesfully`);
        return false;
      }
      const member: GuildMember = msg.guild!.member(user)!;
      for(var i in this.rolesToAdd) {
        await member.roles.add(msg.guild!.roles.cache.find(role => role.name === this.rolesToAdd[i])!);
      }
      console.log(`Verification Service || Added ${this.rolesToAdd} roles to ${user.tag}`);
      for(var i in this.rolesToRemove) {
        await member.roles.remove(msg.guild!.roles.cache.find(role => role.name === this.rolesToRemove[i])!);
      }
      console.log(`Verification Service || Removed ${this.rolesToRemove} roles from ${user.tag}`);
      console.log(`Verification Service || Member ${user.tag} verified.`);
    });

    c.on('remove', async (reaction, user) => {
      if(reaction.emoji.name !== '✅') return;
      const member: GuildMember = msg.guild!.member(user)!;
      var message: Message;
      await member.send(`Du bist gerade dabei deine Regelbestätigung zurückzuziehen, das bedeutet du verlierst alle deine Rollen. ` +
      'Bitte bestätige erneut, dass du die Regeln nicht weiter akzeptierst indem du auf ❌ klickst. Wenn du dich nur verklickt hast, ' +
      'dann brauchst du nichts machen :D').then((msg) => {
        message = msg;
        this.processMessageForUser(msg, message, reaction, member);
      }).catch(async () => {
        await reaction.message.channel.send(`Du, <@${user.id}>, bist gerade dabei deine Regelbestätigung zurückzuziehen,` +
        'das bedeutet du verlierst alle deine Rollen. Bitte bestätige erneut, dass du die Regeln nicht weiter akzeptierst ' +
        'indem du auf ❌ klickst. Wenn du dich nur verklickt hast, dann brauchst du nichts machen :D').then((msg) => {
          message = msg;
          this.processMessageForUser(msg, message, reaction, member);
        });
      });
    });
  }
  async processMessageForUser(msg: Message, message: Message, reaction: MessageReaction, member: GuildMember) {
    const user = member.user;
    await message.react('❌');
      const collector = message.createReactionCollector(() => true, {});

      collector.on('collect', async (r, u) => {
        if(r.emoji.name !== '❌') return;
        if(u.id === user.id) {
          console.log(`Verification Service || ${user.tag} verified removal of roles`);
          await member.roles.remove(member.roles.cache);
          for(var i in this.defaultRoles) {
            member.roles.add(msg.guild!.roles.cache.find(role => role.name === this.defaultRoles[i])!);
          }
          console.log(`Verification Service || Removed all roles from ${user.tag} and given back the defaults. (${this.defaultRoles})`);
          console.log(`Verification Service || Member ${user.tag} unverified.`);
          collector.stop('Removal verified.');
          reaction.users.remove(u);
        } else {
          r.users.remove(u);
        }
      });

      collector.on('end', (_collected, reason) => {
        console.log('Verification Service || Removed reaction collector for role removal approval.');
        console.log(`                           Reason being: ${reason}`);
        collector.message.delete();
      });

      setTimeout(() => {
        collector.stop('Time to verify ran out');
      }, 60000);
      return false;
  }
}