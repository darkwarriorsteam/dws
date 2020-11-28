import { time } from "console";
import { DMChannel, Guild, GuildChannel, GuildMember, Message, MessageEmbed, TextChannel, User } from "discord.js";
import { userInfo } from "os";
import { EmbedBuilder } from "./EmbedBuilder";
import { FileManager, BotFiles } from './FileManager';


export class TicketingManager {
  channelId: string | null;
  teamChannelId: string | null;
  initialized: boolean;

  constructor() {
    this.channelId = null;
    this.teamChannelId = null;
    this.initialized = false;
  }

  init() {
    this.fetchChannelIds();
    this.initialized = true;
  }

  startListening(guild: Guild) {
    if(!this.initialized) this.init();
    if(this.teamChannelId === null || this.channelId === null) throw new Error('No Setup for Ticket-Managing');
    const ticketCommunityChannel: GuildChannel = guild.channels.cache.get(this.channelId)!;
    const ticketTeamChannel: GuildChannel = guild.channels.cache.get(this.teamChannelId)!;
    if(!ticketCommunityChannel.isText()) return;
    if(!ticketTeamChannel.isText()) return;
    const msgCollector = ticketCommunityChannel.createMessageCollector(() => true, {});

    const supportContent: any = {};

    msgCollector.on('collect', (msg: Message) => {
      if(supportContent[msg.author.id] !== undefined) {
        var currentContent = supportContent[msg.author.id].content;
        if(currentContent !== undefined || currentContent !== null) {
          currentContent += `\n\n${msg.content}`;
        } else {
          currentContent = msg.content;
        }
        supportContent[msg.author.id].content = currentContent;

        const tO = supportContent[msg.author.id].timeout;
        if(tO !== null || tO !== undefined) {
          clearTimeout(tO);
        }
      } else {
        supportContent[msg.author.id] = {
          content: msg.content,
          timeout: null
        }
      }
      const timeout = setTimeout(() => {
        const user: User = msg.author;
        const embed: MessageEmbed = EmbedBuilder.getTicketingEmbed(user, supportContent[user.id].content);

        ticketTeamChannel.send(embed).then(() => {
          user.send('Deine Supportanfrage hat uns gerade erreicht. Wir versuchen dir so schnell wie möglich zu helfen :D');
          user.send(embed);
          supportContent[user.id] = undefined;
        });
      }, 30000);
      supportContent[msg.author.id].timeout = timeout;
    });
  }

  fetchChannelIds() {
    const file = BotFiles.ticketing();
    this.channelId = file.data.channelId;
    this.teamChannelId = file.data.teamChannelId;
  }

  setupSupportChannel(channel: GuildChannel) {
    const file = BotFiles.ticketing();

    file.data.channelId = channel.id;
    FileManager.write(BotFiles.ticketing.prototype.path(), file);
  }

  setupTeamChannel(channel: GuildChannel) {
    const file = BotFiles.ticketing();

    file.data.teamChannelId = channel.id;
    FileManager.write(BotFiles.ticketing.prototype.path(), file);
  }
}