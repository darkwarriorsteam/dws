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
    FileManager.write = function (file, content) {
        fs_1.default.writeFile(file, JSON.stringify(content), function (err) {
            console.log(err === null ? "No errors occoured during file writing" : "Error occoured during file writing: " + err);
        });
    };
    return FileManager;
}());
exports.FileManager = FileManager;
var BotFiles = /** @class */ (function () {
    function BotFiles() {
    }
    BotFiles.ticketing = function () {
        return require('./json/ticketing.json');
    };
    BotFiles.verification = function () {
        return require('./json/verification.json');
    };
    BotFiles.init = function () {
        this.ticketing.prototype.path = function () {
            return './build/json/ticketing.json';
        };
        this.verification.prototype.path = function () {
            return './build/json/verification.json';
        };
    };
    return BotFiles;
}());
exports.BotFiles = BotFiles;
