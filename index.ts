import { Client } from 'discord.js';
const client: Client = new Client({partials: ['REACTION', 'MESSAGE', 'USER', 'CHANNEL', 'GUILD_MEMBER']});

import { VerificationService } from './VerificationService';
import { MessageHandler } from './MessageHandler';
import { exit } from 'process';
import { TicketingManager } from './TicketingManager';
import { BotFiles, FileManager } from './FileManager';
const mh = new MessageHandler();
const vs = new VerificationService();
const tm = new TicketingManager();

export class MainProcess {
  static getTicketingManager() {
    return tm;
  }

  static getClient() {
    return client;
  }

  static getVerificationInstance() {
    return vs;
  }

  static loginClient() {
    client.login(process.env.DCTKN_TEST);
  }

  static assignEvents() {
    client.on('ready', async () => {
      if(client.user === null) { console.log(`Client User is null`); exit; return; }
      console.log(`Logged in as ${client.user.tag}`);
      BotFiles.init();
      vs.start();
      console.log(1, vs);
    });

    client.on('message', async msg => {
      mh.handleServerMessage(msg);
    });
  }
}

MainProcess.assignEvents();
MainProcess.loginClient();