import { Client } from 'discord.js';
const client: Client = new Client({partials: ['REACTION', 'MESSAGE', 'USER', 'CHANNEL', 'GUILD_MEMBER']});

import { VerificationService } from './VerificationService';
import { MessageHandler } from './MessageHandler';
import { exit } from 'process';
import { TicketingManager } from './TicketingManager';
import { BotFiles } from './FileManager';
import { EventRoleManager } from './EventRoleManager';
//create classes to handle features
const mh = new MessageHandler();
const vs = new VerificationService();
const tm = new TicketingManager();
const erm = new EventRoleManager();

export class MainProcess {
  //returns TicketingManager instance
  static getTicketingManager() {
    return tm;
  }

  //returns VerificationService instance
  static getVerificationInstance() {
    return vs;
  }

  //returns VerificationService instance
  static getEventRoleManager() {
    return erm;
  }

  //returns client object
  static getClient() {
    return client;
  }

  static loginClient() {
    //login client with token
    client.login(process.env.DCTKN);
  }

  static assignEvents() {
    //when client is ready this event fires
    client.on('ready', async () => {
      //check if client user is null
      if(client.user === null) { console.log(`Client User is null`); exit; return; }
      console.log(`Logged in as ${client.user.tag}`);
      //make prototype.path for files
      BotFiles.init();
      //start VerificationService instance
      vs.start();
      console.log(1, vs);
    });

    //event fires when bot receives message from all sources
    client.on('message', async msg => {
      //handle message from guilds
      mh.handleServerMessage(msg);
    });
  }
}

MainProcess.assignEvents();
MainProcess.loginClient();