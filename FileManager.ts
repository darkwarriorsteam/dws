import fs from 'fs';

export class FileManager {

  //method to write a file with
  static write(path: string, content: any) {
    //try to write JSON content to file with filepath=path
    fs.writeFile(path, JSON.stringify(content), err => {
      //basic error handling
      console.log(err === null ? "No errors occoured during file writing" : `Error occoured during file writing: ${err}`);
    });
  }
}

export class BotFiles {
  //this class returns all the files used in the bot
  //this is used to read the JSON from the files
  //for example read the data.channelId property of file ticketing.json:
  //
  //  var file = BotFiles.ticketing();
  //  if(!file) return;
  //  var property = file.data.channelId;
  //

  //getter for the ticketing.json file
  static ticketing() {
    return require('./json/ticketing.json');
  }

  //getter for the verification.json file
  static verification() {
    return require('./json/verification.json');
  }

  //getter for the events.json file
  static events() {
    return require('./json/events.json');
  }

  //this method sets the prototype method path to every method above
  //this is to return the filepath via the folling syntax:
  //
  //  var eventsPath = BotFiles.events.prototype.path();
  //
  //gets called at index.ts:49 when client is ready
  static init() {
    this.ticketing.prototype.path = () => {
      return './build/json/ticketing.json';
    }
    this.ticketing.prototype.bkppath = () => {
      return './build/json/backups/ticketing.bkp.json';
    }
    this.verification.prototype.path = () => {
      return './build/json/verification.json';
    }
    this.verification.prototype.bkppath = () => {
      return './build/json/backups/verification.bkp.json';
    }
    this.events.prototype.path = () => {
      return './build/json/events.json';
    }
    this.events.prototype.bkppath = () => {
      return './build/json/backups/events.bkp.json';
    }
  }

  static backupAll() {
    this.backup(this.ticketing.prototype.path(), this.ticketing.prototype.bkppath());
    this.backup(this.verification.prototype.path(), this.verification.prototype.bkppath());
    this.backup(this.events.prototype.path(), this.events.prototype.bkppath());
  }

  private static backup(pathA: string, pathB: string) {
    fs.copyFile(pathA, pathB, err => {
      if(err === null) {
        console.log(`Successfully created backup of file ${pathA}.`);
      } else {
        console.log(`Failed to create backup of file ${pathA}. Error: ${err}`);
      }
    });
  }
}