"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotFiles = exports.FileManager = void 0;
var fs_1 = __importDefault(require("fs"));
var FileManager = /** @class */ (function () {
    function FileManager() {
    }
    //method to write a file with
    FileManager.write = function (path, content) {
        //try to write JSON content to file with filepath=path
        fs_1.default.writeFile(path, JSON.stringify(content), function (err) {
            //basic error handling
            console.log(err === null ? "No errors occoured during file writing" : "Error occoured during file writing: " + err);
        });
    };
    return FileManager;
}());
exports.FileManager = FileManager;
var BotFiles = /** @class */ (function () {
    function BotFiles() {
    }
    //this class returns all the files used in the bot
    //this is used to read the JSON from the files
    //for example read the data.channelId property of file ticketing.json:
    //
    //  var file = BotFiles.ticketing();
    //  if(!file) return;
    //  var property = file.data.channelId;
    //
    //getter for the ticketing.json file
    BotFiles.ticketing = function () {
        return require('./json/ticketing.json');
    };
    //getter for the verification.json file
    BotFiles.verification = function () {
        return require('./json/verification.json');
    };
    //getter for the events.json file
    BotFiles.events = function () {
        return require('./json/events.json');
    };
    //this method sets the prototype method path to every method above
    //this is to return the filepath via the folling syntax:
    //
    //  var eventsPath = BotFiles.events.prototype.path();
    //
    //gets called at index.ts:49 when client is ready
    BotFiles.init = function () {
        this.ticketing.prototype.path = function () {
            return './build/json/ticketing.json';
        };
        this.ticketing.prototype.bkppath = function () {
            return './build/json/backups/ticketing.bkp.json';
        };
        this.verification.prototype.path = function () {
            return './build/json/verification.json';
        };
        this.verification.prototype.bkppath = function () {
            return './build/json/backups/verification.bkp.json';
        };
        this.events.prototype.path = function () {
            return './build/json/events.json';
        };
        this.events.prototype.bkppath = function () {
            return './build/json/backups/events.bkp.json';
        };
    };
    BotFiles.backupAll = function () {
        this.backup(this.ticketing.prototype.path(), this.ticketing.prototype.bkppath());
        this.backup(this.verification.prototype.path(), this.verification.prototype.bkppath());
        this.backup(this.events.prototype.path(), this.events.prototype.bkppath());
    };
    BotFiles.backup = function (pathA, pathB) {
        fs_1.default.copyFile(pathA, pathB, function (err) {
            if (err === null) {
                console.log("Successfully created backup of file " + pathA + ".");
            }
            else {
                console.log("Failed to create backup of file " + pathA + ". Error: " + err);
            }
        });
    };
    return BotFiles;
}());
exports.BotFiles = BotFiles;
