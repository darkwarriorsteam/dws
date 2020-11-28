var Discord = require('discord.js');
import { EmbedBuilder } from './EmbedBuilder';
import { Guild, GuildChannel, GuildMember, Message, MessageEmbed } from 'discord.js';
import fs from 'fs';
import { MainProcess } from './index';

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

    this.messageId = file.data.verification.messageId;
    this.channelId = file.data.verification.channelId;
    this.guildId = file.data.verification.guildId;
    this.rolesToAdd = file.data.verification.rolesToAdd;
    this.rolesToRemove = file.data.verification.rolesToRemove;
    this.defaultRoles = file.data.verification.defaultRoles;
  }

  refreshFileData(msg: Message) {
    var file = require('./json/verification.json');

    file.data.verification.messageId = msg.id;
    file.data.verification.channelId = msg.channel.id;
    file.data.verification.guildId = msg.guild!.id;

    fs.writeFile('./json/verification.json', JSON.stringify(file), err => {
      console.log(err === null ? "No errors occoured during file writing" : `Error occoured during file writing: ${err}`);
    });
  }

  resetVerificationData() {
    var file = require('./json/verification.json');

    file.data.verification.messageId = null;
    file.data.verification.channelId = null;
    file.data.verification.guildId = null;

    fs.writeFile('./json/verification.json', JSON.stringify(file), err => {
      console.log(err === null ? "No errors occoured during file writing" : `Error occoured during file writing: ${err}`);
    });
  }

  async startListeners() {
    const guild: Guild = MainProcess.getClient().guilds.cache.find(guild => guild.id === this.guildId)!;
    const channel: GuildChannel = guild.channels.cache.get(this.channelId)!;
    if(!channel.isText()) return;
    const msg: Message = await channel.messages.fetch(this.messageId);

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