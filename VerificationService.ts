var Discord = require('discord.js');
import { EmbedBuilder } from './EmbedBuilder';
import { Guild, GuildChannel, GuildMember, Message, MessageEmbed } from 'discord.js';
import fs from 'fs';
import { MainProcess } from './index';
import { BotFiles, FileManager } from './FileManager';

export class VerificationService {
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
      const member: GuildMember = msg.guild!.member(user)!;
      await member.roles.remove(member.roles.cache);
      for(var i in this.defaultRoles) {
        member.roles.add(msg.guild!.roles.cache.find(role => role.name === this.defaultRoles[i])!);
      }
      console.log(`Verification Service || Removed all roles from ${user.tag} and given back the defaults. (${this.defaultRoles})`);
      console.log(`Verification Service || Member ${user.tag} unverified.`);
    });
  }
}