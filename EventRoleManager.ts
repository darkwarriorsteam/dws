import { Collection, DMChannel, Guild, GuildChannel, GuildMember, Message, MessageReaction, MessageReactionResolvable, Role, TextChannel, User } from "discord.js";
import { readConfigFile } from "typescript";
import { MainProcess } from ".";
import { EmbedBuilder } from "./EmbedBuilder";
import { BotFiles, FileManager } from "./FileManager";

export class EventRoleManager {
  teamChannelId: string;
  channelId: string;
  roleId: string;
  initialized: boolean;
  ongoing: boolean;

  constructor() {
    this.channelId = '';
    this.teamChannelId = '';
    this.roleId = '';
    this.initialized = false;
    this.ongoing = false;
  }

  init() {
    this.fetchChannelIds();
    this.initialized = true;
  }

  startListening(guild: Guild) {
    if(!this.initialized) this.init();
    const channel: GuildChannel | undefined = guild.channels.cache.get(this.channelId);
    if(!channel || !channel.isText()) {
      console.log(`EventService || Event-ChannelID not defined in ${BotFiles.events.prototype.path()}`);
      return;
    }
    const c = channel.createMessageCollector(() => true, /*{ time: 604800000}*/{time: 20000});
    this.ongoing = true;
    const eventChannel: GuildChannel | undefined = guild.channels.cache.get(this.teamChannelId);
    if(!eventChannel || !eventChannel.isText()) {
      console.log(`EventService || Team-ChannelID not defined in ${BotFiles.events.prototype.path()}`);
      c.stop('NoChannelForRegistersFound');
      return false;
    }
    const eventRole: Role | undefined = channel.guild.roles.cache.get(this.roleId);
    if(!eventRole) {
      console.log(`EventService || Event-RoleID not defined in ${BotFiles.events.prototype.path()}`);
      eventChannel.send('ERROR: Event-Role not defined in events.json. Use !!event role @ROLE to initialize role');
      c.stop('NoEventRoleFound');
      return false;
    }


    var userIds: string[] = [];
    var contents: string[] = [];

    c.on('collect', (msg: Message) => {
      const user: User = msg.author;
      const member: GuildMember = msg.guild!.member(user)!;
      if(userIds.includes(user.id)) return;
      var embed = EmbedBuilder.getEventRegistrationEmbed(user, msg.content, false);
      eventChannel.send(embed);
      embed = EmbedBuilder.getEventRegistrationEmbed(user, msg.content, true);
      userIds.push(user.id);
      contents.push(msg.content);
      user.send(embed).then(async(msg: Message) => {
        await msg.react('❌');
        const rC = msg.createReactionCollector(() => true, {});
        rC.on('collect', (reaction: MessageReaction, user: User) => {
          if(reaction.emoji.name !== '❌') {
            reaction.users.remove(user);
            console.log(`Verification Service || User ${user.tag} reacted with ${reaction.emoji.name}. Reaction was removed succesfully`);
            return false;
          }
          if(userIds.includes(user.id)) {
            const i = userIds.indexOf(user.id);
            userIds.splice(i, 1);
            contents.splice(i, 1);
          }
          console.log(userIds, contents);
          reaction.message.delete();
        });
      });
      console.log(`EventService || User ${user.tag} registered to participate in Event`);
      member.roles.add(eventRole);
      console.log(`EventService || User ${user.tag} received Event-Role`);
    });

    c.on('end', (collected: Collection<string, Message>, reason: string) => {
      if(reason === "NoChannelForRegistersFound") return;
      if(reason === "NoEventRoleFound") return;
        const json: any = collected.toJSON();
        if(!json[0]) return;
        const guild: Guild = MainProcess.getClient().guilds.cache.get(json[0].guildID)!;
        const channel: GuildChannel = guild.channels.cache.get(json[0].channelID)!;
        if(!channel.isText()) return;
        for(var key in json) {
          if(json.hasOwnProperty(key)) {
            const msg: Message = channel.messages.cache.get(json[key].id)!;
            msg.delete();
          }
        }
        console.log(userIds, contents);
        const embed = EmbedBuilder.getEventSummaryEmbed(userIds, contents);
        if(embed !== null) eventChannel.send(embed);
        console.log(`EventService || Event-Registration period ended`);
        this.ongoing = false;
        this.initialized = false;
        userIds = []; contents = [];
    });
    console.log(`EventService || Started Listeners`);
    return true;
  }

  fetchChannelIds() {
    const file = BotFiles.events();
    this.channelId = file.data.channelId;
    this.teamChannelId = file.data.teamChannelId;
    this.roleId = file.data.roleId;
    console.log(`EventService || Fetched variables from ${BotFiles.events.prototype.path()}`);
  }

  setupRegistrationChannel(channel: GuildChannel) {
    const file = BotFiles.events();

    file.data.channelId = channel.id;
    FileManager.write(BotFiles.events.prototype.path(), file);
    console.log(`EventService || Wrote Registration-ChannelID to ${BotFiles.events.prototype.path()}`);
  }

  setupEventLogChannel(channel: GuildChannel) {
    const file = BotFiles.events();

    file.data.teamChannelId = channel.id;
    FileManager.write(BotFiles.events.prototype.path(), file);
    console.log(`EventService || Wrote Event-ChannelID to ${BotFiles.events.prototype.path()}`);
  }

  setupEventRole(role: Role) {
    const file = BotFiles.events();

    file.data.roleId = role.id;
    FileManager.write(BotFiles.events.prototype.path(), file);
    console.log(`EventService || Wrote Event-RoleID to ${BotFiles.events.prototype.path()}`);
  }
}