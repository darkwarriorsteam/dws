import { Client, Guild, GuildMember, Message, Role } from 'discord.js';
import { errorMonitor } from 'ws';
import { EventRoleManager } from './EventRoleManager';
import { BotFiles, FileManager } from './FileManager';
import { MainProcess } from './index';
import { TicketingManager } from './TicketingManager';

export class MessageHandler  {

  async handleServerMessage(msg: Message) {
    const verificationService = MainProcess.getVerificationInstance();
    const ticketingManager = MainProcess.getTicketingManager();
    const eventRoleManager = MainProcess.getEventRoleManager();
    //Return if author is bot
    if(msg.author.bot) return;
    //Return if channel type is direct message channel
    if(msg.channel.type === 'dm') return;
    const member: GuildMember = msg.guild!.member(msg.author)!;

    //!!verification command
    if(msg.content.startsWith('!!verification')) {
      if(!member.roles.cache.some(role => role.name === 'OWNER')) {
        console.log(`Verification Service || User ${msg.author.tag} tried to create the verification message whilst no permission to do so.`);
        msg.delete();
        return;
      }
      if(verificationService.messageId === null || verificationService.guildId === null || verificationService.channelId === null) {
        verificationService.sendValidationMessage(msg);
        console.log(`Verification Service || User ${msg.author.tag} created the verification message in channel ${msg.channel}.`);
      } else {
        msg.channel.send(`There is already a verification message in a channel. Channel ID: ${verificationService.channelId}`);
        console.log(`Verification Service || User ${msg.author.tag} tried to overwrite the verification message.`);
      }
      msg.delete();
      return;
    }

    //!!resetv
    else if(msg.content.startsWith('!!resetv')) {
      if(!member.roles.cache.some(role => role.name === 'OWNER')) {
        console.log(`Verification Service || User ${msg.author.tag} tried to reset the verification message whilst no permission to do so.`);
        return;
      }
      verificationService.resetVerificationData();
      verificationService.refreshOnReset();
      console.log(`Verification Service || Reset was successful. Initiated by ${msg.author.tag}`);
      msg.delete();
    }

    //!!ticket
    else if(msg.content.startsWith('!!ticket')) {
      const args: string[] = msg.content.split(' ');
      if(args.length === 2) {
        //ticket start command
        if(args[1].toLowerCase() === 'start') {
          //start the ticket listener
          ticketingManager.startListening(msg.guild!);
          const file = BotFiles.ticketing();

          file.data.guildId = msg.guild;
          FileManager.write(BotFiles.ticketing.prototype.path(), file);
        }
      } else if(args.length === 3) {
        //init command for channel setup
        if(args[1].toLowerCase() === 'init') {
          //init community channel
          if(args[2].toLowerCase() === 'support' || args[2].toLowerCase() === 's') {
            //do community channel setup
            msg.channel.send('Setting up!');
            ticketingManager.setupSupportChannel(msg.channel!);
            msg.channel.send('Setting up done!');
          } else if(args[2].toLowerCase() === 'team' || args[2].toLowerCase() === 't') {
            //do team channel setup
            ticketingManager.setupTeamChannel(msg.channel!);
          }
        }
      }
    }

    //!!event
    else if(msg.content.startsWith('!!event')) {
      const args = msg.content.split(' ');
      if(args.length === 2) {
        if(args[1].toLowerCase() === 'start') {
          eventRoleManager.startListening(msg.guild!);
        }
      } else if(args.length === 3) {
        if(args[1].toLowerCase() === 'init') {
          if(args[2].toLowerCase() === 'event') {
            eventRoleManager.setupRegistrationChannel(msg.channel);
          } else if(args[2].toLowerCase() === 'team') {
            eventRoleManager.setupEventLogChannel(msg.channel);
          }
        } else if(args[1].toLowerCase() === 'role') {
          const role: Role | undefined = this.getRoleFromMention(args[2], msg.guild!);
          if(!role) return;

          eventRoleManager.setupEventRole(role);
        }
      }
    }
  }

  getUserFormMention() {
    //not implemented
  }

  getRoleFromMention(mention: string, guild: Guild): Role | undefined {
    if(!mention) return undefined;

    if(mention.startsWith('<@&') && mention.endsWith('>')) {
      mention = mention.slice(3, -1);

      return guild.roles.cache.get(mention);
    }
    return undefined;
  }
}