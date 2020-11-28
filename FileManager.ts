import fs from 'fs';

export class FileManager {

  static write(file: string, content: any) {
    fs.writeFile(file, JSON.stringify(content), err => {
      console.log(err === null ? "No errors occoured during file writing" : `Error occoured during file writing: ${err}`);
    });
  }
}

export class BotFiles {

  static ticketing() {
    return require('./json/ticketing.json');
  }

  static verification() {
    return require('./json/verification.json');
  }

  static init() {
    this.ticketing.prototype.path = () => {
      return './build/json/ticketing.json';
    }
    this.verification.prototype.path = () => {
      return './build/json/verification.json';
    }
  }
}