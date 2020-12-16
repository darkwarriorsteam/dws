import { Client } from 'discord.js';
const client: Client = new Client({partials: ['REACTION', 'MESSAGE', 'USER', 'CHANNEL', 'GUILD_MEMBER']});

import { VerificationManager } from './VerificationManager';
import { MessageHandler } from './MessageHandler';
import { exit } from 'process';
import { TicketingManager } from './TicketingManager';
import { BotFiles } from './FileManager';
import { EventRoleManager } from './EventRoleManager';
//create classes to handle features
const mh = new MessageHandler();
const vs = new VerificationManager();
const tm = new TicketingManager();
const erm = new EventRoleManager();

export class MainProcess {
  //returns TicketingManager instance
  static getTicketingManager() {
    return tm;
  }

  //returns VerificationManager instance
  static getVerificationManager() {
    return vs;
  }

  //returns EventRoleManager instance
  static getEventRoleManager() {
    return erm;
  }

  //returns client object
  static getClient() {
    return client;
  }

  static loginClient() {
    console.log('');
    console.log('-------------------------------------------------');
    console.log(`------------     ${new Date().toDateString()}     ------------`);
    console.log('-------------------------------------------------');
    console.log('');
    //login client with token
    client.login(process.env.DCTKN);
    this.startBackupService();
  }

  static assignEvents() {
    //whenever client is ready
    client.on('ready', async () => {
      //check if client user is null
      if(client.user === null) { console.log(`Client User is null`); exit; return; }
      console.log(`Logged in as ${client.user.tag}`);
      //make prototype.path for files to address files later
      BotFiles.init();
      //start VerificationManager
      vs.start();
      console.log('Please start services via discord: !!ticket start & more coming soon');
    });

    //whenever bot receives message from all sources
    client.on('message', async msg => {
      //check if message is not a direct message
      if(msg.channel.type !== 'dm') {
        //handle message from guilds
        mh.handleServerMessage(msg);
      }
    });
  }

  private static startBackupService() {
    setTimeout(() => {
      BotFiles.backupAll();

      this.startBackupService();
    }, 24*60*60*1000);
  }
}

MainProcess.assignEvents();
MainProcess.loginClient();